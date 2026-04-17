import type { Metadata } from 'next';
import { VerticalPageTemplate } from '@/components/VerticalPageTemplate';

export const metadata: Metadata = {
  title: 'Care Axis Pain360 | Pain Management Software Package',
  description:
    'Care Axis Pain360 is built for pain management teams with stronger continuity workflows, documentation rigor, communication, and referral control.',
};

export default function Pain360Page() {
  return (
    <VerticalPageTemplate
      product="pain360"
      title="Care Axis Pain360: coordinated pain-management operations with clinical rigor"
      subtitle="Pain360 supports complex, longitudinal pain workflows with better visibility for clinical teams, admins, and operational leadership."
      pains={[
        'Longitudinal care pathways with inconsistent follow-through',
        'High documentation burden across complex patient journeys',
        'Weak coordination between referring partners and in-house teams',
        'Limited visibility into workflow adherence and outcomes',
      ]}
      outcomes={[
        'Reliable continuity workflows for complex cases',
        'Improved documentation and audit readiness',
        'Clear referral and communication orchestration',
        'Leadership insight into operational and care progression performance',
      ]}
      workflow={[
        'Set protocol-specific care progression templates',
        'Automate reminders, communication, and team tasks',
        'Track adherence and key milestones across patient timelines',
        'Use dashboards to improve outcomes and resource allocation',
      ]}
    />
  );
}
