import type { VerticalKey } from '@/components/brand';

type PackageVisualProps = {
  product: VerticalKey | 'careaxis';
  compact?: boolean;
};

const labels: Record<VerticalKey | 'careaxis', string[]> = {
  careaxis: ['Core Engine', 'Automation Layer', 'Analytics'],
  pi360: ['Referrals', 'Records', 'Case Ops'],
  dpc360: ['Membership', 'Patient Comms', 'Retention'],
  practice360: ['Hybrid Billing', 'Front Desk', 'Ops Control'],
  ortho360: ['Procedure Flow', 'Care Path', 'Multi-Location'],
  pain360: ['Treatment Progression', 'Documentation', 'Visibility'],
};

export function PackageVisual({ product, compact = false }: PackageVisualProps) {
  const classes = compact ? `package-visual ${product} compact` : `package-visual ${product}`;

  return (
    <div className={classes} aria-hidden="true">
      <div className="package-visual-headline">
        <strong>{product === 'careaxis' ? 'Care Axis Core' : product.toUpperCase()}</strong>
        <span>Specialized package</span>
      </div>

      <div className="package-bars">
        <span />
        <span />
        <span />
      </div>

      <div className="package-tags">
        {labels[product].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}
