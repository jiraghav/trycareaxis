import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { BrandLockup } from '@/components/BrandLockup';
import { QuoteSignupForm } from '@/components/QuoteSignupForm';
import { FinalCtaPanel } from '@/components/FinalCtaPanel';

export const metadata: Metadata = {
  title: 'Contact Care Axis | Start Now',
  description:
    'Start your Care Axis QuickStart intake, get a quote, accept your setup, submit payment, and schedule launch fast.',
};

const flowSteps = [
  {
    title: '1. Get a quote',
    copy: 'Complete the short signup form and choose your package. We send a scoped quote quickly.',
  },
  {
    title: '2. Accept and activate',
    copy: 'Approve your quote, receive your secure payment link, and activate your implementation.',
  },
  {
    title: '3. Schedule launch call',
    copy: 'Book your launch call and we begin configuration, migration planning, and onboarding.',
  },
];

export default function ContactPage() {
  return (
    <main>
      <Navbar />

      <section className="section hero">
        <div className="container">
          <BrandLockup product="careaxis" />
          <h1 className="hero-title">Sign up fast. Get a quote. Launch quickly.</h1>
          <p className="section-copy">
            Care Axis is built for immediate onboarding with minimal friction. Pick your package,
            approve your quote, submit payment, and schedule your launch call.
          </p>
          <p className="small" style={{ marginTop: 0 }}>
            Official launch domain: <strong>trycareaxis.com</strong>
          </p>
          <div className="btn-row">
            <a className="btn primary" href="/live-demo">Try Live Demo</a>
            <a className="btn secondary" href="/book-call">Schedule a Call</a>
          </div>

          <div className="quote-flow-grid" style={{ marginTop: 28 }}>
            {flowSteps.map((step) => (
              <article className="flow-step" key={step.title}>
                <h3>{step.title}</h3>
                <p className="muted" style={{ marginBottom: 0 }}>{step.copy}</p>
              </article>
            ))}
          </div>

          <div id="quickstart-order" style={{ marginTop: 28 }} className="card quick-quote-card">
            <h3>QuickStart signup + quote request</h3>
            <p className="small">Email: <a href="mailto:hello@trycareaxis.com">hello@trycareaxis.com</a></p>
            <p className="small">Phone: <a href="tel:+18000000360">(800) 000-0360</a></p>

            <QuoteSignupForm />

            <div className="quote-next-steps">
              <h4 style={{ marginTop: 0 }}>What happens after you submit</h4>
              <ul className="list" style={{ marginBottom: 0 }}>
                <li>We send your package quote and setup scope</li>
                <li>You approve and receive secure payment activation</li>
                <li>You pick your launch call time in Google Calendar and onboarding begins</li>
              </ul>
            </div>

            <p className="small" style={{ marginTop: 12 }}>
              Migration guarantee applies to comparable scope and verified competitor migration quotes.
            </p>
          </div>
        </div>
      </section>

      <FinalCtaPanel
        eyebrow="Need Help Choosing?"
        title="We can recommend the right package in one call"
        copy="If you are deciding between PI360, DPC360, Practice360, Ortho360, or Pain360, we will map the best fit and rollout path."
        primaryHref="/book-call"
        primaryLabel="Schedule a Call"
        secondaryHref="/verticals"
        secondaryLabel="Compare Packages"
      />

      <Footer />
    </main>
  );
}
