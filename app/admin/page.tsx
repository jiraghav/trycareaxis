import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BrandLockup } from '@/components/BrandLockup';
import { BillingGraphic } from '@/components/Graphics';
import { FinalCtaPanel } from '@/components/FinalCtaPanel';

export const metadata: Metadata = {
  title: 'Care Axis Admin Console',
  description:
    'Admin view for client operations, billing visibility, collections status, and onboarding progress across Care Axis accounts.',
};

const clientRows = [
  {
    name: 'Velocity Injury Group',
    package: 'PI360',
    clinics: 7,
    mrr: '$4,980',
    status: 'Active',
    balance: '$0',
  },
  {
    name: 'Northline DPC Collective',
    package: 'DPC360',
    clinics: 3,
    mrr: '$2,490',
    status: 'Active',
    balance: '$320',
  },
  {
    name: 'Summit Ortho Partners',
    package: 'Ortho360',
    clinics: 12,
    mrr: '$9,750',
    status: 'Implementation',
    balance: '$0',
  },
  {
    name: 'Metro Pain + Rehab',
    package: 'Pain360',
    clinics: 5,
    mrr: '$3,600',
    status: 'At Risk',
    balance: '$1,240',
  },
  {
    name: 'CareBridge Multi-Specialty',
    package: 'Practice360',
    clinics: 16,
    mrr: '$12,900',
    status: 'Active',
    balance: '$0',
  },
];

const billingRows = [
  { invoice: 'INV-23011', client: 'Velocity Injury Group', due: '2026-04-05', amount: '$4,980', state: 'Paid' },
  { invoice: 'INV-23012', client: 'Northline DPC Collective', due: '2026-04-06', amount: '$2,490', state: 'Past Due' },
  { invoice: 'INV-23013', client: 'Metro Pain + Rehab', due: '2026-04-08', amount: '$3,600', state: 'Past Due' },
  { invoice: 'INV-23014', client: 'CareBridge Multi-Specialty', due: '2026-04-10', amount: '$12,900', state: 'Pending' },
];

export default function AdminPage() {
  return (
    <main>
      <Navbar />

      <section className="section hero">
        <div className="container two-col">
          <div>
            <BrandLockup product="careaxis" />
            <h1 className="hero-title">Admin Console</h1>
            <p className="hero-subtitle hero-lead">
              Unified admin visibility across client health, onboarding, package mix, revenue, and
              billing status.
            </p>
            <div className="btn-row">
              <a className="btn primary" href="/contact#quickstart-order">Add New Client</a>
              <a className="btn secondary" href="/book-call">Escalate Support Call</a>
            </div>
          </div>
          <div className="card">
            <BillingGraphic />
            <div className="admin-kpi-grid" style={{ marginTop: 14 }}>
              <div className="admin-kpi">
                <span>Active Clients</span>
                <strong>48</strong>
              </div>
              <div className="admin-kpi">
                <span>Monthly MRR</span>
                <strong>$184,200</strong>
              </div>
              <div className="admin-kpi">
                <span>Past Due Total</span>
                <strong>$6,920</strong>
              </div>
              <div className="admin-kpi">
                <span>Implementations</span>
                <strong>9</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-tight-top">
        <div className="container card">
          <h2 style={{ marginTop: 0 }}>Client Overview</h2>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Package</th>
                  <th>Clinics</th>
                  <th>MRR</th>
                  <th>Status</th>
                  <th>Outstanding</th>
                </tr>
              </thead>
              <tbody>
                {clientRows.map((row) => (
                  <tr key={row.name}>
                    <td>{row.name}</td>
                    <td>{row.package}</td>
                    <td>{row.clinics}</td>
                    <td>{row.mrr}</td>
                    <td>
                      <span className={`status-pill ${row.status.toLowerCase().replace(' ', '-')}`}>
                        {row.status}
                      </span>
                    </td>
                    <td>{row.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container two-col">
          <div className="card">
            <h2 style={{ marginTop: 0 }}>Billing Queue</h2>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Invoice</th>
                    <th>Client</th>
                    <th>Due</th>
                    <th>Amount</th>
                    <th>State</th>
                  </tr>
                </thead>
                <tbody>
                  {billingRows.map((row) => (
                    <tr key={row.invoice}>
                      <td>{row.invoice}</td>
                      <td>{row.client}</td>
                      <td>{row.due}</td>
                      <td>{row.amount}</td>
                      <td>{row.state}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h2 style={{ marginTop: 0 }}>Admin Actions</h2>
            <ul className="list">
              <li>Filter by package, status, due date, and account owner</li>
              <li>Export billing summaries per client or by date range</li>
              <li>Track onboarding completion and required migration files</li>
              <li>Flag at-risk accounts for intervention and call scheduling</li>
            </ul>
            <div className="btn-row">
              <a className="btn primary" href="/pricing">Update package pricing</a>
              <a className="btn ghost" href="/verticals">View package details</a>
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

      <Footer />
    </main>
  );
}
