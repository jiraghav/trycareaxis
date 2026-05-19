import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/admin-auth';
import { getInvoiceDbSourceById } from '@/lib/db/sources';
import {
  fetchPlatformInvoiceDefaults,
  persistPlatformInvoiceDefaults,
} from '@/lib/platform-invoice/settings';
import type { PlatformInvoiceDefaultsInput } from '@/lib/platform-invoice/types';

function parseDefaultsInput(body: Record<string, unknown>): PlatformInvoiceDefaultsInput {
  return {
    monthlyFee: Number(body.monthlyFee ?? 0),
    otherCharges: Number(body.otherCharges ?? 0),
    openaiUpchargePercent: Number(body.openaiUpchargePercent ?? 0),
    smsUpchargePercent: Number(body.smsUpchargePercent ?? 0),
    openaiUpchargeFlat: Number(body.openaiUpchargeFlat ?? 0),
    smsUpchargeFlat: Number(body.smsUpchargeFlat ?? 0),
    stripeDaysUntilDue: Number(body.stripeDaysUntilDue ?? 30),
    stripeWebhookSecret:
      body.stripeWebhookSecret === undefined || body.stripeWebhookSecret === null
        ? undefined
        : String(body.stripeWebhookSecret),
  };
}

export async function GET(request: Request) {
  const auth = await requireAdminSession();
  if (auth.response) {
    return auth.response;
  }

  const sourceId = new URL(request.url).searchParams.get('sourceId')?.trim() ?? '';
  const source = getInvoiceDbSourceById(sourceId);
  if (!source) {
    return NextResponse.json({ ok: false, error: 'Unknown invoice database source.' }, { status: 400 });
  }

  try {
    const defaults = await fetchPlatformInvoiceDefaults(source);
    return NextResponse.json({
      ok: true,
      sourceId: source.id,
      sourceLabel: source.label,
      defaults,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load invoice defaults.';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const auth = await requireAdminSession();
  if (auth.response) {
    return auth.response;
  }

  const body = (await request.json()) as Record<string, unknown>;
  const sourceId = String(body.sourceId ?? '').trim();
  const source = getInvoiceDbSourceById(sourceId);
  if (!source) {
    return NextResponse.json({ ok: false, error: 'Unknown invoice database source.' }, { status: 400 });
  }

  try {
    const input = parseDefaultsInput(body);
    await persistPlatformInvoiceDefaults(source, input);
    const defaults = await fetchPlatformInvoiceDefaults(source);
    return NextResponse.json({
      ok: true,
      sourceId: source.id,
      sourceLabel: source.label,
      defaults,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save invoice defaults.';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
