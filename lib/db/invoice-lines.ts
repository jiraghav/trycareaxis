import type { AdminInvoiceLine } from '@/lib/db/types';

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

export function formatCurrency(amount: number, currency = 'USD') {
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

export function lineCodeLabel(code: string) {
  switch (code) {
    case 'monthly_platform':
      return 'Monthly platform';
    case 'other_charges':
      return 'Other charges';
    case 'openai':
      return 'OpenAI / AI';
    case 'sms':
      return 'SMS / Text';
    case 'custom':
      return 'Custom';
    default:
      return code.replace(/_/g, ' ');
  }
}

export function computeLineTotal(
  lineCode: string,
  baseAmount: number,
  upchargePercent: number,
  qty: number,
) {
  const qtySafe = qty > 0 ? qty : 1;
  const mult = ['openai', 'sms', 'custom'].includes(lineCode)
    ? 1 + upchargePercent / 100
    : 1;
  return baseAmount * qtySafe * mult;
}

export function normalizeInvoiceLine(row: RawRow, currency: string): AdminInvoiceLine {
  const lineId = String(pickField(row, ['id', 'line_id']) ?? '');
  const lineCode = String(pickField(row, ['line_code', 'code']) ?? 'custom');
  const baseAmount = normalizeAmount(pickField(row, ['base_amount', 'amount']));
  const upchargePercent = normalizeAmount(pickField(row, ['upcharge_percent', 'upcharge']));
  const qty = normalizeAmount(pickField(row, ['qty', 'quantity']));
  const qtySafe = qty > 0 ? qty : 1;
  const total = computeLineTotal(lineCode, baseAmount, upchargePercent, qtySafe);

  return {
    id: lineId,
    lineCode,
    lineTypeLabel: lineCodeLabel(lineCode),
    sortOrder: Number(pickField(row, ['sort_order']) ?? 0),
    description: String(pickField(row, ['description']) ?? ''),
    baseAmount,
    baseAmountFormatted: formatCurrency(baseAmount, currency),
    upchargePercent,
    usageMonth: String(pickField(row, ['usage_month']) ?? ''),
    qty: qtySafe,
    total,
    totalFormatted: formatCurrency(total, currency),
  };
}

export function sumLineTotals(lines: AdminInvoiceLine[]) {
  return lines.reduce((sum, line) => sum + line.total, 0);
}
