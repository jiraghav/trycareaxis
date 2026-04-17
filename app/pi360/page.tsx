import type { Metadata } from 'next';
import { VerticalPageTemplate } from '@/components/VerticalPageTemplate';

export const metadata: Metadata = {
  title: 'Care Axis PI360 | Personal Injury Software Package',
  description:
    'Care Axis PI360 is the personal injury package for referrals, treatment coordination, records, communication, tracking, and operational control.',
};

export default function PI360Page() {
  return (
    <VerticalPageTemplate
      product="pi360"
      title="Care Axis PI360: personal injury workflow depth without operational chaos"
      subtitle="PI360 is the personal injury package inside Care Axis. It is purpose-built for referral velocity, treatment coordination, records readiness, communication, and executive visibility."
      pains={[
        'Referral handoffs getting stuck between teams or facilities',
        'Missing status visibility for lawyers and operations managers',
        'Manual records and billing coordination across specialties',
        'Inconsistent follow-up and no unified accountability layer',
      ]}
      outcomes={[
        'Faster referral-to-treatment progression',
        'Structured updates for legal and clinical stakeholders',
        'Court-ready records coordination with better traceability',
        'Clear case-level and leadership-level operational control',
      ]}
      workflow={[
        'Intake and referral routing across specialty networks',
        'Treatment progression tracking with communication checkpoints',
        'Records, billing, and update workflows connected in one timeline',
        'Lawyer-facing visibility through PI-specific portal experiences',
      ]}
    />
  );
}
