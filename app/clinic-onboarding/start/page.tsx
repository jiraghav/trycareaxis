import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BrandLockup } from '@/components/BrandLockup';
import { CicClinicOnboardingFlow } from '@/components/CicClinicOnboardingFlow';

export const metadata: Metadata = {
  title: 'Start Clinic Onboarding | CIC Network',
  description:
    'Start the CIC clinic onboarding process. A 3–5 minute multi-step flow with autosave and a clear progress bar.',
};

export default function ClinicOnboardingStartPage() {
  return (
    <main>
      <Navbar />

      <section className="section hero">
        <div className="container">
          <div className="two-col" style={{ alignItems: 'start' }}>
            <div>
              <BrandLockup product="pi360" />
              <p className="hero-kicker">Complete Injury Centers Network</p>
              <h1 className="hero-title">Start the clinic onboarding process</h1>
              <p className="hero-subtitle hero-lead">
                Single-column. Mobile-first. Takes about 3–5 minutes. Step 1 captures the basics so we can review fit
                even if you finish later.
              </p>
              <div className="btn-row">
                <a className="btn ghost" href="/clinic-onboarding" data-track="cic_back_to_landing">
                  Back to overview
                </a>
              </div>
            </div>

            <div className="card">
              <p className="panel-title">What happens after you submit</p>
              <ul className="list" style={{ marginBottom: 0 }}>
                <li>Application review + coverage confirmation</li>
                <li>Document collection (if anything is missing)</li>
                <li>Activation steps for referrals, workflows, and coordination</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-tight-top">
        <div className="container">
          <CicClinicOnboardingFlow />
        </div>
      </section>

      <Footer />
    </main>
  );
}
