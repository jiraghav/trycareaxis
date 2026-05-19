import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/admin-auth';
import { fetchInvoicesFromAllSources } from '@/lib/db/invoices';

export async function GET() {
  const auth = await requireAdminSession();
  if (auth.response) {
    return auth.response;
  }

  try {
    const summary = await fetchInvoicesFromAllSources();
    return NextResponse.json({ ok: true, ...summary });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load invoices.';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
