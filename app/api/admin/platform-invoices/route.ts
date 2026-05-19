import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/admin-auth';
import { getInvoiceDbSourceById } from '@/lib/db/sources';
import { hasPositiveTotal, normalizeLineInputs } from '@/lib/platform-invoice/lines';
import { fetchPlatformInvoiceGlobals } from '@/lib/platform-invoice/defaults';
import { createPlatformInvoice } from '@/lib/platform-invoice/repository';
import type { PlatformInvoiceSavePayload } from '@/lib/platform-invoice/types';

function parsePayload(body: Record<string, unknown>): PlatformInvoiceSavePayload {
  return {
    title: String(body.title ?? ''),
    notes: String(body.notes ?? ''),
    userId: null,
    lines: normalizeLineInputs(body.lines),
    stripeDaysUntilDue:
      body.stripeDaysUntilDue === undefined ? undefined : Number(body.stripeDaysUntilDue),
  };
}

export async function POST(request: Request) {
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

  const payload = parsePayload(body);
  const settings = await fetchPlatformInvoiceGlobals(source);
  if (!hasPositiveTotal(payload.lines, settings)) {
    return NextResponse.json(
      { ok: false, error: 'Invoice total must be greater than zero.' },
      { status: 400 },
    );
  }

  try {
    const invoiceId = await createPlatformInvoice(source, payload);
    return NextResponse.json({ ok: true, sourceId, invoiceId });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create invoice.';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
