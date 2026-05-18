import type { VerticalKey } from '@/components/brand';

export type ClientAccount = {
  email: string;
  package: VerticalKey;
  role: string;
  loggedInAt: string;
};

type StaticLogin = {
  email: string;
  password: string;
  package: VerticalKey;
  role: string;
};

const STATIC_LOGINS: StaticLogin[] = [
  {
    email: 'admin@trycareaxis.com',
    password: 'admin@1234',
    package: 'pi360',
    role: 'admin',
  }
];

export function authenticateClient(
  email: string,
  password: string,
): Omit<ClientAccount, 'loggedInAt'> | null {
  const normalizedEmail = email.trim().toLowerCase();
  const match = STATIC_LOGINS.find(
    (login) =>
      login.email.toLowerCase() === normalizedEmail && login.password === password,
  );

  if (!match) {
    return null;
  }

  return {
    email: match.email,
    package: match.package,
    role: match.role,
  };
}

export const CLIENT_SESSION_KEY = 'careaxis_account';

export function readClientSession(): ClientAccount | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = localStorage.getItem(CLIENT_SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as ClientAccount;
  } catch {
    return null;
  }
}

export function writeClientSession(account: Omit<ClientAccount, 'loggedInAt'>) {
  const session: ClientAccount = {
    ...account,
    loggedInAt: new Date().toISOString(),
  };
  localStorage.setItem(CLIENT_SESSION_KEY, JSON.stringify(session));
}

export function clearClientSession() {
  localStorage.removeItem(CLIENT_SESSION_KEY);
}

export function isAdminAccount(account: ClientAccount | null) {
  return account?.role === 'admin';
}

export function parseClientSession(raw: string | undefined | null): ClientAccount | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as ClientAccount;
    if (!parsed.email || !parsed.role) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
