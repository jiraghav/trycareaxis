import type { PlatformInvoiceSettings } from '@/lib/platform-invoice/types';

type StripeLine = {
  description: string;
  amountCents: number;
};

function stripeFormBody(fields: Record<string, string>) {
  return new URLSearchParams(fields).toString();
}

async function stripeRequest<T>(
  secretKey: string,
  method: 'POST' | 'GET',
  path: string,
  fields: Record<string, string> = {},
): Promise<T> {
  const response = await fetch(`https://api.stripe.com/v1${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: method === 'POST' ? stripeFormBody(fields) : undefined,
  });

  const payload = (await response.json()) as T & { error?: { message?: string } };
  if (!response.ok) {
    throw new Error(payload.error?.message ?? `Stripe request failed (${response.status})`);
  }

  return payload;
}

export async function createStripeInvoiceFromLines(
  settings: PlatformInvoiceSettings,
  lines: StripeLine[],
  daysUntilDue: number,
) {
  if (!settings.stripeSecretKey) {
    throw new Error('Stripe secret key is not configured in EMR globals.');
  }
  if (!settings.stripeCustomerId) {
    throw new Error('Stripe customer ID is not configured in EMR globals.');
  }

  const billable = lines.filter((line) => line.amountCents > 0);
  if (!billable.length) {
    throw new Error('No positive line totals to send to Stripe.');
  }

  const currency = (settings.stripeCurrency || 'usd').toLowerCase();
  const dueDays = Math.min(365, Math.max(1, daysUntilDue));

  const draft = await stripeRequest<{
    id: string;
    status?: string;
    number?: string | null;
    hosted_invoice_url?: string | null;
  }>(settings.stripeSecretKey, 'POST', '/invoices', {
    customer: settings.stripeCustomerId,
    collection_method: 'send_invoice',
    days_until_due: String(dueDays),
    currency,
    auto_advance: 'false',
  });

  for (const line of billable) {
    await stripeRequest(settings.stripeSecretKey, 'POST', '/invoiceitems', {
      customer: settings.stripeCustomerId,
      invoice: draft.id,
      amount: String(line.amountCents),
      currency,
      description: line.description,
    });
  }

  if (draft.status === 'draft') {
    const finalized = await stripeRequest<{
      id: string;
      status?: string;
      number?: string | null;
      hosted_invoice_url?: string | null;
    }>(settings.stripeSecretKey, 'POST', `/invoices/${encodeURIComponent(draft.id)}/finalize`);

    return {
      id: finalized.id,
      number: finalized.number ?? null,
      status: finalized.status ?? null,
      hostedInvoiceUrl: finalized.hosted_invoice_url ?? null,
      dashboardUrl: `https://dashboard.stripe.com/invoices/${encodeURIComponent(finalized.id)}`,
    };
  }

  return {
    id: draft.id,
    number: draft.number ?? null,
    status: draft.status ?? null,
    hostedInvoiceUrl: draft.hosted_invoice_url ?? null,
    dashboardUrl: `https://dashboard.stripe.com/invoices/${encodeURIComponent(draft.id)}`,
  };
}
