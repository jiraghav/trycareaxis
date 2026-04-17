import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { BrandLockup } from '@/components/BrandLockup';
import { VERTICAL_PRODUCTS } from '@/components/brand';
import { VerticalPreview } from '@/components/VerticalPreview';
import { FinalCtaPanel } from '@/components/FinalCtaPanel';

export const metadata: Metadata = {
  title: 'Care Axis Vertical Packages',
  description:
    'Explore Care Axis PI360, DPC360, Practice360, Ortho360, and Pain360 packages built on one enterprise healthcare platform.',
};

export default function VerticalsPage() {
  return (
    <main>
      <Navbar />

      <section className="section hero">
        <div className="container">
          <BrandLockup product="careaxis" />
          <h1 className="hero-title">Specialized packages. Shared platform power.</h1>
          <p className="section-copy">
            Every Care Axis package is purpose-built for a specific practice model and delivered on one
            scalable core engine. This keeps implementation clean while preserving specialization.
          </p>
          <ul className="hero-list">
            <li>PI360 for personal injury case operations and legal collaboration</li>
            <li>DPC360 for membership-first practice workflows</li>
            <li>Practice360, Ortho360, and Pain360 for specialty and multi-site teams</li>
          </ul>
          <div className="btn-row">
            <a className="btn primary" href="/demo">Book a Demo</a>
            <a className="btn secondary" href="/pricing">Request Pricing</a>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container vertical-grid">
          {VERTICAL_PRODUCTS.map((product) => (
            <article
              className="vertical-card"
              key={product.key}
              style={{ '--card-accent': product.accent } as { [key: string]: string }}
            >
              <BrandLockup product={product.key} compact />
              <h3 style={{ marginTop: 14 }}>{product.fullName}</h3>
              <p className="muted">{product.summary}</p>
              <p className="vertical-meta">Designed for: {product.audience}</p>
              <VerticalPreview product={product.key} compact />
              <div className="btn-row" style={{ marginTop: 12 }}>
                <a className="btn ghost" href={product.href}>{product.cta}</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <FinalCtaPanel
        eyebrow="Future Verticals"
        title="Need a package we have not launched yet?"
        copy="Care Axis architecture is built for expansion. We can introduce new vertical packages while keeping your data model, training approach, and governance consistent."
        primaryHref="/contact#quickstart-order"
        primaryLabel="Talk to Product Team"
        secondaryHref="/platform"
        secondaryLabel="See Platform"
      />

      <Footer />
    </main>
  );
}
