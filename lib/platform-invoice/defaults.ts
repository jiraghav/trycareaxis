import { querySource } from '@/lib/db/source-client';
import type { InvoiceDbSource } from '@/lib/db/types';
import type {
  PlatformInvoiceEditorLine,
  PlatformInvoiceSettings,
} from '@/lib/platform-invoice/types';

const PRICING_GLOBALS = [
  'cic_platform_monthly_fee',
  'cic_platform_other_charges',
  'cic_platform_openai_upcharge_percent',
  'cic_platform_sms_upcharge_percent',
  'cic_platform_openai_upcharge_flat',
  'cic_platform_sms_upcharge_flat',
  'cic_stripe_currency',
  'cic_stripe_days_until_due',
  'cic_stripe_secret_key',
  'cic_stripe_customer_id',
] as const;

function readGlobal(map: Map<string, string>, key: string, fallback = '') {
  return map.get(key) ?? fallback;
}

function readGlobalNumber(map: Map<string, string>, key: string, fallback = 0) {
  const parsed = Number(readGlobal(map, key, String(fallback)));
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function fetchPlatformInvoiceGlobals(source: InvoiceDbSource) {
  const placeholders = PRICING_GLOBALS.map(() => '?').join(', ');
  const rows = await querySource(
    source,
    `SELECT gl_name, gl_value FROM globals WHERE gl_name IN (${placeholders})`,
    [...PRICING_GLOBALS],
  );

  const map = new Map<string, string>();
  for (const row of rows) {
    const name = String(row.gl_name ?? '');
    if (name) {
      map.set(name, String(row.gl_value ?? ''));
    }
  }

  const settings: PlatformInvoiceSettings = {
    monthlyFee: readGlobalNumber(map, 'cic_platform_monthly_fee'),
    otherCharges: readGlobalNumber(map, 'cic_platform_other_charges'),
    openaiUpchargePercent: readGlobalNumber(map, 'cic_platform_openai_upcharge_percent'),
    smsUpchargePercent: readGlobalNumber(map, 'cic_platform_sms_upcharge_percent'),
    openaiUpchargeFlat: readGlobalNumber(map, 'cic_platform_openai_upcharge_flat'),
    smsUpchargeFlat: readGlobalNumber(map, 'cic_platform_sms_upcharge_flat'),
    stripeCurrency: readGlobal(map, 'cic_stripe_currency', 'usd').toLowerCase() || 'usd',
    stripeDaysUntilDue: Math.min(
      365,
      Math.max(1, readGlobalNumber(map, 'cic_stripe_days_until_due', 30)),
    ),
    stripeSecretKey: readGlobal(map, 'cic_stripe_secret_key'),
    stripeCustomerId: readGlobal(map, 'cic_stripe_customer_id'),
  };

  return settings;
}

export function defaultInvoiceTitle() {
  const now = new Date();
  const month = now.toLocaleString('en-US', { month: 'long' });
  return `Platform invoice ${month} ${now.getFullYear()}`;
}

export function defaultUsageMonth() {
  const now = new Date();
  const prior = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const year = prior.getFullYear();
  const month = String(prior.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function buildDefaultLineTemplate(settings: PlatformInvoiceSettings): PlatformInvoiceEditorLine[] {
  const month = defaultUsageMonth();
  return [
    {
      lineCode: 'monthly_platform',
      sortOrder: 10,
      description: 'Monthly Platform Cost',
      baseAmount: Math.max(0, settings.monthlyFee),
      upchargePercent: 0,
      upchargeFlat: 0,
      usageMonth: null,
      qty: 1,
    },
    {
      lineCode: 'openai',
      sortOrder: 20,
      description: 'OpenAI / AI Cost',
      baseAmount: 0,
      upchargePercent: Math.max(0, settings.openaiUpchargePercent),
      upchargeFlat: Math.max(0, settings.openaiUpchargeFlat),
      usageMonth: month,
      qty: 1,
    },
    {
      lineCode: 'sms',
      sortOrder: 30,
      description: 'SMS / Text Cost',
      baseAmount: 0,
      upchargePercent: Math.max(0, settings.smsUpchargePercent),
      upchargeFlat: Math.max(0, settings.smsUpchargeFlat),
      usageMonth: month,
      qty: 1,
    },
    {
      lineCode: 'other_charges',
      sortOrder: 40,
      description: 'Other charges',
      baseAmount: Math.max(0, settings.otherCharges),
      upchargePercent: 0,
      upchargeFlat: 0,
      usageMonth: null,
      qty: 1,
    },
  ];
}

export function buildUsageMonthOptions(count = 18) {
  const months: string[] = [];
  const cursor = new Date();
  cursor.setDate(1);
  for (let i = 0; i < count; i += 1) {
    const year = cursor.getFullYear();
    const month = String(cursor.getMonth() + 1).padStart(2, '0');
    months.push(`${year}-${month}`);
    cursor.setMonth(cursor.getMonth() - 1);
  }
  return months;
}
