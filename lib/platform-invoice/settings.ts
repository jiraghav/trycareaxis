import { executeSource, querySource } from '@/lib/db/source-client';
import type { InvoiceDbSource } from '@/lib/db/types';
import { fetchPlatformInvoiceGlobals } from '@/lib/platform-invoice/defaults';
import type {
  PlatformInvoiceDefaultsInput,
  PlatformInvoiceDefaultsView,
} from '@/lib/platform-invoice/types';

const EDITABLE_GLOBAL_KEYS = [
  'cic_platform_monthly_fee',
  'cic_platform_other_charges',
  'cic_platform_openai_upcharge_percent',
  'cic_platform_sms_upcharge_percent',
  'cic_stripe_days_until_due',
  'cic_stripe_webhook_secret',
] as const;

export function buildStripeWebhookUrl(source: InvoiceDbSource) {
  const base = source.openemrBaseUrl?.replace(/\/+$/, '');
  if (!base) {
    return null;
  }
  const siteId = source.openemrSiteId?.trim() || 'default';
  return `${base}/interface/billing/cic_stripe_webhook.php?site=${encodeURIComponent(siteId)}`;
}

export async function fetchPlatformInvoiceDefaults(
  source: InvoiceDbSource,
): Promise<PlatformInvoiceDefaultsView> {
  const settings = await fetchPlatformInvoiceGlobals(source);
  const webhookRows = await querySource(
    source,
    "SELECT gl_value FROM globals WHERE gl_name = 'cic_stripe_webhook_secret' LIMIT 1",
  );
  const webhookSecret = String(webhookRows[0]?.gl_value ?? '').trim();

  return {
    monthlyFee: settings.monthlyFee,
    otherCharges: settings.otherCharges,
    openaiUpchargePercent: settings.openaiUpchargePercent,
    smsUpchargePercent: settings.smsUpchargePercent,
    stripeDaysUntilDue: settings.stripeDaysUntilDue,
    stripeCurrency: settings.stripeCurrency,
    hasStripeSecret: Boolean(settings.stripeSecretKey.trim()),
    hasStripeCustomer: Boolean(settings.stripeCustomerId.trim()),
    hasWebhookSecret: Boolean(webhookSecret),
    webhookUrl: buildStripeWebhookUrl(source),
  };
}

function validateDefaultsInput(input: PlatformInvoiceDefaultsInput) {
  if (
    input.monthlyFee < 0 ||
    input.otherCharges < 0 ||
    input.openaiUpchargePercent < 0 ||
    input.smsUpchargePercent < 0
  ) {
    throw new Error('Values cannot be negative.');
  }

  if (input.stripeDaysUntilDue < 1 || input.stripeDaysUntilDue > 365) {
    throw new Error('Stripe payment due days must be between 1 and 365.');
  }
}

async function upsertGlobal(source: InvoiceDbSource, name: string, value: string) {
  await executeSource(source, 'DELETE FROM globals WHERE gl_name = ?', [name]);
  await executeSource(source, 'INSERT INTO globals (gl_name, gl_index, gl_value) VALUES (?, 0, ?)', [
    name,
    value,
  ]);
}

export async function persistPlatformInvoiceDefaults(
  source: InvoiceDbSource,
  input: PlatformInvoiceDefaultsInput,
) {
  validateDefaultsInput(input);

  const values: Record<string, string> = {
    cic_platform_monthly_fee: String(input.monthlyFee),
    cic_platform_other_charges: String(input.otherCharges),
    cic_platform_openai_upcharge_percent: String(input.openaiUpchargePercent),
    cic_platform_sms_upcharge_percent: String(input.smsUpchargePercent),
    cic_stripe_days_until_due: String(
      Math.min(365, Math.max(1, Math.round(input.stripeDaysUntilDue))),
    ),
  };

  const webhookSecret = input.stripeWebhookSecret?.trim();
  if (webhookSecret) {
    values.cic_stripe_webhook_secret = webhookSecret;
  }

  for (const key of EDITABLE_GLOBAL_KEYS) {
    if (key in values) {
      await upsertGlobal(source, key, values[key]);
    }
  }
}
