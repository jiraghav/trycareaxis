import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/admin-auth';
import { getInvoiceDbSourceById } from '@/lib/db/sources';
import { hasPositiveTotal, normalizeLineInputs } from '@/lib/platform-invoice/lines';
import { fetchPlatformInvoiceGlobals } from '@/lib/platform-invoice/defaults';
import {
  deletePlatformInvoice,
  loadInvoiceEditor,
  updatePlatformInvoice,
} from '@/lib/platform-invoice/repository';
import type { PlatformInvoiceSavePayload } from '@/lib/platform-invoice/types';

type RouteContext = {
  params: Promise<{ sourceId: string; invoiceId: string }>;
};

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

export async function GET(_request: Request, context: RouteContext) {
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

  try {
    const editor = await loadInvoiceEditor(source, invoiceId);
    return NextResponse.json({
      ok: true,
      sourceId: source.id,
      sourceLabel: source.label,
      ...editor,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load invoice.';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
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
  const payload = parsePayload(body);
  const settings = await fetchPlatformInvoiceGlobals(source);

  if (!hasPositiveTotal(payload.lines, settings)) {
    return NextResponse.json(
      { ok: false, error: 'Invoice total must be greater than zero.' },
      { status: 400 },
    );
  }

  try {
    await updatePlatformInvoice(source, invoiceId, payload);
    return NextResponse.json({ ok: true, sourceId, invoiceId });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save invoice.';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
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

  try {
    await deletePlatformInvoice(source, invoiceId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete invoice.';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
