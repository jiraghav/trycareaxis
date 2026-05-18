import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BrandLockup } from '@/components/BrandLockup';
import { BillingGraphic } from '@/components/Graphics';
import { FinalCtaPanel } from '@/components/FinalCtaPanel';
import { AdminInvoiceProvider } from '@/components/admin/AdminInvoiceProvider';
import { AdminKpiGrid } from '@/components/admin/AdminKpiGrid';
import { AdminClientOverview } from '@/components/admin/AdminClientOverview';
import { AdminBillingQueue } from '@/components/admin/AdminBillingQueue';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';

export const metadata: Metadata = {
  title: 'Care Axis Admin Console',
  description:
    'Admin view for client operations, billing visibility, collections status, and onboarding progress across Care Axis accounts.',
};

export default function AdminPage() {
  return (
    <main>
      <Navbar />
      <AdminAuthGuard>
      <AdminInvoiceProvider>
        <section className="section hero">
          <div className="container two-col">
            <div>
              <BrandLockup product="careaxis" />
              <h1 className="hero-title">Admin Console</h1>
              <p className="hero-subtitle hero-lead">
                Unified admin visibility across platform clients, Stripe invoices, and billing
                status from connected databases.
              </p>
              <div className="btn-row">
                <a className="btn primary" href="/contact#quickstart-order">
                  Add New Client
                </a>
                <a className="btn secondary" href="/book-call">
                  Escalate Support Call
                </a>
              </div>
            </div>
            <div className="card">
              <BillingGraphic />
              <AdminKpiGrid />
            </div>
          </div>
        </section>

        <section className="section section-tight-top">
          <AdminClientOverview />
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container two-col">
            <AdminBillingQueue />

            <div className="card">
              <h2 style={{ marginTop: 0 }}>Admin Actions</h2>
              <ul className="list">
                <li>Filter by source, status, invoice date, and account owner</li>
                <li>Export billing summaries per client or by date range</li>
                <li>Track onboarding completion and required migration files</li>
                <li>Flag at-risk accounts for intervention and call scheduling</li>
              </ul>
              <div className="btn-row">
                <a className="btn primary" href="/pricing">
                  Update package pricing
                </a>
                <a className="btn ghost" href="/verticals">
                  View package details
                </a>
              </div>
            </div>
          </div>
        </section>

        <FinalCtaPanel
          eyebrow="Admin Operations"
          title="Need to review package performance or billing risk?"
          copy="Use the admin dashboard with your operations team to review account health, rollout progress, and collections priorities."
          primaryHref="/book-call"
          primaryLabel="Schedule Ops Review"
          secondaryHref="/pricing"
          secondaryLabel="Review Pricing Models"
        />
      </AdminInvoiceProvider>
      </AdminAuthGuard>

      <Footer />
    </main>
  );
}
