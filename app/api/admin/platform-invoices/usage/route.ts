import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/admin-auth';
import { getInvoiceDbSourceById } from '@/lib/db/sources';
import { fetchUsageTotals } from '@/lib/platform-invoice/usage';

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if (auth.response) {
    return auth.response;
  }

  const body = (await request.json()) as { sourceId?: string; month?: string };
  const sourceId = String(body.sourceId ?? '').trim();
  const month = String(body.month ?? '').trim();
  const source = getInvoiceDbSourceById(sourceId);

  if (!source) {
    return NextResponse.json({ ok: false, error: 'Unknown invoice database source.' }, { status: 400 });
  }

  try {
    const usage = await fetchUsageTotals(source, month);
    return NextResponse.json({ ok: true, ...usage });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load usage totals.';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
