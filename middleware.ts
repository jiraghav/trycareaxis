import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { CLIENT_SESSION_KEY, isAdminAccount, parseClientSession } from '@/lib/auth';

export function middleware(request: NextRequest) {
  const session = parseClientSession(request.cookies.get(CLIENT_SESSION_KEY)?.value);

  if (!isAdminAccount(session)) {
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin/:path*'],
};
