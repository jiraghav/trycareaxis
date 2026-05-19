import { roundMoney } from '@/lib/db/invoice-lines';
import { querySource } from '@/lib/db/source-client';
import type { InvoiceDbSource } from '@/lib/db/types';
import type { UsageTotalsResult } from '@/lib/platform-invoice/types';

const OPENAI_MODEL_RATES: Record<string, { in: number; out: number }> = {
  'gpt-4-turbo-2024-04-09': { in: 0.01, out: 0.03 },
  'gpt-4-turbo': { in: 0.01, out: 0.03 },
  'gpt-4o': { in: 0.005, out: 0.015 },
  'gpt-4o-mini': { in: 0.00015, out: 0.0006 },
  'gpt-4': { in: 0.03, out: 0.06 },
  'gpt-3.5-turbo': { in: 0.0005, out: 0.0015 },
};

const DEFAULT_OPENAI_RATE = { in: 0.002, out: 0.006 };

function monthRange(month: string) {
  const start = `${month}-01`;
  const endDate = new Date(`${month}-01T00:00:00`);
  endDate.setMonth(endDate.getMonth() + 1);
  const endExclusive = endDate.toISOString().slice(0, 10);
  return {
    start: `${start} 00:00:00`,
    end: `${endExclusive} 00:00:00`,
  };
}

async function smsSumForMonth(source: InvoiceDbSource, month: string) {
  const { start, end } = monthRange(month);

  const columns = await querySource(source, 'SHOW COLUMNS FROM `sms_logs`');
  const fields = new Set(columns.map((row) => String(row.Field ?? '')));

  if (!fields.has('cost')) {
    throw new Error('sms_logs.cost column not found');
  }

  const dateCandidates = ['created_at', 'created_date', 'created', 'sent_at', 'datetime'];
  const dateCol = dateCandidates.find((name) => fields.has(name));
  if (!dateCol) {
    throw new Error('No date column found on sms_logs');
  }

  const sumRows = await querySource(
    source,
    `SELECT SUM(\`cost\`) AS total FROM \`sms_logs\` WHERE \`${dateCol}\` >= ? AND \`${dateCol}\` < ?`,
    [start, end],
  );
  const total = Number(sumRows[0]?.total ?? 0);

  let countSql = `SELECT COUNT(*) AS count FROM \`sms_logs\` WHERE \`${dateCol}\` >= ? AND \`${dateCol}\` < ?`;
  const countParams: unknown[] = [start, end];
  if (fields.has('message_delivery_result')) {
    countSql += ' AND `message_delivery_result` = ?';
    countParams.push('accepted');
  }

  const countRows = await querySource(source, countSql, countParams);
  const count = Number(countRows[0]?.count ?? 0);

  return {
    total: roundMoney(Number.isFinite(total) ? total : 0),
    count,
  };
}

async function openaiSumForMonth(source: InvoiceDbSource, month: string) {
  const { start, end } = monthRange(month);

  const tables = await querySource(source, "SHOW TABLES LIKE 'chatgpt_logs'");
  if (!tables.length) {
    return { total: 0, rows: 0, logCount: 0 };
  }

  const countRows = await querySource(
    source,
    'SELECT COUNT(*) AS count FROM `chatgpt_logs` WHERE `created_at` >= ? AND `created_at` < ?',
    [start, end],
  );
  const logCount = Number(countRows[0]?.count ?? 0);

  const logRows = await querySource(
    source,
    `SELECT model, response FROM chatgpt_logs
     WHERE created_at >= ? AND created_at < ?
       AND response IS NOT NULL AND response != ''`,
    [start, end],
  );

  let total = 0;
  let rows = 0;

  for (const row of logRows) {
    const model = String(row.model ?? '');
    const raw = String(row.response ?? '');
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      continue;
    }

    if (!parsed || typeof parsed !== 'object') {
      continue;
    }

    const usage = (parsed as { usage?: { prompt_tokens?: number; completion_tokens?: number } }).usage;
    if (!usage) {
      continue;
    }

    const promptTokens = Number(usage.prompt_tokens ?? 0);
    const completionTokens = Number(usage.completion_tokens ?? 0);
    if (promptTokens === 0 && completionTokens === 0) {
      continue;
    }

    const rate = OPENAI_MODEL_RATES[model] ?? DEFAULT_OPENAI_RATE;
    total += (promptTokens / 1000) * rate.in + (completionTokens / 1000) * rate.out;
    rows += 1;
  }

  return { total: roundMoney(total), rows, logCount };
}

export async function fetchUsageTotals(
  source: InvoiceDbSource,
  month: string,
): Promise<UsageTotalsResult> {
  if (!/^\d{4}-\d{2}$/.test(month)) {
    throw new Error('Invalid month. Use YYYY-MM.');
  }

  const sms = await smsSumForMonth(source, month);
  const openai = await openaiSumForMonth(source, month);

  return {
    month,
    smsTotal: sms.total,
    smsCount: sms.count,
    openaiTotal: openai.total,
    openaiRows: openai.rows,
    openaiLogCount: openai.logCount,
  };
}
