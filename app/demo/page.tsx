import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { BrandLockup } from '@/components/BrandLockup';
import { DemoScheduleForm } from '@/components/DemoScheduleForm';
import { FinalCtaPanel } from '@/components/FinalCtaPanel';

export const metadata: Metadata = {
  title: 'Book a Demo | Care Axis',
  description:
    'Book a Care Axis demo, start a free trial, or use the interactive live sandbox before scheduling a call.',
};

export default function DemoPage() {
  return (
    <main>
      <Navbar />

      <section className="section hero">
        <div className="container two-col">
          <div>
            <BrandLockup product="careaxis" />
            <h1 className="hero-title">Book a demo or use the live sandbox now</h1>
            <p className="hero-subtitle hero-lead">
              Try a live interactive environment first, then schedule your package walkthrough.
              Your team can feel the system before committing.
            </p>
            <p className="small" style={{ marginTop: 0 }}>
              Book directly at <strong>trycareaxis.com</strong> and we route your request to the right package team.
            </p>
            <div className="btn-row">
              <a className="btn primary" href="/live-demo">Launch Live Demo</a>
              <a className="btn secondary" href="/contact#quickstart-order">Get My Quote</a>
            </div>
          </div>

          <div className="card">
            <h3>Demo tracks</h3>
            <ul className="list">
              <li>Interactive sandbox experience for product feel and workflow speed</li>
              <li>Vertical-specific walkthroughs: PI360, DPC360, Practice360, Ortho360, Pain360</li>
              <li>Implementation and migration planning with your real onboarding path</li>
              <li>Quote, acceptance, payment kickoff, and Google Calendar launch-call booking</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container live-demo-grid">
          <article className="card">
            <h3 style={{ marginTop: 0 }}>Interactive live demo options</h3>
            <p className="muted">
              Choose a role and explore a live workflow experience.
            </p>
            <div className="btn-row" style={{ marginTop: 10 }}>
              <a className="btn primary" href="/live-demo">Open Core Live Sandbox</a>
              <a className="btn ghost" href="/lawyer-portal">Open Updated Lawyer Demo</a>
              <a className="btn ghost" href="/affiliate-portal">Open Affiliate Demo</a>
              <a className="btn ghost" href="/admin">Open Admin Demo</a>
            </div>
          </article>

          <article className="card">
            <h3 style={{ marginTop: 0 }}>Fast path to go-live</h3>
            <ol className="list" style={{ marginBottom: 0 }}>
              <li>Use the live demo and choose your package</li>
              <li>Submit QuickStart intake and receive your quote</li>
              <li>Accept quote, complete payment, schedule launch call</li>
            </ol>
          </article>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container card" style={{ padding: 32 }}>
          <h2 style={{ marginTop: 0 }}>Quick scheduling form</h2>
          <DemoScheduleForm />
        </div>
      </section>

      <FinalCtaPanel
        eyebrow="Ready to Start?"
        title="Move from demo to implementation with no friction"
        copy="Once your team confirms fit, we map the onboarding scope, migration needs, and launch timeline right away."
        primaryHref="/contact#quickstart-order"
        primaryLabel="Start QuickStart Intake"
        secondaryHref="/book-call"
        secondaryLabel="Schedule a Call"
      />

      <Footer />
    </main>
  );
}
