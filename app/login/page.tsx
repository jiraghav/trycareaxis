'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BrandLockup } from '@/components/BrandLockup';
import { isAdminAccount, readClientSession, writeClientSession } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [defaultEmail, setDefaultEmail] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setDefaultEmail(params.get('email') ?? '');

    if (isAdminAccount(readClientSession())) {
      router.replace(params.get('next') ?? '/admin');
    }
  }, [router]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '').trim();
    const password = String(form.get('password') ?? '').trim();

    if (!email || !password) {
      setError('Enter your email and password to continue.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
        account?: ReturnType<typeof readClientSession>;
      };

      if (!response.ok || !payload.ok || !payload.account) {
        throw new Error(payload.error ?? 'Invalid email or password. Check your credentials and try again.');
      }

      writeClientSession(payload.account);
      const next = new URLSearchParams(window.location.search).get('next') ?? '/admin';
      router.push(next);
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : 'Invalid email or password. Check your credentials and try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <Navbar />

      <section className="section hero">
        <div className="container two-col">
          <div>
            <BrandLockup product="careaxis" />
            <h1 className="hero-title">Client login</h1>
            <p className="hero-subtitle hero-lead">
              Access your package dashboard, billing status, onboarding milestones, and launch call details.
            </p>
          </div>

          <div className="card">
            <h3 style={{ marginTop: 0 }}>Sign in to your account</h3>
            <form onSubmit={onSubmit} style={{ marginTop: 10 }}>
              <div className="form-grid">
                <div className="form-field form-field-full">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" required defaultValue={defaultEmail} placeholder="you@clinic.com" />
                </div>

                <div className="form-field form-field-full">
                  <label htmlFor="password">Password</label>
                  <input id="password" name="password" type="password" required placeholder="••••••••" />
                </div>

                <div className="form-field form-field-full">
                  <button className="btn primary" type="submit" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign in'}
                  </button>
                </div>
              </div>
            </form>

            {error ? <p className="small" style={{ color: '#ffb3b3' }}>{error}</p> : null}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
