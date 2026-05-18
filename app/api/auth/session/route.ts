import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  authenticateClient,
  CLIENT_SESSION_KEY,
  isAdminAccount,
  parseClientSession,
  type ClientAccount,
} from '@/lib/auth';

const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_MAX_AGE,
  };
}

function setSessionCookie(response: NextResponse, session: ClientAccount) {
  response.cookies.set(CLIENT_SESSION_KEY, JSON.stringify(session), sessionCookieOptions());
}

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const email = String(body.email ?? '').trim();
  const password = String(body.password ?? '').trim();

  if (!email || !password) {
    return NextResponse.json(
      { ok: false, error: 'Email and password are required.' },
      { status: 400 },
    );
  }

  const account = authenticateClient(email, password);
  if (!isAdminAccount(account)) {
    return NextResponse.json(
      { ok: false, error: 'Invalid email or password.' },
      { status: 401 },
    );
  }

  const session: ClientAccount = {
    ...account!,
    loggedInAt: new Date().toISOString(),
  };

  const response = NextResponse.json({ ok: true, account: session });
  setSessionCookie(response, session);
  return response;
}

export async function GET() {
  const cookieStore = await cookies();
  const session = parseClientSession(cookieStore.get(CLIENT_SESSION_KEY)?.value);

  if (!isAdminAccount(session)) {
    return NextResponse.json({ ok: false, authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ ok: true, authenticated: true, account: session });
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(CLIENT_SESSION_KEY, '', { ...sessionCookieOptions(), maxAge: 0 });
  return response;
}
