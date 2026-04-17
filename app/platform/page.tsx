import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { BrandLockup } from '@/components/BrandLockup';
import { CORE_MODULES } from '@/components/brand';
import { EngineGraphic } from '@/components/Graphics';
import { MasterBrandGraphic } from '@/components/MasterBrandGraphic';
import { FinalCtaPanel } from '@/components/FinalCtaPanel';

export const metadata: Metadata = {
  title: 'Care Axis Platform | Why Care Axis',
  description:
    'Care Axis is the parent healthcare platform for EMR, CRM, case management, automation, communication, and analytics across multiple practice models.',
};

const pillars = [
  {
    title: 'Operational Core',
    copy: 'Run clinical, administrative, and communication workflows on one shared engine instead of disconnected tools.',
  },
  {
    title: 'Vertical Specialization',
    copy: 'Deploy PI360, DPC360, Practice360, Ortho360, and Pain360 as focused packages with shared architecture.',
  },
  {
    title: 'Enterprise Scalability',
    copy: 'Scale from one clinic to multi-location groups with governance controls, templates, and reporting hierarchy.',
  },
  {
    title: 'AI + Automation',
    copy: 'Let automation and AI agents handle repetitive workflow coordination while teams stay in control.',
  },
];

export default function PlatformPage() {
  return (
    <main>
      <Navbar />

      <section className="section hero">
        <div className="container hero-grid">
          <div>
            <BrandLockup product="careaxis" />
            <h1 className="hero-title">Why Care Axis</h1>
            <p className="hero-subtitle hero-lead">
              Care Axis is the master platform brand. Every vertical package inherits one powerful core
              architecture for data, automation, integrations, and performance.
            </p>
            <div className="btn-row">
              <a className="btn primary" href="/verticals">Explore Vertical Packages</a>
              <a className="btn secondary" href="/book-call">Schedule a Call</a>
            </div>
          </div>

          <div className="card">
            <MasterBrandGraphic caption="Advanced data modeling, secure API access, and shared operations infrastructure." />
            <h3>What buyers get with Care Axis</h3>
            <ul className="list">
              <li>One platform contract and implementation strategy</li>
              <li>Role-based experiences for clinicians, admins, and partners</li>
              <li>Flexible support for PI, DPC, insurance, cash, and specialty workflows</li>
              <li>Future-ready architecture for new vertical package expansion</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section section-tight-top">
        <div className="container feature-grid">
          {pillars.map((pillar) => (
            <article className="card" key={pillar.title}>
              <h3>{pillar.title}</h3>
              <p className="muted">{pillar.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container two-col">
          <div>
            <div className="eyebrow">Core Modules</div>
            <h2 className="section-title">The platform capabilities every package inherits</h2>
            <p className="section-copy">
              Specialized verticals are built on one system so implementation, reporting, and operations
              stay coherent as your organization grows.
            </p>
          </div>
          <div className="card">
            <EngineGraphic />
            <ul className="list">
              {CORE_MODULES.map((module) => (
                <li key={module}>{module}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <FinalCtaPanel
        eyebrow="Platform Decision"
        title="Need to map your package architecture?"
        copy="We can help you choose the right package, integrations, and migration plan based on your clinic model and expansion goals."
        primaryHref="/demo"
        primaryLabel="Book a Platform Demo"
        secondaryHref="/pricing"
        secondaryLabel="Request Pricing"
      />

      <Footer />
    </main>
  );
}
