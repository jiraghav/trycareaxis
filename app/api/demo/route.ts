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

  const name = String(formData.get('demo_name') ?? '').trim();
  const email = String(formData.get('demo_email') ?? '').trim();
  const org = String(formData.get('demo_org') ?? '').trim();
  const pkg = String(formData.get('demo_package') ?? 'not_sure').trim();

  if (!name || !email || !org) {
    return NextResponse.json(
      { ok: false, error: 'Please complete your name, email, and organization.' },
      { status: 400 },
    );
  }

  const demoId = createId('DEM');
  const schedulerBase =
    process.env.CARE_AXIS_GOOGLE_CALENDAR_BOOKING_URL ||
    process.env.CARE_AXIS_DEMO_SCHEDULER_URL ||
    '/book-call';
  const schedulerUrl = withParams(schedulerBase, { demo: demoId, package: pkg.toUpperCase() });

  const payload = {
    type: 'demo_request',
    demoId,
    submittedAt: new Date().toISOString(),
    name,
    email,
    organization: org,
    package: pkg,
    goals: String(formData.get('demo_goals') ?? '').trim(),
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
    demoId,
    schedulerUrl,
    message: 'Demo request received. Continue to schedule your live walkthrough.',
  });
}
