import mysql from 'mysql2/promise';
import { Pool } from 'pg';
import { buildClientOverview, buildDashboardMetrics } from '@/lib/db/dashboard';
import { resolveMysqlConfig, resolvePostgresConfig } from '@/lib/db/connection';
import {
  DEFAULT_INVOICE_QUERY,
  DEFAULT_PLATFORM_CLIENTS_COUNT_QUERY,
  getInvoiceDbSources,
} from '@/lib/db/sources';
import type {
  AdminInvoice,
  InvoiceDbSource,
  InvoiceFetchSummary,
  InvoiceSourceResult,
} from '@/lib/db/types';

type RawRow = Record<string, unknown>;

function pickField(row: RawRow, keys: string[]) {
  const normalized = Object.fromEntries(
    Object.entries(row).map(([key, value]) => [key.toLowerCase(), value]),
  );

  for (const key of keys) {
    const value = normalized[key.toLowerCase()];
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }

  return null;
}

function formatCurrency(amount: number, currency = 'USD') {
  const code = currency.trim().toUpperCase() || 'USD';
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(amount);
  }
}

function toSortableDate(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(value: unknown) {
  let parsed: Date | null = null;

  if (value instanceof Date) {
    parsed = value;
  } else {
    const text = String(value ?? '').trim();
    if (!text) {
      return { display: '', sort: '' };
    }

    const candidate = new Date(text);
    if (!Number.isNaN(candidate.getTime())) {
      parsed = candidate;
    } else {
      return { display: text, sort: '' };
    }
  }

  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  const year = parsed.getFullYear();

  return {
    display: `${month}/${day}/${year}`,
    sort: toSortableDate(parsed),
  };
}

function normalizeState(value: unknown) {
  const raw = String(value ?? 'Pending').trim();
  const normalized = raw.toLowerCase().replace(/[_-]+/g, ' ');

  if (['paid', 'complete', 'completed', 'settled'].includes(normalized)) {
    return 'Paid';
  }

  if (['past due', 'overdue', 'late', 'delinquent'].includes(normalized)) {
    return 'Past Due';
  }

  if (
    ['pending', 'open', 'due', 'unpaid', 'sent', 'draft', 'uncollectible'].includes(normalized)
  ) {
    return normalized === 'uncollectible' ? 'Past Due' : 'Pending';
  }

  if (normalized === 'void') {
    return 'Void';
  }

  return raw;
}

function normalizeAmount(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  const cleaned = String(value ?? '0')
    .replace(/[^0-9.-]+/g, '')
    .trim();

  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeInvoice(row: RawRow, source: InvoiceDbSource, index: number): AdminInvoice {
  const rowId = pickField(row, ['id', 'invoice_id', 'uuid']);
  const userId = String(pickField(row, ['user_id', 'userid', 'account_id']) ?? '');
  const title = String(pickField(row, ['title', 'invoice_title', 'description']) ?? 'Platform invoice');
  const invoiceNumber = String(
    pickField(row, [
      'stripe_invoice_number',
      'invoice_number',
      'invoice',
      'inv_no',
      'invoice_no',
      'number',
    ]) ?? `INV-${rowId ?? index + 1}`,
  );
  const clientName = pickField(row, ['client_name', 'client', 'account_name']);
  const organization = String(pickField(row, ['organization', 'org_name', 'company']) ?? '');
  const email = String(pickField(row, ['email']) ?? '');
  const client = clientName
    ? String(clientName)
    : organization
      ? organization
      : userId
        ? `User ${userId}`
        : 'Unknown client';
  const dueDateValue = formatDisplayDate(
    pickField(row, ['date_created', 'created_at', 'due_date', 'due', 'due_at', 'invoice_due_date']),
  );
  const currency = String(pickField(row, ['currency']) ?? 'usd').toLowerCase();
  const rawAmount = pickField(row, ['amount', 'total', 'invoice_amount', 'balance', 'stripe_amount']);
  const amount = normalizeAmount(rawAmount);
  const state = normalizeState(
    pickField(row, [
      'stripe_invoice_status',
      'status',
      'state',
      'payment_status',
      'invoice_status',
    ]),
  );
  const stripeHostedUrl = String(
    pickField(row, ['stripe_hosted_invoice_url', 'hosted_invoice_url', 'invoice_url']) ?? '',
  );
  const stripeDashboardUrl = String(
    pickField(row, ['stripe_dashboard_url', 'dashboard_url']) ?? '',
  );

  return {
    id: `${source.id}:${rowId ?? invoiceNumber}:${index}`,
    invoiceNumber,
    title,
    client,
    organization,
    email,
    userId,
    dueDate: dueDateValue.display,
    dueDateSort: dueDateValue.sort,
    amount,
    amountFormatted: rawAmount != null ? formatCurrency(amount, currency) : '—',
    currency: currency.toUpperCase(),
    state,
    stripeHostedUrl,
    stripeDashboardUrl,
    sourceId: source.id,
    sourceLabel: source.label,
  };
}

async function queryMysql(source: InvoiceDbSource, sql: string) {
  const connection = await mysql.createConnection(resolveMysqlConfig(source));
  try {
    const [rows] = await connection.query(sql);
    return Array.isArray(rows) ? (rows as RawRow[]) : [];
  } finally {
    await connection.end();
  }
}

async function queryPostgres(source: InvoiceDbSource, sql: string) {
  const pool = new Pool(resolvePostgresConfig(source));
  try {
    const result = await pool.query(sql);
    return result.rows as RawRow[];
  } finally {
    await pool.end();
  }
}

async function querySource(source: InvoiceDbSource, sql: string) {
  const connectionTarget = source.url ?? '';
  if (connectionTarget.startsWith('postgres://') || connectionTarget.startsWith('postgresql://')) {
    return queryPostgres(source, sql);
  }

  return queryMysql(source, sql);
}

async function fetchPlatformClientCount(source: InvoiceDbSource) {
  const sql = DEFAULT_PLATFORM_CLIENTS_COUNT_QUERY;
  const rows = await querySource(source, sql);
  const raw = rows[0]?.platform_clients ?? rows[0]?.platform_clients_count ?? 0;
  const count = typeof raw === 'bigint' ? Number(raw) : Number(raw);
  return Number.isFinite(count) ? count : 0;
}

async function fetchSourceInvoices(source: InvoiceDbSource): Promise<InvoiceSourceResult> {
  try {
    const [rows, platformClientCount] = await Promise.all([
      querySource(source, source.query ?? DEFAULT_INVOICE_QUERY),
      fetchPlatformClientCount(source),
    ]);
    const invoices = rows.map((row, index) => normalizeInvoice(row, source, index));

    return {
      sourceId: source.id,
      sourceLabel: source.label,
      invoices,
      platformClientCount,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load invoices.';
    return {
      sourceId: source.id,
      sourceLabel: source.label,
      invoices: [],
      platformClientCount: 0,
      error: message,
    };
  }
}

export async function fetchInvoicesFromAllSources(): Promise<InvoiceFetchSummary> {
  const sources = getInvoiceDbSources();

  if (!sources.length) {
    const metrics = buildDashboardMetrics([], []);
    return {
      sources: [],
      invoices: [],
      clients: [],
      metrics,
      pastDueTotal: metrics.pastDueTotal,
      pastDueTotalFormatted: metrics.pastDueTotalFormatted,
      configuredSourceCount: 0,
    };
  }

  const sourceResults = await Promise.all(sources.map((source) => fetchSourceInvoices(source)));
  const invoices = sourceResults
    .flatMap((result) => result.invoices)
    .sort(
      (left, right) =>
        right.dueDateSort.localeCompare(left.dueDateSort) || right.id.localeCompare(left.id),
    );

  const metrics = buildDashboardMetrics(invoices, sourceResults);
  const clients = buildClientOverview(sourceResults);

  return {
    sources: sourceResults,
    invoices,
    clients,
    metrics,
    pastDueTotal: metrics.pastDueTotal,
    pastDueTotalFormatted: metrics.pastDueTotalFormatted,
    configuredSourceCount: sources.length,
  };
}
