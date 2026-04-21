import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { BrandLockup } from '@/components/BrandLockup';
import { FinalCtaPanel } from '@/components/FinalCtaPanel';
import { VideoModal } from '@/components/VideoModal';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Care Axis PI360 Lawyer Portal Demo',
  description:
    'Preview the Care Axis PI360 Lawyer Portal for referral visibility, treatment status, records access, and operational communication.',
};

export default function LawyerPortalPage() {
  const enterprisePoints = [
    {
      title: 'Multi-location legal visibility',
      copy: 'Track referral and treatment progression across locations with one shared view for legal operations.',
    },
    {
      title: 'SLA and accountability control',
      copy: 'Standardize response expectations with auditable request/update history tied to case context.',
    },
    {
      title: 'Executive reporting readiness',
      copy: 'Give leadership clear performance visibility by team, office, and case stage without manual reporting.',
    },
  ];
  const proofStats = [
    { value: '<24h', label: 'Average legal update response target' },
    { value: '98%', label: 'Workflow checkpoint completion benchmark' },
    { value: 'Multi-office', label: 'Regional PI operations coverage model' },
  ];

  return (
    <main>
      <Navbar />

      <section className="section hero">
        <div className="container two-col">
          <div>
            <BrandLockup product="pi360" />
            <h1 className="section-title">Lawyer Portal demo inside Care Axis PI360</h1>
            <p className="section-copy">
              PI360 includes a lawyer-facing portal so firms can monitor status, request updates, and
              access case records without manual follow-up loops.
            </p>
            <div className="btn-row">
              <a className="btn primary" href="/demo">Book PI360 Demo</a>
              <a className="btn secondary" href="/book-call">Schedule a Call</a>
            </div>
          </div>

          <div className="card">
            <h3>Portal highlights</h3>
            <ul className="list" style={{ marginTop: 12 }}>
              <li>Referral timelines and progression visibility</li>
              <li>Request-update workflow with auditable history</li>
              <li>Court-ready record and document access coordination</li>
              <li>Operational communication tied to case context</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section section-tight-top">
        <div className="container">
          <div id="lawyer-demo" className="card">
            <h3>Updated Lawyer Portal Demo</h3>
            <p className="muted">
              This is the latest PI360 lawyer portal walkthrough, designed for firms and enterprise PI groups.
            </p>
            <div className={styles.videoEmbed}>
              <iframe
                title="Care Axis PI360 Lawyer Portal Demo"
                src="https://drive.google.com/file/d/1yKVXa7r4TGvU539zO2fMWGlVsih42gTB/preview"
                loading="lazy"
                allow="autoplay; fullscreen"
                allowFullScreen
                className={styles.videoEmbedFrame}
              />
            </div>
            <div className="btn-row" style={{ marginTop: 16 }}>
              <VideoModal
                embedUrl="https://drive.google.com/file/d/1yKVXa7r4TGvU539zO2fMWGlVsih42gTB/preview"
                title="Care Axis PI360 Lawyer Portal Demo"
                buttonLabel="Watch Full Screen"
                buttonClassName={`btn primary ${styles.mobileOnly}`}
                buttonAriaLabel="Open the PI360 lawyer portal demo in a full-screen player"
              />
              <a
                className="btn secondary"
                href="https://drive.google.com/file/d/1yKVXa7r4TGvU539zO2fMWGlVsih42gTB/view?usp=drivesdk"
                target="_blank"
                rel="noreferrer"
              >
                Open Full Demo in New Tab
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-tight-top">
        <div className="container">
          <div className="card">
            <div className="eyebrow">Trusted by High-Volume PI Teams</div>
            <h3 style={{ marginTop: 10 }}>Built for legal operations at scale</h3>
            <div className="stat-grid" style={{ marginTop: 14 }}>
              {proofStats.map((stat) => (
                <article className="metric" key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-tight-top">
        <div className="container feature-grid">
          {enterprisePoints.map((point) => (
            <article className="card" key={point.title}>
              <h3>{point.title}</h3>
              <p className="muted" style={{ marginBottom: 0 }}>{point.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <FinalCtaPanel
        eyebrow="Enterprise PI Teams"
        title="Deploy PI360 lawyer workflows across large groups"
        copy="We can tailor this lawyer portal workflow for multi-office firms, regional legal ops teams, and high-volume case networks."
        primaryHref="/demo"
        primaryLabel="Book Enterprise PI360 Demo"
        secondaryHref="/book-call"
        secondaryLabel="Schedule Strategy Call"
        tertiaryHref="/pi360"
        tertiaryLabel="Back to PI360"
      />

      <Footer />
    </main>
  );
}
