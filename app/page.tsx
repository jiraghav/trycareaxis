import Image from 'next/image';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { BrandLockup } from '@/components/BrandLockup';
import { CORE_MODULES, VERTICAL_PRODUCTS } from '@/components/brand';
import { VerticalPreview } from '@/components/VerticalPreview';
import { FinalCtaPanel } from '@/components/FinalCtaPanel';

const trustPoints = [
  {
    title: 'Built for complexity',
    copy: 'Supports PI, insurance, cash-pay, DPC, and specialty models without fragmented systems.',
  },
  {
    title: 'Made for operators',
    copy: 'Role-ready experiences for lawyers, clinic owners, case managers, and admin teams.',
  },
  {
    title: 'Fast implementation',
    copy: '5-day QuickStart target for standard deployments with clear onboarding milestones.',
  },
  {
    title: 'Migration guarantee',
    copy: '50% lower migration pricing compared to comparable competitor migration quotes.',
  },
];

const faqs = [
  {
    q: 'Is Care Axis only for personal injury clinics?',
    a: 'No. PI360 is one package in the Care Axis family. Care Axis also supports DPC, ortho, pain, and multi-specialty clinic models.',
  },
  {
    q: 'Can we run insurance and cash-pay workflows together?',
    a: 'Yes. Practice360 supports hybrid billing and operational workflows so teams can run mixed models in one system.',
  },
  {
    q: 'How quickly can we launch?',
    a: 'Standard EMR and operations setups can be configured in as little as 5 days, with guided onboarding and migration support.',
  },
  {
    q: 'Do you support multi-location groups?',
    a: 'Yes. Care Axis was designed for scale with enterprise controls, shared templates, and location-level analytics.',
  },
];

export default function HomePage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Care Axis',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: 'https://trycareaxis.com',
    offers: {
      '@type': 'Offer',
      price: '199',
      priceCurrency: 'USD',
      description: 'Starting monthly price for standard launch plan.',
    },
  };

  return (
    <main id="top">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <Navbar />

      <section className="section hero hero-premium">
        <div className="container hero-grid">
          <div>
            <BrandLockup product="careaxis" />
            <p className="hero-kicker">trycareaxis.com</p>
            <h1 className="hero-title">One platform. Specialized packages for every practice model.</h1>
            <p className="hero-subtitle hero-lead">
              Care Axis is the premium healthcare operations platform for EMR, CRM, workflow automation,
              referrals, communication, analytics, and case coordination across PI, DPC, specialty,
              insurance, and cash-pay models.
            </p>

            <ul className="hero-list">
              <li>From 1 clinic to 100+ clinics on a shared enterprise core</li>
              <li>Built by operators and doctors for real-world clinical complexity</li>
              <li>Designed for fast launch without sacrificing long-term scalability</li>
            </ul>

            <div className="btn-row cta-primary-row">
              <a className="btn primary cta-large" href="/demo">Book a Demo</a>
              <a className="btn secondary cta-large" href="/pricing">Request Pricing</a>
              <a className="btn ghost" href="/contact#quickstart-order">Start Free Trial</a>
            </div>

            <div className="hero-proof-row">
              <div className="hero-proof-pill"><strong>Starting at $199/mo</strong><span>for standard launch plans</span></div>
              <div className="hero-proof-pill"><strong>5-day QuickStart</strong><span>for standard EMR configurations</span></div>
              <div className="hero-proof-pill"><strong>Migration Guarantee</strong><span>50% lower vs comparable competitor quotes</span></div>
            </div>
          </div>

          <div className="visual-card hero-visual-stack">
            <div className="showcase-shot">
              <Image
                src="/product-shots/clean/pi-dashboard-clean.png"
                alt="Care Axis platform dashboard preview"
                width={1512}
                height={982}
                className="showcase-image"
                priority
              />
            </div>
            <div className="card hero-side-note">
              <h3 style={{ marginBottom: 8 }}>Made by doctors for doctors</h3>
              <p className="muted" style={{ margin: 0 }}>
                Teams stop reinventing workflows. Care Axis gives clinics a proven operating system so
                staff can focus on care while automations and AI agents handle repetitive tasks.
              </p>
            </div>
            <div className="stat-grid">
              <div className="metric">
                <strong>5</strong>
                <span>Live vertical packages</span>
              </div>
              <div className="metric">
                <strong>1-100+</strong>
                <span>Clinic scaling architecture</span>
              </div>
              <div className="metric">
                <strong>Enterprise</strong>
                <span>Controls and reporting by design</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-tight-top">
        <div className="container trust-grid">
          {trustPoints.map((item) => (
            <div className="trust-strip" key={item.title}>
              <div className="trust-chip">{item.title}</div>
              <p className="small" style={{ marginBottom: 0 }}>{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="verticals-home">
        <div className="container">
          <div className="eyebrow">Product Family</div>
          <h2 className="section-title">A premium package family, all on one Care Axis core</h2>
          <p className="section-copy">
            PI360, DPC360, Practice360, Ortho360, and Pain360 are specialized packages with shared
            architecture, shared data standards, and package-specific workflows. New verticals can be added
            without replacing your platform.
          </p>

          <div className="vertical-grid" style={{ marginTop: 24 }}>
            {VERTICAL_PRODUCTS.map((product) => (
              <article
                className="vertical-card"
                key={product.key}
                style={{ '--card-accent': product.accent } as { [key: string]: string }}
              >
                <BrandLockup product={product.key} compact />
                <h3 style={{ marginTop: 14 }}>{product.fullName}</h3>
                <p className="muted">{product.summary}</p>
                <p className="vertical-meta">Best for: {product.audience}</p>
                <VerticalPreview product={product.key} compact />
                <div style={{ marginTop: 14 }}>
                  <a className="btn ghost" href={product.href}>{product.cta}</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="platform-engine">
        <div className="container two-col">
          <div>
            <div className="eyebrow">Core Engine</div>
            <h2 className="section-title">Shared enterprise engine + specialized clinical workflows</h2>
            <p className="section-copy">
              Care Axis gives each vertical package dedicated workflows while sharing one enterprise-grade
              architecture for automation, user permissions, reporting, communication, and integrations.
            </p>
            <div className="btn-row">
              <a className="btn primary" href="/platform">Why Care Axis</a>
              <a className="btn secondary" href="/verticals">Explore Vertical Packages</a>
            </div>
          </div>

          <div className="card">
            <h3>Core modules</h3>
            <ul className="list">
              {CORE_MODULES.map((module) => (
                <li key={module}>{module}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section" id="workflow">
        <div className="container">
          <div className="eyebrow">How It Works</div>
          <h2 className="section-title">Fast rollout, low friction onboarding, enterprise-ready controls</h2>
          <div className="workflow-preview-grid" style={{ marginTop: 20, marginBottom: 20 }}>
            <article className="product-shot-card">
              <div className="showcase-shot">
                <Image
                  src="/product-shots/clean/pi-cases-clean.png"
                  alt="Case management workflow preview"
                  width={1512}
                  height={982}
                  className="showcase-image"
                />
              </div>
              <div className="showcase-copy">
                <h3>Case and referral flow</h3>
                <p className="muted" style={{ marginBottom: 0 }}>
                  Teams move from intake to action with clear status, ownership, and response speed.
                </p>
              </div>
            </article>

            <article className="product-shot-card">
              <div className="showcase-shot">
                <Image
                  src="/product-shots/clean/pi-maps-clean.png"
                  alt="Referral map and network preview"
                  width={1512}
                  height={982}
                  className="showcase-image"
                />
              </div>
              <div className="showcase-copy">
                <h3>Network and dispatch visibility</h3>
                <p className="muted" style={{ marginBottom: 0 }}>
                  Locate providers, dispatch referrals, and monitor progress from one unified interface.
                </p>
              </div>
            </article>
          </div>
          <div className="timeline">
            <div className="timeline-step">
              <strong>1. Choose your package and complete QuickStart intake</strong>
              <span className="muted">We map your workflows, user roles, integrations, and launch timeline in one guided process.</span>
            </div>
            <div className="timeline-step">
              <strong>2. Configure workflows, migration, and communications</strong>
              <span className="muted">Care Axis aligns templates, data migration, and communication channels to your exact practice model.</span>
            </div>
            <div className="timeline-step">
              <strong>3. Launch with training and operational checkpoints</strong>
              <span className="muted">Go-live support ensures teams adopt quickly with measurable workflow outcomes and clear ownership.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="eyebrow">FAQs</div>
          <h2 className="section-title">Answers for buyers and operators</h2>
          <div className="faq-grid" style={{ marginTop: 22 }}>
            {faqs.map((faq) => (
              <article className="faq-item" key={faq.q}>
                <h3>{faq.q}</h3>
                <p className="muted" style={{ marginBottom: 0 }}>{faq.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <FinalCtaPanel
        eyebrow="Start Now"
        title="Launch Care Axis with a clear rollout plan"
        copy="Tell us your specialty mix, clinic count, and timeline. We will recommend the right package, implementation scope, and launch sequence."
        primaryHref="/book-call"
        primaryLabel="Schedule a Call"
        secondaryHref="/contact#quickstart-order"
        secondaryLabel="Start Now"
        tertiaryHref="/pricing"
        tertiaryLabel="Request Pricing"
      />

      <Footer />
    </main>
  );
}
