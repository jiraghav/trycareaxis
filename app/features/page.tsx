import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { BrandLockup } from '@/components/BrandLockup';
import { MasterBrandGraphic } from '@/components/MasterBrandGraphic';
import { FinalCtaPanel } from '@/components/FinalCtaPanel';

export const metadata: Metadata = {
  title: 'Care Axis Features',
  description:
    'Explore Care Axis core platform features for EMR, practice management, automation, communication, and enterprise operations.',
};

const features = [
  {
    title: 'Clinical + operations core',
    copy: 'Unified EMR, CRM, documentation, and operational controls in one execution system.',
  },
  {
    title: 'Communication infrastructure',
    copy: 'Calendar, calling, texting, reminders, and outreach workflows connected to case context.',
  },
  {
    title: 'Referral coordination',
    copy: 'Track referral movement, ownership, and response timelines without manual status chasing.',
  },
  {
    title: 'Automation and AI agents',
    copy: 'Reduce repetitive admin load with rules-based workflows and AI-assisted task routing.',
  },
  {
    title: 'Enterprise controls',
    copy: 'Role permissions, auditability, and governance for single-site teams to large groups.',
  },
  {
    title: 'Partner-facing portals',
    copy: 'Lawyer and affiliate workflows with clear accountability and operational visibility.',
  },
];

export default function FeaturesPage() {
  return (
    <main>
      <Navbar />

      <section className="section hero">
        <div className="container two-col">
          <div>
            <BrandLockup product="careaxis" />
            <div className="eyebrow">Features</div>
            <h1 className="section-title">Platform capabilities built for real-world healthcare operations</h1>
            <p className="section-copy">
              Care Axis features are engineered for operational complexity and packaged by vertical so teams
              can launch quickly without sacrificing depth, control, or scalability.
            </p>
            <div className="btn-row">
              <a className="btn primary" href="/verticals">Explore Packages</a>
              <a className="btn secondary" href="/demo">Book a Demo</a>
            </div>
          </div>

          <div className="card">
            <MasterBrandGraphic caption="One architecture across automation, documentation, communication, and analytics." />
          </div>
        </div>
      </section>

      <section className="section section-tight-top">
        <div className="container">
          <div className="eyebrow">Features</div>
          <h2 className="section-title">Core capabilities every package inherits</h2>

          <div className="feature-grid" style={{ marginTop: 24 }}>
            {features.map((feature) => (
              <article className="card" key={feature.title}>
                <h3>{feature.title}</h3>
                <p className="muted" style={{ marginBottom: 0 }}>{feature.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <FinalCtaPanel
        eyebrow="Next Step"
        title="See these capabilities in your package workflow"
        copy="We can walk your team through the exact feature set for PI360, DPC360, Practice360, Ortho360, or Pain360 and map your launch path."
        primaryHref="/demo"
        primaryLabel="Book a Demo"
        secondaryHref="/pricing"
        secondaryLabel="Request Pricing"
      />

      <Footer />
    </main>
  );
}
