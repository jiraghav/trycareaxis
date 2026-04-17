import type { Metadata } from 'next';
import { VerticalPageTemplate } from '@/components/VerticalPageTemplate';

export const metadata: Metadata = {
  title: 'Care Axis Ortho360 | Orthopedic Practice Software Package',
  description:
    'Care Axis Ortho360 supports orthopedic workflows with procedure visibility, patient progression, referral coordination, and multi-site controls.',
};

export default function Ortho360Page() {
  return (
    <VerticalPageTemplate
      product="ortho360"
      title="Care Axis Ortho360: orthopedic workflow control from consult to recovery"
      subtitle="Ortho360 helps orthopedic teams standardize care operations and coordination across providers, facilities, and administrative teams."
      pains={[
        'Disjointed pre-op, post-op, and longitudinal care tracking',
        'Coordination gaps between providers, imaging, and support teams',
        'Inconsistent process adherence across locations',
        'Limited leadership visibility into throughput and bottlenecks',
      ]}
      outcomes={[
        'Consistent orthopedic care-path execution',
        'Better coordination across procedure-related workflows',
        'Unified operational oversight for multi-site groups',
        'Improved throughput and reduced avoidable delays',
      ]}
      workflow={[
        'Define procedure pathways and role responsibilities',
        'Activate referral and coordination checkpoints',
        'Track patient progression and documentation readiness',
        'Use analytics to improve scheduling and team performance',
      ]}
    />
  );
}
