'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';

type FieldType = 'text' | 'email' | 'tel' | 'date' | 'number' | 'textarea' | 'select' | 'multiselect' | 'facilitylist' | 'volumeprofile' | 'templateprofile';

type FieldOption = {
  label: string;
  value: string;
};

type IntakeField = {
  id: string;
  label: string;
  type: FieldType;
  description: string;
  group?: string;
  priceLogic?: string;
  required?: boolean;
  placeholder?: string;
  options?: FieldOption[];
};

type IntakeSection = {
  id: string;
  title: string;
  copy: string;
  fields: IntakeField[];
};

type IntakeState = Record<string, string | string[]>;

const sections: IntakeSection[] = [
  {
    id: 'client-account',
    title: '1. Client account and legal entity setup',
    copy: 'This step mirrors the legal entity and launch setup section from the questionnaire.',
    fields: [
      { id: 'legal_business_name', label: 'Legal business name', type: 'text', group: 'Legal Entity', description: 'Exact contracting entity name.', priceLogic: 'Used on MSA, quote, and invoice.', required: true, placeholder: 'Enter legal business name' },
      { id: 'dba_brand_name', label: 'DBA / brand name', type: 'text', group: 'Legal Entity', description: 'Displayed brand if different from legal entity.', priceLogic: 'Impacts white-label setup.', required: true, placeholder: 'Enter DBA or brand name' },
      { id: 'primary_contact_name', label: 'Decision Maker Full Name', type: 'text', group: 'Decision Maker', description: 'Primary business owner or decision maker.', required: true, placeholder: 'Enter decision maker full name' },
      { id: 'primary_contact_title', label: 'Decision Maker Title', type: 'text', group: 'Decision Maker', description: 'Role or title for the primary contact.', required: true, placeholder: 'Enter decision maker title' },
      { id: 'primary_contact_email', label: 'Decision Maker Email', type: 'email', group: 'Decision Maker', description: 'Email for approvals and onboarding communication.', required: true, placeholder: 'Enter decision maker email' },
      { id: 'primary_contact_mobile', label: 'Decision Maker Mobile', type: 'tel', group: 'Decision Maker', description: 'Direct mobile or best callback number.', required: true, placeholder: 'Enter decision maker mobile' },
      { id: 'billing_contact_name', label: 'Billing contact name', type: 'text', group: 'Billing Contact', description: 'Accounts payable or billing owner.', priceLogic: 'Needed for invoicing.', required: true, placeholder: 'Enter billing contact name' },
      { id: 'billing_contact_email', label: 'Billing contact email', type: 'email', group: 'Billing Contact', description: 'Invoice and billing communication address.', required: true, placeholder: 'Enter billing contact email' },
      { id: 'billing_contact_phone', label: 'Billing contact phone', type: 'tel', group: 'Billing Contact', description: 'Direct line for billing follow-up.', required: true, placeholder: 'Enter billing contact phone' },
      { id: 'billing_contact_address', label: 'Billing address', type: 'textarea', group: 'Billing Contact', description: 'Full billing address for invoicing records.', required: true, placeholder: 'Enter billing address' },
      { id: 'contract_signer_name', label: 'Contract signer name', type: 'text', group: 'Contract Signer', description: 'Authorized signer for the agreement.', priceLogic: 'Needed for e-sign workflow.', required: true, placeholder: 'Enter contract signer name' },
      { id: 'contract_signer_title', label: 'Contract signer title', type: 'text', group: 'Contract Signer', description: 'Signer title or authority level.', required: true, placeholder: 'Enter contract signer title' },
      { id: 'contract_signer_email', label: 'Contract signer email', type: 'email', group: 'Contract Signer', description: 'Email used for quote and contract signature.', required: true, placeholder: 'Enter contract signer email' },
      { id: 'ein', label: 'EIN', type: 'text', group: 'Entity Details', description: 'Federal tax ID if available.', priceLogic: 'Optional for underwriting.', placeholder: 'Enter EIN' },
      { id: 'state_of_formation', label: 'State of formation', type: 'text', group: 'Entity Details', description: 'State where the entity was formed.', placeholder: 'Enter state of formation' },
      { id: 'entity_type', label: 'Entity type', type: 'select', group: 'Entity Details', description: 'Legal entity type.', placeholder: 'Select entity type', options: [
        { label: 'LLC', value: 'llc' },
        { label: 'Corporation', value: 'corporation' },
        { label: 'Partnership', value: 'partnership' },
        { label: 'Sole proprietor', value: 'sole-proprietor' },
        { label: 'Other', value: 'other' },
      ] },
      { id: 'target_go_live_date', label: 'Target go-live date', type: 'date', group: 'Launch Timing', description: 'Desired launch date.', priceLogic: 'Rush fee may apply.', required: true, placeholder: 'Select target go-live date' },
      { id: 'launch_urgency', label: 'Urgency level', type: 'select', group: 'Launch Timing', description: 'How urgent the launch is.', required: true, placeholder: 'Select urgency level', options: [
        { label: 'Standard', value: 'standard' },
        { label: 'High priority', value: 'high-priority' },
        { label: 'Rush', value: 'rush' },
      ] },
      { id: 'sales_rep_channel', label: 'Sales rep / channel', type: 'select', group: 'Launch Timing', description: 'How this account is being sold or referred.', priceLogic: 'Commission tracking only.', required: true, placeholder: 'Select source channel', options: [
        { label: 'Direct', value: 'direct' },
        { label: 'Referral', value: 'referral' },
        { label: 'Partner', value: 'partner' },
        { label: 'Reseller', value: 'reseller' },
        { label: 'Other', value: 'other' },
      ] },
    ],
  },
  {
    id: 'org-structure',
    title: '2. Organization structure and instance design',
    copy: 'This step captures the org structure and environment design questions from the source document.',
    fields: [
      { id: 'parent_company_structure', label: 'Parent company structure', type: 'select', group: 'Organization Model', description: 'Choose the structure requiring separation.', priceLogic: 'Multi-entity setup may add implementation scope.', required: true, options: [
        { label: 'Single entity', value: 'single-entity' },
        { label: 'Group', value: 'group' },
        { label: 'MSO', value: 'mso' },
        { label: 'Management company', value: 'management-company' },
        { label: 'Franchise', value: 'franchise' },
        { label: 'Umbrella structure', value: 'umbrella' },
      ] },
      { id: 'number_of_practice_groups', label: 'Number of practice groups', type: 'number', group: 'Organization Model', description: 'How many distinct groups require separation.', priceLogic: '$300 per additional billing entity after the first.', required: true, placeholder: 'Enter number of practice groups' },
      { id: 'number_of_locations', label: 'Number of locations', type: 'number', group: 'Location Footprint', description: 'Current live location count.', priceLogic: 'Base includes 1 location; monthly add-on per extra location.', required: true, placeholder: 'Enter number of locations' },
      { id: 'facility_list', label: 'Facility list', type: 'facilitylist', group: 'Location Footprint', description: 'Location names, addresses, phones, hours, and contact people.', priceLogic: 'Used for facility buildout.', required: true },
      { id: 'shared_vs_separate_config', label: 'Shared vs separate configuration', type: 'select', group: 'Configuration Design', description: 'How much templating and workflow separation is needed.', priceLogic: 'Heavy branching may add setup fee.', required: true, options: [
        { label: 'Shared templates', value: 'shared' },
        { label: 'Separate templates', value: 'separate' },
        { label: 'Hybrid', value: 'hybrid' },
      ] },
      { id: 'dedicated_domain_subdomain', label: 'Dedicated domain / subdomain', type: 'textarea', group: 'Configuration Design', description: 'Custom domain, subdomain, SSO, and DNS contact details.', priceLogic: 'White-label or SSO pricing if selected.', placeholder: 'Domain, SSO needs, DNS contact' },
    ],
  },
  {
    id: 'practice-profile',
    title: '3. Practice profile and specialty modules',
    copy: 'This step keeps the practice profile and specialty fit section intact.',
    fields: [
      { id: 'primary_specialties', label: 'Primary specialties', type: 'multiselect', group: 'Specialty Mix', description: 'Specialties in the current practice mix.', priceLogic: 'Base package depends on specialty mix.', required: true, options: [
        { label: 'Chiro', value: 'chiro' },
        { label: 'Medical', value: 'medical' },
        { label: 'Pain', value: 'pain' },
        { label: 'Ortho', value: 'ortho' },
        { label: 'PT', value: 'pt' },
        { label: 'Radiology', value: 'radiology' },
        { label: 'ER', value: 'er' },
        { label: 'Family med', value: 'family-med' },
        { label: 'Pediatrics', value: 'pediatrics' },
        { label: 'Occupational med', value: 'occupational-med' },
        { label: 'Multidisciplinary', value: 'multidisciplinary' },
      ] },
      { id: 'case_types', label: 'Case types', type: 'multiselect', group: 'Case Mix', description: 'Revenue and case models currently in use.', priceLogic: 'Insurance and PI modules priced separately if needed.', required: true, options: [
        { label: 'PI', value: 'pi' },
        { label: 'Cash', value: 'cash' },
        { label: 'Insurance', value: 'insurance' },
        { label: 'Workers comp', value: 'workers-comp' },
        { label: 'Hybrid', value: 'hybrid' },
      ] },
      { id: 'volume_profile', label: 'Volume profile', type: 'volumeprofile', group: 'Practice Volume', description: 'Active patients, new patients per day, visits per day, and providers per location.', priceLogic: 'Determines migration and support tier.', required: true },
      { id: 'high_priority_workflows', label: 'High-priority workflows', type: 'multiselect', group: 'Workflow Priorities', description: 'Workflow priorities that matter most in the rollout.', priceLogic: 'Used for package selection.', required: true, options: [
        { label: 'Referrals', value: 'referrals' },
        { label: 'Lawyer coordination', value: 'lawyer-coordination' },
        { label: 'Affiliate updates', value: 'affiliate-updates' },
        { label: 'Scheduling', value: 'scheduling' },
        { label: 'Treatment notes', value: 'treatment-notes' },
        { label: 'Imaging', value: 'imaging' },
        { label: 'RCM', value: 'rcm' },
        { label: 'Marketing', value: 'marketing' },
      ] },
      { id: 'need_for_custom_templates', label: 'Need for custom templates', type: 'templateprofile', group: 'Custom Templates', description: 'Upload or describe sample notes, intake forms, SOAPs, and reports.', priceLogic: '$150 per custom template after bundled count.' },
    ],
  },
  {
    id: 'roles-portals-seats',
    title: '4. User roles, portals, and seat counts',
    copy: 'This step follows the seat-count and role matrix block from the questionnaire.',
    fields: [
      { id: 'provider_logins', label: 'Provider logins', type: 'textarea', description: 'Count by provider type and supervising relationships.', priceLogic: 'Base includes up to 5 provider seats, then per-seat.', required: true },
      { id: 'internal_staff_logins', label: 'Internal staff logins', type: 'textarea', description: 'Admin, front desk, MA, billing, marketing, call center, executives.', priceLogic: 'Base includes 10 staff seats, then per-seat.', required: true },
      { id: 'law_firm_portal_users', label: 'Law firm portal users', type: 'textarea', description: 'Firm names, contacts, permissions, and matter visibility.', priceLogic: '$250 per firm portal org per month suggested.' },
      { id: 'affiliate_facility_portal_users', label: 'Affiliate / facility portal users', type: 'textarea', description: 'Clinic or affiliate groups requiring portal access.', priceLogic: '$250 per affiliate org per month suggested.' },
      { id: 'role_permissions_matrix', label: 'Role permissions matrix', type: 'textarea', description: 'Read, write, export, and admin privileges by role.', priceLogic: 'Complex custom RBAC may add setup fee.', required: true },
      { id: 'training_by_role', label: 'Training by role', type: 'multiselect', description: 'Which roles need onboarding tracks.', priceLogic: 'Priced in onboarding tier.', required: true, options: [
        { label: 'Provider', value: 'provider' },
        { label: 'Front desk', value: 'front-desk' },
        { label: 'Biller', value: 'biller' },
        { label: 'Lawyer', value: 'lawyer' },
        { label: 'Affiliate', value: 'affiliate' },
        { label: 'Admin', value: 'admin' },
      ] },
    ],
  },
  {
    id: 'migration-scope',
    title: '5. Data migration and onboarding scope',
    copy: 'This step preserves the migration intake exactly as a dedicated section.',
    fields: [
      { id: 'current_emr_source_systems', label: 'Current EMR / source systems', type: 'textarea', description: 'Current EMR, CRM, spreadsheets, or paper-chart sources.', priceLogic: 'Migration quote based on source complexity.', required: true },
      { id: 'data_to_migrate', label: 'Data to migrate', type: 'textarea', description: 'Patients, appointments, balances, notes, documents, providers, firms, referral sources, templates, and fee schedules.', priceLogic: 'Tiered migration fee.', required: true },
      { id: 'approximate_chart_count', label: 'Approximate chart count', type: 'textarea', description: 'Active charts and total historical charts.', priceLogic: '$0.75-$2.50 per chart depending on structure.', required: true },
      { id: 'file_types', label: 'File types', type: 'textarea', description: 'CSV, PDF, image, structured export, API access.', priceLogic: 'Unstructured files increase scope.', required: true },
      { id: 'cutover_strategy', label: 'Cutover strategy', type: 'select', description: 'Preferred migration and launch sequencing.', priceLogic: 'Phased launches may add PM hours.', required: true, options: [
        { label: 'Big bang', value: 'big-bang' },
        { label: 'Phased', value: 'phased' },
        { label: 'By location', value: 'by-location' },
        { label: 'By specialty', value: 'by-specialty' },
      ] },
      { id: 'legacy_retention', label: 'Legacy retention', type: 'select', description: 'Is a read-only archive needed?', priceLogic: '$100-$300 per month depending on storage.', options: [
        { label: 'No archive needed', value: 'no' },
        { label: 'Yes, archive required', value: 'yes' },
      ] },
    ],
  },
  {
    id: 'core-modules',
    title: '6. Core modules and recurring software pricing',
    copy: 'This step reflects the recurring platform module block and pricing inputs.',
    fields: [
      { id: 'core_care_axis_platform', label: 'Core Care Axis platform', type: 'textarea', description: 'Scheduling, charting, patient records, dashboards, and base admin tools.', priceLogic: '$1,500 per month suggested base for 1 location.', required: true },
      { id: 'additional_location', label: 'Additional location', type: 'text', description: 'Each added live location beyond the base.', priceLogic: '$500 per month per added location suggested.' },
      { id: 'additional_provider', label: 'Additional provider', type: 'text', description: 'Providers beyond the bundled count.', priceLogic: '$150 per month each suggested.' },
      { id: 'additional_internal_staff_seat', label: 'Additional internal staff seat', type: 'text', description: 'Internal seats beyond the bundled count.', priceLogic: '$35 per month each suggested.' },
      { id: 'patient_communications_module', label: 'Patient communications module', type: 'select', description: 'Email, reminders, intake links, and status messages.', priceLogic: '$200 per month plus usage if enabled.', options: [
        { label: 'Enabled', value: 'enabled' },
        { label: 'Not needed', value: 'not-needed' },
      ] },
      { id: 'advanced_reporting_analytics', label: 'Advanced reporting / analytics', type: 'select', description: 'Dashboards, KPI views, and export packs.', priceLogic: '$300 per month suggested.', options: [
        { label: 'Enabled', value: 'enabled' },
        { label: 'Not needed', value: 'not-needed' },
      ] },
      { id: 'tasking_workflow_automations', label: 'Tasking / workflow automations', type: 'select', description: 'Follow-ups, stale updates, and escalation rules.', priceLogic: '$400 per month suggested.', options: [
        { label: 'Enabled', value: 'enabled' },
        { label: 'Not needed', value: 'not-needed' },
      ] },
    ],
  },
  {
    id: 'pi-legal-affiliate',
    title: '7. PI, legal, and affiliate workflow modules',
    copy: 'This step keeps the PI and legal-specific module section intact.',
    fields: [
      { id: 'lawyer_portal', label: 'Lawyer portal', type: 'textarea', description: 'Case status, records requests, maps, dashboards, and notifications.', priceLogic: '$250 per month per firm org or custom enterprise bundle.' },
      { id: 'affiliate_portal', label: 'Affiliate portal', type: 'textarea', description: 'Weekly updates, document upload, payment status, and referrals.', priceLogic: '$250 per month per affiliate org or custom enterprise bundle.' },
      { id: 'referral_management_engine', label: 'Referral management engine', type: 'select', description: 'Inbound and outbound referrals, tracking, and referral alerts.', priceLogic: '$300 per month suggested.', options: [
        { label: 'Enabled', value: 'enabled' },
        { label: 'Not needed', value: 'not-needed' },
      ] },
      { id: 'weekly_update_automation', label: 'Weekly update automation', type: 'textarea', description: 'Email or portal update workflows and reminders.', priceLogic: '$200 per month suggested.' },
      { id: 'lop_pi_case_workflows', label: 'LOP / PI case workflows', type: 'textarea', description: 'PI flags, firm tagging, case stages, and records logic.', priceLogic: '$350 per month suggested.' },
      { id: 'medical_summary_case_snapshot_module', label: 'Medical summary / case snapshot module', type: 'textarea', description: 'Central summary for staff and law firms.', priceLogic: '$250 per month suggested.' },
    ],
  },
  {
    id: 'billing-insurance-payments',
    title: '8. Billing, insurance, payments, and financial services',
    copy: 'This step matches the billing and revenue workflow questions from the document.',
    fields: [
      { id: 'insurance_workflows', label: 'Insurance workflows', type: 'textarea', description: 'Insurance billing, payer mapping, and claim workflows.', priceLogic: '$500 setup + $250 per month suggested.' },
      { id: 'clearinghouse_integration', label: 'Clearinghouse integration', type: 'textarea', description: 'Claim submission, eligibility, ERA vendor details.', priceLogic: '$500 setup + pass-through vendor costs.' },
      { id: 'rcm_support', label: 'RCM support', type: 'textarea', description: 'Internal-only tools or full managed billing support.', priceLogic: 'Custom percent of collections or fixed fee.' },
      { id: 'payment_processing', label: 'Payment processing', type: 'textarea', description: 'Stripe, merchant processor, card on file, or ACH.', priceLogic: 'Pass-through plus setup if custom.' },
      { id: 'payroll_integration', label: 'Payroll integration', type: 'textarea', description: 'Gusto, ADP, or export support.', priceLogic: '$250 setup + $75 per month suggested.' },
      { id: 'accounting_integration', label: 'Accounting integration', type: 'textarea', description: 'QuickBooks, Xero, or export mapping.', priceLogic: '$300 setup + $95 per month suggested.' },
    ],
  },
  {
    id: 'clinical-integrations',
    title: '9. Clinical integrations and medical tools',
    copy: 'This step mirrors the clinical integration and medical tooling section.',
    fields: [
      { id: 'e_prescribing', label: 'E-prescribing', type: 'textarea', description: 'Providers needing eRx, controlled substances, and identity proofing.', priceLogic: '$750 per provider setup + $99 per provider per month suggested plus vendor pass-through.' },
      { id: 'lis_integration', label: 'LIS integration', type: 'textarea', description: 'Lab connectivity and result routing.', priceLogic: '$1,500 setup + $250 per month suggested.' },
      { id: 'imaging_radiology_integration', label: 'Imaging / radiology integration', type: 'textarea', description: 'Orders, results import, and external imaging partners.', priceLogic: '$1,000 setup + $200 per month suggested.' },
      { id: 'custom_cpt_icd_logic', label: 'Custom CPT / ICD logic', type: 'textarea', description: 'Fee schedules, code preferences, and specialty rules.', priceLogic: 'Bundled up to certain scope, then custom.' },
      { id: 'document_generation', label: 'Document generation', type: 'textarea', description: 'Work notes, referral letters, summaries, and custom PDFs.', priceLogic: '$300-$1,500 setup depending on templates.' },
    ],
  },
  {
    id: 'marketing-crm',
    title: '10. Marketing CRM and growth modules',
    copy: 'This step reproduces the marketing and growth module block.',
    fields: [
      { id: 'marketing_crm', label: 'Marketing CRM', type: 'textarea', description: 'Lead tracking, source management, and outreach pipeline.', priceLogic: '$400 per month suggested.' },
      { id: 'address_book_import', label: 'Address book import', type: 'textarea', description: 'CSV or spreadsheet import of contacts.', priceLogic: '$150 one-time per cleaned import.' },
      { id: 'drip_campaigns', label: 'Drip campaigns', type: 'textarea', description: 'Email sequences, reminder campaigns, and nurture flows.', priceLogic: '$200 setup + $100 per month suggested.' },
      { id: 'marketing_email_sending_service', label: 'Marketing email sending service', type: 'textarea', description: 'Client sends or Care Axis sends on behalf.', priceLogic: 'Pass-through email costs plus service fee if managed.' },
      { id: 'call_tracking_voip', label: 'Call tracking / VOIP', type: 'textarea', description: 'Texting, calls, call routing, and assigned numbers.', priceLogic: '$250 setup + vendor usage + $100 per month platform fee.' },
    ],
  },
  {
    id: 'branding-white-label',
    title: '11. Branding, white label, website, and client experience',
    copy: 'This step maps directly to the branding and client-experience section.',
    fields: [
      { id: 'white_label_branding', label: 'White label branding', type: 'textarea', description: 'Logo, colors, custom login URL, and branded emails.', priceLogic: '$1,500 setup + $200 per month suggested.' },
      { id: 'custom_domain_dns_support', label: 'Custom domain / DNS support', type: 'textarea', description: 'DNS changes, SPF, DKIM, DMARC, and sender domain.', priceLogic: '$300 setup suggested.' },
      { id: 'website_needs', label: 'Website needs', type: 'select', description: 'Website or landing-page scope needed from Care Axis.', priceLogic: 'Custom web quote or bundled package.', options: [
        { label: 'None', value: 'none' },
        { label: 'New website', value: 'new-website' },
        { label: 'Revamp old website', value: 'revamp' },
        { label: 'Landing pages', value: 'landing-pages' },
      ] },
      { id: 'app_portal_branding_extras', label: 'App or portal branding extras', type: 'textarea', description: 'Custom graphics, UI polish, and launch assets.', priceLogic: 'Custom creative quote.' },
    ],
  },
  {
    id: 'training-support-implementation',
    title: '12. Training, support, service level, and implementation',
    copy: 'This step carries over the implementation tier and support structure section.',
    fields: [
      { id: 'implementation_tier', label: 'Implementation tier', type: 'select', description: 'Choose the rollout tier.', priceLogic: '$2,500 / $4,500 / $8,500 suggested.', required: true, options: [
        { label: 'Starter', value: 'starter' },
        { label: 'Standard', value: 'standard' },
        { label: 'Enterprise', value: 'enterprise' },
      ] },
      { id: 'training_sessions', label: 'Training sessions', type: 'textarea', description: 'Number of live sessions and role-specific tracks.', priceLogic: 'Starter 2, Standard 4, Enterprise 8 included.', required: true },
      { id: 'support_tier', label: 'Support tier', type: 'select', description: 'Support level required after launch.', priceLogic: '$0 / $300 / $1,000+ per month suggested.', required: true, options: [
        { label: 'Email only', value: 'email-only' },
        { label: 'Priority', value: 'priority' },
        { label: 'Dedicated manager', value: 'dedicated-manager' },
      ] },
      { id: 'project_management_needs', label: 'Project management needs', type: 'textarea', description: 'Single point of contact, meeting cadence, and PM hours.', priceLogic: 'Extra PM hours at $150/hr suggested.' },
      { id: 'rush_launch', label: 'Rush launch', type: 'select', description: 'Need launch in under 14 days?', priceLogic: '25% implementation rush fee suggested.', options: [
        { label: 'No', value: 'no' },
        { label: 'Yes', value: 'yes' },
      ] },
    ],
  },
  {
    id: 'billing-quote-auth',
    title: '13. Billing setup and quote authorization',
    copy: 'This step mirrors the final commercial authorization section from the questionnaire.',
    fields: [
      { id: 'billing_model', label: 'Billing model', type: 'select', description: 'How the account should be billed.', priceLogic: 'Annual prepay discount optional at 8%-12%.', required: true, options: [
        { label: 'Monthly ACH', value: 'monthly-ach' },
        { label: 'Monthly card', value: 'monthly-card' },
        { label: 'Annual prepay', value: 'annual-prepay' },
        { label: 'Milestone billing', value: 'milestone-billing' },
      ] },
      { id: 'payment_method', label: 'Payment method', type: 'select', description: 'Preferred settlement method.', priceLogic: 'Card surcharge optional if desired.', required: true, options: [
        { label: 'ACH preferred', value: 'ach' },
        { label: 'Card', value: 'card' },
        { label: 'Wire', value: 'wire' },
      ] },
      { id: 'billing_start_trigger', label: 'Billing start trigger', type: 'select', description: 'When recurring billing should begin.', priceLogic: 'Internal rule selection only.', required: true, options: [
        { label: 'At contract', value: 'contract' },
        { label: 'At kickoff', value: 'kickoff' },
        { label: 'At go-live', value: 'go-live' },
        { label: 'After migration', value: 'after-migration' },
      ] },
      { id: 'deposit_required', label: 'Deposit required', type: 'select', description: 'Required upfront deposit level.', priceLogic: 'Recommended: 50% of implementation upfront.', required: true, options: [
        { label: '0%', value: '0' },
        { label: '25%', value: '25' },
        { label: '50%', value: '50' },
        { label: 'Custom', value: 'custom' },
      ] },
      { id: 'quote_approval_contact', label: 'Quote approval contact', type: 'textarea', description: 'Who receives proposal and invoice links.', priceLogic: 'Operational only.', required: true },
      { id: 'auto_renewal_terms', label: 'Auto-renewal terms', type: 'select', description: 'Default renewal term for the account.', priceLogic: 'Affects contract template.', required: true, options: [
        { label: 'Monthly', value: 'monthly' },
        { label: 'Annual', value: 'annual' },
        { label: 'Custom term', value: 'custom' },
      ] },
    ],
  },
  {
    id: 'uploads-automation',
    title: 'Required uploads and internal automation mapping',
    copy: 'This final step preserves the upload and automation mapping block from the document.',
    fields: [
      { id: 's1_provider_signatures', label: 'S1 - Provider signatures', type: 'textarea', description: 'Needed for document generation and eRx readiness.', priceLogic: 'Automation: store in provider profile.' },
      { id: 'f1_fee_schedules', label: 'F1 - Fee schedules', type: 'textarea', description: 'Needed for billing and CPT pricing.', priceLogic: 'Automation: import fee tables.' },
      { id: 'c1_cpt_code_preferences', label: 'C1 - CPT code preferences', type: 'textarea', description: 'Needed for charge capture defaults.', priceLogic: 'Automation: map CPT library.' },
      { id: 'ic1_icd10_preferences', label: 'IC1 - ICD-10 preferences', type: 'textarea', description: 'Needed for assessment defaults.', priceLogic: 'Automation: map diagnosis favorites.' },
      { id: 'n1_sample_notes_templates', label: 'N1 - Sample notes / templates', type: 'textarea', description: 'Needed for template buildout.', priceLogic: 'Automation: create custom note package.' },
      { id: 'm1_marketing_csv_address_book', label: 'M1 - Marketing CSV / address book', type: 'textarea', description: 'Needed for CRM import.', priceLogic: 'Automation: create contacts and lists.' },
      { id: 'i1_insurance_payer_list', label: 'I1 - Insurance / payer list', type: 'textarea', description: 'Needed for insurance workflows.', priceLogic: 'Automation: map payer settings.' },
      { id: 'w1_weekly_update_template', label: 'W1 - Weekly update template', type: 'textarea', description: 'Needed for affiliate and lawyer update workflows.', priceLogic: 'Automation: create update automation template.' },
      { id: 'r1_referral_contact_list', label: 'R1 - Referral contact list', type: 'textarea', description: 'Needed for referral routing.', priceLogic: 'Automation: create contact and referral rules.' },
      { id: 'r2_referral_form_template', label: 'R2 - Referral form / template', type: 'textarea', description: 'Needed for outbound referral docs.', priceLogic: 'Automation: generate referral template.' },
      { id: 'd1_domain_dns_access_details', label: 'D1 - Domain / DNS access details', type: 'textarea', description: 'Needed for white-label and email sender setup.', priceLogic: 'Automation: trigger DNS task.' },
      { id: 'b1_billing_authorization_form', label: 'B1 - Billing authorization form', type: 'textarea', description: 'Needed for payment setup.', priceLogic: 'Automation: start ACH or card onboarding.' },
      { id: 'mig1_data_export_files', label: 'MIG1 - Data export files', type: 'textarea', description: 'Needed for migration.', priceLogic: 'Automation: create migration work order.' },
    ],
  },
];

const initialState: IntakeState = sections.reduce<IntakeState>((acc, section) => {
  section.fields.forEach((field) => {
    if (field.type === 'multiselect') {
      acc[field.id] = [];
    } else if (field.type === 'facilitylist') {
      acc[field.id] = JSON.stringify([
        { name: '', address: '', phone: '', hours: '', contact: '' },
      ]);
    } else if (field.type === 'volumeprofile') {
      acc[field.id] = JSON.stringify({
        activePatients: '',
        newPatientsPerDay: '',
        visitsPerDay: '',
        providersPerLocation: '',
      });
    } else if (field.type === 'templateprofile') {
      acc[field.id] = JSON.stringify({
        templateTypes: '',
        templateCount: '',
        sampleFilesReady: '',
        templateNotes: '',
      });
    } else {
      acc[field.id] = '';
    }
  });
  return acc;
}, {});

function isAnswered(value: string | string[]) {
  return Array.isArray(value) ? value.length > 0 : value.trim().length > 0;
}

function formatPhoneInput(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 10);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function openDatePicker(target: HTMLInputElement) {
  if (target.type !== 'date') return;

  const pickerTarget = target as HTMLInputElement & { showPicker?: () => void };
  if (typeof pickerTarget.showPicker === 'function') {
    try {
      pickerTarget.showPicker();
    } catch {
      // Ignore browsers that block programmatic picker opening.
    }
  }
}

function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

type FacilityItem = {
  name: string;
  address: string;
  phone: string;
  hours: string;
  contact: string;
};

type VolumeProfile = {
  activePatients: string;
  newPatientsPerDay: string;
  visitsPerDay: string;
  providersPerLocation: string;
};

type TemplateProfile = {
  templateTypes: string;
  templateCount: string;
  sampleFilesReady: string;
  templateNotes: string;
};

function parseFacilities(value: string | string[]): FacilityItem[] {
  if (typeof value !== 'string' || !value.trim()) {
    return [{ name: '', address: '', phone: '', hours: '', contact: '' }];
  }

  try {
    const parsed = JSON.parse(value) as FacilityItem[];
    return parsed.length > 0 ? parsed : [{ name: '', address: '', phone: '', hours: '', contact: '' }];
  } catch {
    return [{ name: '', address: '', phone: '', hours: '', contact: '' }];
  }
}

function parseVolumeProfile(value: string | string[]): VolumeProfile {
  if (typeof value !== 'string' || !value.trim()) {
    return {
      activePatients: '',
      newPatientsPerDay: '',
      visitsPerDay: '',
      providersPerLocation: '',
    };
  }

  try {
    const parsed = JSON.parse(value) as Partial<VolumeProfile>;
    return {
      activePatients: parsed.activePatients ?? '',
      newPatientsPerDay: parsed.newPatientsPerDay ?? '',
      visitsPerDay: parsed.visitsPerDay ?? '',
      providersPerLocation: parsed.providersPerLocation ?? '',
    };
  } catch {
    return {
      activePatients: '',
      newPatientsPerDay: '',
      visitsPerDay: '',
      providersPerLocation: '',
    };
  }
}

function parseTemplateProfile(value: string | string[]): TemplateProfile {
  if (typeof value !== 'string' || !value.trim()) {
    return {
      templateTypes: '',
      templateCount: '',
      sampleFilesReady: '',
      templateNotes: '',
    };
  }

  try {
    const parsed = JSON.parse(value) as Partial<TemplateProfile>;
    return {
      templateTypes: parsed.templateTypes ?? '',
      templateCount: parsed.templateCount ?? '',
      sampleFilesReady: parsed.sampleFilesReady ?? '',
      templateNotes: parsed.templateNotes ?? '',
    };
  } catch {
    return {
      templateTypes: '',
      templateCount: '',
      sampleFilesReady: '',
      templateNotes: '',
    };
  }
}

function isFacilityComplete(facility: FacilityItem) {
  const phoneDigits = facility.phone.replace(/\D/g, '');
  return Boolean(
    facility.name.trim() &&
      facility.address.trim() &&
      facility.hours.trim() &&
      facility.contact.trim() &&
      phoneDigits.length >= 10,
  );
}

function getFieldError(field: IntakeField, value: string | string[]) {
  if (field.required && !isAnswered(value)) {
    return 'This field is required.';
  }

  if (!isAnswered(value)) {
    return '';
  }

  if (field.type === 'email' && typeof value === 'string') {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value.trim())) {
      return 'Enter a valid email address.';
    }
  }

  if (field.type === 'tel' && typeof value === 'string') {
    const digits = value.replace(/\D/g, '');
    if (digits.length !== 10) {
      return 'Enter a valid phone number.';
    }
  }

  if (field.type === 'text' && typeof value === 'string' && field.required && value.trim().length < 2) {
    return 'Enter at least 2 characters.';
  }

  if (field.type === 'number' && typeof value === 'string') {
    if (!/^\d+$/.test(value.trim())) {
      return 'Enter a valid whole number.';
    }

    if (Number(value) < 1) {
      return 'Enter a number greater than 0.';
    }
  }

  if (field.type === 'textarea' && typeof value === 'string' && field.required && value.trim().length < 6) {
    return 'Add a little more detail.';
  }

  if (field.type === 'date' && typeof value === 'string' && value) {
    const today = getTodayDateString();
    if (value < today) {
      return 'Date cannot be in the past.';
    }
  }

  if (field.type === 'facilitylist' && typeof value === 'string') {
    const facilities = parseFacilities(value);
    const hasCompleteFacility = facilities.some((facility) => isFacilityComplete(facility));
    const allFacilitiesComplete = facilities.every((facility) => isFacilityComplete(facility));

    if (!hasCompleteFacility) {
      return 'Add at least one complete facility.';
    }

    if (!allFacilitiesComplete) {
      return 'Complete every added location before continuing.';
    }
  }

  if (field.type === 'volumeprofile' && typeof value === 'string') {
    const profile = parseVolumeProfile(value);
    const entries = Object.values(profile);

    if (entries.some((item) => item.trim() === '')) {
      return 'Complete all volume profile fields.';
    }

    if (entries.some((item) => !/^\d+$/.test(item) || Number(item) < 1)) {
      return 'Enter valid whole numbers for all volume fields.';
    }
  }

  if (field.type === 'templateprofile' && typeof value === 'string') {
    const profile = parseTemplateProfile(value);
    const hasAnyInput = Object.values(profile).some((item) => item.trim() !== '');

    if (!hasAnyInput) {
      return '';
    }

    if (!profile.templateTypes.trim() || !profile.templateCount.trim() || !profile.sampleFilesReady.trim()) {
      return 'Complete the required custom template fields.';
    }

    if (!/^\d+$/.test(profile.templateCount) || Number(profile.templateCount) < 1) {
      return 'Enter a valid template count.';
    }
  }

  return '';
}

function isSectionComplete(section: IntakeSection, formState: IntakeState) {
  const answeredFields = section.fields.filter((field) => isAnswered(formState[field.id]));

  if (answeredFields.length === 0) return false;

  return section.fields.every((field) => !getFieldError(field, formState[field.id]));
}

function toggleArrayValue(current: string | string[], nextValue: string) {
  const list = Array.isArray(current) ? current : [];
  return list.includes(nextValue) ? list.filter((item) => item !== nextValue) : [...list, nextValue];
}

export function OnboardingIntakeForm() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [formState, setFormState] = useState<IntakeState>(initialState);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [attemptedSections, setAttemptedSections] = useState<Record<number, boolean>>({});
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({});
  const cardTopRef = useRef<HTMLDivElement | null>(null);
  const hasMountedRef = useRef(false);

  const section = sections[step];
  const completedSections = useMemo(
    () => sections.filter((currentSection) => isSectionComplete(currentSection, formState)).length,
    [formState],
  );
  const progress = Math.round((completedSections / sections.length) * 100);
  const currentStepComplete = isSectionComplete(section, formState);
  const canGoBack = step > 0;
  const canGoForward = step < sections.length - 1;

  function updateField(id: string, value: string | string[]) {
    setFormState((current) => ({ ...current, [id]: value }));
  }

  function updateFacilities(fieldId: string, facilities: FacilityItem[]) {
    updateField(fieldId, JSON.stringify(facilities));
    markTouched(fieldId);
  }

  function updateVolumeProfile(fieldId: string, profile: VolumeProfile) {
    updateField(fieldId, JSON.stringify(profile));
    markTouched(fieldId);
  }

  function updateTemplateProfile(fieldId: string, profile: TemplateProfile) {
    updateField(fieldId, JSON.stringify(profile));
    markTouched(fieldId);
  }

  function markTouched(id: string) {
    setTouchedFields((current) => ({ ...current, [id]: true }));
  }

  function getSectionFirstError(currentSection: IntakeSection) {
    return currentSection.fields.find((field) => getFieldError(field, formState[field.id]));
  }

  function focusField(fieldId: string) {
    const target = fieldRefs.current[fieldId];
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if ('focus' in target) {
      window.setTimeout(() => {
        (target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).focus();
      }, 160);
    }
  }

  function goNext() {
    const firstError = getSectionFirstError(section);
    if (firstError) {
      setAttemptedSections((current) => ({ ...current, [step]: true }));
      focusField(firstError.id);
      return;
    }

    setStep((current) => Math.min(current + 1, sections.length - 1));
  }

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    cardTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const firstError = getSectionFirstError(section);
    if (firstError) {
      setAttemptedSections((current) => ({ ...current, [step]: true }));
      focusField(firstError.id);
      return;
    }
    setSubmitted(true);
  }

  const selectedSpecialties = Array.isArray(formState.primary_specialties) ? formState.primary_specialties : [];
  const implementationTier = String(formState.implementation_tier || 'pending');
  const billingModel = String(formState.billing_model || 'pending');
  const locations = String(formState.number_of_locations || 'pending');
  const migrationScope = String(formState.data_to_migrate || 'pending');
  const fieldGroups = section.fields.reduce<Array<{ name: string; fields: IntakeField[] }>>((acc, field) => {
    const groupName = field.group ?? 'Details';
    const existing = acc.find((item) => item.name === groupName);
    if (existing) {
      existing.fields.push(field);
    } else {
      acc.push({ name: groupName, fields: [field] });
    }
    return acc;
  }, []);

  return (
    <div className="onboarding-shell">
      <div className="onboarding-card-wrap">
      <div ref={cardTopRef} className="onboarding-scroll-anchor" />
      <div className="onboarding-main card">
        <div className="onboarding-header">
          <div>
            <p className="panel-title">Full Questionnaire Flow</p>
            <h3>{section.title}</h3>
            <p className="muted" style={{ marginBottom: 0 }}>{section.copy}</p>
          </div>
          <div className="onboarding-progress-chip">
            <strong>{progress}%</strong>
            <span>{completedSections} of {sections.length} questionnaire sections complete</span>
          </div>
        </div>

        <div className="onboarding-progress-bar" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>

        <div className="onboarding-stepper-compact" aria-label="Onboarding steps">
          <div className="onboarding-stepper-topline">
            <div className="onboarding-step-meta">
              <span className="onboarding-step-count">Step {step + 1} of {sections.length}</span>
              <strong>{section.title.replace(/^[0-9]+\. /, '')}</strong>
            </div>
            <div className="onboarding-step-jump">
              <label htmlFor="step_jump" className="sr-only">Jump to section</label>
              <select
                id="step_jump"
                value={section.id}
                onChange={(event) => {
                  const nextIndex = sections.findIndex((item) => item.id === event.target.value);
                  if (nextIndex === -1) return;
                  if (nextIndex > step && !sections.slice(0, nextIndex).every((previous) => isSectionComplete(previous, formState))) {
                    return;
                  }
                  setStep(nextIndex);
                }}
              >
                {sections.map((item, index) => {
                  const locked = index > step && !sections.slice(0, index).every((previous) => isSectionComplete(previous, formState));
                  return (
                    <option key={item.id} value={item.id} disabled={locked}>
                      {index + 1}. {item.title.replace(/^[0-9]+\. /, '')}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="onboarding-stepper-nav">
            <button
              type="button"
              className="onboarding-nav-btn"
              disabled={!canGoBack}
              onClick={() => setStep((current) => Math.max(current - 1, 0))}
            >
              Previous
            </button>

            <div className="onboarding-step-dots" aria-hidden="true">
              {sections.map((item, index) => (
                <span
                  key={item.id}
                  className={`onboarding-step-dot ${index === step ? 'active' : ''} ${isSectionComplete(item, formState) ? 'done' : ''}`}
                />
              ))}
            </div>

            <button
              type="button"
              className="onboarding-nav-btn"
              disabled={!canGoForward}
              onClick={goNext}
            >
              Next
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="onboarding-group-stack">
            {fieldGroups.map((group) => (
              <section className="onboarding-field-group" key={group.name}>
                {fieldGroups.length > 1 && group.fields.length > 1 ? (
                  <div className="onboarding-field-group-head">
                    <h4>{group.name}</h4>
                  </div>
                ) : null}

                <div className="form-grid">
                  {group.fields.map((field) => (
              <div key={field.id} className={`form-field ${field.type === 'textarea' || field.type === 'multiselect' || field.type === 'facilitylist' || field.type === 'volumeprofile' || field.type === 'templateprofile' ? 'form-field-full' : ''}`}>
                <label htmlFor={field.id}>
                  {field.label}
                  {field.required ? ' *' : ''}
                </label>
                {touchedFields[field.id] || attemptedSections[step] ? (
                  getFieldError(field, formState[field.id]) ? <div className="field-error">{getFieldError(field, formState[field.id])}</div> : null
                ) : null}

                {field.type === 'text' || field.type === 'email' || field.type === 'tel' || field.type === 'date' || field.type === 'number' ? (
                  <input
                    id={field.id}
                    type={field.type}
                    value={String(formState[field.id] || '')}
                    min={field.id === 'target_go_live_date' ? getTodayDateString() : undefined}
                    step={field.type === 'number' ? '1' : undefined}
                    ref={(node) => {
                      fieldRefs.current[field.id] = node;
                    }}
                    onChange={(event) =>
                      updateField(
                        field.id,
                        field.type === 'tel'
                          ? formatPhoneInput(event.target.value)
                          : field.type === 'number'
                            ? event.target.value.replace(/[^\d]/g, '')
                            : event.target.value,
                      )
                    }
                    onFocus={(event) => {
                      if (field.type === 'date') {
                        openDatePicker(event.currentTarget);
                      }
                    }}
                    onClick={(event) => {
                      if (field.type === 'date') {
                        openDatePicker(event.currentTarget);
                      }
                    }}
                    onBlur={() => markTouched(field.id)}
                    aria-invalid={Boolean((touchedFields[field.id] || attemptedSections[step]) && getFieldError(field, formState[field.id]))}
                    className={(touchedFields[field.id] || attemptedSections[step]) && getFieldError(field, formState[field.id]) ? 'field-invalid' : ''}
                    placeholder={field.placeholder}
                  />
                ) : null}

                {field.type === 'textarea' ? (
                  <textarea
                    id={field.id}
                    rows={4}
                    value={String(formState[field.id] || '')}
                    ref={(node) => {
                      fieldRefs.current[field.id] = node;
                    }}
                    onChange={(event) => updateField(field.id, event.target.value)}
                    onBlur={() => markTouched(field.id)}
                    aria-invalid={Boolean((touchedFields[field.id] || attemptedSections[step]) && getFieldError(field, formState[field.id]))}
                    className={(touchedFields[field.id] || attemptedSections[step]) && getFieldError(field, formState[field.id]) ? 'field-invalid' : ''}
                    placeholder={field.placeholder}
                  />
                ) : null}

                {field.type === 'select' ? (
                  <select
                    id={field.id}
                    value={String(formState[field.id] || '')}
                    ref={(node) => {
                      fieldRefs.current[field.id] = node;
                    }}
                    onChange={(event) => updateField(field.id, event.target.value)}
                    onBlur={() => markTouched(field.id)}
                    aria-invalid={Boolean((touchedFields[field.id] || attemptedSections[step]) && getFieldError(field, formState[field.id]))}
                    className={(touchedFields[field.id] || attemptedSections[step]) && getFieldError(field, formState[field.id]) ? 'field-invalid' : ''}
                  >
                    <option value="">{field.placeholder ?? 'Select an option'}</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : null}

                {field.type === 'multiselect' ? (
                  <div
                    className={`selection-grid ${(touchedFields[field.id] || attemptedSections[step]) && getFieldError(field, formState[field.id]) ? 'selection-grid-invalid' : ''}`}
                    ref={(node) => {
                      fieldRefs.current[field.id] = node;
                    }}
                  >
                    {field.options?.map((option) => {
                      const currentValue = formState[field.id];
                      const checked = Array.isArray(currentValue) ? currentValue.includes(option.value) : false;
                      return (
                        <label className="selection-card" key={option.value}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              updateField(field.id, toggleArrayValue(currentValue, option.value));
                              markTouched(field.id);
                            }}
                          />
                          <span>{option.label}</span>
                        </label>
                      );
                    })}
                  </div>
                ) : null}

                {field.type === 'facilitylist' ? (
                  <div
                    className={`facility-list ${(touchedFields[field.id] || attemptedSections[step]) && getFieldError(field, formState[field.id]) ? 'selection-grid-invalid' : ''}`}
                    ref={(node) => {
                      fieldRefs.current[field.id] = node;
                    }}
                  >
                    {parseFacilities(formState[field.id]).map((facility, facilityIndex, facilities) => (
                      <div className={`facility-card ${!isFacilityComplete(facility) && (touchedFields[field.id] || attemptedSections[step]) ? 'facility-card-invalid' : ''}`} key={`${field.id}-${facilityIndex}`}>
                        <div className="facility-card-head">
                          <strong>Location {facilityIndex + 1}</strong>
                          {facilities.length > 1 ? (
                            <button
                              type="button"
                              className="facility-remove-btn"
                              onClick={() => updateFacilities(field.id, facilities.filter((_, index) => index !== facilityIndex))}
                            >
                              Remove
                            </button>
                          ) : null}
                        </div>

                        <div className="form-grid">
                          <div className="form-field">
                            <label htmlFor={`${field.id}_name_${facilityIndex}`}>Location name</label>
                            <input
                              id={`${field.id}_name_${facilityIndex}`}
                              value={facility.name}
                              onChange={(event) => {
                                const next = [...facilities];
                                next[facilityIndex] = { ...facility, name: event.target.value };
                                updateFacilities(field.id, next);
                              }}
                              placeholder="Main clinic"
                            />
                          </div>
                          <div className="form-field">
                            <label htmlFor={`${field.id}_phone_${facilityIndex}`}>Phone</label>
                            <input
                              id={`${field.id}_phone_${facilityIndex}`}
                              value={facility.phone}
                              onChange={(event) => {
                                const next = [...facilities];
                                next[facilityIndex] = { ...facility, phone: formatPhoneInput(event.target.value) };
                                updateFacilities(field.id, next);
                              }}
                              placeholder="(555) 000-0000"
                            />
                          </div>
                          <div className="form-field form-field-full">
                            <label htmlFor={`${field.id}_address_${facilityIndex}`}>Address</label>
                            <textarea
                              id={`${field.id}_address_${facilityIndex}`}
                              rows={3}
                              value={facility.address}
                              onChange={(event) => {
                                const next = [...facilities];
                                next[facilityIndex] = { ...facility, address: event.target.value };
                                updateFacilities(field.id, next);
                              }}
                              placeholder="Street, city, state, ZIP"
                            />
                          </div>
                          <div className="form-field">
                            <label htmlFor={`${field.id}_hours_${facilityIndex}`}>Hours</label>
                            <input
                              id={`${field.id}_hours_${facilityIndex}`}
                              value={facility.hours}
                              onChange={(event) => {
                                const next = [...facilities];
                                next[facilityIndex] = { ...facility, hours: event.target.value };
                                updateFacilities(field.id, next);
                              }}
                              placeholder="Mon-Fri 8am-5pm"
                            />
                          </div>
                          <div className="form-field">
                            <label htmlFor={`${field.id}_contact_${facilityIndex}`}>Contact person</label>
                            <input
                              id={`${field.id}_contact_${facilityIndex}`}
                              value={facility.contact}
                              onChange={(event) => {
                                const next = [...facilities];
                                next[facilityIndex] = { ...facility, contact: event.target.value };
                                updateFacilities(field.id, next);
                              }}
                              placeholder="Office manager name"
                            />
                          </div>
                        </div>

                        {!isFacilityComplete(facility) && (touchedFields[field.id] || attemptedSections[step]) ? (
                          <div className="field-error">Complete location name, address, valid phone, hours, and contact person before continuing.</div>
                        ) : null}
                      </div>
                    ))}

                    <button
                      type="button"
                      className="facility-add-btn"
                      disabled={!isFacilityComplete(parseFacilities(formState[field.id]).slice(-1)[0])}
                      onClick={() =>
                        updateFacilities(field.id, [
                          ...parseFacilities(formState[field.id]),
                          { name: '', address: '', phone: '', hours: '', contact: '' },
                        ])
                      }
                    >
                      <span className="facility-add-icon" aria-hidden="true">+</span>
                      <span className="facility-add-copy">
                        <strong>Add Another Location</strong>
                        <small>Create a new facility entry</small>
                      </span>
                    </button>
                  </div>
                ) : null}

                {field.type === 'volumeprofile' ? (
                  <div
                    className={`volume-profile-grid ${(touchedFields[field.id] || attemptedSections[step]) && getFieldError(field, formState[field.id]) ? 'selection-grid-invalid' : ''}`}
                    ref={(node) => {
                      fieldRefs.current[field.id] = node;
                    }}
                  >
                    {(() => {
                      const profile = parseVolumeProfile(formState[field.id]);
                      const profileFields: Array<{ key: keyof VolumeProfile; label: string; placeholder: string }> = [
                        { key: 'activePatients', label: 'Active patients', placeholder: 'Enter active patients' },
                        { key: 'newPatientsPerDay', label: 'New patients per day', placeholder: 'Enter new patients per day' },
                        { key: 'visitsPerDay', label: 'Visits per day', placeholder: 'Enter visits per day' },
                        { key: 'providersPerLocation', label: 'Providers per location', placeholder: 'Enter providers per location' },
                      ];

                      return profileFields.map((profileField) => (
                        <div className="form-field" key={profileField.key}>
                          <label htmlFor={`${field.id}_${profileField.key}`}>{profileField.label}</label>
                          <input
                            id={`${field.id}_${profileField.key}`}
                            type="number"
                            min="1"
                            step="1"
                            value={profile[profileField.key]}
                            onChange={(event) =>
                              updateVolumeProfile(field.id, {
                                ...profile,
                                [profileField.key]: event.target.value.replace(/[^\d]/g, ''),
                              })
                            }
                            placeholder={profileField.placeholder}
                          />
                        </div>
                      ));
                    })()}
                  </div>
                ) : null}

                {field.type === 'templateprofile' ? (
                  <div
                    className={`template-profile-grid ${(touchedFields[field.id] || attemptedSections[step]) && getFieldError(field, formState[field.id]) ? 'selection-grid-invalid' : ''}`}
                    ref={(node) => {
                      fieldRefs.current[field.id] = node;
                    }}
                  >
                    {(() => {
                      const profile = parseTemplateProfile(formState[field.id]);
                      return (
                        <>
                          <div className="form-field">
                            <label htmlFor={`${field.id}_templateTypes`}>Template types</label>
                            <input
                              id={`${field.id}_templateTypes`}
                              type="text"
                              value={profile.templateTypes}
                              onChange={(event) =>
                                updateTemplateProfile(field.id, { ...profile, templateTypes: event.target.value })
                              }
                              placeholder="Enter template types"
                            />
                          </div>
                          <div className="form-field">
                            <label htmlFor={`${field.id}_templateCount`}>Number of templates</label>
                            <input
                              id={`${field.id}_templateCount`}
                              type="number"
                              min="1"
                              step="1"
                              value={profile.templateCount}
                              onChange={(event) =>
                                updateTemplateProfile(field.id, {
                                  ...profile,
                                  templateCount: event.target.value.replace(/[^\d]/g, ''),
                                })
                              }
                              placeholder="Enter number of templates"
                            />
                          </div>
                          <div className="form-field">
                            <label htmlFor={`${field.id}_sampleFilesReady`}>Sample files ready</label>
                            <select
                              id={`${field.id}_sampleFilesReady`}
                              value={profile.sampleFilesReady}
                              onChange={(event) =>
                                updateTemplateProfile(field.id, { ...profile, sampleFilesReady: event.target.value })
                              }
                            >
                              <option value="">Select file status</option>
                              <option value="yes">Yes</option>
                              <option value="no">No</option>
                              <option value="partial">Partial</option>
                            </select>
                          </div>
                          <div className="form-field form-field-full">
                            <label htmlFor={`${field.id}_templateNotes`}>Notes</label>
                            <textarea
                              id={`${field.id}_templateNotes`}
                              rows={4}
                              value={profile.templateNotes}
                              onChange={(event) =>
                                updateTemplateProfile(field.id, { ...profile, templateNotes: event.target.value })
                              }
                              placeholder="Enter custom template notes"
                            />
                          </div>
                        </>
                      );
                    })()}
                  </div>
                ) : null}
              </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="onboarding-actions">
            <button type="button" className="btn ghost" onClick={() => setStep((current) => Math.max(current - 1, 0))} disabled={step === 0}>
              Back
            </button>

            {step < sections.length - 1 ? (
              <button
                type="button"
                className="btn primary"
                onClick={goNext}
              >
                Continue
              </button>
            ) : (
              <button type="submit" className="btn primary">
                Save Full Intake
              </button>
            )}
          </div>
        </form>

        {submitted ? (
          <div className="form-response success">
            <p style={{ marginTop: 0, marginBottom: 10 }}>
              The full Care Axis questionnaire structure is now represented on this page, including all core sections,
              billing logic inputs, and required upload mappings from the source document.
            </p>
            <div className="onboarding-step-grid">
              <article className="onboarding-step done">
                <strong>Questionnaire complete</strong>
                <span>All 13 intake sections plus the upload mapping block are available as guided steps.</span>
              </article>
              <article className="onboarding-step done">
                <strong>Ops-ready structure</strong>
                <span>Each prompt carries the operational description and pricing logic note from the document.</span>
              </article>
              <article className="onboarding-step done">
                <strong>Client-facing flow</strong>
                <span>The experience stays polished while keeping the original sequence intact.</span>
              </article>
              <article className="onboarding-step done">
                <strong>Next integration step</strong>
                <span>This can now be wired into quote generation, onboarding tasks, and persistence.</span>
              </article>
            </div>
          </div>
        ) : null}
      </div>
      </div>

      <aside className="onboarding-sidebar">
        <div className="card onboarding-sidebar-card">
          <p className="panel-title">Questionnaire Mirror</p>
          <div className="onboarding-kpi-grid">
            <div className="onboarding-kpi">
              <span>Sections</span>
              <strong>{sections.length}</strong>
            </div>
            <div className="onboarding-kpi">
              <span>Completed</span>
              <strong>{completedSections}</strong>
            </div>
            <div className="onboarding-kpi">
              <span>Specialties</span>
              <strong>{selectedSpecialties.length || 0}</strong>
            </div>
            <div className="onboarding-kpi">
              <span>Implementation tier</span>
              <strong>{implementationTier}</strong>
            </div>
          </div>

          <div className="onboarding-summary-block">
            <span>Scope snapshot</span>
            <ul className="list" style={{ marginBottom: 0 }}>
              <li>Locations: {locations}</li>
              <li>Billing model: {billingModel}</li>
              <li>Migration scope: {migrationScope || 'pending'}</li>
              <li>White-label section preserved in step 11</li>
            </ul>
          </div>

          <div className="onboarding-summary-block">
            <span>Document alignment</span>
            <p className="small" style={{ marginBottom: 0 }}>
              The stepper now follows the questionnaire’s original sequence: legal setup, org structure, specialty profile,
              users and portals, migration, pricing modules, PI workflows, billing services, clinical integrations, marketing,
              branding, implementation, quote authorization, and upload mapping.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
