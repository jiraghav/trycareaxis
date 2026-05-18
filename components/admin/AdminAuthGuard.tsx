'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { isAdminAccount, readClientSession, writeClientSession } from '@/lib/auth';

export function AdminAuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function verifyAccess() {
      const localSession = readClientSession();
      if (isAdminAccount(localSession)) {
        if (!cancelled) {
          setReady(true);
        }
        return;
      }

      try {
        const response = await fetch('/api/auth/session', { cache: 'no-store' });
        const payload = (await response.json()) as {
          ok?: boolean;
          account?: ReturnType<typeof readClientSession>;
        };

        if (!response.ok || !payload.ok || !isAdminAccount(payload.account ?? null)) {
          router.replace('/login?next=/admin');
          return;
        }

        writeClientSession(payload.account!);
        if (!cancelled) {
          setReady(true);
        }
      } catch {
        router.replace('/login?next=/admin');
      }
    }

    void verifyAccess();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!ready) {
    return (
      <section className="section hero">
        <div className="container card">
          <p className="small" style={{ margin: 0 }}>
            Checking admin access...
          </p>
        </div>
      </section>
    );
  }

  return children;
}
