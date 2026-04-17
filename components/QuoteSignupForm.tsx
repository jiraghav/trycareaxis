'use client';

import { FormEvent, useState } from 'react';

type QuoteResponse = {
  ok: boolean;
  error?: string;
  quoteId?: string;
  paymentUrl?: string;
  acceptQuoteUrl?: string;
  launchCallUrl?: string;
  message?: string;
};

export function QuoteSignupForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QuoteResponse | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [paymentStarted, setPaymentStarted] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setResult(null);

    const formData = new FormData(event.currentTarget);

    const response = await fetch('/api/quote', {
      method: 'POST',
      body: formData,
    });

    const data = (await response.json()) as QuoteResponse;
    setResult(data);
    if (data.ok) {
      setAccepted(false);
      setPaymentStarted(false);
    }
    setLoading(false);
  }

  function openStep(url: string | undefined, setter?: (value: boolean) => void) {
    if (setter) setter(true);
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <>
      <form onSubmit={onSubmit} style={{ marginTop: 14 }}>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="organization">Clinic or organization</label>
            <input id="organization" name="organization" required placeholder="Acme Spine & Rehab" />
          </div>

          <div className="form-field">
            <label htmlFor="contact_name">Primary contact</label>
            <input id="contact_name" name="contact_name" required placeholder="Dr. Jane Doe" />
          </div>

          <div className="form-field">
            <label htmlFor="email">Work email</label>
            <input id="email" name="email" type="email" required placeholder="jane@clinic.com" />
          </div>

          <div className="form-field">
            <label htmlFor="phone">Phone</label>
            <input id="phone" name="phone" type="tel" placeholder="(555) 000-0000" />
          </div>

          <div className="form-field">
            <label htmlFor="package">Package</label>
            <select id="package" name="package" defaultValue="pi360">
              <option value="pi360">Care Axis PI360</option>
              <option value="dpc360">Care Axis DPC360</option>
              <option value="practice360">Care Axis Practice360</option>
              <option value="ortho360">Care Axis Ortho360</option>
              <option value="pain360">Care Axis Pain360</option>
              <option value="not_sure">Not sure yet</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="clinic_count">Clinic count</label>
            <select id="clinic_count" name="clinic_count" defaultValue="1">
              <option value="1">1 clinic</option>
              <option value="2-5">2-5 clinics</option>
              <option value="6-20">6-20 clinics</option>
              <option value="21-100">21-100 clinics</option>
              <option value="100+">100+ clinics</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="go_live">Go-live timeline</label>
            <select id="go_live" name="go_live" defaultValue="5-14-days">
              <option value="5-14-days">5-14 days</option>
              <option value="2-4-weeks">2-4 weeks</option>
              <option value="1-2-months">1-2 months</option>
              <option value="planning">Planning stage</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="migration">Need migration support?</label>
            <select id="migration" name="migration" defaultValue="yes">
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="not-sure">Not sure</option>
            </select>
          </div>

          <div className="form-field form-field-full">
            <label htmlFor="notes">Anything we should include in your quote?</label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Integrations, special workflows, user count, or launch constraints."
            />
          </div>

          <div className="form-field form-field-full">
            <div className="checkbox-grid">
              <label><input type="checkbox" name="consent_quote" value="yes" required /> I want to receive my quote and package scope</label>
              <label><input type="checkbox" name="consent_launch" value="yes" /> I am ready to schedule a launch call after quote approval</label>
            </div>
          </div>

          <div className="form-field form-field-full">
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="btn primary" type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Get My Quote'}
              </button>
              <a className="btn ghost" href="/live-demo" data-track="quote_form_try_live_demo">Try interactive live demo first</a>
            </div>
          </div>
        </div>
      </form>

      {result ? (
        <div className={result.ok ? 'form-response success' : 'form-response error'}>
          <p style={{ marginTop: 0 }}>
            {result.ok
              ? `${result.message ?? 'Quote request received.'} Quote ID: ${result.quoteId ?? 'Pending'}`
              : result.error ?? 'Submission failed. Please try again.'}
          </p>

          {result.ok ? (
            <div className="onboarding-step-grid" style={{ marginTop: 10 }}>
              <article className="onboarding-step done">
                <strong>Step 1: Quote Ready</strong>
                <span>Your quote and onboarding scope have been generated.</span>
              </article>

              <article className={accepted ? 'onboarding-step done' : 'onboarding-step'}>
                <strong>Step 2: Accept Quote</strong>
                <span>Review and accept to activate your account setup.</span>
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => openStep(result.acceptQuoteUrl ?? '/contact#quickstart-order', setAccepted)}
                >
                  Accept Quote
                </button>
              </article>

              <article className={paymentStarted ? 'onboarding-step done' : 'onboarding-step'}>
                <strong>Step 3: Add Payment</strong>
                <span>Submit payment to begin implementation and provisioning.</span>
                <button
                  type="button"
                  className="btn secondary"
                  disabled={!accepted}
                  onClick={() => openStep(result.paymentUrl ?? '/pricing', setPaymentStarted)}
                >
                  Add Payment
                </button>
              </article>

              <article className="onboarding-step">
                <strong>Step 4: Schedule Launch Call</strong>
                <span>Book your Google Calendar launch call with our implementation team.</span>
                <button
                  type="button"
                  className="btn primary"
                  disabled={!paymentStarted}
                  data-track="quote_form_schedule_launch_call"
                  onClick={() => openStep(result.launchCallUrl ?? '/book-call')}
                >
                  Schedule Launch Call
                </button>
              </article>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
