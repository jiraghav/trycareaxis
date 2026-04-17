'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BrandLockup } from '@/components/BrandLockup';
import type { VerticalKey } from '@/components/brand';

type Account = {
  email: string;
  package: VerticalKey;
  role: string;
  loggedInAt: string;
};

const packageLabel: Record<VerticalKey, string> = {
  pi360: 'Care Axis PI360',
  dpc360: 'Care Axis DPC360',
  practice360: 'Care Axis Practice360',
  ortho360: 'Care Axis Ortho360',
  pain360: 'Care Axis Pain360',
};

const packagePrice: Record<VerticalKey, string> = {
  pi360: '$399/mo',
  dpc360: '$299/mo',
  practice360: '$349/mo',
  ortho360: '$449/mo',
  pain360: '$449/mo',
};

export default function PortalPage() {
  const router = useRouter();
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('careaxis_account');
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as Account;
      setAccount(parsed);
    } catch {
      setAccount(null);
    }
  }, []);

  const billingSummary = useMemo(() => {
    if (!account) {
      return null;
    }

    return {
      packageName: packageLabel[account.package] ?? 'Care Axis Package',
      monthly: packagePrice[account.package] ?? 'Starting at $199/mo',
      nextInvoiceDate: 'April 30, 2026',
      invoiceStatus: 'Auto-pay enabled',
      implementationStatus: 'In progress',
    };
  }, [account]);

  function logout() {
    localStorage.removeItem('careaxis_account');
    router.push('/login');
  }

  return (
    <main>
      <Navbar />

      <section className="section hero">
        <div className="container two-col">
          <div>
            <BrandLockup product="careaxis" />
            <h1 className="hero-title">Client portal</h1>
            <p className="hero-subtitle hero-lead">
              Review package status, billing, onboarding milestones, and launch scheduling in one place.
            </p>
            <div className="btn-row">
              <a className="btn primary" href="/book-call">Schedule launch call</a>
              <a className="btn secondary" href="/contact#quickstart-order">Open onboarding support</a>
              <button className="btn ghost" type="button" onClick={logout}>Sign out</button>
            </div>
          </div>

          <article className="card">
            <h3 style={{ marginTop: 0 }}>Account summary</h3>
            {account ? (
              <div className="list">
                <p className="small" style={{ margin: 0 }}><strong>Email:</strong> {account.email}</p>
                <p className="small" style={{ margin: 0 }}><strong>Selected package:</strong> {packageLabel[account.package]}</p>
                <p className="small" style={{ margin: 0 }}><strong>Portal role:</strong> Client Admin</p>
                <p className="small" style={{ margin: 0 }}><strong>Last login:</strong> {new Date(account.loggedInAt).toLocaleString()}</p>
              </div>
            ) : (
              <p className="small" style={{ marginBottom: 0 }}>
                No active session found. Sign in to view your billing and onboarding progress.
              </p>
            )}
            {!account ? (
              <div className="btn-row" style={{ marginTop: 16 }}>
                <a className="btn primary" href="/login">Go to login</a>
              </div>
            ) : null}
          </article>
        </div>
      </section>

      {account && billingSummary ? (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="admin-kpi-grid portal-kpi-grid">
              <article className="admin-kpi">
                <span>Current Package</span>
                <strong>{billingSummary.packageName}</strong>
              </article>
              <article className="admin-kpi">
                <span>Monthly Plan</span>
                <strong>{billingSummary.monthly}</strong>
              </article>
              <article className="admin-kpi">
                <span>Next Invoice</span>
                <strong>{billingSummary.nextInvoiceDate}</strong>
              </article>
              <article className="admin-kpi">
                <span>Status</span>
                <strong>{billingSummary.invoiceStatus}</strong>
              </article>
            </div>
          </div>
        </section>
      ) : null}

      {account && billingSummary ? (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container two-col">
            <article className="card">
              <h3 style={{ marginTop: 0 }}>Onboarding workflow</h3>
              <div className="timeline">
                <div className="timeline-step">
                  <strong>1. Package confirmed: {billingSummary.packageName}</strong>
                  <span className="muted">Your package is mapped to your clinic model and user structure.</span>
                </div>
                <div className="timeline-step">
                  <strong>2. Billing and contract status: {billingSummary.invoiceStatus}</strong>
                  <span className="muted">Invoice and payment settings are active for implementation kickoff.</span>
                </div>
                <div className="timeline-step">
                  <strong>3. Implementation state: {billingSummary.implementationStatus}</strong>
                  <span className="muted">Data migration intake and workflow configuration are underway.</span>
                </div>
                <div className="timeline-step">
                  <strong>4. Launch call</strong>
                  <span className="muted">Choose your preferred date and time in Google Calendar.</span>
                </div>
              </div>
            </article>

            <article className="card">
              <h3 style={{ marginTop: 0 }}>Billing and support actions</h3>
              <div className="table-wrap">
                <table className="data-table" aria-label="Client billing summary">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{billingSummary.packageName} monthly plan</td>
                      <td>{billingSummary.monthly}</td>
                      <td><span className="status-pill active">Active</span></td>
                    </tr>
                    <tr>
                      <td>Data migration setup</td>
                      <td>$499 one-time</td>
                      <td><span className="status-pill implementation">In setup</span></td>
                    </tr>
                    <tr>
                      <td>Launch support</td>
                      <td>Included</td>
                      <td><span className="status-pill active">Scheduled</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="btn-row" style={{ marginTop: 18 }}>
                <a className="btn primary" href="/book-call">Open launch calendar</a>
                <a className="btn secondary" href="/contact">Message support</a>
              </div>
            </article>
          </div>
        </section>
      ) : null}

      <Footer />
    </main>
  );
}
