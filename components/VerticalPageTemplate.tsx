import Image from 'next/image';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { BrandLockup } from '@/components/BrandLockup';
import type { VerticalKey } from '@/components/brand';
import { VerticalPreview } from '@/components/VerticalPreview';
import { MasterBrandGraphic } from '@/components/MasterBrandGraphic';
import { FinalCtaPanel } from '@/components/FinalCtaPanel';

type VerticalPageTemplateProps = {
  product: VerticalKey;
  title: string;
  subtitle: string;
  pains: string[];
  outcomes: string[];
  workflow: string[];
};

type ProductShot = {
  src: string;
  title: string;
  caption: string;
};

const SHOTS_BY_PRODUCT: Record<VerticalKey, ProductShot[]> = {
  pi360: [
    {
      src: '/product-shots/clean/pi-dashboard-clean.png',
      title: 'Command Center Dashboard',
      caption: 'Live referral, cases, task queues, and daily activity in one PI-specific operating view.',
    },
    {
      src: '/product-shots/clean/pi-cases-clean.png',
      title: 'Case Management Grid',
      caption: 'Fast triage for high-volume personal injury workflows with role-ready actions.',
    },
    {
      src: '/product-shots/clean/pi-case-details-clean.png',
      title: 'Case Intelligence Panel',
      caption: 'Case summary, treatment tracks, and legal update readiness side-by-side.',
    },
    {
      src: '/product-shots/clean/pi-tasks-clean.png',
      title: 'Two-Way Task Ops',
      caption: 'Structured handoffs between legal and clinical teams with ownership and status.',
    },
    {
      src: '/product-shots/clean/pi-maps-clean.png',
      title: 'Referral Network Map',
      caption: 'Location-aware provider routing and referral dispatch from one interface.',
    },
  ],
  dpc360: [
    {
      src: '/product-shots/clean/pi-dashboard-clean.png',
      title: 'Membership Ops Hub',
      caption: 'Use the same premium dashboard model for memberships, outreach, and continuity.',
    },
    {
      src: '/product-shots/clean/pi-tasks-clean.png',
      title: 'Care Team Work Queues',
      caption: 'Track outreach, follow-ups, and renewals with clean operational accountability.',
    },
    {
      src: '/product-shots/clean/pi-case-details-clean.png',
      title: 'Patient Progression Workspace',
      caption: 'Centralized member context, notes, and workflow control for relationship-first care.',
    },
  ],
  practice360: [
    {
      src: '/product-shots/clean/pi-dashboard-clean.png',
      title: 'Multi-Specialty Command View',
      caption: 'One central surface for insurance, cash-pay, and hybrid practice operations.',
    },
    {
      src: '/product-shots/clean/pi-cases-clean.png',
      title: 'Cross-Team Worklist',
      caption: 'Unified filtering and action routing across specialties and staff roles.',
    },
    {
      src: '/product-shots/clean/pi-maps-clean.png',
      title: 'Location + Referral Coordination',
      caption: 'Coordinate service locations, referrals, and patient routing from one screen.',
    },
  ],
  ortho360: [
    {
      src: '/product-shots/clean/pi-case-details-clean.png',
      title: 'Procedure Pathway Control',
      caption: 'Track care-path milestones, documentation readiness, and team actions per case.',
    },
    {
      src: '/product-shots/clean/pi-dashboard-clean.png',
      title: 'Ortho Ops Dashboard',
      caption: 'Clinical throughput and task readiness in a high-clarity command layout.',
    },
    {
      src: '/product-shots/clean/pi-tasks-clean.png',
      title: 'Pre-Op / Post-Op Tasking',
      caption: 'Reliable task orchestration across clinical and administrative teams.',
    },
  ],
  pain360: [
    {
      src: '/product-shots/clean/pi-case-details-clean.png',
      title: 'Longitudinal Care Workspace',
      caption: 'Monitor progression, interventions, and documentation with one persistent view.',
    },
    {
      src: '/product-shots/clean/pi-tasks-clean.png',
      title: 'Pain Program Task Flow',
      caption: 'Coordinate follow-ups, reminders, and status updates without operational drift.',
    },
    {
      src: '/product-shots/clean/pi-dashboard-clean.png',
      title: 'Program-Level Visibility',
      caption: 'Leadership dashboard for active volume, pending tasks, and team responsiveness.',
    },
  ],
};

export function VerticalPageTemplate({
  product,
  title,
  subtitle,
  pains,
  outcomes,
  workflow,
}: VerticalPageTemplateProps) {
  const shots = SHOTS_BY_PRODUCT[product];
  const featured = shots[0];
  const secondary = shots.slice(1);
  const topWorkflowPoints = workflow.slice(0, 3);
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `Care Axis ${product.toUpperCase()}`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: `https://trycareaxis.com/${product}`,
    description: subtitle,
  };

  return (
    <main className={`vertical-page ${product}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <Navbar />

      <section className="section hero hero-premium">
        <div className="container hero-grid">
          <div>
            <BrandLockup product={product} />
            <h1 className="hero-title">{title}</h1>
            <p className="hero-subtitle hero-lead">{subtitle}</p>
            <ul className="hero-list">
              {topWorkflowPoints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="btn-row cta-primary-row">
              <a className="btn primary" href="/demo">Book a Demo</a>
              <a className="btn secondary" href="/pricing">Request Pricing</a>
            </div>
          </div>

          <div className="card vertical-identity-card">
            <VerticalPreview product={product} />
            <h3>Specialized package. Shared Care Axis core.</h3>
            <p className="muted">
              {product.toUpperCase()} is purpose-built for this clinical model while using the same core
              architecture for security, automation, integrations, communication, and analytics.
            </p>
            <div className="vertical-meta-row">
              <span className="status-pill active">Fast rollout</span>
              <span className="status-pill implementation">Role-based ops</span>
              <span className="status-pill active">Enterprise-ready</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="eyebrow">Product Experience</div>
          <h2 className="section-title">What teams actually use every day</h2>
          <p className="section-copy">
            The interface is designed for high-volume execution: clear context, rapid actions, and
            role-based visibility across operations.
          </p>
          <div className={`card vertical-showcase-shell ${product}`}>
            <MasterBrandGraphic caption={`${product.toUpperCase()} delivered on the Care Axis core architecture with production-grade workflows.`} />

            <div className="showcase-grid">
              <article className="showcase-main">
                <div className="showcase-shot">
                  <Image
                    src={featured.src}
                    alt={`${featured.title} inside Care Axis ${product.toUpperCase()}`}
                    width={1512}
                    height={982}
                    className="showcase-image"
                  />
                </div>
                <div className="showcase-copy">
                  <h3>{featured.title}</h3>
                  <p className="muted" style={{ marginBottom: 0 }}>{featured.caption}</p>
                </div>
              </article>

              <div className="showcase-secondary-grid">
                {secondary.map((shot) => (
                  <article className="showcase-secondary" key={shot.title}>
                    <div className="showcase-shot">
                      <Image
                        src={shot.src}
                        alt={`${shot.title} product view`}
                        width={1512}
                        height={982}
                        className="showcase-image"
                      />
                    </div>
                    <div className="showcase-copy">
                      <h4>{shot.title}</h4>
                      <p className="muted" style={{ marginBottom: 0 }}>{shot.caption}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container two-col">
          <div className="card">
            <h2 style={{ marginTop: 0 }}>Pain points we solve</h2>
            <ul className="list">
              {pains.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h2 style={{ marginTop: 0 }}>Operational outcomes</h2>
            <ul className="list">
              {outcomes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="eyebrow">Implementation Flow</div>
          <h2 className="section-title">Specialized workflows, premium rollout experience</h2>
          <div className="timeline workflow-grid">
            {workflow.map((item, index) => (
              <div className="timeline-step" key={item}>
                <strong>{index + 1}. {item}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FinalCtaPanel
        eyebrow="Next Step"
        title={`See ${product.toUpperCase()} in your live workflow`}
        copy="Share your clinic model, timeline, and migration requirements. We will map your package, implementation scope, and launch sequence."
        primaryHref="/contact#quickstart-order"
        primaryLabel="Start Now"
        secondaryHref="/book-call"
        secondaryLabel="Schedule a Call"
      />

      <Footer />
    </main>
  );
}
