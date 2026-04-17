import { NextResponse } from 'next/server';

function createId(prefix: string) {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${Date.now().toString().slice(-6)}-${rand}`;
}

function withParams(url: string, params: Record<string, string>) {
  const out = new URL(url, 'http://localhost');
  Object.entries(params).forEach(([key, value]) => {
    out.searchParams.set(key, value);
  });
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return out.toString();
  }
  return `${out.pathname}${out.search}`;
}

export async function POST(request: Request) {
  const formData = await request.formData();

  const organization = String(formData.get('organization') ?? '').trim();
  const contactName = String(formData.get('contact_name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const pkg = String(formData.get('package') ?? '').trim();
  const consentQuote = String(formData.get('consent_quote') ?? '');

  if (!organization || !contactName || !email || !pkg || consentQuote !== 'yes') {
    return NextResponse.json(
      { ok: false, error: 'Please complete required fields and consent to receive your quote.' },
      { status: 400 },
    );
  }

  const quoteId = createId('QTE');
  const packageName = pkg.toUpperCase();

  const paymentBase = process.env.CARE_AXIS_PAYMENT_URL || '/pricing';
  const launchBase =
    process.env.CARE_AXIS_LAUNCH_CALL_URL ||
    process.env.CARE_AXIS_GOOGLE_CALENDAR_BOOKING_URL ||
    '/book-call';
  const acceptBase = process.env.CARE_AXIS_ACCEPT_QUOTE_URL || '/contact#quickstart-order';

  const paymentUrl = withParams(paymentBase, { quote: quoteId, package: packageName });
  const launchCallUrl = withParams(launchBase, { quote: quoteId, package: packageName });
  const acceptQuoteUrl = withParams(acceptBase, { quote: quoteId });

  const payload = {
    type: 'quote_request',
    quoteId,
    submittedAt: new Date().toISOString(),
    organization,
    contactName,
    email,
    phone: String(formData.get('phone') ?? '').trim(),
    package: pkg,
    clinicCount: String(formData.get('clinic_count') ?? '').trim(),
    goLive: String(formData.get('go_live') ?? '').trim(),
    migration: String(formData.get('migration') ?? '').trim(),
    notes: String(formData.get('notes') ?? '').trim(),
    launchReady: String(formData.get('consent_launch') ?? '') === 'yes',
  };

  const webhook = process.env.CARE_AXIS_LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      // Non-blocking: webhook failures should not block user conversion flow.
    }
  }

  return NextResponse.json({
    ok: true,
    quoteId,
    paymentUrl,
    acceptQuoteUrl,
    launchCallUrl,
    message: 'Quote request received. Continue to acceptance and payment to start onboarding.',
  });
}
