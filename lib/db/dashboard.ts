import type {
  AdminClientRow,
  AdminDashboardMetrics,
  AdminInvoice,
  InvoiceSourceResult,
} from '@/lib/db/types';

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

function isOpenStatus(state: string) {
  const normalized = state.toLowerCase();
  return ['pending', 'open', 'draft', 'past due'].includes(normalized);
}

function isOutstandingInvoice(invoice: AdminInvoice) {
  if (invoice.state === 'Paid' || invoice.state === 'Void') {
    return false;
  }

  return invoice.state === 'Past Due' || isOpenStatus(invoice.state);
}

function sumOutstanding(invoices: AdminInvoice[]) {
  return invoices
    .filter(isOutstandingInvoice)
    .reduce((sum, invoice) => sum + invoice.amount, 0);
}

export function buildDashboardMetrics(
  invoices: AdminInvoice[],
  sources: InvoiceSourceResult[],
): AdminDashboardMetrics {
  const openInvoices = invoices.filter((invoice) => isOpenStatus(invoice.state)).length;
  const paidInvoices = invoices.filter((invoice) => invoice.state === 'Paid').length;
  const pastDueTotal = sumOutstanding(invoices);
  const currency = invoices.find((invoice) => invoice.currency)?.currency ?? 'USD';
  const platformClients = sources.reduce(
    (sum, source) => sum + (source.error ? 0 : source.platformClientCount),
    0,
  );

  return {
    platformClients,
    totalInvoices: invoices.length,
    openInvoices,
    paidInvoices,
    pastDueTotal,
    pastDueTotalFormatted: formatCurrency(pastDueTotal, currency),
  };
}

function buildClientRow(source: InvoiceSourceResult): AdminClientRow {
  const sorted = [...source.invoices].sort((left, right) =>
    right.dueDateSort.localeCompare(left.dueDateSort),
  );
  const latest = sorted[0];
  const outstandingSum = sumOutstanding(sorted);
  const currency = latest?.currency ?? 'USD';

  return {
    id: source.sourceId,
    client: source.sourceLabel,
    sourceLabel: source.sourceLabel,
    platformClientCount: source.platformClientCount,
    invoiceCount: sorted.length,
    latestInvoice: latest?.invoiceNumber ?? '—',
    latestStatus: latest?.state ?? '—',
    lastInvoiceDate: latest?.dueDate ?? '—',
    lastInvoiceDateSort: latest?.dueDateSort ?? '',
    outstanding: formatCurrency(outstandingSum, currency),
  };
}

export function buildClientOverview(sources: InvoiceSourceResult[]): AdminClientRow[] {
  return sources
    .map((source) => buildClientRow(source))
    .sort((left, right) => right.lastInvoiceDateSort.localeCompare(left.lastInvoiceDateSort));
}
