'use client';

import { FormEvent, useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BrandLockup } from '@/components/BrandLockup';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [defaultEmail, setDefaultEmail] = useState('');

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get('email') ?? '';
    setDefaultEmail(value);
  }, []);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
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

    const packageName = String(form.get('package') ?? 'pi360');

    const account = {
      email,
      package: packageName,
      role: 'client',
      loggedInAt: new Date().toISOString(),
    };

    localStorage.setItem('careaxis_account', JSON.stringify(account));
    setLoading(false);
    router.push('/portal');
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
                  <label htmlFor="package">Package</label>
                  <select id="package" name="package" defaultValue="pi360">
                    <option value="pi360">Care Axis PI360</option>
                    <option value="dpc360">Care Axis DPC360</option>
                    <option value="practice360">Care Axis Practice360</option>
                    <option value="ortho360">Care Axis Ortho360</option>
                    <option value="pain360">Care Axis Pain360</option>
                  </select>
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
