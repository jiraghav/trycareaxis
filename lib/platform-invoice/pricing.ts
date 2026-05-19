import { computeLineTotal, formatCurrency, roundMoney } from '@/lib/db/invoice-lines';
import type { PlatformInvoiceSettings } from '@/lib/platform-invoice/types';
import type { InvoiceLineInput } from '@/lib/platform-invoice/types';

/** Site defaults when creating a new OpenAI/SMS line (not when displaying saved lines). */
export function defaultUpchargePercent(code: string, settings: PlatformInvoiceSettings) {
  if (code === 'openai') {
    return Math.max(0, settings.openaiUpchargePercent);
  }
  if (code === 'sms') {
    return Math.max(0, settings.smsUpchargePercent);
  }
  return 0;
}

/** Site defaults when creating a new OpenAI/SMS line (not when displaying saved lines). */
export function defaultUpchargeFlat(code: string, settings: PlatformInvoiceSettings) {
  if (code === 'openai') {
    return Math.max(0, settings.openaiUpchargeFlat);
  }
  if (code === 'sms') {
    return Math.max(0, settings.smsUpchargeFlat);
  }
  return 0;
}

/** @deprecated Use stored line values; kept for callers that still import the old name. */
export const resolveUpchargePercent = (
  code: string,
  postedPct: number,
  settings: PlatformInvoiceSettings,
) => {
  if (code === 'monthly_platform' || code === 'other_charges') {
    return 0;
  }
  if (code === 'openai' || code === 'sms') {
    return defaultUpchargePercent(code, settings);
  }
  return Math.max(0, postedPct);
};

/** @deprecated Use stored line values; kept for callers that still import the old name. */
export const resolveUpchargeFlat = (code: string, settings: PlatformInvoiceSettings) =>
  defaultUpchargeFlat(code, settings);

export function amountWithUpcharge(
  baseAmount: number,
  upchargePercent: number,
  upchargeFlat = 0,
) {
  return roundMoney(baseAmount * (1 + upchargePercent / 100) + upchargeFlat);
}

export function lineTotalFromParts(
  lineCode: string,
  baseAmount: number,
  upchargePercent: number,
  qty: number,
  upchargeFlat = 0,
) {
  return computeLineTotal(lineCode, baseAmount, upchargePercent, qty, upchargeFlat);
}

export function lineTotalFromInput(line: InvoiceLineInput) {
  const qty = line.qty > 0 ? line.qty : 1;
  const pct = Math.max(0, line.upchargePercent);
  const flat = Math.max(0, line.upchargeFlat ?? 0);
  return lineTotalFromParts(line.lineCode, line.baseAmount, pct, qty, flat);
}

export function formatUpchargeLabelFromValues(
  pct: number,
  flat: number,
  currency = 'USD',
) {
  const parts: string[] = [];
  const pctSafe = Math.max(0, pct);
  const flatSafe = Math.max(0, flat);

  if (pctSafe > 0) {
    const display = Number.isInteger(pctSafe) ? String(pctSafe) : String(pctSafe);
    parts.push(`+${display}%`);
  }
  if (flatSafe > 0) {
    parts.push(`+${formatCurrency(flatSafe, currency)}`);
  }

  return parts.length ? parts.join(' ') : '—';
}

export function formatUpchargeLabel(
  lineCode: string,
  _settings: PlatformInvoiceSettings,
  postedPct = 0,
  currency = 'USD',
  postedFlat = 0,
) {
  if (lineCode === 'monthly_platform' || lineCode === 'other_charges') {
    return '—';
  }

  return formatUpchargeLabelFromValues(postedPct, postedFlat, currency);
}
