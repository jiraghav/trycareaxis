import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { BrandLockup } from '@/components/BrandLockup';
import { FinalCtaPanel } from '@/components/FinalCtaPanel';

export const metadata: Metadata = {
  title: 'Care Axis Pricing',
  description:
    'Care Axis pricing for platform and vertical packages, including starter plans, growth options, enterprise pathways, and migration support.',
};

const plans = [
  {
    name: 'Launch',
    fit: 'Single site and lean teams',
    price: 'Starting at $199/mo',
    bullets: [
      'Core EMR + practice operations setup',
      'Guided QuickStart implementation',
      'Standard templates and onboarding',
    ],
  },
  {
    name: 'Growth',
    fit: 'Multi-site and specialized workflows',
    price: 'Contact for pricing',
    bullets: [
      'Vertical package customization',
      'Automations, integrations, and AI agent setup',
      'Expanded analytics and role controls',
    ],
    featured: true,
  },
  {
    name: 'Enterprise',
    fit: 'Hospitals and large groups',
    price: 'Custom enterprise pricing',
    bullets: [
      'Governance, security, and regional scaling',
      'Enterprise implementation and migration planning',
      'Dedicated enablement and support structure',
    ],
  },
];

export default function PricingPage() {
  const pricingSchema = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'Care Axis Pricing',
    itemListElement: plans.map((plan) => {
      const offer: Record<string, unknown> = {
        '@type': 'Offer',
        name: plan.name,
        description: `${plan.fit}. ${plan.bullets.join(' ')}`,
      };

      if (plan.name === 'Launch') {
        offer.priceSpecification = {
          '@type': 'PriceSpecification',
          price: '199',
          priceCurrency: 'USD',
        };
      }

      return offer;
    }),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
      />
      <Navbar />

      <section className="section hero">
        <div className="container two-col">
          <div>
            <BrandLockup product="careaxis" />
            <h1 className="hero-title">Pricing built for launch speed and enterprise scale</h1>
            <p className="hero-subtitle hero-lead">
              Care Axis pricing is aligned to your package, clinic count, and workflow depth. Standard
              setups can go live in as little as 5 days.
            </p>
            <p className="small">
              Migration offer: guaranteed 50% lower migration cost versus comparable competitor quotes.
            </p>
            <ul className="hero-list">
              <li>Transparent entry path for standard setups</li>
              <li>Vertical package pricing for specialized workflows</li>
              <li>Enterprise options for hospitals and large groups</li>
            </ul>
          </div>

          <div className="card">
            <h3>Best next step</h3>
            <p className="muted" style={{ marginTop: 0 }}>
              Get a scoped package recommendation before committing to a plan.
            </p>
            <div className="btn-row" style={{ marginTop: 8 }}>
              <a className="btn primary" href="/contact#quickstart-order">Get My Quote</a>
              <a className="btn secondary" href="/demo">Book Demo</a>
              <a className="btn ghost" href="/book-call">Talk to Sales</a>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container pricing-grid">
          {plans.map((plan) => (
            <article
              className="pricing-card"
              key={plan.name}
              style={plan.featured ? { borderColor: 'rgba(97, 184, 255, 0.5)', background: 'var(--panel-strong)' } : undefined}
            >
              <p className="eyebrow" style={{ margin: 0 }}>{plan.fit}</p>
              <h3 style={{ marginTop: 10 }}>{plan.name}</h3>
              <div className="pricing-price">{plan.price}</div>
              <ul className="list">
                {plan.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <div style={{ marginTop: 16 }}>
                <a className="btn primary" href="/contact#quickstart-order">Get My Quote</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <FinalCtaPanel
        eyebrow="Procurement Friendly"
        title="Need a tailored quote with rollout plan?"
        copy="We can prepare a package recommendation with migration scope, timeline, and implementation milestones for stakeholders."
        primaryHref="/book-call"
        primaryLabel="Schedule a Pricing Call"
        secondaryHref="/contact#quickstart-order"
        secondaryLabel="Start QuickStart Intake"
      />

      <Footer />
    </main>
  );
}
