import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { BrandLockup } from '@/components/BrandLockup';
import { FinalCtaPanel } from '@/components/FinalCtaPanel';

export const metadata: Metadata = {
  title: 'Care Axis PI360 Affiliate Portal Demo',
  description:
    'Explore the Care Axis PI360 Affiliate Portal workflow for weekly updates, records, billing coordination, and partner collaboration.',
};

export default function AffiliatePortalPage() {
  return (
    <main>
      <Navbar />

      <section className="section hero">
        <div className="container two-col">
          <div>
            <BrandLockup product="pi360" />
            <h1 className="section-title">Affiliate Portal inside Care Axis PI360</h1>
            <p className="section-copy">
              PI360 gives affiliate providers a structured portal for updates, records handling, and
              billing coordination while keeping operations teams aligned.
            </p>
            <div className="btn-row">
              <a className="btn primary" href="/demo">Book PI360 Demo</a>
              <a className="btn secondary" href="/book-call">Schedule Affiliate Demo</a>
            </div>
          </div>

          <div className="card">
            <h3>Portal highlights</h3>
            <ul className="list" style={{ marginTop: 12 }}>
              <li>Structured weekly update submissions</li>
              <li>Document and billing workflow checkpoints</li>
              <li>Visibility for outstanding requests and tasks</li>
              <li>Cleaner communication with case operations teams</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section section-tight-top">
        <div className="container">
          <div id="affiliate-demo" className="card">
            <h3>Affiliate Demo Walkthrough</h3>
            <p className="muted">Request the affiliate workflow walkthrough in your live PI360 demo session.</p>
            <div style={{ marginTop: 14 }}>
              <a className="btn primary" href="/book-call">Schedule affiliate demo</a>
            </div>
          </div>
        </div>
      </section>

      <FinalCtaPanel
        eyebrow="Partner Collaboration"
        title="Give affiliates a cleaner operational workflow"
        copy="We can map weekly updates, records processing, and billing checkpoints to your exact partner process."
        primaryHref="/book-call"
        primaryLabel="Schedule Affiliate Demo"
        secondaryHref="/pi360"
        secondaryLabel="Back to PI360"
      />

      <Footer />
    </main>
  );
}
