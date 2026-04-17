'use client';

import { FormEvent, useState } from 'react';

type DemoResponse = {
  ok: boolean;
  error?: string;
  demoId?: string;
  schedulerUrl?: string;
  message?: string;
};

export function DemoScheduleForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DemoResponse | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setResult(null);

    const formData = new FormData(event.currentTarget);

    const response = await fetch('/api/demo', {
      method: 'POST',
      body: formData,
    });

    const data = (await response.json()) as DemoResponse;
    setResult(data);
    setLoading(false);
  }

  return (
    <>
      <form onSubmit={onSubmit} style={{ marginTop: 10 }}>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="demo_name">Name</label>
            <input id="demo_name" name="demo_name" required placeholder="Your full name" />
          </div>
          <div className="form-field">
            <label htmlFor="demo_email">Email</label>
            <input id="demo_email" name="demo_email" type="email" required placeholder="you@clinic.com" />
          </div>
          <div className="form-field">
            <label htmlFor="demo_org">Organization</label>
            <input id="demo_org" name="demo_org" required placeholder="Clinic or group name" />
          </div>
          <div className="form-field">
            <label htmlFor="demo_package">Primary package of interest</label>
            <select id="demo_package" name="demo_package" defaultValue="pi360">
              <option value="pi360">Care Axis PI360</option>
              <option value="dpc360">Care Axis DPC360</option>
              <option value="practice360">Care Axis Practice360</option>
              <option value="ortho360">Care Axis Ortho360</option>
              <option value="pain360">Care Axis Pain360</option>
              <option value="not_sure">Not sure yet</option>
            </select>
          </div>
          <div className="form-field form-field-full">
            <label htmlFor="demo_goals">What do you want to see in the demo?</label>
            <textarea id="demo_goals" name="demo_goals" rows={4} placeholder="Share your top workflow goals and timeline." />
          </div>
          <div className="form-field form-field-full">
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="btn primary" type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Request Demo Session'}
              </button>
              <a className="btn ghost" href="/contact#quickstart-order" data-track="demo_form_start_trial">Start Free Trial</a>
            </div>
          </div>
        </div>
      </form>

      {result ? (
        <div className={result.ok ? 'form-response success' : 'form-response error'}>
          <p style={{ marginTop: 0 }}>
            {result.ok
              ? `${result.message ?? 'Demo request received.'} Demo ID: ${result.demoId ?? 'Pending'}`
              : result.error ?? 'Submission failed. Please try again.'}
          </p>
          {result.ok ? (
            <div className="btn-row" style={{ marginTop: 8 }}>
              <a className="btn primary" href={result.schedulerUrl ?? '/book-call'} data-track="demo_form_open_calendar">Open Google Calendar</a>
              <a className="btn secondary" href="/live-demo" data-track="demo_form_continue_live_demo">Continue in Live Demo</a>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
