import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { BrandLockup } from '@/components/BrandLockup';
import { FinalCtaPanel } from '@/components/FinalCtaPanel';

export const metadata: Metadata = {
  title: 'About Care Axis',
  description:
    'Learn about Care Axis, the parent healthcare software platform built to support specialized clinic workflows across multiple practice models.',
};

const values = [
  'Operational clarity over software sprawl',
  'Specialized workflows without fragmented architecture',
  'Implementation speed with enterprise-grade stability',
  'Human-centered operations supported by modern AI tools',
];

export default function AboutPage() {
  return (
    <main>
      <Navbar />

      <section className="section hero">
        <div className="container two-col">
          <div>
            <BrandLockup product="careaxis" />
          <h1 className="hero-title">About Care Axis</h1>
          <p className="hero-subtitle hero-lead">
            Care Axis was built to help healthcare organizations run complex operations with less
            friction, stronger accountability, and scalable workflow systems.
          </p>
          <div className="btn-row">
            <a className="btn primary" href="/demo">Book a Demo</a>
            <a className="btn secondary" href="/verticals">Explore Packages</a>
          </div>
        </div>

          <div className="card">
            <h3>Our mission</h3>
            <p className="muted">
              Build the most trusted healthcare operations platform where specialized vertical packages
              can launch fast, scale cleanly, and deliver measurable workflow outcomes.
            </p>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container feature-grid">
          {values.map((value) => (
            <article className="card" key={value}>
              <h3>{value}</h3>
            </article>
          ))}
        </div>
      </section>

      <FinalCtaPanel
        eyebrow="Company Snapshot"
        title="Parent platform with a specialized product family"
        copy="Care Axis is expandable by design: one core engine with vertical packages for PI, DPC, ortho, pain, and broader clinic operations."
        primaryHref="/verticals"
        primaryLabel="Explore Product Family"
        secondaryHref="/demo"
        secondaryLabel="Book a Demo"
      />

      <Footer />
    </main>
  );
}
