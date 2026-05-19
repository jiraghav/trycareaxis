import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/admin-auth';
import { getInvoiceDbSourceById } from '@/lib/db/sources';
import { fetchPlatformInvoiceGlobals } from '@/lib/platform-invoice/defaults';
import { hasPositiveTotal, normalizeLineInputs, stripeLinesFromInput } from '@/lib/platform-invoice/lines';
import { loadInvoiceEditor, markStripeLinked, updatePlatformInvoice } from '@/lib/platform-invoice/repository';
import { createStripeInvoiceFromLines } from '@/lib/platform-invoice/stripe';
import type { PlatformInvoiceSavePayload } from '@/lib/platform-invoice/types';

type RouteContext = {
  params: Promise<{ sourceId: string; invoiceId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if (auth.response) {
    return auth.response;
  }

  const { sourceId, invoiceId: invoiceIdRaw } = await context.params;
  const source = getInvoiceDbSourceById(sourceId);
  const invoiceId = Number(invoiceIdRaw);

  if (!source || !Number.isFinite(invoiceId) || invoiceId < 1) {
    return NextResponse.json({ ok: false, error: 'Invalid invoice reference.' }, { status: 400 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const payload: PlatformInvoiceSavePayload = {
    title: String(body.title ?? ''),
    notes: String(body.notes ?? ''),
    userId: null,
    lines: normalizeLineInputs(body.lines),
    stripeDaysUntilDue:
      body.stripeDaysUntilDue === undefined ? undefined : Number(body.stripeDaysUntilDue),
  };

  const settings = await fetchPlatformInvoiceGlobals(source);
  if (!hasPositiveTotal(payload.lines, settings)) {
    return NextResponse.json(
      { ok: false, error: 'Invoice total must be greater than zero.' },
      { status: 400 },
    );
  }

  try {
    const existing = await loadInvoiceEditor(source, invoiceId);
    if (existing.invoice.stripeInvoiceId) {
      return NextResponse.json(
        { ok: false, error: 'This invoice is already linked to Stripe.' },
        { status: 400 },
      );
    }

    await updatePlatformInvoice(source, invoiceId, payload);

    const stripeLines = stripeLinesFromInput(payload.lines, settings);
    if (!stripeLines.length) {
      return NextResponse.json(
        { ok: false, error: 'No billable line items to send to Stripe.' },
        { status: 400 },
      );
    }

    const daysDue = payload.stripeDaysUntilDue ?? settings.stripeDaysUntilDue;
    const stripe = await createStripeInvoiceFromLines(settings, stripeLines, daysDue);
    await markStripeLinked(source, invoiceId, stripe);

    return NextResponse.json({ ok: true, stripe });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create Stripe invoice.';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
