'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';

type AdminStatus = 'New lead' | 'In progress' | 'Missing items' | 'Reviewing' | 'Approved' | 'Not a fit';

type ClinicOnboardingDraft = {
  applicationId?: string;
  adminStatus?: AdminStatus;
  stepIndex: number;
  updatedAt: string;
  submittedAt?: string;

  clinicName: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  clinicType: string;

  numberOfLocations: string;
  servicesOffered: string;
  piExperience: string;
  languagesSpoken: string;
  schedulingCapacity: string;
  availability: string;
  wantsPiTraining: string;

  npi: string;
  taxId: string;
  licensureNotes: string;
  insuranceNotes: string;
  licensureFiles: FileMeta[];
  insuranceFiles: FileMeta[];
  licensureUploadIds: string[];
  insuranceUploadIds: string[];

  portalUsersNeeded: string;
  communicationMethod: string;
  referralCapacity: string;
  needsTransportationSupport: string;
  regionsServed: string;

  acknowledgment: boolean;
};

type FileMeta = { name: string; size: number; type: string; lastModified: number };

type Step = {
  id: string;
  title: string;
  subtitle: string;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

const steps: Step[] = [
  { id: 'basics', title: 'Clinic basics', subtitle: 'Contact + location + specialty' },
  { id: 'operations', title: 'Operations', subtitle: 'Capacity + services + PI experience' },
  { id: 'compliance', title: 'Compliance', subtitle: 'NPI, tax ID, licensure, insurance' },
  { id: 'workflow', title: 'Workflow fit', subtitle: 'Communication + referral capacity' },
  { id: 'review', title: 'Review + submit', subtitle: 'Confirm details and submit' },
];

const STORAGE_KEY = 'cic_clinic_onboarding_draft_v1';

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix: string) {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${Date.now().toString().slice(-6)}-${rand}`;
}

function pushAnalytics(eventName: string, payload: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...payload });
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, payload);
  }
}

function defaultDraft(): ClinicOnboardingDraft {
  return {
    stepIndex: 0,
    updatedAt: nowIso(),

    clinicName: '',
    contactName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    clinicType: '',

    numberOfLocations: '1',
    servicesOffered: '',
    piExperience: 'some',
    languagesSpoken: '',
    schedulingCapacity: '',
    availability: '',
    wantsPiTraining: '',

    npi: '',
    taxId: '',
    licensureNotes: '',
    insuranceNotes: '',
    licensureFiles: [],
    insuranceFiles: [],
    licensureUploadIds: [],
    insuranceUploadIds: [],

    portalUsersNeeded: '1',
    communicationMethod: 'email',
    referralCapacity: '',
    needsTransportationSupport: 'not_sure',
    regionsServed: '',

    acknowledgment: false,
  };
}

function safeParseDraft(raw: string | null): ClinicOnboardingDraft | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ClinicOnboardingDraft>;
    if (!parsed || typeof parsed !== 'object') return null;
    const base = defaultDraft();
    return {
      ...base,
      ...parsed,
      stepIndex: typeof parsed.stepIndex === 'number' ? parsed.stepIndex : 0,
      licensureFiles: Array.isArray(parsed.licensureFiles) ? (parsed.licensureFiles as FileMeta[]) : [],
      insuranceFiles: Array.isArray(parsed.insuranceFiles) ? (parsed.insuranceFiles as FileMeta[]) : [],
      licensureUploadIds: Array.isArray(parsed.licensureUploadIds) ? (parsed.licensureUploadIds as string[]) : [],
      insuranceUploadIds: Array.isArray(parsed.insuranceUploadIds) ? (parsed.insuranceUploadIds as string[]) : [],
      acknowledgment: Boolean(parsed.acknowledgment),
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : nowIso(),
    };
  } catch {
    return null;
  }
}

function fileMeta(file: File): FileMeta {
  return { name: file.name, size: file.size, type: file.type, lastModified: file.lastModified };
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function cleanPhone(value: string) {
  return value.replace(/[^\d()+\-.\s]/g, '').slice(0, 32);
}

function requiredText(value: string) {
  return String(value || '').trim().length > 0;
}

function validateStep(stepIndex: number, draft: ClinicOnboardingDraft) {
  const errors: Record<string, string> = {};

  if (stepIndex === 0) {
    if (!requiredText(draft.clinicName)) errors.clinicName = 'Clinic name is required.';
    if (!requiredText(draft.contactName)) errors.contactName = 'Contact name is required.';
    if (!requiredText(draft.email) || !isEmail(draft.email)) errors.email = 'A valid email is required.';
    if (!requiredText(draft.phone)) errors.phone = 'Phone number is required.';
    if (!requiredText(draft.city)) errors.city = 'City is required.';
    if (!requiredText(draft.state)) errors.state = 'State is required.';
    if (!requiredText(draft.clinicType)) errors.clinicType = 'Clinic type / specialty is required.';
  }

  if (stepIndex === 1) {
    if (!requiredText(draft.servicesOffered)) errors.servicesOffered = 'Please list services offered.';
    if (!requiredText(draft.schedulingCapacity)) errors.schedulingCapacity = 'Please select a scheduling capacity.';
    if (!requiredText(draft.availability)) errors.availability = 'Please select an availability window.';
    if (draft.piExperience === 'none' && !requiredText(draft.wantsPiTraining)) {
      errors.wantsPiTraining = 'Please choose whether you want PI workflow training support.';
    }
  }

  if (stepIndex === 2) {
    if (!requiredText(draft.npi)) errors.npi = 'NPI is required.';
    if (!requiredText(draft.taxId)) errors.taxId = 'Tax ID is required.';
  }

  if (stepIndex === 3) {
    if (!requiredText(draft.referralCapacity)) errors.referralCapacity = 'Please select your referral capacity.';
    if (!requiredText(draft.regionsServed)) errors.regionsServed = 'Please list regions served.';
  }

  if (stepIndex === 4) {
    if (!draft.acknowledgment) errors.acknowledgment = 'Please confirm the acknowledgment to submit.';
  }

  return errors;
}

async function postJson(path: string, body: unknown, signal?: AbortSignal) {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });
  const data = (await response.json().catch(() => null)) as any;
  if (!response.ok) {
    const message = data?.error || 'Unable to save. Please try again.';
    throw new Error(message);
  }
  return data;
}

export function CicClinicOnboardingFlow() {
  const [draft, setDraft] = useState<ClinicOnboardingDraft>(() => defaultDraft());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const saveTimer = useRef<number | null>(null);
  const inflight = useRef<AbortController | null>(null);

  const step = draft.stepIndex;
  const currentStep = steps[step] || steps[0];
  const progressPct = Math.round(((step + 1) / steps.length) * 100);

  const complianceMissing = useMemo(() => {
    const missing: string[] = [];
    if (!draft.licensureUploadIds.length) missing.push('Licensure document');
    if (!draft.insuranceUploadIds.length) missing.push('Insurance document');
    return missing;
  }, [draft.insuranceUploadIds.length, draft.licensureUploadIds.length]);

  useEffect(() => {
    const existing = safeParseDraft(window.localStorage.getItem(STORAGE_KEY));
    if (existing) setDraft(existing);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [draft]);

  useEffect(() => {
    pushAnalytics('cic_clinic_onboarding_step_view', {
      step: currentStep.id,
      stepIndex: step,
      label: currentStep.title,
      applicationId: draft.applicationId || null,
    });
  }, [currentStep.id, currentStep.title, draft.applicationId, step]);

  function updateDraft(patch: Partial<ClinicOnboardingDraft>) {
    setDraft((current) => ({
      ...current,
      ...patch,
      updatedAt: nowIso(),
    }));
  }

  async function saveDraftToServer(nextDraft: ClinicOnboardingDraft, mode: 'autosave' | 'step1' | 'submit') {
    if (inflight.current) inflight.current.abort();
    const controller = new AbortController();
    inflight.current = controller;

    const payload = {
      event: 'clinic_onboarding_save',
      mode,
      applicationId: nextDraft.applicationId || null,
      adminStatus: nextDraft.adminStatus || null,
      stepIndex: nextDraft.stepIndex,
      stepId: steps[nextDraft.stepIndex]?.id ?? 'unknown',
      updatedAt: nextDraft.updatedAt,
      submittedAt: mode === 'submit' ? nowIso() : null,
      draft: {
        clinicName: nextDraft.clinicName,
        contactName: nextDraft.contactName,
        email: nextDraft.email,
        phone: nextDraft.phone,
        city: nextDraft.city,
        state: nextDraft.state,
        clinicType: nextDraft.clinicType,

        numberOfLocations: nextDraft.numberOfLocations,
        servicesOffered: nextDraft.servicesOffered,
        piExperience: nextDraft.piExperience,
        languagesSpoken: nextDraft.languagesSpoken,
        schedulingCapacity: nextDraft.schedulingCapacity,
        availability: nextDraft.availability,
        wantsPiTraining: nextDraft.piExperience === 'none' ? nextDraft.wantsPiTraining : '',

        npi: nextDraft.npi,
        taxId: nextDraft.taxId,
        licensureNotes: nextDraft.licensureNotes,
        insuranceNotes: nextDraft.insuranceNotes,
        licensureFiles: nextDraft.licensureFiles,
        insuranceFiles: nextDraft.insuranceFiles,
        licensureUploadIds: nextDraft.licensureUploadIds,
        insuranceUploadIds: nextDraft.insuranceUploadIds,

        portalUsersNeeded: nextDraft.portalUsersNeeded,
        communicationMethod: nextDraft.communicationMethod,
        referralCapacity: nextDraft.referralCapacity,
        needsTransportationSupport: nextDraft.needsTransportationSupport,
        regionsServed: nextDraft.regionsServed,
      },
    };

    const data = await postJson('/api/clinic-onboarding', payload, controller.signal);
    const nextApplicationId = String(data?.applicationId || nextDraft.applicationId || '');
    const nextStatus = (data?.adminStatus as AdminStatus | undefined) || nextDraft.adminStatus;

    if (nextApplicationId && nextApplicationId !== nextDraft.applicationId) {
      updateDraft({ applicationId: nextApplicationId });
    }
    if (nextStatus && nextStatus !== nextDraft.adminStatus) {
      updateDraft({ adminStatus: nextStatus });
    }
  }

  function scheduleAutosave(nextDraft: ClinicOnboardingDraft) {
    if (!nextDraft.applicationId) return;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(async () => {
      setSaving(true);
      setServerMessage(null);
      try {
        await saveDraftToServer(nextDraft, 'autosave');
        setServerMessage('Saved.');
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setServerMessage(err instanceof Error ? err.message : 'Unable to save.');
      } finally {
        setSaving(false);
      }
    }, 650);
  }

  function handleChange(field: keyof ClinicOnboardingDraft, value: string | boolean) {
    const next = {
      ...draft,
      [field]: field === 'phone' ? cleanPhone(String(value)) : value,
      updatedAt: nowIso(),
    } as ClinicOnboardingDraft;
    setDraft(next);
    if (Object.keys(errors).length) {
      const nextErrors = { ...errors };
      delete nextErrors[String(field)];
      setErrors(nextErrors);
    }
    scheduleAutosave(next);
  }

  function handleFiles(field: 'licensureFiles' | 'insuranceFiles', files: FileList | null) {
    const nextFiles = files ? Array.from(files).map(fileMeta) : [];
    const uploadField = field === 'licensureFiles' ? 'licensureUploadIds' : 'insuranceUploadIds';
    const next = {
      ...draft,
      [field]: nextFiles,
      [uploadField]: [],
      updatedAt: nowIso(),
    } as ClinicOnboardingDraft;
    setDraft(next);
    scheduleAutosave(next);

    if (!next.applicationId || !files || files.length === 0) return;
    void uploadDocs(next.applicationId, field === 'licensureFiles' ? 'licensure' : 'insurance', Array.from(files));
  }

  async function uploadDocs(applicationId: string, kind: 'licensure' | 'insurance', files: File[]) {
    setSaving(true);
    setServerMessage(null);

    const formData = new FormData();
    formData.set('applicationId', applicationId);
    formData.set('kind', kind);
    for (const file of files) formData.append('files', file);

    try {
      const response = await fetch('/api/clinic-onboarding/upload', { method: 'POST', body: formData });
      const data = (await response.json().catch(() => null)) as any;
      if (!response.ok) throw new Error(data?.error || 'Unable to upload documents.');

      const uploadIds = Array.isArray(data?.uploadIds) ? (data.uploadIds as string[]) : [];
      if (kind === 'licensure') updateDraft({ licensureUploadIds: uploadIds });
      if (kind === 'insurance') updateDraft({ insuranceUploadIds: uploadIds });
      setServerMessage(uploadIds.length ? 'Documents uploaded.' : 'Saved.');

      pushAnalytics('cic_clinic_onboarding_docs_uploaded', {
        applicationId,
        kind,
        count: uploadIds.length,
      });
    } catch (err) {
      setServerMessage(err instanceof Error ? err.message : 'Unable to upload documents.');
    } finally {
      setSaving(false);
    }
  }

  async function goNext() {
    setServerMessage(null);
    const stepErrors = validateStep(step, draft);
    if (Object.keys(stepErrors).length) {
      setErrors(stepErrors);
      pushAnalytics('cic_clinic_onboarding_validation_error', {
        step: currentStep.id,
        count: Object.keys(stepErrors).length,
      });
      return;
    }

    const nextStepIndex = Math.min(step + 1, steps.length - 1);
    const nextApplicationId = draft.applicationId || createId('CICAPP');
    const nextStatus: AdminStatus = draft.applicationId ? 'In progress' : 'New lead';
    const nextDraft: ClinicOnboardingDraft = {
      ...draft,
      applicationId: nextApplicationId,
      adminStatus: nextStatus,
      stepIndex: nextStepIndex,
      updatedAt: nowIso(),
    };

    setDraft(nextDraft);

    if (!draft.applicationId) {
      setSaving(true);
      try {
        await saveDraftToServer(nextDraft, 'step1');
        setServerMessage('Saved. Continue when ready.');
      } catch (err) {
        setServerMessage(err instanceof Error ? err.message : 'Unable to save.');
      } finally {
        setSaving(false);
      }
    } else {
      scheduleAutosave(nextDraft);
    }
  }

  function goBack() {
    setServerMessage(null);
    setDraft((current) => ({
      ...current,
      stepIndex: Math.max(0, current.stepIndex - 1),
      updatedAt: nowIso(),
    }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setServerMessage(null);

    const stepErrors = validateStep(steps.length - 1, draft);
    if (Object.keys(stepErrors).length) {
      setErrors(stepErrors);
      return;
    }

    const nextDraft: ClinicOnboardingDraft = {
      ...draft,
      applicationId: draft.applicationId || createId('CICAPP'),
      adminStatus: complianceMissing.length ? 'Missing items' : 'Reviewing',
      submittedAt: nowIso(),
      updatedAt: nowIso(),
    };

    setSaving(true);
    try {
      await saveDraftToServer(nextDraft, 'submit');
      setDraft(nextDraft);
      setSubmitted(true);
      setServerMessage(
        complianceMissing.length
          ? `Submitted. We’ll follow up for: ${complianceMissing.join(', ')}.`
          : 'Submitted. CIC will review fit and follow up shortly.',
      );
      pushAnalytics('cic_clinic_onboarding_submitted', {
        applicationId: nextDraft.applicationId,
        adminStatus: nextDraft.adminStatus,
      });
    } catch (err) {
      setServerMessage(err instanceof Error ? err.message : 'Unable to submit.');
    } finally {
      setSaving(false);
    }
  }

  function renderFieldError(id: string) {
    const error = errors[id];
    if (!error) return null;
    return (
      <p className="field-error" id={`${id}-error`} style={{ margin: 0 }}>
        {error}
      </p>
    );
  }

  const disableSubmit = saving || submitted;

  return (
    <div className="card onboarding-main cic-clinic-onboarding">
      <div className="onboarding-header">
        <div>
          <h3 style={{ marginTop: 0 }}>{currentStep.title}</h3>
          <p className="small" style={{ marginTop: 0, marginBottom: 0 }}>
            {currentStep.subtitle}
          </p>
        </div>

        <div className="onboarding-progress-chip">
          <strong>{progressPct}%</strong>
          <span>Progress • takes 3–5 minutes</span>
        </div>
      </div>

      <div className="onboarding-progress-bar" aria-hidden="true">
        <span style={{ width: `${progressPct}%` }} />
      </div>

      <div className="onboarding-stepper-compact" style={{ marginTop: 18 }}>
        <div className="onboarding-stepper-topline">
          <div className="onboarding-step-meta">
            <span className="onboarding-step-count">{`Step ${step + 1} of ${steps.length}`}</span>
            <strong>{steps[step]?.title}</strong>
          </div>
          <span className="onboarding-step-badge">{draft.applicationId ? `ID: ${draft.applicationId}` : 'Not saved yet'}</span>
        </div>
        <p className="small" style={{ margin: 0 }}>
          Autosave starts after step 1.
          {saving ? ' Saving…' : null}
          {serverMessage ? ` ${serverMessage}` : null}
        </p>
      </div>

      <form onSubmit={onSubmit} className="onboarding-form">
        {step === 0 ? (
          <div className="form-grid single-column" data-track-section="step_basics">
            <div className="form-field form-field-full">
              <label htmlFor="clinicName">Clinic name</label>
              <input
                id="clinicName"
                value={draft.clinicName}
                onChange={(e) => handleChange('clinicName', e.target.value)}
                placeholder="Enter clinic legal or brand name"
                className={errors.clinicName ? 'field-invalid' : undefined}
                aria-invalid={errors.clinicName ? 'true' : 'false'}
                aria-describedby={errors.clinicName ? 'clinicName-error' : undefined}
              />
              {renderFieldError('clinicName')}
            </div>

            <div className="form-field form-field-full">
              <label htmlFor="contactName">Main contact</label>
              <input
                id="contactName"
                value={draft.contactName}
                onChange={(e) => handleChange('contactName', e.target.value)}
                placeholder="Full name"
                className={errors.contactName ? 'field-invalid' : undefined}
                aria-invalid={errors.contactName ? 'true' : 'false'}
                aria-describedby={errors.contactName ? 'contactName-error' : undefined}
              />
              {renderFieldError('contactName')}
            </div>

            <div className="form-field form-field-full">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                value={draft.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="name@clinic.com"
                className={errors.email ? 'field-invalid' : undefined}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {renderFieldError('email')}
            </div>

            <div className="form-field form-field-full">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                value={draft.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="Best callback number"
                className={errors.phone ? 'field-invalid' : undefined}
                aria-invalid={errors.phone ? 'true' : 'false'}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
              />
              {renderFieldError('phone')}
            </div>

            <div className="form-field">
              <label htmlFor="city">City</label>
              <input
                id="city"
                value={draft.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="City"
                className={errors.city ? 'field-invalid' : undefined}
                aria-invalid={errors.city ? 'true' : 'false'}
                aria-describedby={errors.city ? 'city-error' : undefined}
              />
              {renderFieldError('city')}
            </div>

            <div className="form-field">
              <label htmlFor="state">State</label>
              <input
                id="state"
                value={draft.state}
                onChange={(e) => handleChange('state', e.target.value)}
                placeholder="State"
                className={errors.state ? 'field-invalid' : undefined}
                aria-invalid={errors.state ? 'true' : 'false'}
                aria-describedby={errors.state ? 'state-error' : undefined}
              />
              {renderFieldError('state')}
            </div>

            <div className="form-field form-field-full">
              <label htmlFor="clinicType">Clinic type / specialty</label>
              <input
                id="clinicType"
                value={draft.clinicType}
                onChange={(e) => handleChange('clinicType', e.target.value)}
                placeholder="e.g., chiropractic, medical, pain management, orthopedics"
                className={errors.clinicType ? 'field-invalid' : undefined}
                aria-invalid={errors.clinicType ? 'true' : 'false'}
                aria-describedby={errors.clinicType ? 'clinicType-error' : undefined}
              />
              {renderFieldError('clinicType')}
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="form-grid single-column" data-track-section="step_operations">
            <div className="form-field">
              <label htmlFor="numberOfLocations">Number of locations</label>
              <select
                id="numberOfLocations"
                value={draft.numberOfLocations}
                onChange={(e) => handleChange('numberOfLocations', e.target.value)}
              >
                {['1', '2', '3', '4', '5+'].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field form-field-full">
              <label htmlFor="servicesOffered">Services offered</label>
              <textarea
                id="servicesOffered"
                value={draft.servicesOffered}
                onChange={(e) => handleChange('servicesOffered', e.target.value)}
                placeholder="List core services and diagnostics (if applicable)"
                rows={4}
                className={errors.servicesOffered ? 'field-invalid' : undefined}
                aria-invalid={errors.servicesOffered ? 'true' : 'false'}
                aria-describedby={errors.servicesOffered ? 'servicesOffered-error' : undefined}
              />
              {renderFieldError('servicesOffered')}
            </div>

            <div className="form-field">
              <label htmlFor="piExperience">PI experience</label>
              <select id="piExperience" value={draft.piExperience} onChange={(e) => handleChange('piExperience', e.target.value)}>
                <option value="none">New to PI</option>
                <option value="some">Some PI experience</option>
                <option value="strong">Strong PI practice</option>
              </select>
            </div>

            {draft.piExperience === 'none' ? (
              <div className="form-field">
                <label htmlFor="wantsPiTraining">Need PI workflow support?</label>
                <select
                  id="wantsPiTraining"
                  value={draft.wantsPiTraining}
                  onChange={(e) => handleChange('wantsPiTraining', e.target.value)}
                  className={errors.wantsPiTraining ? 'field-invalid' : undefined}
                  aria-invalid={errors.wantsPiTraining ? 'true' : 'false'}
                  aria-describedby={errors.wantsPiTraining ? 'wantsPiTraining-error' : undefined}
                >
                  <option value="">Select one</option>
                  <option value="yes">Yes, training + guidance</option>
                  <option value="no">No, we’re good</option>
                </select>
                {renderFieldError('wantsPiTraining')}
              </div>
            ) : null}

            <div className="form-field">
              <label htmlFor="schedulingCapacity">Scheduling capacity</label>
              <select
                id="schedulingCapacity"
                value={draft.schedulingCapacity}
                onChange={(e) => handleChange('schedulingCapacity', e.target.value)}
                className={errors.schedulingCapacity ? 'field-invalid' : undefined}
                aria-invalid={errors.schedulingCapacity ? 'true' : 'false'}
                aria-describedby={errors.schedulingCapacity ? 'schedulingCapacity-error' : undefined}
              >
                <option value="">Select capacity</option>
                <option value="light">Light (0–10 PI patients/week)</option>
                <option value="medium">Medium (11–25 PI patients/week)</option>
                <option value="high">High (26+ PI patients/week)</option>
              </select>
              {renderFieldError('schedulingCapacity')}
            </div>

            <div className="form-field">
              <label htmlFor="availability">Same-day / next-day availability</label>
              <select
                id="availability"
                value={draft.availability}
                onChange={(e) => handleChange('availability', e.target.value)}
                className={errors.availability ? 'field-invalid' : undefined}
                aria-invalid={errors.availability ? 'true' : 'false'}
                aria-describedby={errors.availability ? 'availability-error' : undefined}
              >
                <option value="">Select one</option>
                <option value="same_day">Same-day available</option>
                <option value="next_day">Next-day available</option>
                <option value="limited">Limited availability</option>
              </select>
              {renderFieldError('availability')}
            </div>

            <div className="form-field form-field-full">
              <label htmlFor="languagesSpoken">Languages spoken (optional)</label>
              <input
                id="languagesSpoken"
                value={draft.languagesSpoken}
                onChange={(e) => handleChange('languagesSpoken', e.target.value)}
                placeholder="e.g., English, Spanish, Arabic"
              />
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="form-grid single-column" data-track-section="step_compliance">
            <div className="form-field">
              <label htmlFor="npi">NPI</label>
              <input
                id="npi"
                value={draft.npi}
                onChange={(e) => handleChange('npi', e.target.value)}
                placeholder="Enter NPI"
                className={errors.npi ? 'field-invalid' : undefined}
                aria-invalid={errors.npi ? 'true' : 'false'}
                aria-describedby={errors.npi ? 'npi-error' : undefined}
              />
              {renderFieldError('npi')}
            </div>

            <div className="form-field">
              <label htmlFor="taxId">Tax ID</label>
              <input
                id="taxId"
                value={draft.taxId}
                onChange={(e) => handleChange('taxId', e.target.value)}
                placeholder="Enter tax ID / EIN"
                className={errors.taxId ? 'field-invalid' : undefined}
                aria-invalid={errors.taxId ? 'true' : 'false'}
                aria-describedby={errors.taxId ? 'taxId-error' : undefined}
              />
              {renderFieldError('taxId')}
            </div>

            <div className="form-field form-field-full">
              <label htmlFor="licensureFiles">Licensure documents (upload)</label>
              <input
                id="licensureFiles"
                type="file"
                multiple
                onChange={(e) => handleFiles('licensureFiles', e.target.files)}
              />
              <p className="small" style={{ margin: 0 }}>
                {draft.licensureUploadIds.length
                  ? `Uploaded: ${draft.licensureUploadIds.length} file(s).`
                  : draft.licensureFiles.length
                    ? 'Selected (uploading…)'
                    : 'Optional now; required before activation.'}
              </p>
            </div>

            <div className="form-field form-field-full">
              <label htmlFor="insuranceFiles">Insurance documents (upload)</label>
              <input
                id="insuranceFiles"
                type="file"
                multiple
                onChange={(e) => handleFiles('insuranceFiles', e.target.files)}
              />
              <p className="small" style={{ margin: 0 }}>
                {draft.insuranceUploadIds.length
                  ? `Uploaded: ${draft.insuranceUploadIds.length} file(s).`
                  : draft.insuranceFiles.length
                    ? 'Selected (uploading…)'
                    : 'Optional now; required before activation.'}
              </p>
            </div>

            <div className="form-field form-field-full">
              <label htmlFor="licensureNotes">Licensure notes (optional)</label>
              <textarea
                id="licensureNotes"
                value={draft.licensureNotes}
                onChange={(e) => handleChange('licensureNotes', e.target.value)}
                rows={3}
                placeholder="Anything we should know about licensure or provider coverage"
              />
            </div>

            <div className="form-field form-field-full">
              <label htmlFor="insuranceNotes">Insurance notes (optional)</label>
              <textarea
                id="insuranceNotes"
                value={draft.insuranceNotes}
                onChange={(e) => handleChange('insuranceNotes', e.target.value)}
                rows={3}
                placeholder="Insurance details, payer notes, or operational constraints"
              />
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="form-grid single-column" data-track-section="step_workflow">
            <div className="form-field">
              <label htmlFor="portalUsersNeeded">Portal users needed</label>
              <select
                id="portalUsersNeeded"
                value={draft.portalUsersNeeded}
                onChange={(e) => handleChange('portalUsersNeeded', e.target.value)}
              >
                {['1', '2', '3', '4', '5+'].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="communicationMethod">Best communication method</label>
              <select
                id="communicationMethod"
                value={draft.communicationMethod}
                onChange={(e) => handleChange('communicationMethod', e.target.value)}
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="text">Text</option>
              </select>
            </div>

            <div className="form-field form-field-full">
              <label htmlFor="referralCapacity">Referral capacity</label>
              <select
                id="referralCapacity"
                value={draft.referralCapacity}
                onChange={(e) => handleChange('referralCapacity', e.target.value)}
                className={errors.referralCapacity ? 'field-invalid' : undefined}
                aria-invalid={errors.referralCapacity ? 'true' : 'false'}
                aria-describedby={errors.referralCapacity ? 'referralCapacity-error' : undefined}
              >
                <option value="">Select one</option>
                <option value="limited">Limited capacity right now</option>
                <option value="steady">Steady capacity</option>
                <option value="expanding">Expanding / can take more volume</option>
              </select>
              {renderFieldError('referralCapacity')}
            </div>

            <div className="form-field form-field-full">
              <label htmlFor="needsTransportationSupport">Transportation / scheduling support needs</label>
              <select
                id="needsTransportationSupport"
                value={draft.needsTransportationSupport}
                onChange={(e) => handleChange('needsTransportationSupport', e.target.value)}
              >
                <option value="not_sure">Not sure</option>
                <option value="yes">Yes, we want support</option>
                <option value="no">No, we handle it</option>
              </select>
            </div>

            {draft.needsTransportationSupport === 'yes' ? (
              <div className="card" style={{ marginTop: 0 }}>
                <p className="small" style={{ margin: 0 }}>
                  Great — CIC can coordinate scheduling + transportation logistics so your front desk stays focused on care delivery.
                </p>
              </div>
            ) : null}

            <div className="form-field form-field-full">
              <label htmlFor="regionsServed">Regions served</label>
              <textarea
                id="regionsServed"
                value={draft.regionsServed}
                onChange={(e) => handleChange('regionsServed', e.target.value)}
                placeholder="List cities/areas you serve"
                rows={3}
                className={errors.regionsServed ? 'field-invalid' : undefined}
                aria-invalid={errors.regionsServed ? 'true' : 'false'}
                aria-describedby={errors.regionsServed ? 'regionsServed-error' : undefined}
              />
              {renderFieldError('regionsServed')}
            </div>
          </div>
        ) : null}

        {step === 4 ? (
          <div className="form-grid single-column" data-track-section="step_review">
            <div className="card" style={{ marginTop: 0 }}>
              <p className="panel-title">Summary</p>
              <ul className="list" style={{ marginBottom: 0 }}>
                <li>
                  <strong>Clinic:</strong> {draft.clinicName || '—'} ({draft.city || '—'}, {draft.state || '—'})
                </li>
                <li>
                  <strong>Contact:</strong> {draft.contactName || '—'} • {draft.email || '—'} • {draft.phone || '—'}
                </li>
                <li>
                  <strong>Type:</strong> {draft.clinicType || '—'} • <strong>Locations:</strong> {draft.numberOfLocations || '—'}
                </li>
                <li>
                  <strong>PI experience:</strong> {draft.piExperience}
                </li>
                <li>
                  <strong>Compliance:</strong> {draft.npi ? 'NPI' : 'NPI missing'}, {draft.taxId ? 'Tax ID' : 'Tax ID missing'}
                </li>
                <li>
                  <strong>Docs:</strong>{' '}
                  {complianceMissing.length ? `Missing: ${complianceMissing.join(', ')}` : 'Licensure + insurance uploaded'}
                </li>
              </ul>
            </div>

            <div className="form-field form-field-full" style={{ marginTop: 12 }}>
              <label className="sr-only" htmlFor="acknowledgment">
                Acknowledgment
              </label>
              <div className={errors.acknowledgment ? 'selection-grid-invalid' : undefined} style={{ padding: 12, borderRadius: 14 }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <input
                    id="acknowledgment"
                    type="checkbox"
                    checked={draft.acknowledgment}
                    onChange={(e) => handleChange('acknowledgment', e.target.checked)}
                    style={{ marginTop: 2 }}
                  />
                  <span className="small" style={{ color: '#dce9f6' }}>
                    I confirm the information above is accurate to the best of my knowledge, and I understand CIC may request additional items to
                    complete onboarding and activation.
                  </span>
                </label>
                {renderFieldError('acknowledgment')}
              </div>
            </div>

            {draft.adminStatus ? (
              <p className="small" style={{ marginTop: 10, marginBottom: 0 }}>
                Internal status: <strong>{draft.adminStatus}</strong>
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="onboarding-actions" style={{ marginTop: 22 }}>
          <button
            type="button"
            className="btn ghost"
            onClick={goBack}
            disabled={step === 0 || saving}
            data-track={`cic_onboarding_back_${currentStep.id}`}
          >
            Back
          </button>

          {step < steps.length - 1 ? (
            <button
              type="button"
              className="btn primary"
              onClick={goNext}
              disabled={saving}
              data-track={`cic_onboarding_continue_${currentStep.id}`}
            >
              Continue
            </button>
          ) : (
            <button type="submit" className="btn primary" disabled={disableSubmit} data-track="cic_onboarding_submit">
              {submitted ? 'Submitted' : 'Submit application'}
            </button>
          )}
        </div>
      </form>

      {draft.applicationId ? (
        <div className="form-response" style={{ marginTop: 18 }}>
          <p className="small" style={{ margin: 0 }}>
            Your application is autosaving under <strong>{draft.applicationId}</strong>. You can close this page and return later on the same device.
          </p>
        </div>
      ) : null}
    </div>
  );
}
