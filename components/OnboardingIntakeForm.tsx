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
  min?: number;
  max?: number;
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
      { id: 'provider_seat_total', label: 'Total provider seats', type: 'number', group: 'Provider Seats', description: 'Total provider logins across all provider types.', priceLogic: 'Base includes up to 5 provider seats; then per-seat.', required: true, min: 1, placeholder: 'e.g. 7' },
      { id: 'provider_seats_md_do', label: 'MD / DO seats', type: 'number', group: 'Provider Seats', description: 'Attending / supervising physicians.', min: 0, placeholder: '0' },
      { id: 'provider_seats_np_pa', label: 'NP / PA seats', type: 'number', group: 'Provider Seats', description: 'Midlevel providers.', min: 0, placeholder: '0' },
      { id: 'provider_seats_pt_ot', label: 'PT / OT seats', type: 'number', group: 'Provider Seats', description: 'Therapy providers needing clinical access.', min: 0, placeholder: '0' },
      { id: 'provider_seats_dc', label: 'Chiropractor (DC) seats', type: 'number', group: 'Provider Seats', description: 'Chiropractic providers.', min: 0, placeholder: '0' },
      { id: 'provider_seats_other', label: 'Other provider seats', type: 'number', group: 'Provider Seats', description: 'Any other provider category not listed above.', min: 0, placeholder: '0' },
      { id: 'provider_seats_other_notes', label: 'Other provider types (notes)', type: 'textarea', group: 'Provider Seats', description: 'If you entered other provider seats, list the provider types and any special access needs.', priceLogic: 'Used to provision correct provider permissions.', placeholder: 'Example: X-ray tech (2), nutritionist (1) — view-only chart access.' },
      { id: 'supervising_relationship_notes', label: 'Supervising relationships', type: 'textarea', group: 'Provider Seats', description: 'Describe supervision (who supervises whom) and any required co-sign workflows.', priceLogic: 'Required to configure supervision, co-sign, and restricted orders.', placeholder: 'Example: 3 NP/PA supervised by 2 MDs; co-sign required for orders and controlled meds.' },

      { id: 'staff_seat_total', label: 'Total internal staff seats', type: 'number', group: 'Internal Staff Seats', description: 'All non-provider internal users needing logins.', priceLogic: 'Base includes 10 staff seats; then per-seat.', required: true, min: 0, placeholder: 'e.g. 12' },
      { id: 'staff_seats_admin', label: 'Admin seats', type: 'number', group: 'Internal Staff Seats', description: 'System admins / superusers.', min: 0, placeholder: '0' },
      { id: 'staff_seats_front_desk', label: 'Front desk seats', type: 'number', group: 'Internal Staff Seats', description: 'Scheduling, intake, and check-in.', min: 0, placeholder: '0' },
      { id: 'staff_seats_ma', label: 'MA / clinical support seats', type: 'number', group: 'Internal Staff Seats', description: 'MA, scribe, clinical support.', min: 0, placeholder: '0' },
      { id: 'staff_seats_billing', label: 'Billing seats', type: 'number', group: 'Internal Staff Seats', description: 'Billing, RCM, collections.', min: 0, placeholder: '0' },
      { id: 'staff_seats_marketing', label: 'Marketing seats', type: 'number', group: 'Internal Staff Seats', description: 'CRM, campaigns, lead management.', min: 0, placeholder: '0' },
      { id: 'staff_seats_call_center', label: 'Call center seats', type: 'number', group: 'Internal Staff Seats', description: 'Inbound / outbound calls and follow-ups.', min: 0, placeholder: '0' },
      { id: 'staff_seats_executives', label: 'Executive seats', type: 'number', group: 'Internal Staff Seats', description: 'Executive / read-only reporting users.', min: 0, placeholder: '0' },
      { id: 'staff_seat_notes', label: 'Staff access notes', type: 'textarea', group: 'Internal Staff Seats', description: 'Anything special about internal access (multi-location restrictions, read-only executives, etc.).', priceLogic: 'Used to map default role policies.', placeholder: 'Example: executives need read-only dashboards; front desk limited to Location A.' },

      { id: 'law_firm_portal_org_count', label: 'Law firm portal orgs (count)', type: 'number', group: 'Law Firm Portal', description: 'How many law firm organizations require portal access.', priceLogic: '$250 per firm portal org / month suggested.', required: true, min: 0, placeholder: '0' },
      { id: 'law_firm_portal_org_details', label: 'Firm names and contacts', type: 'textarea', group: 'Law Firm Portal', description: 'List firm names, primary contacts, and any special permissions.', placeholder: 'Example:\nSmith Law — jane@smithlaw.com\nGarcia & Co — ops@garciaco.com' },
      { id: 'law_firm_portal_permission_model', label: 'Portal permissions', type: 'select', group: 'Law Firm Portal', description: 'Default portal permission profile for firms.', priceLogic: 'Custom permissions may increase onboarding scope.', placeholder: 'Select permissions', options: [
        { label: 'View-only updates', value: 'view-only' },
        { label: 'Collaborate (upload + comments)', value: 'collaborate' },
        { label: 'Records requests + approvals', value: 'records-requests' },
        { label: 'Custom', value: 'custom' },
      ] },
      { id: 'law_firm_portal_matter_visibility', label: 'Matter visibility', type: 'select', group: 'Law Firm Portal', description: 'How firms should see matters / cases in the portal.', priceLogic: 'Per-firm visibility rules can add setup time.', placeholder: 'Select visibility', options: [
        { label: 'Assigned-only (recommended)', value: 'assigned-only' },
        { label: 'All matters for the firm', value: 'all-for-firm' },
        { label: 'By location / office', value: 'by-location' },
        { label: 'Custom', value: 'custom' },
      ] },

      { id: 'affiliate_portal_org_count', label: 'Affiliate / facility portal orgs (count)', type: 'number', group: 'Affiliate / Facility Portal', description: 'How many affiliate clinic groups require portal access.', priceLogic: '$250 per affiliate org / month suggested.', required: true, min: 0, placeholder: '0' },
      { id: 'affiliate_portal_org_details', label: 'Affiliate org names and contacts', type: 'textarea', group: 'Affiliate / Facility Portal', description: 'List org names and primary contacts for portal access.', placeholder: 'Example:\nImaging Center A — portal@imaginga.com\nPT Network B — admin@ptnetworkb.com' },
      { id: 'affiliate_portal_use_cases', label: 'Portal use cases', type: 'multiselect', group: 'Affiliate / Facility Portal', description: 'What affiliates need to do inside the portal.', priceLogic: 'Used to scope portal modules and notifications.', options: [
        { label: 'Referrals', value: 'referrals' },
        { label: 'Weekly updates', value: 'weekly-updates' },
        { label: 'Document upload', value: 'document-upload' },
        { label: 'Payment status / invoices', value: 'payment-status' },
        { label: 'Scheduling requests', value: 'scheduling' },
        { label: 'Custom', value: 'custom' },
      ] },
      { id: 'affiliate_portal_permission_model', label: 'Portal permissions', type: 'select', group: 'Affiliate / Facility Portal', description: 'Default portal permission profile for affiliates.', priceLogic: 'Custom permissions may increase onboarding scope.', placeholder: 'Select permissions', options: [
        { label: 'View-only updates', value: 'view-only' },
        { label: 'Upload + status tracking', value: 'upload-status' },
        { label: 'Collaborate (tasks + messages)', value: 'collaborate' },
        { label: 'Custom', value: 'custom' },
      ] },

      { id: 'rbac_mode', label: 'RBAC approach', type: 'select', group: 'RBAC & Permissions', description: 'Standard role matrix or custom role-based access controls.', priceLogic: 'Complex custom RBAC may add setup fee.', required: true, placeholder: 'Select RBAC approach', options: [
        { label: 'Standard roles (recommended)', value: 'standard' },
        { label: 'Custom RBAC', value: 'custom' },
      ] },
      { id: 'role_permissions_matrix', label: 'Role permissions matrix', type: 'textarea', group: 'RBAC & Permissions', description: 'Read / write / export / admin privileges by role. Paste your matrix or describe the rules.', priceLogic: 'Complex custom RBAC may add setup fee.', required: true, placeholder: 'Example: Front desk = read/write scheduling; Billing = export + claims; Executives = read-only dashboards.' },
      { id: 'rbac_notes', label: 'Custom RBAC notes', type: 'textarea', group: 'RBAC & Permissions', description: 'If you selected custom RBAC, describe required roles, restrictions, and any compliance constraints.', priceLogic: 'May require additional setup and testing.', placeholder: 'Example: Location-scoped access for all staff; portal users restricted by matter ownership.' },

      { id: 'training_by_role', label: 'Training by role', type: 'multiselect', group: 'Training', description: 'Which roles need onboarding tracks.', priceLogic: 'Priced in onboarding tier.', required: true, options: [
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
      { id: 'current_emr_source_systems', label: 'Current EMR / source systems', type: 'textarea', group: 'Source Systems', description: 'Name your current EMR, CRM, spreadsheets, and any paper-chart sources.', priceLogic: 'Migration quote based on source complexity.', required: true, placeholder: 'Example: ChiroTouch (EMR), Google Sheets scheduling, paper intake forms.' },
      { id: 'source_system_access_level', label: 'Access level to source systems', type: 'select', group: 'Source Systems', description: 'What level of access do you have for exports and configuration?', priceLogic: 'Limited access may require vendor services.', required: true, placeholder: 'Select access level', options: [
        { label: 'Full admin access', value: 'admin' },
        { label: 'Standard user access', value: 'standard' },
        { label: 'Vendor-managed only', value: 'vendor-only' },
        { label: 'Not sure yet', value: 'unknown' },
      ] },
      { id: 'export_readiness', label: 'Export readiness', type: 'select', group: 'Source Systems', description: 'How quickly can you produce exports from the current systems?', priceLogic: 'Vendor dependencies can extend timeline.', required: true, placeholder: 'Select readiness', options: [
        { label: 'Exports available now', value: 'ready' },
        { label: 'Need vendor / IT support', value: 'need-vendor' },
        { label: 'Not sure yet', value: 'unknown' },
      ] },
      { id: 'data_to_migrate', label: 'Data to migrate', type: 'textarea', group: 'Migration Dataset', description: 'Patients, appointments, balances, notes, documents, providers, firms, referral sources, templates, fee schedules, and any custom fields.', priceLogic: 'Tiered migration fee.', required: true, placeholder: 'List what must come over on day 1 vs. later (if phased).' },
      { id: 'day1_data_requirements', label: 'Day-1 requirements (must-have)', type: 'multiselect', group: 'Migration Dataset', description: 'Select what must be live at go-live on day 1.', priceLogic: 'Day-1 scope drives launch timeline.', required: true, options: [
        { label: 'Patients / demographics', value: 'patients' },
        { label: 'Appointments / schedule', value: 'appointments' },
        { label: 'Balances / AR', value: 'balances' },
        { label: 'Clinical notes', value: 'notes' },
        { label: 'Documents / attachments', value: 'documents' },
        { label: 'Provider profiles', value: 'providers' },
        { label: 'Law firms / affiliates', value: 'firms-affiliates' },
        { label: 'Templates', value: 'templates' },
        { label: 'Fee schedules', value: 'fee-schedules' },
        { label: 'Other', value: 'other' },
      ] },
      { id: 'day1_other_notes', label: 'Day-1 other requirements (notes)', type: 'textarea', group: 'Migration Dataset', description: 'If you selected Other, describe the day-1 requirement.', priceLogic: 'Used to prevent day-1 blockers.', placeholder: 'Example: imaging results import for the last 30 days.' },
      { id: 'approximate_chart_count', label: 'Approximate chart count', type: 'textarea', group: 'Migration Dataset', description: 'Active charts and total historical charts (and date range if known).', priceLogic: '$0.75-$2.50 per chart depending on structure.', required: true, placeholder: 'Example: Active ~2,100; Historical ~18,000; 2016–present.' },
      { id: 'historical_scope_window', label: 'Historical scope window', type: 'select', group: 'Migration Dataset', description: 'How much history needs to be queryable inside Care Axis?', priceLogic: 'More history increases migration volume and QA time.', required: true, placeholder: 'Select window', options: [
        { label: 'Day-1 only (no history)', value: 'day1-only' },
        { label: 'Last 12 months', value: '12-months' },
        { label: 'Last 24 months', value: '24-months' },
        { label: 'All available history', value: 'all-history' },
        { label: 'Custom', value: 'custom' },
      ] },
      { id: 'historical_scope_custom_notes', label: 'Historical scope (custom notes)', type: 'textarea', group: 'Migration Dataset', description: 'If custom, define the date range or rules for historical data.', priceLogic: 'Used to scope the dataset and cutover plan.', placeholder: 'Example: migrate all patients + last 3 years of notes; older docs archived only.' },
      { id: 'file_types', label: 'File types', type: 'multiselect', group: 'File Types', description: 'Select what you have available for migration.', priceLogic: 'Unstructured files increase scope.', required: true, options: [
        { label: 'CSV', value: 'csv' },
        { label: 'PDF', value: 'pdf' },
        { label: 'Images (JPG/PNG)', value: 'images' },
        { label: 'Structured export (JSON/XML)', value: 'structured-export' },
        { label: 'API access', value: 'api-access' },
        { label: 'Other', value: 'other' },
      ] },
      { id: 'file_types_other_notes', label: 'Other file types (notes)', type: 'textarea', group: 'File Types', description: 'If you selected Other, describe the file types and where they live.', priceLogic: 'Used to scope parsing and cleansing.', placeholder: 'Example: TIFF scans in a shared drive; DOCX templates; proprietary export format.' },
      { id: 'structured_export_format', label: 'Structured export format', type: 'select', group: 'File Types', description: 'If structured export is available, select the format.', priceLogic: 'Mapping effort depends on format quality.', placeholder: 'Select format', options: [
        { label: 'JSON', value: 'json' },
        { label: 'XML', value: 'xml' },
        { label: 'FHIR', value: 'fhir' },
        { label: 'HL7', value: 'hl7' },
        { label: 'Other', value: 'other' },
      ] },
      { id: 'api_access_details', label: 'API access details', type: 'textarea', group: 'File Types', description: 'If API access is available, share vendor/API name, auth method, and any constraints.', priceLogic: 'API migrations may add engineering scope.', placeholder: 'Example: Vendor API + OAuth2; rate-limited; sandbox available.' },
      { id: 'file_delivery_method', label: 'File delivery method', type: 'select', group: 'Transfer & Security', description: 'How will the exports/files be transferred to Care Axis securely?', priceLogic: 'Some methods add coordination steps.', required: true, placeholder: 'Select delivery method', options: [
        { label: 'Secure upload portal', value: 'secure-upload' },
        { label: 'SFTP', value: 'sftp' },
        { label: 'Encrypted drive link', value: 'encrypted-link' },
        { label: 'Vendor portal / handoff', value: 'vendor-portal' },
        { label: 'Other', value: 'other' },
      ] },
      { id: 'phi_security_requirements', label: 'PHI security requirements', type: 'textarea', group: 'Transfer & Security', description: 'Any required encryption standards, BAAs, access constraints, or audit requirements.', priceLogic: 'Additional security requirements can extend setup.', placeholder: 'Example: SFTP only, named users, audit logs for downloads, BAA on file.' },
      { id: 'data_quality_risks', label: 'Data quality risks', type: 'multiselect', group: 'Data Quality', description: 'Select any known issues in the source data.', priceLogic: 'High cleanup can add migration scope.', options: [
        { label: 'Duplicates', value: 'duplicates' },
        { label: 'Missing identifiers (DOB/MRN)', value: 'missing-identifiers' },
        { label: 'Inconsistent providers', value: 'inconsistent-providers' },
        { label: 'Unstructured notes', value: 'unstructured-notes' },
        { label: 'Scanned docs need OCR', value: 'ocr-needed' },
        { label: 'Other', value: 'other' },
      ] },
      { id: 'data_quality_notes', label: 'Data quality notes', type: 'textarea', group: 'Data Quality', description: 'Describe data issues and any cleanup you want Care Axis to handle.', priceLogic: 'Used to scope cleansing + validation.', placeholder: 'Example: duplicate patients across two systems; missing MRNs; scanned PDFs only.' },
      { id: 'cutover_strategy', label: 'Cutover strategy', type: 'select', group: 'Cutover', description: 'Preferred migration and launch sequencing.', priceLogic: 'Phased launches may add PM hours.', required: true, options: [
        { label: 'Big bang', value: 'big-bang' },
        { label: 'Phased', value: 'phased' },
        { label: 'By location', value: 'by-location' },
        { label: 'By specialty', value: 'by-specialty' },
      ] },
      { id: 'cutover_window', label: 'Cutover window', type: 'select', group: 'Cutover', description: 'Preferred cutover window for final sync and go-live.', priceLogic: 'After-hours cutovers can add PM time.', required: true, placeholder: 'Select window', options: [
        { label: 'Weekday daytime', value: 'weekday-day' },
        { label: 'Weekday after-hours', value: 'weekday-after-hours' },
        { label: 'Weekend', value: 'weekend' },
        { label: 'Not sure yet', value: 'unknown' },
      ] },
      { id: 'downtime_tolerance', label: 'Downtime tolerance', type: 'select', group: 'Cutover', description: 'How much downtime can you tolerate during cutover?', priceLogic: 'Lower downtime tolerance can increase complexity.', required: true, placeholder: 'Select tolerance', options: [
        { label: 'No downtime (parallel run)', value: 'none' },
        { label: 'Up to 2 hours', value: '2-hours' },
        { label: 'Up to 1 day', value: '1-day' },
        { label: 'Flexible', value: 'flexible' },
      ] },
      { id: 'phased_cutover_plan_notes', label: 'Phased cutover plan (notes)', type: 'textarea', group: 'Cutover', description: 'If phased / by location / by specialty, describe the phases and order.', priceLogic: 'Used to build a rollout plan and dependencies.', placeholder: 'Example: start with Location A for 2 weeks, then Location B; specialty ortho last.' },
      { id: 'legacy_retention', label: 'Legacy retention', type: 'select', group: 'Retention', description: 'Is a read-only archive needed?', priceLogic: '$100-$300 / mo depending on storage.', required: true, options: [
        { label: 'No archive needed', value: 'no' },
        { label: 'Yes, archive required', value: 'yes' },
      ] },
      { id: 'legacy_retention_months', label: 'Retention duration (months)', type: 'number', group: 'Retention', description: 'How long should historical data remain accessible in read-only form?', priceLogic: 'Impacts storage and access layer.', min: 1, placeholder: 'e.g. 24' },
      { id: 'legacy_retention_notes', label: 'Retention requirements (notes)', type: 'textarea', group: 'Retention', description: 'Describe access expectations (who can access, search needs, audit logs, etc.).', priceLogic: 'Additional requirements can add setup scope.', placeholder: 'Example: providers + billing can search archived notes; audit log required for downloads.' },
    ],
  },
  {
    id: 'core-modules',
    title: '6. Core modules and recurring software pricing',
    copy: 'This step reflects the recurring platform module block and pricing inputs.',
    fields: [
      { id: 'core_care_axis_platform', label: 'Core Care Axis platform scope', type: 'textarea', group: 'Core Platform', description: 'Scheduling, charting, patient records, dashboards, and base admin tools.', priceLogic: '$1,500/mo suggested base for 1 location.', required: true, placeholder: 'Confirm base platform scope and any must-have modules.' },
      { id: 'base_location_included', label: 'Base location included', type: 'select', group: 'Seat & Location Add-ons', description: 'Base platform includes 1 live location.', priceLogic: 'Included in base.', required: true, placeholder: 'Confirm base location', options: [
        { label: '1 location included', value: '1-included' },
        { label: 'Custom base', value: 'custom' },
      ] },
      { id: 'additional_location_count', label: 'Additional locations (count)', type: 'number', group: 'Seat & Location Add-ons', description: 'Each added live location beyond the base.', priceLogic: '$500/mo per added location suggested.', required: true, min: 0, placeholder: '0' },
      { id: 'additional_provider_seats_count', label: 'Additional provider seats (count)', type: 'number', group: 'Seat & Location Add-ons', description: 'Provider seats beyond bundled count.', priceLogic: '$150/mo each suggested.', required: true, min: 0, placeholder: '0' },
      { id: 'additional_staff_seats_count', label: 'Additional internal staff seats (count)', type: 'number', group: 'Seat & Location Add-ons', description: 'Internal staff seats beyond bundled count.', priceLogic: '$35/mo each suggested.', required: true, min: 0, placeholder: '0' },
      { id: 'seat_pricing_notes', label: 'Seat + location pricing notes', type: 'textarea', group: 'Seat & Location Add-ons', description: 'Any special seat policies (read-only executives, shared logins disallowed, etc.).', priceLogic: 'Used to confirm provisioning rules.', placeholder: 'Example: executives are read-only; no shared logins; seasonal staff seats.' },

      { id: 'patient_communications_module', label: 'Patient communications module', type: 'select', group: 'Modules', description: 'Email, reminders, intake links, and status messages.', priceLogic: '$200/mo plus usage if enabled.', placeholder: 'Select module status', options: [
        { label: 'Enabled', value: 'enabled' },
        { label: 'Not needed', value: 'not-needed' },
      ] },
      { id: 'patient_communications_channels', label: 'Patient communications channels', type: 'multiselect', group: 'Modules', description: 'Select channels to enable.', priceLogic: 'SMS/voice may add pass-through vendor usage.', options: [
        { label: 'Email', value: 'email' },
        { label: 'SMS', value: 'sms' },
        { label: 'Voice calls', value: 'voice' },
        { label: 'Patient intake links', value: 'intake-links' },
      ] },
      { id: 'patient_communications_monthly_volume', label: 'Estimated monthly message volume', type: 'number', group: 'Modules', description: 'Best estimate for reminders, confirmations, and follow-ups.', priceLogic: 'Used for usage projections.', min: 0, placeholder: 'e.g. 2500' },
      { id: 'patient_communications_notes', label: 'Patient communications notes', type: 'textarea', group: 'Modules', description: 'Any special routing rules, languages, or branding requirements.', priceLogic: 'Complex rules may add setup time.', placeholder: 'Example: bilingual reminders; opt-out handling; branded sender domain.' },

      { id: 'advanced_reporting_analytics', label: 'Advanced reporting / analytics', type: 'select', group: 'Modules', description: 'Dashboards, KPI views, and export packs.', priceLogic: '$300/mo suggested.', placeholder: 'Select module status', options: [
        { label: 'Enabled', value: 'enabled' },
        { label: 'Not needed', value: 'not-needed' },
      ] },
      { id: 'reporting_dashboards_needed', label: 'Dashboards needed', type: 'multiselect', group: 'Modules', description: 'Select the reporting packs you want available by default.', priceLogic: 'Custom packs may add setup.', options: [
        { label: 'Executive KPI dashboards', value: 'exec-kpi' },
        { label: 'Provider productivity', value: 'provider-productivity' },
        { label: 'Billing / AR / collections', value: 'billing-ar' },
        { label: 'Referral + marketing ROI', value: 'referral-roi' },
        { label: 'Law firm / affiliate reporting', value: 'portal-reporting' },
        { label: 'Custom', value: 'custom' },
      ] },
      { id: 'reporting_exports_needed', label: 'Exports needed', type: 'multiselect', group: 'Modules', description: 'Select any export packs required.', priceLogic: 'Some exports may require mapping work.', options: [
        { label: 'CSV exports', value: 'csv' },
        { label: 'PDF reports', value: 'pdf' },
        { label: 'Scheduled email reports', value: 'scheduled-email' },
        { label: 'API/reporting endpoint', value: 'api' },
      ] },
      { id: 'reporting_custom_notes', label: 'Reporting notes (custom)', type: 'textarea', group: 'Modules', description: 'If you selected custom dashboards, describe the KPIs and audience.', priceLogic: 'Custom packs may add setup fee.', placeholder: 'Example: weekly PI case aging by firm; provider utilization; clinic throughput.' },

      { id: 'tasking_workflow_automations', label: 'Tasking / workflow automations', type: 'select', group: 'Modules', description: 'Follow-ups, stale updates, and escalation rules.', priceLogic: '$400/mo suggested.', placeholder: 'Select module status', options: [
        { label: 'Enabled', value: 'enabled' },
        { label: 'Not needed', value: 'not-needed' },
      ] },
      { id: 'automation_use_cases', label: 'Automation use cases', type: 'multiselect', group: 'Modules', description: 'Select which automation categories you want active.', priceLogic: 'Complex multi-branching automations can add PM/QA time.', options: [
        { label: 'Appointment reminders + confirmations', value: 'appt-reminders' },
        { label: 'No-show / cancellation follow-ups', value: 'no-show' },
        { label: 'Stale case updates', value: 'stale-updates' },
        { label: 'Billing follow-ups', value: 'billing-followups' },
        { label: 'Referral pipeline follow-ups', value: 'referral-followups' },
        { label: 'Escalations to supervisors', value: 'escalations' },
        { label: 'Custom', value: 'custom' },
      ] },
      { id: 'automation_notes', label: 'Automation notes', type: 'textarea', group: 'Modules', description: 'Describe triggers, owners, and any escalation rules.', priceLogic: 'Used to scope automation buildout.', placeholder: 'Example: escalate stale PI case updates after 7 days to billing lead; auto-create tasks after missed visits.' },
    ],
  },
  {
    id: 'pi-legal-affiliate',
    title: '7. PI, legal, and affiliate workflow modules',
    copy: 'This step keeps the PI and legal-specific module section intact.',
    fields: [
      { id: 'lawyer_portal_enabled', label: 'Lawyer portal', type: 'select', group: 'Lawyer Portal', description: 'Case status, records requests, maps, dashboards, and notifications.', priceLogic: '$250/mo per firm org or custom enterprise bundle.', required: true, placeholder: 'Select module status', options: [
        { label: 'Enabled', value: 'enabled' },
        { label: 'Not needed', value: 'not-needed' },
      ] },
      { id: 'lawyer_portal_firm_visibility', label: 'Firm visibility model', type: 'select', group: 'Lawyer Portal', description: 'How firms should see matters / cases in the portal.', priceLogic: 'Per-firm visibility rules can add setup time.', placeholder: 'Select visibility', options: [
        { label: 'Assigned-only (recommended)', value: 'assigned-only' },
        { label: 'All matters for the firm', value: 'all-for-firm' },
        { label: 'By location / office', value: 'by-location' },
        { label: 'Custom', value: 'custom' },
      ] },
      { id: 'lawyer_portal_features', label: 'Lawyer portal features', type: 'multiselect', group: 'Lawyer Portal', description: 'Select what law firms can do inside the portal.', priceLogic: 'More features = more configuration and testing.', options: [
        { label: 'Case status dashboard', value: 'case-status' },
        { label: 'Records requests', value: 'records-requests' },
        { label: 'Document upload', value: 'document-upload' },
        { label: 'Messaging / comments', value: 'messaging' },
        { label: 'Map + facility directions', value: 'maps' },
        { label: 'Settlement / lien summary view', value: 'settlement-summary' },
        { label: 'Custom', value: 'custom' },
      ] },
      { id: 'lawyer_portal_notifications', label: 'Lawyer portal notifications', type: 'multiselect', group: 'Lawyer Portal', description: 'Select which events should generate notifications.', priceLogic: 'Notification rules may require tuning per firm.', options: [
        { label: 'Weekly updates', value: 'weekly-updates' },
        { label: 'Records ready / fulfilled', value: 'records-ready' },
        { label: 'Appointment milestones', value: 'appointment-milestones' },
        { label: 'Billing / balance changes', value: 'billing-changes' },
        { label: 'Case stage changes', value: 'stage-changes' },
      ] },
      { id: 'lawyer_portal_records_workflow', label: 'Records request workflow', type: 'select', group: 'Lawyer Portal', description: 'How law firm records requests should be handled.', priceLogic: 'Approval + audit requirements can add setup scope.', placeholder: 'Select workflow', options: [
        { label: 'Firms submit requests; staff fulfill', value: 'submit-fulfill' },
        { label: 'Firms submit + pay; staff fulfill', value: 'submit-pay-fulfill' },
        { label: 'View-only (no requests)', value: 'view-only' },
        { label: 'Custom', value: 'custom' },
      ] },
      { id: 'lawyer_portal_notes', label: 'Lawyer portal notes', type: 'textarea', group: 'Lawyer Portal', description: 'Firm onboarding, permissions, compliance, or special rules.', priceLogic: 'Complex rules may add setup fee.', placeholder: 'Example: firm users restricted by matter ownership; audit logs required for downloads.' },

      { id: 'affiliate_portal_enabled', label: 'Affiliate portal', type: 'select', group: 'Affiliate Portal', description: 'Weekly updates, document upload, payment status, and referrals.', priceLogic: '$250/mo per affiliate org or custom enterprise bundle.', required: true, placeholder: 'Select module status', options: [
        { label: 'Enabled', value: 'enabled' },
        { label: 'Not needed', value: 'not-needed' },
      ] },
      { id: 'affiliate_portal_features', label: 'Affiliate portal features', type: 'multiselect', group: 'Affiliate Portal', description: 'Select what affiliates can do inside the portal.', priceLogic: 'More features = more configuration and testing.', options: [
        { label: 'Weekly updates', value: 'weekly-updates' },
        { label: 'Document upload', value: 'document-upload' },
        { label: 'Referral submission', value: 'referral-submission' },
        { label: 'Payment status / invoices', value: 'payment-status' },
        { label: 'Scheduling requests', value: 'scheduling' },
        { label: 'Custom', value: 'custom' },
      ] },
      { id: 'affiliate_portal_update_frequency', label: 'Update frequency', type: 'select', group: 'Affiliate Portal', description: 'Default cadence for affiliate updates.', priceLogic: 'Higher frequency can increase workflow volume.', placeholder: 'Select cadence', options: [
        { label: 'Weekly (recommended)', value: 'weekly' },
        { label: 'Twice weekly', value: 'twice-weekly' },
        { label: 'Daily', value: 'daily' },
        { label: 'Per milestone only', value: 'milestone-only' },
        { label: 'Custom', value: 'custom' },
      ] },
      { id: 'affiliate_portal_notifications', label: 'Affiliate portal notifications', type: 'multiselect', group: 'Affiliate Portal', description: 'Select which events should generate notifications.', priceLogic: 'Notification rules may require tuning by org.', options: [
        { label: 'Update posted', value: 'update-posted' },
        { label: 'Document requested', value: 'document-requested' },
        { label: 'Referral accepted / scheduled', value: 'referral-scheduled' },
        { label: 'Payment status change', value: 'payment-change' },
      ] },
      { id: 'affiliate_portal_notes', label: 'Affiliate portal notes', type: 'textarea', group: 'Affiliate Portal', description: 'Org onboarding, permissions, SLAs, or special rules.', priceLogic: 'Complex rules may add setup fee.', placeholder: 'Example: affiliates see only their referred patients; uploads require staff approval.' },

      { id: 'referral_management_engine', label: 'Referral management engine', type: 'select', group: 'Referral Engine', description: 'Inbound/outbound referrals, tracking, routing, and referral alerts.', priceLogic: '$300/mo suggested.', required: true, placeholder: 'Select module status', options: [
        { label: 'Enabled', value: 'enabled' },
        { label: 'Not needed', value: 'not-needed' },
      ] },
      { id: 'referral_sources', label: 'Referral sources', type: 'textarea', group: 'Referral Engine', description: 'List referral sources (firms, affiliates, doctors, marketing channels) and any source metadata you track.', priceLogic: 'Used to configure routing + reporting.', placeholder: 'Example: 12 law firms, 6 affiliate clinics, Google Ads, internal campaigns.' },
      { id: 'referral_intake_channels', label: 'Referral intake channels', type: 'multiselect', group: 'Referral Engine', description: 'How referrals come in today and what you want to support.', priceLogic: 'More channels may add setup.', options: [
        { label: 'Portal form', value: 'portal-form' },
        { label: 'Phone (call center)', value: 'phone' },
        { label: 'Fax / scanned docs', value: 'fax' },
        { label: 'Email', value: 'email' },
        { label: 'Website form', value: 'website-form' },
        { label: 'Other', value: 'other' },
      ] },
      { id: 'referral_assignment_rules', label: 'Assignment + routing rules', type: 'textarea', group: 'Referral Engine', description: 'Describe routing rules (by location, specialty, payer, firm, capacity, etc.).', priceLogic: 'Complex routing can add setup fee.', placeholder: 'Example: ortho referrals to Location B; PI cases routed by firm; overflow to call center.' },
      { id: 'referral_alerts', label: 'Referral alerts', type: 'multiselect', group: 'Referral Engine', description: 'Which alerts you want enabled.', priceLogic: 'Alert tuning is part of onboarding.', options: [
        { label: 'New referral received', value: 'new-referral' },
        { label: 'Unscheduled referral aging', value: 'aging-unscheduled' },
        { label: 'Referral status changed', value: 'status-change' },
        { label: 'No response / lost referral', value: 'lost-referral' },
      ] },

      { id: 'weekly_update_automation_enabled', label: 'Weekly update automation', type: 'select', group: 'Updates & Automations', description: 'Email or portal update workflows and reminders.', priceLogic: '$200/mo suggested.', required: true, placeholder: 'Select module status', options: [
        { label: 'Enabled', value: 'enabled' },
        { label: 'Not needed', value: 'not-needed' },
      ] },
      { id: 'weekly_update_channels', label: 'Update channels', type: 'multiselect', group: 'Updates & Automations', description: 'Where updates should be delivered.', priceLogic: 'Some channels have usage costs.', options: [
        { label: 'Portal', value: 'portal' },
        { label: 'Email', value: 'email' },
        { label: 'SMS', value: 'sms' },
      ] },
      { id: 'weekly_update_cadence', label: 'Update cadence', type: 'select', group: 'Updates & Automations', description: 'Default cadence for updates and reminders.', priceLogic: 'Higher cadence can increase volume.', placeholder: 'Select cadence', options: [
        { label: 'Weekly', value: 'weekly' },
        { label: 'Twice weekly', value: 'twice-weekly' },
        { label: 'Daily', value: 'daily' },
        { label: 'Milestones only', value: 'milestones-only' },
        { label: 'Custom', value: 'custom' },
      ] },
      { id: 'weekly_update_template_requirements', label: 'Update template requirements', type: 'textarea', group: 'Updates & Automations', description: 'What a “good update” includes (fields, status, next steps, attachments, etc.).', priceLogic: 'Custom templates may add setup.', placeholder: 'Example: case stage + last visit + next appt + outstanding balance + document links.' },

      { id: 'lop_pi_case_workflows_enabled', label: 'LOP / PI case workflows', type: 'select', group: 'LOP / PI Workflows', description: 'PI flags, firm tagging, case stages, and records logic.', priceLogic: '$350/mo suggested.', required: true, placeholder: 'Select module status', options: [
        { label: 'Enabled', value: 'enabled' },
        { label: 'Not needed', value: 'not-needed' },
      ] },
      { id: 'pi_case_stages', label: 'PI case stages', type: 'textarea', group: 'LOP / PI Workflows', description: 'List your PI case stages and what triggers stage changes.', priceLogic: 'Used to build stage automation and dashboards.', placeholder: 'Example: Intake → Treating → Records requested → Records delivered → Settlement pending → Closed.' },
      { id: 'pi_firm_tagging_rules', label: 'Firm tagging rules', type: 'textarea', group: 'LOP / PI Workflows', description: 'How firms are assigned to matters and how conflicts are handled.', priceLogic: 'Complex tagging may add setup.', placeholder: 'Example: firm tied to referral source; one primary firm per matter; approvals required to switch.' },
      { id: 'pi_records_logic', label: 'Records logic', type: 'textarea', group: 'LOP / PI Workflows', description: 'Describe what counts as “records,” how they are packaged, and fulfillment SLAs.', priceLogic: 'Packaging rules may add setup.', placeholder: 'Example: records package includes visit notes + billing ledger; SLA 3 business days.' },
      { id: 'pi_billing_visibility', label: 'Billing visibility to firms/affiliates', type: 'select', group: 'LOP / PI Workflows', description: 'What billing data external portals can see.', priceLogic: 'Sensitive visibility rules require review.', placeholder: 'Select visibility', options: [
        { label: 'No billing visibility', value: 'none' },
        { label: 'Balance only', value: 'balance-only' },
        { label: 'Invoices + payments', value: 'invoices-payments' },
        { label: 'Full ledger', value: 'full-ledger' },
        { label: 'Custom', value: 'custom' },
      ] },

      { id: 'medical_summary_case_snapshot_module_enabled', label: 'Medical summary / case snapshot module', type: 'select', group: 'Case Snapshot', description: 'Central summary for staff and law firms.', priceLogic: '$250/mo suggested.', required: true, placeholder: 'Select module status', options: [
        { label: 'Enabled', value: 'enabled' },
        { label: 'Not needed', value: 'not-needed' },
      ] },
      { id: 'case_snapshot_contents', label: 'Snapshot contents', type: 'multiselect', group: 'Case Snapshot', description: 'Select what should appear in the case snapshot.', priceLogic: 'More sections can add setup.', options: [
        { label: 'Clinical summary + diagnosis', value: 'clinical-summary' },
        { label: 'Treatment plan + milestones', value: 'treatment-plan' },
        { label: 'Visit timeline', value: 'visit-timeline' },
        { label: 'Imaging / attachments', value: 'imaging-attachments' },
        { label: 'Billing summary', value: 'billing-summary' },
        { label: 'Documents / records links', value: 'documents-links' },
        { label: 'Custom', value: 'custom' },
      ] },
      { id: 'case_snapshot_export_format', label: 'Snapshot export format', type: 'multiselect', group: 'Case Snapshot', description: 'How snapshots should be exported or shared.', priceLogic: 'PDF templates may add setup.', options: [
        { label: 'Portal view', value: 'portal' },
        { label: 'PDF', value: 'pdf' },
        { label: 'Email link', value: 'email-link' },
        { label: 'CSV export', value: 'csv' },
      ] },
      { id: 'case_snapshot_notes', label: 'Case snapshot notes', type: 'textarea', group: 'Case Snapshot', description: 'Any formatting, compliance, or approval requirements.', priceLogic: 'Complex formatting may add setup.', placeholder: 'Example: include provider signature block; versioned PDFs; approval before external sharing.' },
    ],
  },
  {
    id: 'billing-insurance-payments',
    title: '8. Billing, insurance, payments, and financial services',
    copy: 'This step matches the billing and revenue workflow questions from the document.',
    fields: [
      { id: 'insurance_workflows_enabled', label: 'Insurance workflows', type: 'select', group: 'Insurance', description: 'Insurance billing, payer mapping, eligibility, and claim workflows.', priceLogic: '$500 setup + $250/mo suggested.', required: true, placeholder: 'Select module status', options: [
        { label: 'Enabled', value: 'enabled' },
        { label: 'Not needed', value: 'not-needed' },
      ] },
      { id: 'insurance_payers', label: 'Primary payers', type: 'textarea', group: 'Insurance', description: 'List top payers and any payer-specific rules or carveouts.', priceLogic: 'Used to scope payer mapping + rules.', placeholder: 'Example: BCBS, Aetna, Cigna, United; state WC payer list if applicable.' },
      { id: 'insurance_services', label: 'Insurance services billed', type: 'multiselect', group: 'Insurance', description: 'Select the services you bill to insurance.', priceLogic: 'Used to validate coding + workflows.', options: [
        { label: 'Office visits / evaluation', value: 'office-visits' },
        { label: 'Physical therapy', value: 'pt' },
        { label: 'Imaging (X-ray/MRI/US)', value: 'imaging' },
        { label: 'Injections / procedures', value: 'procedures' },
        { label: 'DME', value: 'dme' },
        { label: 'Other', value: 'other' },
      ] },
      { id: 'insurance_claim_types', label: 'Claim types', type: 'multiselect', group: 'Insurance', description: 'Select claim types needed.', priceLogic: 'Some claim formats require extra mapping.', options: [
        { label: 'Professional (CMS-1500)', value: 'cms-1500' },
        { label: 'Institutional (UB-04)', value: 'ub-04' },
        { label: 'Dental (if applicable)', value: 'dental' },
      ] },
      { id: 'eligibility_era_requirements', label: 'Eligibility + ERA requirements', type: 'multiselect', group: 'Insurance', description: 'Select real-time services you need enabled.', priceLogic: 'Clearinghouse enrollment may apply.', options: [
        { label: 'Eligibility (270/271)', value: 'eligibility' },
        { label: 'ERA (835)', value: 'era' },
        { label: 'EFT enrollment tracking', value: 'eft' },
        { label: 'Prior auth tracking', value: 'prior-auth' },
      ] },
      { id: 'insurance_workflow_notes', label: 'Insurance workflow notes', type: 'textarea', group: 'Insurance', description: 'Any special billing rules (global periods, modifiers, split billing, etc.).', priceLogic: 'Complex rules may add setup.', placeholder: 'Example: modifier rules for therapy; split billing by provider; payer-specific documentation requirements.' },

      { id: 'clearinghouse_integration_enabled', label: 'Clearinghouse integration', type: 'select', group: 'Clearinghouse', description: 'Claim submission, eligibility, ERA vendor details.', priceLogic: '$500 setup + pass-through vendor costs.', required: true, placeholder: 'Select module status', options: [
        { label: 'Enabled', value: 'enabled' },
        { label: 'Not needed', value: 'not-needed' },
      ] },
      { id: 'clearinghouse_vendor', label: 'Clearinghouse vendor', type: 'select', group: 'Clearinghouse', description: 'Select your clearinghouse (or desired clearinghouse).', priceLogic: 'Vendor choice impacts enrollment steps.', placeholder: 'Select vendor', options: [
        { label: 'Change Healthcare / Optum', value: 'change-optum' },
        { label: 'Availity', value: 'availity' },
        { label: 'Office Ally', value: 'office-ally' },
        { label: 'Waystar', value: 'waystar' },
        { label: 'Trizetto', value: 'trizetto' },
        { label: 'Other / not sure', value: 'other' },
      ] },
      { id: 'clearinghouse_services', label: 'Clearinghouse services', type: 'multiselect', group: 'Clearinghouse', description: 'Select services to enable through the clearinghouse.', priceLogic: 'Enrollment and testing required per service.', options: [
        { label: 'Claims submission', value: 'claims' },
        { label: 'Eligibility', value: 'eligibility' },
        { label: 'ERA', value: 'era' },
        { label: 'Claim status (276/277)', value: 'claim-status' },
        { label: 'Attachments', value: 'attachments' },
      ] },
      { id: 'clearinghouse_claim_volume', label: 'Estimated monthly claim volume', type: 'number', group: 'Clearinghouse', description: 'Best estimate of total claims per month across all locations.', priceLogic: 'Used for vendor cost estimates.', min: 0, placeholder: 'e.g. 1200' },
      { id: 'clearinghouse_notes', label: 'Clearinghouse notes', type: 'textarea', group: 'Clearinghouse', description: 'Enrollment status, existing IDs, and testing constraints.', priceLogic: 'Vendor coordination may extend timeline.', placeholder: 'Example: already enrolled for ERA; need new submitter ID; vendor requires 2-week lead time.' },

      { id: 'rcm_support_mode', label: 'RCM support', type: 'select', group: 'RCM', description: 'Internal-only tools or full managed billing support.', priceLogic: 'Custom % of collections or fixed fee.', required: true, placeholder: 'Select RCM mode', options: [
        { label: 'None (in-house RCM)', value: 'none' },
        { label: 'Tools only (billing team uses platform)', value: 'tools-only' },
        { label: 'Hybrid support (some managed workflows)', value: 'hybrid' },
        { label: 'Fully managed RCM', value: 'managed' },
      ] },
      { id: 'rcm_scope', label: 'RCM scope', type: 'multiselect', group: 'RCM', description: 'Select what RCM activities are in-scope.', priceLogic: 'Scope drives staffing + fees.', options: [
        { label: 'Charge capture / coding support', value: 'charge-capture' },
        { label: 'Claims submission', value: 'claims-submission' },
        { label: 'Denials management', value: 'denials' },
        { label: 'AR follow-up', value: 'ar-followup' },
        { label: 'Patient statements', value: 'statements' },
        { label: 'Collections', value: 'collections' },
        { label: 'Payment posting', value: 'payment-posting' },
        { label: 'Reporting', value: 'reporting' },
      ] },
      { id: 'rcm_fee_preference', label: 'RCM fee preference', type: 'select', group: 'RCM', description: 'Preferred pricing model for managed or hybrid RCM.', priceLogic: 'Custom % of collections or fixed fee.', placeholder: 'Select fee model', options: [
        { label: 'Percent of collections', value: 'percent' },
        { label: 'Fixed monthly fee', value: 'fixed' },
        { label: 'Not sure yet', value: 'unknown' },
      ] },
      { id: 'rcm_notes', label: 'RCM notes', type: 'textarea', group: 'RCM', description: 'Current pain points, KPIs, and any compliance requirements.', priceLogic: 'Used to scope onboarding + QA.', placeholder: 'Example: high denial rate on imaging; want weekly AR aging review; strict separation by location.' },

      { id: 'payment_processing_enabled', label: 'Payment processing', type: 'select', group: 'Payments', description: 'Stripe / merchant processor / card on file / ACH.', priceLogic: 'Pass-through plus setup if custom.', required: true, placeholder: 'Select module status', options: [
        { label: 'Enabled', value: 'enabled' },
        { label: 'Not needed', value: 'not-needed' },
      ] },
      { id: 'payment_processor', label: 'Processor', type: 'select', group: 'Payments', description: 'Select the payment processor to use.', priceLogic: 'Pass-through vendor fees.', placeholder: 'Select processor', options: [
        { label: 'Stripe', value: 'stripe' },
        { label: 'Square', value: 'square' },
        { label: 'Authorize.net', value: 'authorizenet' },
        { label: 'Merchant account (other)', value: 'merchant-other' },
        { label: 'Not sure yet', value: 'unknown' },
      ] },
      { id: 'payment_methods', label: 'Payment methods', type: 'multiselect', group: 'Payments', description: 'Select payment methods to support.', priceLogic: 'Some methods add vendor setup.', options: [
        { label: 'Card present', value: 'card-present' },
        { label: 'Card not present / card-on-file', value: 'card-on-file' },
        { label: 'ACH', value: 'ach' },
        { label: 'HSA/FSA cards', value: 'hsa-fsa' },
        { label: 'Payment links / online checkout', value: 'payment-links' },
      ] },
      { id: 'payment_policies', label: 'Payment policies', type: 'multiselect', group: 'Payments', description: 'Select policies you want enforced.', priceLogic: 'Policy complexity may add setup.', options: [
        { label: 'Require card on file', value: 'require-cof' },
        { label: 'Auto-charge balances', value: 'auto-charge' },
        { label: 'Deposits for appointments', value: 'deposits' },
        { label: 'Payment plans', value: 'payment-plans' },
        { label: 'Surcharging / convenience fees', value: 'surcharging' },
      ] },
      { id: 'payment_notes', label: 'Payment notes', type: 'textarea', group: 'Payments', description: 'Any special rules (refund workflows, split payments, multi-location merchant IDs, etc.).', priceLogic: 'Custom rules may require setup.', placeholder: 'Example: separate merchant IDs per location; refund approval workflow; partial payments allowed.' },

      { id: 'payroll_integration_enabled', label: 'Payroll integration', type: 'select', group: 'Finance Integrations', description: 'Gusto / ADP / export support.', priceLogic: '$250 setup + $75/mo suggested.', required: true, placeholder: 'Select module status', options: [
        { label: 'Enabled', value: 'enabled' },
        { label: 'Not needed', value: 'not-needed' },
      ] },
      { id: 'payroll_vendor', label: 'Payroll vendor', type: 'select', group: 'Finance Integrations', description: 'Select payroll vendor or export target.', priceLogic: 'Export mapping may be required.', placeholder: 'Select vendor', options: [
        { label: 'Gusto', value: 'gusto' },
        { label: 'ADP', value: 'adp' },
        { label: 'Paychex', value: 'paychex' },
        { label: 'QuickBooks Payroll', value: 'qb-payroll' },
        { label: 'Other / export only', value: 'other' },
      ] },
      { id: 'payroll_export_needs', label: 'Payroll export needs', type: 'textarea', group: 'Finance Integrations', description: 'What should be exported (hours, roles, provider productivity, commissions, etc.)?', priceLogic: 'Custom exports may add setup.', placeholder: 'Example: export provider productivity monthly; staff hours weekly.' },

      { id: 'accounting_integration_enabled', label: 'Accounting integration', type: 'select', group: 'Finance Integrations', description: 'QuickBooks / Xero / export map.', priceLogic: '$300 setup + $95/mo suggested.', required: true, placeholder: 'Select module status', options: [
        { label: 'Enabled', value: 'enabled' },
        { label: 'Not needed', value: 'not-needed' },
      ] },
      { id: 'accounting_vendor', label: 'Accounting system', type: 'select', group: 'Finance Integrations', description: 'Select accounting system or export target.', priceLogic: 'Mapping effort depends on chart-of-accounts complexity.', placeholder: 'Select system', options: [
        { label: 'QuickBooks Online', value: 'qbo' },
        { label: 'QuickBooks Desktop', value: 'qbd' },
        { label: 'Xero', value: 'xero' },
        { label: 'NetSuite', value: 'netsuite' },
        { label: 'Other / export only', value: 'other' },
      ] },
      { id: 'accounting_mapping_scope', label: 'Accounting mapping scope', type: 'multiselect', group: 'Finance Integrations', description: 'Select what should be mapped/exported to accounting.', priceLogic: 'More mappings can add setup time.', options: [
        { label: 'Invoices', value: 'invoices' },
        { label: 'Payments', value: 'payments' },
        { label: 'Refunds', value: 'refunds' },
        { label: 'Adjustments / write-offs', value: 'adjustments' },
        { label: 'Deposits', value: 'deposits' },
        { label: 'Provider payouts / commissions', value: 'provider-payouts' },
      ] },
      { id: 'accounting_notes', label: 'Accounting notes', type: 'textarea', group: 'Finance Integrations', description: 'Chart of accounts structure, classes/locations, reconciliation expectations.', priceLogic: 'Complex COA/class mapping may add setup.', placeholder: 'Example: separate classes by location; reconcile daily deposits; map write-offs to specific accounts.' },
    ],
  },
  {
    id: 'clinical-integrations',
    title: '9. Clinical integrations and medical tools',
    copy: 'This step mirrors the clinical integration and medical tooling section.',
    fields: [
      { id: 'e_prescribing_enabled', label: 'E-prescribing', type: 'select', group: 'E-Prescribing', description: 'Providers needing eRx, controlled substances, and identity proofing.', priceLogic: '$750/provider setup + $99/provider/mo suggested + vendor pass-through.', required: true, placeholder: 'Select module status', options: [
        { label: 'Enabled', value: 'enabled' },
        { label: 'Not needed', value: 'not-needed' },
      ] },
      { id: 'e_prescribing_provider_count', label: 'Providers needing eRx (count)', type: 'number', group: 'E-Prescribing', description: 'How many providers require eRx access.', priceLogic: 'Used to scope per-provider setup + monthly fees.', min: 0, placeholder: '0' },
      { id: 'e_prescribing_controlled_substances', label: 'Controlled substances', type: 'select', group: 'E-Prescribing', description: 'Do any providers need controlled substances eRx (EPCS)?', priceLogic: 'EPCS requires identity proofing and extra steps.', placeholder: 'Select', options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
        { label: 'Not sure yet', value: 'unknown' },
      ] },
      { id: 'e_prescribing_vendor_preference', label: 'eRx vendor preference', type: 'select', group: 'E-Prescribing', description: 'Preferred eRx vendor (or “not sure yet”).', priceLogic: 'Vendor choice impacts onboarding steps.', placeholder: 'Select vendor', options: [
        { label: 'Surescripts (via integrated vendor)', value: 'surescripts' },
        { label: 'DrFirst', value: 'drfirst' },
        { label: 'DoseSpot', value: 'dosespot' },
        { label: 'Not sure yet', value: 'unknown' },
      ] },
      { id: 'e_prescribing_identity_proofing', label: 'Identity proofing method', type: 'select', group: 'E-Prescribing', description: 'How providers will complete identity proofing.', priceLogic: 'Proofing workflow impacts timeline.', placeholder: 'Select method', options: [
        { label: 'Remote / online', value: 'remote' },
        { label: 'In-person / notary', value: 'in-person' },
        { label: 'Not sure yet', value: 'unknown' },
      ] },
      { id: 'e_prescribing_notes', label: 'E-prescribing notes', type: 'textarea', group: 'E-Prescribing', description: 'Any state rules, multi-location needs, or prescribing constraints.', priceLogic: 'Complex constraints may add setup.', placeholder: 'Example: EPCS required for 3 MDs; multi-state licenses; delegated prescribing workflows.' },

      { id: 'lis_integration_enabled', label: 'LIS integration', type: 'select', group: 'Lab (LIS)', description: 'Lab connectivity and result routing.', priceLogic: '$1,500 setup + $250/mo suggested.', required: true, placeholder: 'Select module status', options: [
        { label: 'Enabled', value: 'enabled' },
        { label: 'Not needed', value: 'not-needed' },
      ] },
      { id: 'lis_vendors', label: 'Lab vendors / partners', type: 'textarea', group: 'Lab (LIS)', description: 'List labs (Quest, Labcorp, local labs) and any portal/API access available.', priceLogic: 'Vendor complexity impacts integration scope.', placeholder: 'Example: Labcorp + 2 local labs; results via HL7; ordering via portal.' },
      { id: 'lis_connectivity_type', label: 'Connectivity type', type: 'multiselect', group: 'Lab (LIS)', description: 'Select connectivity methods available.', priceLogic: 'HL7/FHIR may add mapping and testing.', options: [
        { label: 'HL7', value: 'hl7' },
        { label: 'FHIR', value: 'fhir' },
        { label: 'API', value: 'api' },
        { label: 'CSV / flat file', value: 'flat-file' },
        { label: 'PDF results only', value: 'pdf-only' },
      ] },
      { id: 'lis_ordering_needed', label: 'Lab ordering needed', type: 'select', group: 'Lab (LIS)', description: 'Do you need electronic ordering (not just results)?', priceLogic: 'Ordering adds additional workflow scope.', placeholder: 'Select', options: [
        { label: 'Results only', value: 'results-only' },
        { label: 'Ordering + results', value: 'ordering-results' },
        { label: 'Not sure yet', value: 'unknown' },
      ] },
      { id: 'lis_result_routing_rules', label: 'Result routing rules', type: 'textarea', group: 'Lab (LIS)', description: 'Describe how results should route to providers/locations and how abnormal flags should be handled.', priceLogic: 'Complex routing may add setup.', placeholder: 'Example: route by ordering provider; abnormal results create tasks; notify MA + provider.' },

      { id: 'imaging_integration_enabled', label: 'Imaging / radiology integration', type: 'select', group: 'Imaging', description: 'Orders, results import, and external imaging partners.', priceLogic: '$1,000 setup + $200/mo suggested.', required: true, placeholder: 'Select module status', options: [
        { label: 'Enabled', value: 'enabled' },
        { label: 'Not needed', value: 'not-needed' },
      ] },
      { id: 'imaging_partners', label: 'Imaging partners', type: 'textarea', group: 'Imaging', description: 'List imaging centers and systems (PACS/RIS) involved.', priceLogic: 'Partner count impacts scope.', placeholder: 'Example: Imaging Center A (PACS); Hospital B RIS; in-house X-ray system.' },
      { id: 'imaging_modalities', label: 'Modalities', type: 'multiselect', group: 'Imaging', description: 'Select modalities you need to support.', priceLogic: 'Used to scope order/result vocab.', options: [
        { label: 'X-ray', value: 'xray' },
        { label: 'MRI', value: 'mri' },
        { label: 'CT', value: 'ct' },
        { label: 'Ultrasound', value: 'ultrasound' },
        { label: 'Other', value: 'other' },
      ] },
      { id: 'imaging_workflow_needs', label: 'Workflow needs', type: 'multiselect', group: 'Imaging', description: 'Select imaging workflow capabilities needed.', priceLogic: 'More workflow steps may add setup.', options: [
        { label: 'Ordering', value: 'ordering' },
        { label: 'Results import', value: 'results-import' },
        { label: 'Scheduling coordination', value: 'scheduling' },
        { label: 'Prior auth tracking', value: 'prior-auth' },
        { label: 'DICOM link / image viewer linkouts', value: 'dicom-linkout' },
      ] },
      { id: 'imaging_integration_notes', label: 'Imaging notes', type: 'textarea', group: 'Imaging', description: 'Any routing rules, partner constraints, or turnaround SLAs.', priceLogic: 'Partner constraints may extend timeline.', placeholder: 'Example: results via HL7; scheduling handled by imaging partner; need linkouts to PACS viewer.' },

      { id: 'custom_cpt_icd_logic_enabled', label: 'Custom CPT / ICD logic', type: 'select', group: 'Coding & Fee Rules', description: 'Fee schedules, code preferences, specialty rules, and payer-specific constraints.', priceLogic: 'Bundled up to certain scope; then custom.', required: true, placeholder: 'Select module status', options: [
        { label: 'Enabled', value: 'enabled' },
        { label: 'Not needed', value: 'not-needed' },
      ] },
      { id: 'cpt_icd_specialty_rules', label: 'Specialty rules', type: 'textarea', group: 'Coding & Fee Rules', description: 'Describe specialty-specific coding rules or preferences.', priceLogic: 'Complex rules can add setup.', placeholder: 'Example: ortho procedure bundles; PT units rules; pain injections mapping.' },
      { id: 'fee_schedule_sources', label: 'Fee schedule sources', type: 'multiselect', group: 'Coding & Fee Rules', description: 'Where do fee schedules come from?', priceLogic: 'More sources can add mapping effort.', options: [
        { label: 'Self-pay fee schedule', value: 'self-pay' },
        { label: 'Insurance contracted rates', value: 'insurance-contracts' },
        { label: 'Workers comp fee schedule', value: 'wc' },
        { label: 'PI/LOP pricing rules', value: 'pi-lop' },
        { label: 'Other', value: 'other' },
      ] },
      { id: 'coding_rule_notes', label: 'Coding notes', type: 'textarea', group: 'Coding & Fee Rules', description: 'Any modifier rules, payer edits, or claim scrubbing needs.', priceLogic: 'May require additional configuration.', placeholder: 'Example: modifier 25 rules; prior auth flags for MRI; payer edit rules.' },

      { id: 'document_generation_enabled', label: 'Document generation', type: 'select', group: 'Documents', description: 'Work notes, referral letters, summaries, and custom PDFs.', priceLogic: '$300-$1,500 setup depending on templates.', required: true, placeholder: 'Select module status', options: [
        { label: 'Enabled', value: 'enabled' },
        { label: 'Not needed', value: 'not-needed' },
      ] },
      { id: 'document_types_needed', label: 'Document types needed', type: 'multiselect', group: 'Documents', description: 'Select the documents you need generated.', priceLogic: 'More templates = more setup.', options: [
        { label: 'Work notes', value: 'work-notes' },
        { label: 'Referral letters', value: 'referral-letters' },
        { label: 'Medical summaries', value: 'medical-summaries' },
        { label: 'Treatment plans', value: 'treatment-plans' },
        { label: 'School notes', value: 'school-notes' },
        { label: 'PI demand packet / records bundle cover', value: 'pi-demand' },
        { label: 'Custom PDFs', value: 'custom-pdfs' },
      ] },
      { id: 'document_signature_requirements', label: 'Signature requirements', type: 'multiselect', group: 'Documents', description: 'Select signature requirements for generated documents.', priceLogic: 'Signature workflows can add setup.', options: [
        { label: 'Provider signature', value: 'provider-signature' },
        { label: 'Supervising provider co-sign', value: 'cosign' },
        { label: 'Stamp/seal', value: 'stamp' },
        { label: 'No signature needed', value: 'none' },
      ] },
      { id: 'document_generation_notes', label: 'Document generation notes', type: 'textarea', group: 'Documents', description: 'Template branding, distribution rules, and compliance needs.', priceLogic: 'Custom formatting may add setup.', placeholder: 'Example: templates must include logo; PDFs emailed to firms; versioning + audit required.' },
    ],
  },
  {
    id: 'marketing-crm',
    title: '10. Marketing CRM and growth modules',
    copy: 'This step reproduces the marketing and growth module block.',
    fields: [
      { id: 'marketing_crm_enabled', label: 'Marketing CRM', type: 'select', group: 'Marketing CRM', description: 'Lead tracking, source management, and outreach pipeline.', priceLogic: '$400/mo suggested.', required: true, placeholder: 'Select module status', options: [
        { label: 'Enabled', value: 'enabled' },
        { label: 'Not needed', value: 'not-needed' },
      ] },
      { id: 'crm_use_cases', label: 'CRM use cases', type: 'multiselect', group: 'Marketing CRM', description: 'Select what you want the CRM to handle.', priceLogic: 'More scope increases onboarding configuration.', options: [
        { label: 'Lead capture + intake', value: 'lead-capture' },
        { label: 'Source tracking / attribution', value: 'source-tracking' },
        { label: 'Outreach pipeline + follow-ups', value: 'outreach-pipeline' },
        { label: 'Referral pipeline management', value: 'referral-pipeline' },
        { label: 'Nurture sequences', value: 'nurture' },
        { label: 'Sales team tasking', value: 'sales-tasking' },
        { label: 'Reporting / ROI dashboards', value: 'roi-reporting' },
        { label: 'Custom', value: 'custom' },
      ] },
      { id: 'crm_pipeline_stages', label: 'Pipeline stages', type: 'textarea', group: 'Marketing CRM', description: 'List your pipeline stages and what “done” means for each.', priceLogic: 'Used to configure pipeline + automation triggers.', placeholder: 'Example: New lead → Contacted → Scheduled → Arrived → Converted → Closed-lost.' },
      { id: 'crm_lead_sources', label: 'Lead sources', type: 'textarea', group: 'Marketing CRM', description: 'List lead sources and any tracking parameters you need (UTM, campaign, referral source).', priceLogic: 'Used to configure source taxonomy + reporting.', placeholder: 'Example: Google Ads, SEO, referrals, law firms, affiliates, walk-ins.' },
      { id: 'crm_assignment_rules', label: 'Lead assignment rules', type: 'textarea', group: 'Marketing CRM', description: 'Describe routing rules (by location, specialty, language, hours, priority).', priceLogic: 'Complex routing may add setup.', placeholder: 'Example: Spanish-speaking leads route to call center; ortho to Location B; overflow after hours.' },
      { id: 'crm_users_count', label: 'CRM user seats (count)', type: 'number', group: 'Marketing CRM', description: 'How many users need access to the marketing CRM views.', priceLogic: 'May use existing staff seats; used for permission setup.', min: 0, placeholder: '0' },
      { id: 'crm_notes', label: 'CRM notes', type: 'textarea', group: 'Marketing CRM', description: 'Anything unique about your lead flow, handoffs, or compliance needs.', priceLogic: 'Used to scope workflows + QA.', placeholder: 'Example: lead SLA is 5 minutes; call center handoff; consent logging required.' },

      { id: 'address_book_import_enabled', label: 'Address book import', type: 'select', group: 'Imports', description: 'CSV or spreadsheet import of contacts.', priceLogic: '$150 one-time per cleaned import.', required: true, placeholder: 'Select module status', options: [
        { label: 'Enabled', value: 'enabled' },
        { label: 'Not needed', value: 'not-needed' },
      ] },
      { id: 'import_sources', label: 'Import sources', type: 'multiselect', group: 'Imports', description: 'Where contacts will be imported from.', priceLogic: 'Some sources require extra cleanup.', options: [
        { label: 'CSV', value: 'csv' },
        { label: 'Excel', value: 'excel' },
        { label: 'Google Sheets', value: 'google-sheets' },
        { label: 'Existing CRM export', value: 'crm-export' },
        { label: 'Other', value: 'other' },
      ] },
      { id: 'import_contact_count', label: 'Estimated contacts to import', type: 'number', group: 'Imports', description: 'Best estimate of contacts/leads to import.', priceLogic: 'Used to estimate cleanup effort.', min: 0, placeholder: 'e.g. 5000' },
      { id: 'import_data_quality', label: 'Import data quality', type: 'select', group: 'Imports', description: 'How clean is the source data (duplicates, missing fields, inconsistent formatting)?', priceLogic: 'Higher cleanup can increase one-time import cost.', placeholder: 'Select quality', options: [
        { label: 'Clean', value: 'clean' },
        { label: 'Some cleanup needed', value: 'some-cleanup' },
        { label: 'Heavy cleanup needed', value: 'heavy-cleanup' },
        { label: 'Not sure yet', value: 'unknown' },
      ] },
      { id: 'import_notes', label: 'Import notes', type: 'textarea', group: 'Imports', description: 'Any required fields, tags, segmentation, or dedupe rules.', priceLogic: 'Complex mapping may add setup.', placeholder: 'Example: tag by campaign; preserve source + last-contacted; dedupe by email + phone.' },

      { id: 'drip_campaigns_enabled', label: 'Drip campaigns', type: 'select', group: 'Campaigns', description: 'Email sequences, reminder campaigns, and nurture flows.', priceLogic: '$200 setup + $100/mo suggested.', required: true, placeholder: 'Select module status', options: [
        { label: 'Enabled', value: 'enabled' },
        { label: 'Not needed', value: 'not-needed' },
      ] },
      { id: 'drip_channels', label: 'Campaign channels', type: 'multiselect', group: 'Campaigns', description: 'Select channels for nurture and reminder campaigns.', priceLogic: 'SMS may add pass-through vendor usage.', options: [
        { label: 'Email', value: 'email' },
        { label: 'SMS', value: 'sms' },
      ] },
      { id: 'drip_sequence_types', label: 'Sequences needed', type: 'multiselect', group: 'Campaigns', description: 'Select sequence types you want included.', priceLogic: 'More sequences increase setup.', options: [
        { label: 'New lead nurture', value: 'lead-nurture' },
        { label: 'Unscheduled lead follow-up', value: 'unscheduled-followup' },
        { label: 'Missed appointment follow-up', value: 'no-show-followup' },
        { label: 'Reactivation (inactive patients)', value: 'reactivation' },
        { label: 'Post-visit review request', value: 'review-request' },
        { label: 'Custom', value: 'custom' },
      ] },
      { id: 'drip_compliance_opt_in', label: 'Consent / opt-in approach', type: 'select', group: 'Campaigns', description: 'How consent is captured for messaging.', priceLogic: 'Compliance requirements may add setup.', placeholder: 'Select approach', options: [
        { label: 'Existing consent process', value: 'existing' },
        { label: 'Need Care Axis consent workflow', value: 'need-workflow' },
        { label: 'Not sure yet', value: 'unknown' },
      ] },
      { id: 'drip_notes', label: 'Drip campaign notes', type: 'textarea', group: 'Campaigns', description: 'Copy requirements, branding, segmentation, and timing rules.', priceLogic: 'Custom copywriting is separate scope.', placeholder: 'Example: bilingual sequences; segment by specialty; send within business hours only.' },

      { id: 'marketing_email_sending_service_enabled', label: 'Marketing email sending service', type: 'select', group: 'Email Sending', description: 'Client sends or Care Axis sends on behalf.', priceLogic: 'Pass-through email costs + service fee if managed.', required: true, placeholder: 'Select service model', options: [
        { label: 'Client-managed sending', value: 'client-managed' },
        { label: 'Care Axis-managed sending', value: 'care-axis-managed' },
        { label: 'Not needed', value: 'not-needed' },
      ] },
      { id: 'email_sending_provider', label: 'Email provider', type: 'select', group: 'Email Sending', description: 'Select provider or preferred sending service.', priceLogic: 'Pass-through vendor costs.', placeholder: 'Select provider', options: [
        { label: 'SendGrid', value: 'sendgrid' },
        { label: 'Mailgun', value: 'mailgun' },
        { label: 'Amazon SES', value: 'ses' },
        { label: 'Postmark', value: 'postmark' },
        { label: 'Other / not sure', value: 'other' },
      ] },
      { id: 'email_sender_domain_ready', label: 'Sender domain readiness', type: 'select', group: 'Email Sending', description: 'Is your domain ready for SPF/DKIM/DMARC setup?', priceLogic: 'DNS coordination may affect timeline.', placeholder: 'Select readiness', options: [
        { label: 'Ready now', value: 'ready' },
        { label: 'Need DNS access / IT support', value: 'need-dns' },
        { label: 'Not sure yet', value: 'unknown' },
      ] },
      { id: 'email_monthly_volume', label: 'Estimated monthly email volume', type: 'number', group: 'Email Sending', description: 'Best estimate for marketing sends (campaigns + nurtures).', priceLogic: 'Used for vendor plan sizing.', min: 0, placeholder: 'e.g. 20000' },
      { id: 'email_sending_notes', label: 'Email sending notes', type: 'textarea', group: 'Email Sending', description: 'Suppression lists, deliverability constraints, compliance needs.', priceLogic: 'Complex deliverability requirements may add setup.', placeholder: 'Example: maintain suppression list; send from multiple subdomains; strict DMARC alignment.' },

      { id: 'call_tracking_voip_enabled', label: 'Call tracking / VOIP', type: 'select', group: 'Call Tracking / VOIP', description: 'Texting, calls, call routing, and assigned numbers.', priceLogic: '$250 setup + vendor usage + $100/mo platform fee.', required: true, placeholder: 'Select module status', options: [
        { label: 'Enabled', value: 'enabled' },
        { label: 'Not needed', value: 'not-needed' },
      ] },
      { id: 'voip_vendor', label: 'VOIP / call tracking vendor', type: 'select', group: 'Call Tracking / VOIP', description: 'Select vendor or preferred system.', priceLogic: 'Vendor choice impacts integration + numbers.', placeholder: 'Select vendor', options: [
        { label: 'CallRail', value: 'callrail' },
        { label: 'Twilio', value: 'twilio' },
        { label: 'RingCentral', value: 'ringcentral' },
        { label: 'OpenPhone', value: 'openphone' },
        { label: 'Other / not sure', value: 'other' },
      ] },
      { id: 'voip_numbers_needed', label: 'Phone numbers needed (count)', type: 'number', group: 'Call Tracking / VOIP', description: 'How many numbers (tracking, main lines, departments) are needed.', priceLogic: 'Used for vendor plan sizing.', min: 0, placeholder: 'e.g. 6' },
      { id: 'voip_features', label: 'VOIP features', type: 'multiselect', group: 'Call Tracking / VOIP', description: 'Select call and messaging features required.', priceLogic: 'More features can increase setup complexity.', options: [
        { label: 'Call routing / IVR', value: 'ivr' },
        { label: 'Call recording', value: 'recording' },
        { label: 'Call tracking numbers', value: 'tracking-numbers' },
        { label: 'SMS / texting', value: 'sms' },
        { label: 'Call whisper / coaching', value: 'whisper' },
        { label: 'Analytics / attribution', value: 'analytics' },
      ] },
      { id: 'voip_notes', label: 'Call tracking / VOIP notes', type: 'textarea', group: 'Call Tracking / VOIP', description: 'Routing rules, hours, departments, and reporting needs.', priceLogic: 'Complex routing may add setup.', placeholder: 'Example: route by location; after-hours voicemail + SMS follow-up; attribution by campaign.' },
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

function parseWholeNumber(value: string | string[]) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!/^\d+$/.test(trimmed)) return null;
  return Number(trimmed);
}

function getFieldError(field: IntakeField, value: string | string[], state: IntakeState) {
  if (field.id === 'law_firm_portal_org_details' || field.id === 'law_firm_portal_permission_model' || field.id === 'law_firm_portal_matter_visibility') {
    const firmCount = parseWholeNumber(state.law_firm_portal_org_count) ?? 0;
    if (firmCount > 0 && !isAnswered(value)) {
      return 'Complete this field when law firm portals are enabled.';
    }
  }

  if (field.id === 'affiliate_portal_org_details' || field.id === 'affiliate_portal_use_cases' || field.id === 'affiliate_portal_permission_model') {
    const affiliateCount = parseWholeNumber(state.affiliate_portal_org_count) ?? 0;
    if (affiliateCount > 0 && !isAnswered(value)) {
      return 'Complete this field when affiliate portals are enabled.';
    }
  }

  if (field.id === 'provider_seats_other_notes') {
    const otherCount = parseWholeNumber(state.provider_seats_other) ?? 0;
    if (otherCount > 0 && !isAnswered(value)) {
      return 'Add notes for the other provider seats.';
    }
  }

  if (field.id === 'supervising_relationship_notes') {
    const midlevelCount = parseWholeNumber(state.provider_seats_np_pa) ?? 0;
    if (midlevelCount > 0 && !isAnswered(value)) {
      return 'Describe supervising relationships for NP/PA seats.';
    }
  }

  if (field.id === 'rbac_notes') {
    const rbacMode = String(state.rbac_mode || '');
    if (rbacMode === 'custom' && !isAnswered(value)) {
      return 'Add custom RBAC notes when Custom RBAC is selected.';
    }
  }

  if (field.id === 'file_types_other_notes') {
    const fileTypes = Array.isArray(state.file_types) ? state.file_types : [];
    if (fileTypes.includes('other') && !isAnswered(value)) {
      return 'Describe the other file types you selected.';
    }
  }

  if (field.id === 'structured_export_format') {
    const fileTypes = Array.isArray(state.file_types) ? state.file_types : [];
    if (fileTypes.includes('structured-export') && !isAnswered(value)) {
      return 'Select the structured export format.';
    }
  }

  if (field.id === 'api_access_details') {
    const fileTypes = Array.isArray(state.file_types) ? state.file_types : [];
    if (fileTypes.includes('api-access') && !isAnswered(value)) {
      return 'Add API access details when API access is available.';
    }
  }

  if (field.id === 'day1_other_notes') {
    const day1 = Array.isArray(state.day1_data_requirements) ? state.day1_data_requirements : [];
    if (day1.includes('other') && !isAnswered(value)) {
      return 'Describe the day-1 requirement you selected.';
    }
  }

  if (field.id === 'historical_scope_custom_notes') {
    const scopeWindow = String(state.historical_scope_window || '');
    if (scopeWindow === 'custom' && !isAnswered(value)) {
      return 'Describe the custom historical scope window.';
    }
  }

  if (field.id === 'phased_cutover_plan_notes') {
    const cutover = String(state.cutover_strategy || '');
    if (cutover !== 'big-bang' && !isAnswered(value)) {
      return 'Describe the phased cutover plan.';
    }
  }

  if (field.id === 'legacy_retention_months' || field.id === 'legacy_retention_notes') {
    const legacyRetention = String(state.legacy_retention || '');
    if (legacyRetention === 'yes' && !isAnswered(value)) {
      return 'Complete this field when legacy retention is required.';
    }
  }

  if (field.id === 'patient_communications_channels' || field.id === 'patient_communications_monthly_volume') {
    const comms = String(state.patient_communications_module || '');
    if (comms === 'enabled' && !isAnswered(value)) {
      return 'Complete this field when patient communications are enabled.';
    }
  }

  if (field.id === 'reporting_dashboards_needed' || field.id === 'reporting_exports_needed') {
    const reporting = String(state.advanced_reporting_analytics || '');
    if (reporting === 'enabled' && !isAnswered(value)) {
      return 'Complete this field when advanced reporting is enabled.';
    }
  }

  if (field.id === 'reporting_custom_notes') {
    const reporting = String(state.advanced_reporting_analytics || '');
    const dashboards = Array.isArray(state.reporting_dashboards_needed) ? state.reporting_dashboards_needed : [];
    if (reporting === 'enabled' && dashboards.includes('custom') && !isAnswered(value)) {
      return 'Describe the custom dashboards you selected.';
    }
  }

  if (field.id === 'automation_use_cases' || field.id === 'automation_notes') {
    const automations = String(state.tasking_workflow_automations || '');
    if (automations === 'enabled' && !isAnswered(value)) {
      return 'Complete this field when workflow automations are enabled.';
    }
  }

  if (field.id === 'lawyer_portal_firm_visibility' || field.id === 'lawyer_portal_features' || field.id === 'lawyer_portal_notifications' || field.id === 'lawyer_portal_records_workflow') {
    const lawyerPortal = String(state.lawyer_portal_enabled || '');
    if (lawyerPortal === 'enabled' && !isAnswered(value)) {
      return 'Complete this field when the lawyer portal is enabled.';
    }
  }

  if (field.id === 'affiliate_portal_features' || field.id === 'affiliate_portal_update_frequency' || field.id === 'affiliate_portal_notifications') {
    const affiliatePortal = String(state.affiliate_portal_enabled || '');
    if (affiliatePortal === 'enabled' && !isAnswered(value)) {
      return 'Complete this field when the affiliate portal is enabled.';
    }
  }

  if (field.id === 'referral_sources' || field.id === 'referral_intake_channels' || field.id === 'referral_assignment_rules' || field.id === 'referral_alerts') {
    const referralEngine = String(state.referral_management_engine || '');
    if (referralEngine === 'enabled' && !isAnswered(value)) {
      return 'Complete this field when the referral management engine is enabled.';
    }
  }

  if (field.id === 'weekly_update_channels' || field.id === 'weekly_update_cadence' || field.id === 'weekly_update_template_requirements') {
    const updateAutomation = String(state.weekly_update_automation_enabled || '');
    if (updateAutomation === 'enabled' && !isAnswered(value)) {
      return 'Complete this field when weekly update automation is enabled.';
    }
  }

  if (field.id === 'pi_case_stages' || field.id === 'pi_firm_tagging_rules' || field.id === 'pi_records_logic' || field.id === 'pi_billing_visibility') {
    const piWorkflows = String(state.lop_pi_case_workflows_enabled || '');
    if (piWorkflows === 'enabled' && !isAnswered(value)) {
      return 'Complete this field when LOP / PI case workflows are enabled.';
    }
  }

  if (field.id === 'case_snapshot_contents' || field.id === 'case_snapshot_export_format') {
    const snapshot = String(state.medical_summary_case_snapshot_module_enabled || '');
    if (snapshot === 'enabled' && !isAnswered(value)) {
      return 'Complete this field when the case snapshot module is enabled.';
    }
  }

  if (field.id === 'insurance_payers' || field.id === 'insurance_services' || field.id === 'insurance_claim_types' || field.id === 'eligibility_era_requirements') {
    const insurance = String(state.insurance_workflows_enabled || '');
    if (insurance === 'enabled' && !isAnswered(value)) {
      return 'Complete this field when insurance workflows are enabled.';
    }
  }

  if (field.id === 'clearinghouse_vendor' || field.id === 'clearinghouse_services' || field.id === 'clearinghouse_claim_volume') {
    const clearinghouse = String(state.clearinghouse_integration_enabled || '');
    if (clearinghouse === 'enabled' && !isAnswered(value)) {
      return 'Complete this field when clearinghouse integration is enabled.';
    }
  }

  if (field.id === 'rcm_scope' || field.id === 'rcm_fee_preference') {
    const rcmMode = String(state.rcm_support_mode || '');
    if (rcmMode && rcmMode !== 'none' && !isAnswered(value)) {
      return 'Complete this field when RCM support is included.';
    }
  }

  if (field.id === 'payment_processor' || field.id === 'payment_methods' || field.id === 'payment_policies') {
    const payments = String(state.payment_processing_enabled || '');
    if (payments === 'enabled' && !isAnswered(value)) {
      return 'Complete this field when payment processing is enabled.';
    }
  }

  if (field.id === 'payroll_vendor' || field.id === 'payroll_export_needs') {
    const payroll = String(state.payroll_integration_enabled || '');
    if (payroll === 'enabled' && !isAnswered(value)) {
      return 'Complete this field when payroll integration is enabled.';
    }
  }

  if (field.id === 'accounting_vendor' || field.id === 'accounting_mapping_scope' || field.id === 'accounting_notes') {
    const accounting = String(state.accounting_integration_enabled || '');
    if (accounting === 'enabled' && !isAnswered(value)) {
      return 'Complete this field when accounting integration is enabled.';
    }
  }

  if (field.id === 'e_prescribing_provider_count' || field.id === 'e_prescribing_controlled_substances' || field.id === 'e_prescribing_vendor_preference' || field.id === 'e_prescribing_identity_proofing') {
    const erx = String(state.e_prescribing_enabled || '');
    if (erx === 'enabled' && !isAnswered(value)) {
      return 'Complete this field when e-prescribing is enabled.';
    }
  }

  if (field.id === 'lis_vendors' || field.id === 'lis_connectivity_type' || field.id === 'lis_ordering_needed' || field.id === 'lis_result_routing_rules') {
    const lis = String(state.lis_integration_enabled || '');
    if (lis === 'enabled' && !isAnswered(value)) {
      return 'Complete this field when LIS integration is enabled.';
    }
  }

  if (field.id === 'imaging_partners' || field.id === 'imaging_modalities' || field.id === 'imaging_workflow_needs') {
    const imaging = String(state.imaging_integration_enabled || '');
    if (imaging === 'enabled' && !isAnswered(value)) {
      return 'Complete this field when imaging integration is enabled.';
    }
  }

  if (field.id === 'cpt_icd_specialty_rules' || field.id === 'fee_schedule_sources') {
    const coding = String(state.custom_cpt_icd_logic_enabled || '');
    if (coding === 'enabled' && !isAnswered(value)) {
      return 'Complete this field when custom CPT/ICD logic is enabled.';
    }
  }

  if (field.id === 'document_types_needed' || field.id === 'document_signature_requirements' || field.id === 'document_generation_notes') {
    const docs = String(state.document_generation_enabled || '');
    if (docs === 'enabled' && !isAnswered(value)) {
      return 'Complete this field when document generation is enabled.';
    }
  }

  if (field.id === 'crm_use_cases' || field.id === 'crm_pipeline_stages' || field.id === 'crm_lead_sources' || field.id === 'crm_assignment_rules' || field.id === 'crm_users_count') {
    const crm = String(state.marketing_crm_enabled || '');
    if (crm === 'enabled' && !isAnswered(value)) {
      return 'Complete this field when marketing CRM is enabled.';
    }
  }

  if (field.id === 'import_sources' || field.id === 'import_contact_count' || field.id === 'import_data_quality') {
    const importEnabled = String(state.address_book_import_enabled || '');
    if (importEnabled === 'enabled' && !isAnswered(value)) {
      return 'Complete this field when address book import is enabled.';
    }
  }

  if (field.id === 'drip_channels' || field.id === 'drip_sequence_types' || field.id === 'drip_compliance_opt_in') {
    const drip = String(state.drip_campaigns_enabled || '');
    if (drip === 'enabled' && !isAnswered(value)) {
      return 'Complete this field when drip campaigns are enabled.';
    }
  }

  if (field.id === 'email_sending_provider' || field.id === 'email_sender_domain_ready' || field.id === 'email_monthly_volume') {
    const sending = String(state.marketing_email_sending_service_enabled || '');
    if (sending && sending !== 'not-needed' && !isAnswered(value)) {
      return 'Complete this field when marketing email sending is included.';
    }
  }

  if (field.id === 'voip_vendor' || field.id === 'voip_numbers_needed' || field.id === 'voip_features') {
    const voip = String(state.call_tracking_voip_enabled || '');
    if (voip === 'enabled' && !isAnswered(value)) {
      return 'Complete this field when call tracking / VOIP is enabled.';
    }
  }

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

    const numericValue = Number(value);
    const minValue = field.min ?? 1;
    if (numericValue < minValue) {
      return minValue === 0 ? 'Enter 0 or more.' : 'Enter a number greater than 0.';
    }

    if (typeof field.max === 'number' && numericValue > field.max) {
      return `Enter a number less than or equal to ${field.max}.`;
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

  return section.fields.every((field) => !getFieldError(field, formState[field.id], formState));
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

  useEffect(() => {
    if (section.id !== 'core-modules') return;

    const nextState: IntakeState = { ...formState };
    let changed = false;

    const locationCount = parseWholeNumber(nextState.number_of_locations) ?? null;
    if (locationCount !== null && String(nextState.additional_location_count || '').trim() === '') {
      nextState.additional_location_count = String(Math.max(0, locationCount - 1));
      changed = true;
    }

    const providerTotal = parseWholeNumber(nextState.provider_seat_total) ?? null;
    if (providerTotal !== null && String(nextState.additional_provider_seats_count || '').trim() === '') {
      nextState.additional_provider_seats_count = String(Math.max(0, providerTotal - 5));
      changed = true;
    }

    const staffTotal = parseWholeNumber(nextState.staff_seat_total) ?? null;
    if (staffTotal !== null && String(nextState.additional_staff_seats_count || '').trim() === '') {
      nextState.additional_staff_seats_count = String(Math.max(0, staffTotal - 10));
      changed = true;
    }

    if (changed) {
      setFormState(nextState);
    }
  }, [section.id, formState]);

  useEffect(() => {
    if (section.id !== 'pi-legal-affiliate') return;

    const nextState: IntakeState = { ...formState };
    let changed = false;

    const firmOrgs = parseWholeNumber(nextState.law_firm_portal_org_count) ?? 0;
    if (String(nextState.lawyer_portal_enabled || '').trim() === '' && firmOrgs > 0) {
      nextState.lawyer_portal_enabled = 'enabled';
      changed = true;
    }

    const affiliateOrgs = parseWholeNumber(nextState.affiliate_portal_org_count) ?? 0;
    if (String(nextState.affiliate_portal_enabled || '').trim() === '' && affiliateOrgs > 0) {
      nextState.affiliate_portal_enabled = 'enabled';
      changed = true;
    }

    const caseTypes = Array.isArray(nextState.case_types) ? nextState.case_types : [];
    if (String(nextState.lop_pi_case_workflows_enabled || '').trim() === '' && caseTypes.includes('personal-injury')) {
      nextState.lop_pi_case_workflows_enabled = 'enabled';
      changed = true;
    }

    if (changed) {
      setFormState(nextState);
    }
  }, [section.id, formState]);

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
    return currentSection.fields.find((field) => getFieldError(field, formState[field.id], formState));
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
  const providerSeats = String(formState.provider_seat_total || 'pending');
  const staffSeats = String(formState.staff_seat_total || 'pending');
  const firmPortalOrgs = String(formState.law_firm_portal_org_count || 'pending');
  const affiliatePortalOrgs = String(formState.affiliate_portal_org_count || 'pending');
  const rbacApproach = String(formState.rbac_mode || 'pending');
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
                  getFieldError(field, formState[field.id], formState) ? <div className="field-error">{getFieldError(field, formState[field.id], formState)}</div> : null
                ) : null}

                {field.type === 'text' || field.type === 'email' || field.type === 'tel' || field.type === 'date' || field.type === 'number' ? (
                  <input
                    id={field.id}
                    type={field.type}
                    value={String(formState[field.id] || '')}
                    min={field.type === 'date' && field.id === 'target_go_live_date' ? getTodayDateString() : field.type === 'number' && typeof field.min === 'number' ? String(field.min) : undefined}
                    max={field.type === 'number' && typeof field.max === 'number' ? String(field.max) : undefined}
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
                    aria-invalid={Boolean((touchedFields[field.id] || attemptedSections[step]) && getFieldError(field, formState[field.id], formState))}
                    className={(touchedFields[field.id] || attemptedSections[step]) && getFieldError(field, formState[field.id], formState) ? 'field-invalid' : ''}
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
                    aria-invalid={Boolean((touchedFields[field.id] || attemptedSections[step]) && getFieldError(field, formState[field.id], formState))}
                    className={(touchedFields[field.id] || attemptedSections[step]) && getFieldError(field, formState[field.id], formState) ? 'field-invalid' : ''}
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
                    aria-invalid={Boolean((touchedFields[field.id] || attemptedSections[step]) && getFieldError(field, formState[field.id], formState))}
                    className={(touchedFields[field.id] || attemptedSections[step]) && getFieldError(field, formState[field.id], formState) ? 'field-invalid' : ''}
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
                    className={`selection-grid ${(touchedFields[field.id] || attemptedSections[step]) && getFieldError(field, formState[field.id], formState) ? 'selection-grid-invalid' : ''}`}
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
                    className={`facility-list ${(touchedFields[field.id] || attemptedSections[step]) && getFieldError(field, formState[field.id], formState) ? 'selection-grid-invalid' : ''}`}
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
                    className={`volume-profile-grid ${(touchedFields[field.id] || attemptedSections[step]) && getFieldError(field, formState[field.id], formState) ? 'selection-grid-invalid' : ''}`}
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
                    className={`template-profile-grid ${(touchedFields[field.id] || attemptedSections[step]) && getFieldError(field, formState[field.id], formState) ? 'selection-grid-invalid' : ''}`}
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
              <li>Provider seats: {providerSeats}</li>
              <li>Staff seats: {staffSeats}</li>
              <li>Law firm portals: {firmPortalOrgs}</li>
              <li>Affiliate portals: {affiliatePortalOrgs}</li>
              <li>RBAC approach: {rbacApproach}</li>
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
