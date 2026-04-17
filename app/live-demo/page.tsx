import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { BrandLockup } from '@/components/BrandLockup';
import { LiveDemoSandbox } from '@/components/LiveDemoSandbox';
import { FinalCtaPanel } from '@/components/FinalCtaPanel';

export const metadata: Metadata = {
  title: 'Live Demo | Care Axis',
  description: 'Try the interactive Care Axis live demo sandbox and experience real workflow operations before onboarding.',
};

export default function LiveDemoPage() {
  return (
    <main>
      <Navbar />

      <section className="section hero">
        <div className="container">
          <BrandLockup product="careaxis" />
          <h1 className="hero-title">Interactive live demo sandbox</h1>
          <p className="section-copy">
            Click through package views, queues, and operations panels to feel the product experience.
            Then move directly to quote, payment, and launch.
          </p>
          <div className="btn-row">
            <a className="btn primary" href="/contact#quickstart-order">Get My Quote</a>
            <a className="btn secondary" href="/book-call">Schedule a Call</a>
          </div>

          <LiveDemoSandbox />
        </div>
      </section>

      <FinalCtaPanel
        eyebrow="From Demo to Launch"
        title="Ready to move from sandbox to production setup?"
        copy="Complete QuickStart intake and we will map your package, migration scope, and launch timeline."
        primaryHref="/contact#quickstart-order"
        primaryLabel="Start QuickStart Intake"
        secondaryHref="/pricing"
        secondaryLabel="View Pricing"
      />

      <Footer />
    </main>
  );
}
