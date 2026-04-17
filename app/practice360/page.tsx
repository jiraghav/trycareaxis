import type { Metadata } from 'next';
import { VerticalPageTemplate } from '@/components/VerticalPageTemplate';

export const metadata: Metadata = {
  title: 'Care Axis Practice360 | Multi-Specialty Clinic Software Package',
  description:
    'Care Axis Practice360 is the flexible package for cash-pay, insurance-based, and hybrid clinic models with robust practice operations workflows.',
};

export default function Practice360Page() {
  return (
    <VerticalPageTemplate
      product="practice360"
      title="Care Axis Practice360: one package for cash, insurance, and hybrid clinics"
      subtitle="Practice360 is designed for multidisciplinary teams that need flexible workflows without losing operational control as volume increases."
      pains={[
        'Mixed business models causing workflow fragmentation',
        'Limited consistency across staff, specialties, and locations',
        'No single view of scheduling, communications, and productivity',
        'Hard-to-scale operations with manual process dependencies',
      ]}
      outcomes={[
        'Unified workflows across cash-pay and insurance operations',
        'Clear role-based task ownership across the organization',
        'Integrated communications and scheduling visibility',
        'Operational systemization that scales with growth',
      ]}
      workflow={[
        'Map your care and business model pathways',
        'Configure templates, automations, and integration touchpoints',
        'Launch a unified operating dashboard for daily execution',
        'Continuously optimize through analytics and AI suggestions',
      ]}
    />
  );
}
