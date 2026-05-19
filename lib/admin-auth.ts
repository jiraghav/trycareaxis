import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { CLIENT_SESSION_KEY, isAdminAccount, parseClientSession } from '@/lib/auth';

export async function getAdminSession() {
  const cookieStore = await cookies();
  const session = parseClientSession(cookieStore.get(CLIENT_SESSION_KEY)?.value);
  return isAdminAccount(session) ? session : null;
}

export function unauthorizedResponse() {
  return NextResponse.json({ ok: false, error: 'Admin access required.' }, { status: 401 });
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) {
    return { session: null, response: unauthorizedResponse() };
  }
  return { session, response: null };
}
