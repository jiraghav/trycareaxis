import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BrandLockup } from '@/components/BrandLockup';
import { FinalCtaPanel } from '@/components/FinalCtaPanel';
import { SectionViewTracker } from '@/components/SectionViewTracker';

export const metadata: Metadata = {
  title: 'Clinic Onboarding | Complete Injury Centers Network',
  description:
    'Join the Complete Injury Centers (CIC) Network. Grow your clinic with coordinated personal injury referrals, back-office support, and case coordination so your team can stay focused on patient care.',
};

const proofPoints = [
  'Back-office support',
  'Scheduling + transportation coordination',
  'EMR/CRM workflow support',
  'Integrated specialty network',
  'No fee to join',
  'Built for PI case management',
];

const whyCards = [
  {
    title: 'Focus on patient care',
    copy: 'You treat the patient while CIC supports scheduling, coordination, and operational follow-through.',
  },
  {
    title: 'Back-office support',
    copy: 'Trained staff and infrastructure that functions like an extension of your clinic team.',
  },
  {
    title: 'No join fee',
    copy: 'No cost to apply or join. CIC aligns incentives by growing when your clinic grows.',
  },
  {
    title: 'Operational efficiency',
    copy: 'Patient + law firm workflows supported with systems that reduce administrative friction.',
  },
  {
    title: 'Integrated specialty network',
    copy: 'Coordinated care across chiropractic, medical, pain, ortho, neuro, psych, surgery, and diagnostics.',
  },
  {
    title: 'Patient logistics support',
    copy: 'Scheduling and transportation coordination help reduce burden on your front desk and staff.',
  },
];

const howItWorks = [
  {
    title: 'Submit your clinic information',
    copy: 'Share locations, services, and the best point of contact.',
  },
  {
    title: 'CIC reviews fit and coverage',
    copy: 'We confirm specialty alignment, geography, and participation requirements.',
  },
  {
    title: 'Complete onboarding details',
    copy: 'Provide operational details, documents, and clinic setup items.',
  },
  {
    title: 'Get activated in the network',
    copy: 'Your team is prepared for referrals, workflows, and coordination support.',
  },
];

const whatCicDoes = [
  'Helps reduce time spent on staffing, overhead, coordination, and administrative friction.',
  'Provides back-office and support staff infrastructure.',
  'Gives clinics access to EMR/CRM workflow support for patient + law firm management.',
  'Handles intake support and streamlines forms coming from the website.',
  'Coordinates medically necessary referrals across multiple specialties.',
  'Supports diagnostic coordination including imaging and testing.',
  'Provides scheduling and transportation support.',
  'Offers education and professional support for doctors, staff, and affiliates.',
];

const whoItsFor = [
  'Chiropractors',
  'Medical clinics',
  'Pain management',
  'Orthopedics',
  'Neurology',
  'Imaging / diagnostics',
  'Multi-specialty facilities',
  'Clinics wanting PI growth support',
];

const beforeStartChecklist = [
  'Clinic legal name',
  'Primary contact info',
  'Facility locations',
  'Services / specialties',
  'NPI / tax details',
  'Licensure / insurance documents',
  'Scheduling capacity',
  'Preferred communication method',
];

const faqs = [
  {
    q: 'Is there a fee to join CIC?',
    a: 'No. There is no cost to apply or join. CIC is aligned with clinic success and grows when your clinic grows.',
  },
  {
    q: 'What kinds of clinics can apply?',
    a: 'Clinics and providers across chiropractic, medical, pain management, orthopedics, neurology, psychiatry, counseling, surgery, and diagnostics.',
  },
  {
    q: 'What support does CIC provide?',
    a: 'Back office support, intake help, scheduling + transportation coordination, patient/law-firm workflow support, referral coordination, and EMR/CRM workflow support.',
  },
  {
    q: 'Will CIC help with referrals and coordination?',
    a: 'Yes. CIC supports medically necessary referrals and helps coordinate care across multiple specialties.',
  },
  {
    q: 'What happens after I apply?',
    a: 'We review your application, confirm fit and coverage, collect any missing items, and activate onboarding steps for your clinic.',
  },
];

export default function ClinicOnboardingLandingPage() {
  return (
    <main>
      <Navbar />
      <SectionViewTracker
        sections={[
          { id: 'hero', label: 'Hero' },
          { id: 'why', label: 'Why Clinics Join' },
          { id: 'how', label: 'How It Works' },
          { id: 'what', label: 'What CIC Does' },
          { id: 'who', label: 'Who This Is For' },
          { id: 'before', label: 'Before You Start' },
          { id: 'faq', label: 'FAQ' },
        ]}
        eventPrefix="cic_clinic_onboarding"
      />

      <section className="section hero hero-premium" id="hero" data-track-section="hero">
        <div className="container">
          <div className="onboarding-hero">
            <div>
              <BrandLockup product="pi360" />
              <p className="hero-kicker">trycareaxis.com</p>
              <h1 className="hero-title">Join the Complete Injury Centers Network</h1>
              <p className="hero-subtitle hero-lead">
                Grow your clinic with coordinated personal injury referrals, case coordination, back-office support,
                and a system built to help your team stay focused on patient care.
              </p>
              <p className="hero-subtitle" style={{ marginTop: 12 }}>
                <strong>You see the patient.</strong> CIC handles everything else.
              </p>

              <div className="btn-row" style={{ alignItems: 'center' }}>
                <a className="btn primary" href="/clinic-onboarding/start" data-track="cic_start_process_now">
                  Start Process Now
                </a>
                <a className="btn secondary" href="#how" data-track="cic_see_how_it_works">
                  See How CIC Works
                </a>
              </div>
              <p className="small" style={{ marginTop: 12, marginBottom: 0 }}>
                No cost to apply. Fast review. Multi-location clinics welcome.
              </p>
            </div>

            <div className="card onboarding-hero-card">
              <p className="panel-title">What Clinics Get</p>
              <div className="onboarding-step-grid">
                <article className="onboarding-step done">
                  <strong>Operational support</strong>
                  <span>Back-office help, intake support, and workflow reinforcement.</span>
                </article>
                <article className="onboarding-step done">
                  <strong>Coordination layer</strong>
                  <span>Scheduling, transportation, and medically necessary referrals.</span>
                </article>
                <article className="onboarding-step done">
                  <strong>Case-ready systems</strong>
                  <span>EMR/CRM workflow support for patients and law firms.</span>
                </article>
                <article className="onboarding-step done">
                  <strong>Integrated network</strong>
                  <span>Access to a broader provider ecosystem across specialties.</span>
                </article>
              </div>
            </div>
          </div>

          <div className="trust-grid cic-proof-strip" style={{ marginTop: 28 }}>
            {proofPoints.map((point) => (
              <article className="trust-strip" key={point}>
                <div className="trust-chip">{point}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tight-top" id="why" data-track-section="why">
        <div className="container">
          <div className="section-header-row">
            <div>
              <div className="eyebrow">Why Clinics Join</div>
              <h2 className="section-title">A win-win model built around clinic throughput and quality care</h2>
              <p className="section-copy">
                CIC is designed to remove operational burden, reduce coordination overhead, and help clinics scale PI
                patient volume without turning your team into a case-management department.
              </p>
            </div>
            <div className="btn-row">
              <a className="btn primary" href="/clinic-onboarding/start" data-track="cic_start_process_now_why">
                Start Process Now
              </a>
            </div>
          </div>

          <div className="feature-grid">
            {whyCards.map((card) => (
              <article className="card feature-card" key={card.title}>
                <h3 style={{ marginTop: 0 }}>{card.title}</h3>
                <p className="small" style={{ marginBottom: 0 }}>
                  {card.copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="how" data-track-section="how" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="eyebrow">How It Works</div>
          <h2 className="section-title">Clear steps. Fast review. No surprises.</h2>
          <p className="section-copy">
            Clinics convert more often when the process is transparent. This flow clarifies what happens next before you
            spend time on details.
          </p>

          <div className="trust-grid cic-how-grid">
            {howItWorks.map((step, index) => (
              <article className="trust-strip" key={step.title}>
                <div className="trust-chip">{`Step ${index + 1}`}</div>
                <p style={{ margin: '10px 0 6px' }}>
                  <strong>{step.title}</strong>
                </p>
                <p className="small" style={{ marginBottom: 0 }}>
                  {step.copy}
                </p>
              </article>
            ))}
          </div>

          <div className="btn-row" style={{ marginTop: 18 }}>
            <a className="btn primary" href="/clinic-onboarding/start" data-track="cic_start_process_now_how">
              Start Process Now
            </a>
          </div>
        </div>
      </section>

      <section className="section" id="what" data-track-section="what">
        <div className="container">
          <div className="eyebrow">Operational Coverage</div>
          <h2 className="section-title">What CIC does for clinics</h2>
          <p className="section-copy">
            The clinic stays clinical. CIC supports the operational layer required for PI case management and
            multi-specialty coordination.
          </p>

          <div className="card cic-bullets-card">
            <ul className="list" style={{ marginBottom: 0 }}>
              {whatCicDoes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="btn-row" style={{ marginTop: 18 }}>
            <a className="btn primary" href="/clinic-onboarding/start" data-track="cic_start_process_now_what">
              Start Process Now
            </a>
          </div>
        </div>
      </section>

      <section className="section" id="who" data-track-section="who" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="eyebrow">Who This Is For</div>
          <h2 className="section-title">Built for clinics that want PI growth without operational chaos</h2>
          <p className="section-copy">
            CIC supports coordinated care across specialties, from initial evaluation through diagnostics, referrals,
            and follow-through.
          </p>

          <div className="trust-grid cic-who-grid">
            {whoItsFor.map((item) => (
              <article className="trust-strip" key={item}>
                <div className="trust-chip">{item}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="before" data-track-section="before">
        <div className="container two-col">
          <div>
            <div className="eyebrow">Before You Start</div>
            <h2 className="section-title">Have these ready (takes about 3–5 minutes)</h2>
            <p className="section-copy">
              You can start with basics and finish later. Step 1 captures contact details so our team can follow up if
              you get interrupted.
            </p>
            <div className="btn-row">
              <a className="btn primary" href="/clinic-onboarding/start" data-track="cic_start_process_now_before">
                Start Process Now
              </a>
              <a className="btn ghost" href="#faq" data-track="cic_jump_to_faq">
                Read FAQ
              </a>
            </div>
          </div>

          <div className="card">
            <p className="panel-title">Checklist</p>
            <ul className="list" style={{ marginBottom: 0 }}>
              {beforeStartChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section" id="faq" data-track-section="faq" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="eyebrow">FAQ</div>
          <h2 className="section-title">Quick answers for clinic operators</h2>
          <div className="faq-grid">
            {faqs.map((item) => (
              <article className="card" key={item.q}>
                <h3 style={{ marginTop: 0 }}>{item.q}</h3>
                <p className="small" style={{ marginBottom: 0 }}>
                  {item.a}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <FinalCtaPanel
        eyebrow="Clinic Network Onboarding"
        title="See if your clinic is a fit for the CIC Network"
        copy="Start the process now. Step 1 takes about a minute and captures the basics so we can review fit and coverage quickly."
        primaryHref="/clinic-onboarding/start"
        primaryLabel="Start Process Now"
        secondaryHref="/book-call"
        secondaryLabel="Talk Through Fit"
      />

      <Footer />
    </main>
  );
}

