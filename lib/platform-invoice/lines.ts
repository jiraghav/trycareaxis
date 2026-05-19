import { roundMoney } from '@/lib/db/invoice-lines';
import {
  formatUsageMonthLabel,
  sanitizeInvoiceLineDescription,
} from '@/lib/platform-invoice/format';
import {
  lineTotalFromInput,
  resolveUpchargeFlat,
  resolveUpchargePercent,
} from '@/lib/platform-invoice/pricing';
import type { PlatformInvoiceSettings } from '@/lib/platform-invoice/types';
import type { InvoiceLineInput } from '@/lib/platform-invoice/types';

export { lineTotalFromInput, resolveUpchargeFlat, resolveUpchargePercent } from '@/lib/platform-invoice/pricing';

export function grandTotalFromLines(lines: InvoiceLineInput[], _settings?: PlatformInvoiceSettings) {
  return lines
    .filter((line) => line.description.trim() !== '')
    .reduce((sum, line) => sum + lineTotalFromInput(line), 0);
}

export function hasPositiveTotal(lines: InvoiceLineInput[], settings?: PlatformInvoiceSettings) {
  return grandTotalFromLines(lines, settings) >= 0.01;
}

export function stripeLinesFromInput(lines: InvoiceLineInput[], _settings?: PlatformInvoiceSettings) {
  const stripeLines: Array<{ description: string; amountCents: number }> = [];

  for (const line of lines) {
    if (!line.description.trim()) {
      continue;
    }

    const total = lineTotalFromInput(line);
    const cents = Math.round(total * 100);
    if (cents <= 0) {
      continue;
    }

    let description = sanitizeInvoiceLineDescription(line.description);
    if ((line.lineCode === 'openai' || line.lineCode === 'sms') && line.usageMonth) {
      description += ` — Usage month ${formatUsageMonthLabel(line.usageMonth)}`;
    }

    stripeLines.push({ description, amountCents: cents });
  }

  return stripeLines;
}

export function normalizeLineInputs(raw: unknown): InvoiceLineInput[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw.map((entry, index) => {
    const row = (entry ?? {}) as Record<string, unknown>;
    const usageMonthRaw = String(row.usageMonth ?? row.usage_month ?? '').trim();
    const usageMonth = /^\d{4}-\d{2}$/.test(usageMonthRaw) ? usageMonthRaw : null;

    return {
      lineCode: String(row.lineCode ?? row.line_code ?? 'custom').trim() || 'custom',
      sortOrder: Number(row.sortOrder ?? row.sort_order ?? (index + 1) * 10),
      description: String(row.description ?? '').trim(),
      baseAmount: roundMoney(Number(row.baseAmount ?? row.base_amount ?? 0)),
      upchargePercent: Number(row.upchargePercent ?? row.upcharge_percent ?? 0),
      upchargeFlat: Number(row.upchargeFlat ?? row.upcharge_flat ?? 0),
      usageMonth,
      qty: Number(row.qty ?? 1),
    };
  });
}
