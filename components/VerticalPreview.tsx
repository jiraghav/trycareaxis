import type { VerticalKey } from '@/components/brand';

type VerticalPreviewProps = {
  product: VerticalKey | 'careaxis';
  compact?: boolean;
};

type PreviewConfig = {
  heading: string;
  subheading: string;
  tags: [string, string, string];
};

const previewByProduct: Record<VerticalKey | 'careaxis', PreviewConfig> = {
  careaxis: {
    heading: 'Care Axis Core',
    subheading: 'Shared operations engine',
    tags: ['Automation', 'Analytics', 'Integrations'],
  },
  pi360: {
    heading: 'PI360',
    subheading: 'Personal injury workflows',
    tags: ['Referrals', 'Records', 'Case Ops'],
  },
  dpc360: {
    heading: 'DPC360',
    subheading: 'Membership-first care',
    tags: ['Retention', 'Patient Comms', 'Billing'],
  },
  practice360: {
    heading: 'Practice360',
    subheading: 'Hybrid multi-specialty',
    tags: ['Front Desk', 'Hybrid Billing', 'Ops Control'],
  },
  ortho360: {
    heading: 'Ortho360',
    subheading: 'Procedure-ready operations',
    tags: ['Care Path', 'Multi-Location', 'Surgery Ops'],
  },
  pain360: {
    heading: 'Pain360',
    subheading: 'Longitudinal pain management',
    tags: ['Progression', 'Follow-Ups', 'Treatment Flow'],
  },
};

export function VerticalPreview({ product, compact = false }: VerticalPreviewProps) {
  const config = previewByProduct[product];
  const classes = compact
    ? `vertical-preview ${product} compact`
    : `vertical-preview ${product}`;

  return (
    <figure className={classes} aria-hidden="true">
      <div className="vp-backdrop" />
      <div className="vp-frame">
        <div className="vp-head">
          <span className="vp-dot" />
          <span className="vp-dot" />
          <span className="vp-dot" />
        </div>
        <div className="vp-body">
          <div className="vp-main">
            <strong>{config.heading}</strong>
            <span>{config.subheading}</span>
            <div className="vp-wave" />
          </div>
          <div className="vp-side vp-side-top" />
          <div className="vp-side vp-side-bottom" />
        </div>
        <div className="vp-tags">
          {config.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </figure>
  );
}
