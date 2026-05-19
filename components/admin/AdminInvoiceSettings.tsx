'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { PlatformInvoiceDefaultsView } from '@/lib/platform-invoice/types';

type SourceOption = { id: string; label: string };

type AdminInvoiceSettingsProps = {
  open: boolean;
  onClose: () => void;
  sourceOptions: SourceOption[];
  initialSourceId?: string;
};

type LoadResponse = {
  ok: boolean;
  error?: string;
  sourceId: string;
  sourceLabel: string;
  defaults: PlatformInvoiceDefaultsView;
};

const emptyDefaults: PlatformInvoiceDefaultsView = {
  monthlyFee: 0,
  otherCharges: 0,
  openaiUpchargePercent: 0,
  smsUpchargePercent: 0,
  stripeDaysUntilDue: 30,
  stripeCurrency: 'usd',
  hasStripeSecret: false,
  hasStripeCustomer: false,
  hasWebhookSecret: false,
  webhookUrl: null,
};

export function AdminInvoiceSettings({
  open,
  onClose,
  sourceOptions,
  initialSourceId = '',
}: AdminInvoiceSettingsProps) {
  const [portalReady, setPortalReady] = useState(false);
  const [activeSourceId, setActiveSourceId] = useState(initialSourceId || sourceOptions[0]?.id || '');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [defaults, setDefaults] = useState<PlatformInvoiceDefaultsView>(emptyDefaults);

  const activeSourceLabel =
    sourceOptions.find((option) => option.id === activeSourceId)?.label ?? activeSourceId;

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }
    setActiveSourceId(initialSourceId || sourceOptions[0]?.id || '');
    setError('');
    setMessage('');
  }, [open, initialSourceId, sourceOptions]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open || !activeSourceId) {
      return;
    }

    let cancelled = false;

    async function loadDefaults() {
      setLoading(true);
      setError('');
      setMessage('');

      try {
        const response = await fetch(
          `/api/admin/platform-invoices/settings?sourceId=${encodeURIComponent(activeSourceId)}`,
          { cache: 'no-store' },
        );
        const payload = (await response.json()) as LoadResponse;
        if (!response.ok || !payload.ok) {
          throw new Error(payload.error ?? 'Unable to load invoice defaults.');
        }
        if (!cancelled) {
          setDefaults(payload.defaults);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load invoice defaults.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadDefaults();

    return () => {
      cancelled = true;
    };
  }, [open, activeSourceId]);

  async function saveDefaults() {
    if (!activeSourceId) {
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/admin/platform-invoices/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceId: activeSourceId,
          monthlyFee: defaults.monthlyFee,
          otherCharges: defaults.otherCharges,
          openaiUpchargePercent: defaults.openaiUpchargePercent,
          smsUpchargePercent: defaults.smsUpchargePercent,
          stripeDaysUntilDue: defaults.stripeDaysUntilDue,
        }),
      });
      const payload = (await response.json()) as LoadResponse;
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? 'Unable to save invoice defaults.');
      }
      setDefaults(payload.defaults);
      setMessage('Settings saved.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save invoice defaults.');
    } finally {
      setSaving(false);
    }
  }

  function updateDefaults(patch: Partial<PlatformInvoiceDefaultsView>) {
    setDefaults((current) => ({ ...current, ...patch }));
  }

  if (!open || !portalReady) {
    return null;
  }

  return createPortal(
    <div className="admin-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="admin-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-invoice-settings-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="admin-modal-top">
          <div className="admin-modal-header">
            <div>
              <p className="admin-modal-eyebrow">Platform billing</p>
              <h2 id="admin-invoice-settings-title" className="admin-modal-title">
                Invoice defaults
              </h2>
              <div className="admin-modal-meta">
                <span className="admin-instance-pill">Instance: {activeSourceLabel}</span>
              </div>
            </div>
            <button
              type="button"
              className="btn ghost admin-modal-close"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>

        </div>

        <div className="admin-modal-body">
          {error ? <div className="admin-alert admin-alert-error">{error}</div> : null}
          {message ? <div className="admin-alert admin-alert-success">{message}</div> : null}

          {loading ? (
            <div className="admin-loading-block">
              <span className="admin-loading-dot" aria-hidden />
              Loading defaults…
            </div>
          ) : (
            <div className="admin-editor-pane admin-pane-card">
              <div className="admin-form-grid">
                <div className="form-group">
                  <label htmlFor="admin-default-monthly-fee">Default monthly platform fee</label>
                  <input
                    id="admin-default-monthly-fee"
                    type="number"
                    step="0.01"
                    min={0}
                    className="form-control"
                    value={defaults.monthlyFee}
                    onChange={(event) =>
                      updateDefaults({ monthlyFee: Number(event.target.value) })
                    }
                    disabled={saving}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="admin-default-other-charges">Default other charges</label>
                  <input
                    id="admin-default-other-charges"
                    type="number"
                    step="0.01"
                    min={0}
                    className="form-control"
                    value={defaults.otherCharges}
                    onChange={(event) =>
                      updateDefaults({ otherCharges: Number(event.target.value) })
                    }
                    disabled={saving}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="admin-default-openai-upcharge">Default OpenAI / AI upcharge %</label>
                  <input
                    id="admin-default-openai-upcharge"
                    type="number"
                    step="0.0001"
                    min={0}
                    className="form-control"
                    value={defaults.openaiUpchargePercent}
                    onChange={(event) =>
                      updateDefaults({ openaiUpchargePercent: Number(event.target.value) })
                    }
                    disabled={saving}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="admin-default-sms-upcharge">Default SMS / Text upcharge %</label>
                  <input
                    id="admin-default-sms-upcharge"
                    type="number"
                    step="0.0001"
                    min={0}
                    className="form-control"
                    value={defaults.smsUpchargePercent}
                    onChange={(event) =>
                      updateDefaults({ smsUpchargePercent: Number(event.target.value) })
                    }
                    disabled={saving}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="admin-default-stripe-days">Default Stripe payment due (days)</label>
                  <input
                    id="admin-default-stripe-days"
                    type="number"
                    step={1}
                    min={1}
                    max={365}
                    className="form-control"
                    value={defaults.stripeDaysUntilDue}
                    onChange={(event) =>
                      updateDefaults({ stripeDaysUntilDue: Number(event.target.value) })
                    }
                    disabled={saving}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="admin-modal-footer">
          <button
            type="button"
            className="btn primary"
            onClick={() => void saveDefaults()}
            disabled={loading || saving || !activeSourceId}
          >
            {saving ? 'Saving…' : 'Save settings'}
          </button>
          <button type="button" className="btn ghost" onClick={onClose} disabled={saving}>
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
