export type VerticalKey = 'pi360' | 'dpc360' | 'practice360' | 'ortho360' | 'pain360';

export type VerticalProduct = {
  key: VerticalKey;
  name: string;
  fullName: string;
  href: string;
  summary: string;
  audience: string;
  accent: string;
  cta: string;
};

export const VERTICAL_PRODUCTS: VerticalProduct[] = [
  {
    key: 'pi360',
    name: 'PI360',
    fullName: 'Care Axis PI360',
    href: '/pi360',
    summary:
      'Personal injury workflow, referrals, treatment coordination, records, billing coordination, and legal visibility.',
    audience: 'PI clinics, case managers, and lawyers',
    accent: 'var(--accent-pi)',
    cta: 'See PI360',
  },
  {
    key: 'dpc360',
    name: 'DPC360',
    fullName: 'Care Axis DPC360',
    href: '/dpc360',
    summary:
      'Membership-first operations for direct primary care practices with scheduling, communication, and retention workflows.',
    audience: 'DPC practices and operators',
    accent: 'var(--accent-dpc)',
    cta: 'Explore DPC360',
  },
  {
    key: 'practice360',
    name: 'Practice360',
    fullName: 'Care Axis Practice360',
    href: '/practice360',
    summary:
      'Flexible multi-specialty package for cash-pay, insurance, and hybrid clinic models.',
    audience: 'Multi-specialty operators and admin teams',
    accent: 'var(--accent-practice)',
    cta: 'Explore Practice360',
  },
  {
    key: 'ortho360',
    name: 'Ortho360',
    fullName: 'Care Axis Ortho360',
    href: '/ortho360',
    summary:
      'Orthopedic workflow package with procedure visibility, care-path consistency, and multi-location controls.',
    audience: 'Orthopedic groups and ASC-aligned teams',
    accent: 'var(--accent-ortho)',
    cta: 'Explore Ortho360',
  },
  {
    key: 'pain360',
    name: 'Pain360',
    fullName: 'Care Axis Pain360',
    href: '/pain360',
    summary:
      'Pain-management package focused on patient progression, documentation fidelity, and referral communication.',
    audience: 'Pain clinics and interdisciplinary groups',
    accent: 'var(--accent-pain)',
    cta: 'Explore Pain360',
  },
];

export const CORE_MODULES = [
  'EMR and clinical documentation',
  'Practice management and scheduling',
  'CRM and pipeline workflows',
  'Referrals and coordination tracking',
  'Communication: calls, text, email, reminders',
  'Automation and AI agents',
  'Analytics and operational command center',
  'Role-based portals and enterprise controls',
];
