import type { Metadata } from 'next';
import { Logo } from '@/components/Logo';
import { VideoModal } from '@/components/VideoModal';

const DEMO_VIDEO_EMBED_URL =
  'https://drive.google.com/file/d/1yKVXa7r4TGvU539zO2fMWGlVsih42gTB/preview';

const INTRO_BOOKING_URL = 'https://calendly.com/cictelemed/15';

export const metadata: Metadata = {
  title: 'Lawyer Demo | Care Axis',
  description:
    'Watch the Care Axis lawyer demo and book a 15-minute intro for PI360 coordination and case visibility.',
};

export default function LawyerDemoPage() {
  return (
    <main>
      <section className="section hero hero-premium">
        <div className="container two-col">
          <div>
            <div style={{ marginBottom: 14 }}>
              <Logo subline="" className="logo-footer" />
            </div>

            <p className="hero-kicker">trycareaxis.com</p>
            <h1 className="hero-title">Lawyer Demo</h1>
            <p className="hero-subtitle hero-lead">
              A focused walkthrough of the PI360 lawyer experience: referral intake, case status tracking,
              document exchange, and faster clinic coordination on the Care Axis platform.
            </p>

            <div className="btn-row cta-primary-row">
              <VideoModal embedUrl={DEMO_VIDEO_EMBED_URL} title="Care Axis Lawyer Demo" />
              <a
                className="btn secondary cta-large"
                href={INTRO_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Book a 15-Minute Intro
              </a>
            </div>

            <div className="hero-proof-row lawyer-demo-proof">
              <div className="hero-proof-pill">
                <strong>Case visibility</strong>
                <span>Status + timeline without follow-ups</span>
              </div>
              <div className="hero-proof-pill">
                <strong>Auditable requests</strong>
                <span>Updates tied to case context</span>
              </div>
              <div className="hero-proof-pill">
                <strong>Secure exchange</strong>
                <span>Documents + records coordination</span>
              </div>
            </div>
          </div>

          <aside className="visual-card lawyer-demo-visual">
            <div className="eyebrow">Demo Preview</div>
            <h3 style={{ marginTop: 10 }}>What you'll see</h3>
            <ul className="list" style={{ marginTop: 12 }}>
              <li>Referral intake and case creation flow</li>
              <li>Case status updates and progression timeline</li>
              <li>Document exchange and record requests</li>
              <li>Clinic coordination without manual loops</li>
            </ul>

            <VideoModal
              buttonClassName="lawyer-demo-tile"
              buttonAriaLabel="Watch the lawyer demo"
              embedUrl={DEMO_VIDEO_EMBED_URL}
              title="Care Axis Lawyer Demo"
            >
              <span className="lawyer-demo-tile-inner">
                <span className="lawyer-demo-play" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="22" height="22" focusable="false" aria-hidden="true">
                    <path d="M9 7.5v9l8-4.5-8-4.5Z" fill="currentColor" />
                  </svg>
                </span>
                <span className="lawyer-demo-tile-copy">
                  <strong>Watch the demo</strong>
                  <span>See the workflow end-to-end</span>
                </span>
              </span>
            </VideoModal>
          </aside>
        </div>
      </section>
    </main>
  );
}
