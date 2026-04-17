import type { VerticalKey } from '@/components/brand';

const labelByKey: Record<VerticalKey | 'careaxis', string> = {
  careaxis: 'Core Platform',
  pi360: 'Personal Injury',
  dpc360: 'Direct Primary Care',
  practice360: 'Multi-Specialty',
  ortho360: 'Orthopedic',
  pain360: 'Pain Management',
};

type BrandLockupProps = {
  product?: VerticalKey | 'careaxis';
  compact?: boolean;
};

export function BrandLockup({ product = 'careaxis', compact = false }: BrandLockupProps) {
  const lockupClassName = compact ? 'brand-lockup compact' : 'brand-lockup';

  return (
    <div className={lockupClassName}>
      <span className={`brand-dot ${product}`} aria-hidden="true" />
      <span className="brand-copy">
        <span className="brand-parent">Care Axis</span>
        <span className="brand-child">{product === 'careaxis' ? 'Platform' : product.toUpperCase()}</span>
        <span className="brand-label">{labelByKey[product]}</span>
      </span>
    </div>
  );
}
