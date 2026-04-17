import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { BrandLockup } from '@/components/BrandLockup';
import { FinalCtaPanel } from '@/components/FinalCtaPanel';
import { OnboardingIntakeForm } from '@/components/OnboardingIntakeForm';

export const metadata: Metadata = {
  title: 'Care Axis Onboarding Intake',
  description:
    'Complete the Care Axis multi-step onboarding intake to scope package fit, provisioning, billing, migration, and launch readiness.',
};

const onboardingSignals = [
  {
    title: 'Buyer-friendly intake',
    copy: 'Client-safe wording for a complex onboarding questionnaire without exposing internal pricing logic.',
  },
  {
    title: 'Provisioning-ready outputs',
    copy: 'Captures the signals needed for modules, portals, roles, integrations, migration, and billing workflows.',
  },
  {
    title: 'Launch-focused structure',
    copy: 'Built to move from intake to quote, contract, payment, and implementation with less back-and-forth.',
  },
];

export default function OnboardingPage() {
  return (
    <main>
      <Navbar />

      <section className="section hero hero-premium">
        <div className="container">
          <div className="onboarding-hero">
            <div>
              <BrandLockup product="careaxis" />
              <p className="hero-kicker">trycareaxis.com</p>
              <h1 className="hero-title">A premium onboarding intake built for real implementation work.</h1>
              <p className="hero-subtitle hero-lead">
                This Care Axis onboarding page turns the client intake, provisioning, pricing, and launch
                questionnaire into one guided multi-step experience. It is designed to capture what sales,
                operations, billing, and implementation teams actually need.
              </p>
              <div className="btn-row">
                <a className="btn primary" href="#client-intake-form">Start Intake</a>
                <a className="btn secondary" href="/book-call">Talk Through Setup</a>
              </div>
            </div>

            <div className="card onboarding-hero-card">
              <p className="panel-title">What This Page Supports</p>
              <div className="onboarding-step-grid">
                <article className="onboarding-step done">
                  <strong>Quote generation</strong>
                  <span>Package recommendation, scope assumptions, and recurring billing inputs.</span>
                </article>
                <article className="onboarding-step done">
                  <strong>Provisioning logic</strong>
                  <span>Modules, portals, workflows, integrations, and white-label setup signals.</span>
                </article>
                <article className="onboarding-step done">
                  <strong>Launch planning</strong>
                  <span>Migration, training, billing kickoff, and go-live dependencies.</span>
                </article>
                <article className="onboarding-step done">
                  <strong>Operations handoff</strong>
                  <span>Structured answers ready for downstream onboarding and delivery workflows.</span>
                </article>
              </div>
            </div>
          </div>

          <div className="trust-grid" style={{ marginTop: 28 }}>
            {onboardingSignals.map((item) => (
              <article className="trust-strip" key={item.title}>
                <div className="trust-chip">{item.title}</div>
                <p className="small" style={{ marginBottom: 0 }}>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tight-top" id="client-intake-form">
        <div className="container">
          <div className="eyebrow">Onboarding Intake</div>
          <h2 className="section-title">One intake flow for package fit, provisioning, pricing, and launch readiness</h2>
          <p className="section-copy">
            The original questionnaire covered legal setup, contacts, modules, workflows, migration, white
            label details, billing triggers, and launch tasks. This version keeps that coverage while making
            the experience cleaner and easier to complete with a client live on the call.
          </p>

          <OnboardingIntakeForm />
        </div>
      </section>

      <FinalCtaPanel
        eyebrow="Need A Guided Intake?"
        title="We can complete the onboarding scope with you live"
        copy="If you want Care Axis to recommend the right package, rollout order, and provisioning plan, schedule a working session with our team."
        primaryHref="/book-call"
        primaryLabel="Book Working Session"
        secondaryHref="/pricing"
        secondaryLabel="Review Pricing"
      />

      <Footer />
    </main>
  );
}
