import type { Metadata } from 'next';
import { VerticalPageTemplate } from '@/components/VerticalPageTemplate';

export const metadata: Metadata = {
  title: 'Care Axis DPC360 | Direct Primary Care Software Package',
  description:
    'Care Axis DPC360 supports direct primary care practices with membership workflows, care continuity, communication, and retention-focused operations.',
};

export default function DPC360Page() {
  return (
    <VerticalPageTemplate
      product="dpc360"
      title="Care Axis DPC360: membership-first operations for modern DPC teams"
      subtitle="DPC360 helps direct primary care clinics run efficient member workflows, high-touch communication, and operational consistency as they grow."
      pains={[
        'Membership workflows spread across multiple disconnected tools',
        'Inconsistent retention follow-ups and member engagement',
        'Manual operational burden on physicians and admin teams',
        'Limited visibility into growth and service utilization trends',
      ]}
      outcomes={[
        'Centralized member lifecycle operations',
        'Clear communication workflows for renewals and outreach',
        'Lower admin load through automation and AI support',
        'Actionable analytics for growth and retention decisions',
      ]}
      workflow={[
        'Configure membership plans and onboarding pathways',
        'Automate reminders, outreach cadences, and follow-ups',
        'Track care continuity, utilization, and patient engagement',
        'Scale with repeatable SOPs across teams and locations',
      ]}
    />
  );
}
