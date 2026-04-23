import { NextResponse } from 'next/server';

type AdminStatus = 'New lead' | 'In progress' | 'Missing items' | 'Reviewing' | 'Approved' | 'Not a fit';

function createId(prefix: string) {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${Date.now().toString().slice(-6)}-${rand}`;
}

function coerceStatus(value: unknown): AdminStatus | null {
  const allowed: AdminStatus[] = ['New lead', 'In progress', 'Missing items', 'Reviewing', 'Approved', 'Not a fit'];
  const str = typeof value === 'string' ? value.trim() : '';
  return allowed.includes(str as AdminStatus) ? (str as AdminStatus) : null;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as any;
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ ok: false, error: 'Invalid request payload.' }, { status: 400 });
  }

  const mode = String(body.mode || '').trim();
  if (!['autosave', 'step1', 'submit'].includes(mode)) {
    return NextResponse.json({ ok: false, error: 'Invalid save mode.' }, { status: 400 });
  }

  const draft = body.draft || {};

  const applicationId = String(body.applicationId || '').trim() || createId('CICAPP');
  const hasDocs =
    Array.isArray(draft?.licensureUploadIds) && draft.licensureUploadIds.length > 0 &&
    Array.isArray(draft?.insuranceUploadIds) && draft.insuranceUploadIds.length > 0;

  const explicitStatus = coerceStatus(body.adminStatus);
  const adminStatus: AdminStatus =
    mode === 'step1'
      ? 'New lead'
      : mode === 'submit'
        ? hasDocs
          ? 'Reviewing'
          : 'Missing items'
        : explicitStatus || 'In progress';

  const payload = {
    type: 'clinic_onboarding',
    source: 'cic_clinic_onboarding',
    mode,
    applicationId,
    adminStatus,
    stepIndex: Number(body.stepIndex ?? 0),
    stepId: String(body.stepId ?? 'unknown'),
    updatedAt: String(body.updatedAt ?? new Date().toISOString()),
    submittedAt: body.submittedAt ? String(body.submittedAt) : null,
    draft: {
      clinicName: String(draft.clinicName ?? ''),
      contactName: String(draft.contactName ?? ''),
      email: String(draft.email ?? ''),
      phone: String(draft.phone ?? ''),
      city: String(draft.city ?? ''),
      state: String(draft.state ?? ''),
      clinicType: String(draft.clinicType ?? ''),

      numberOfLocations: String(draft.numberOfLocations ?? ''),
      servicesOffered: String(draft.servicesOffered ?? ''),
      piExperience: String(draft.piExperience ?? ''),
      languagesSpoken: String(draft.languagesSpoken ?? ''),
      schedulingCapacity: String(draft.schedulingCapacity ?? ''),
      availability: String(draft.availability ?? ''),
      wantsPiTraining: String(draft.wantsPiTraining ?? ''),

      npi: String(draft.npi ?? ''),
      taxId: String(draft.taxId ?? ''),
      licensureNotes: String(draft.licensureNotes ?? ''),
      insuranceNotes: String(draft.insuranceNotes ?? ''),
      licensureFiles: Array.isArray(draft.licensureFiles) ? draft.licensureFiles : [],
      insuranceFiles: Array.isArray(draft.insuranceFiles) ? draft.insuranceFiles : [],
      licensureUploadIds: Array.isArray(draft.licensureUploadIds) ? draft.licensureUploadIds : [],
      insuranceUploadIds: Array.isArray(draft.insuranceUploadIds) ? draft.insuranceUploadIds : [],

      portalUsersNeeded: String(draft.portalUsersNeeded ?? ''),
      communicationMethod: String(draft.communicationMethod ?? ''),
      referralCapacity: String(draft.referralCapacity ?? ''),
      needsTransportationSupport: String(draft.needsTransportationSupport ?? ''),
      regionsServed: String(draft.regionsServed ?? ''),
    },
  };

  const webhook = process.env.CARE_AXIS_LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      // Non-blocking: webhook failures should not block user flow.
    }
  }

  return NextResponse.json({
    ok: true,
    applicationId,
    adminStatus,
  });
}

