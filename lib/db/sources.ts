import type { InvoiceDbSource } from '@/lib/db/types';

export const DEFAULT_INVOICE_QUERY = `
  SELECT
    i.id,
    i.date_created,
    i.user_id,
    i.title,
    i.notes,
    i.stripe_invoice_id,
    i.stripe_invoice_number,
    i.stripe_invoice_status,
    i.stripe_hosted_invoice_url,
    i.stripe_dashboard_url,
    i.currency,
    COALESCE(line_totals.amount, 0) AS amount,
    NULLIF(TRIM(CONCAT(COALESCE(u.fname, ''), ' ', COALESCE(u.lname, ''))), '') AS client_name,
    u.organization,
    u.email
  FROM cic_platform_invoice i
  LEFT JOIN users u ON u.id = i.user_id
  LEFT JOIN (
    SELECT
      invoice_id,
      SUM(
        base_amount * qty * CASE
          WHEN line_code IN ('openai', 'sms', 'custom') THEN (1 + (upcharge_percent / 100))
          ELSE 1
        END
      ) AS amount
    FROM cic_platform_invoice_line
    GROUP BY invoice_id
  ) line_totals ON line_totals.invoice_id = i.id
  ORDER BY i.date_created DESC
  LIMIT 200
`.trim();

export const DEFAULT_INVOICE_LINES_QUERY = `
  SELECT
    l.id,
    l.invoice_id,
    l.line_code,
    l.sort_order,
    l.description,
    l.base_amount,
    l.upcharge_percent,
    l.usage_month,
    l.qty
  FROM cic_platform_invoice_line l
  INNER JOIN cic_platform_invoice i ON i.id = l.invoice_id
  ORDER BY l.invoice_id DESC, l.sort_order ASC, l.id ASC
`.trim();

export const DEFAULT_PLATFORM_CLIENTS_COUNT_QUERY = `
  SELECT COUNT(DISTINCT user_id) AS platform_clients
  FROM cic_platform_invoice
  WHERE user_id IS NOT NULL AND user_id > 0
`.trim();

export function getInvoiceDbSources(): InvoiceDbSource[] {
  const raw = process.env.CARE_AXIS_INVOICE_DB_SOURCES?.trim();
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    const sources: InvoiceDbSource[] = [];

    for (const entry of parsed) {
      if (!entry || typeof entry !== 'object') {
        continue;
      }

      const record = entry as Record<string, unknown>;
      const id = String(record.id ?? '').trim();
      const label = String(record.label ?? record.id ?? '').trim();
      const url = String(record.url ?? '').trim() || undefined;
      const host = String(record.host ?? '').trim() || undefined;
      const user = String(record.user ?? '').trim() || undefined;
      const password =
        record.password === undefined || record.password === null
          ? undefined
          : String(record.password);
      const database = String(record.database ?? '').trim() || undefined;
      const port = record.port === undefined || record.port === null ? undefined : Number(record.port);
      const query =
        typeof record.query === 'string' && record.query.trim()
          ? record.query.trim()
          : undefined;

      const hasUrl = Boolean(url);
      const hasDiscreteConfig = Boolean(host && user && database);

      if (!id || !label || (!hasUrl && !hasDiscreteConfig)) {
        continue;
      }

      sources.push({
        id,
        label,
        url,
        host,
        port: Number.isFinite(port) ? port : undefined,
        user,
        password,
        database,
        query,
      });
    }

    return sources;
  } catch {
    return [];
  }
}
