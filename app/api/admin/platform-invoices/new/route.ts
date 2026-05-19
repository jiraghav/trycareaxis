import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/admin-auth';
import { getInvoiceDbSourceById } from '@/lib/db/sources';
import { loadNewInvoiceEditor } from '@/lib/platform-invoice/repository';

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
    const editor = await loadNewInvoiceEditor(source);
    return NextResponse.json({
      ok: true,
      sourceId: source.id,
      sourceLabel: source.label,
      ...editor,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load invoice defaults.';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
