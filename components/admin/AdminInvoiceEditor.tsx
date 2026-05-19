'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { formatCurrency, roundMoney } from '@/lib/db/invoice-lines';
import { AdminInvoiceViewLinks } from '@/components/admin/AdminInvoiceActions';
import { formatUsageMonthLabel } from '@/lib/platform-invoice/format';
import {
  amountWithUpcharge,
  defaultUpchargeFlat,
  defaultUpchargePercent,
  formatUpchargeLabelFromValues,
  lineTotalFromParts,
} from '@/lib/platform-invoice/pricing';
import type {
  PlatformInvoiceEditorLine,
  PlatformInvoiceEditorState,
  PlatformInvoiceSettings,
  UsageTotalsResult,
} from '@/lib/platform-invoice/types';

type EditorLoadResponse = {
  ok: boolean;
  error?: string;
  sourceId: string;
  sourceLabel: string;
  settings: PlatformInvoiceSettings;
  usageMonths: string[];
  invoice: PlatformInvoiceEditorState;
};

type EditorLineRow = PlatformInvoiceEditorLine & { key: string };

type AdminInvoiceEditorProps = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  sourceId: string;
  sourceOptions: Array<{ id: string; label: string }>;
  invoiceId?: number;
  /** When true, database/instance is fixed to sourceId (e.g. opened from Client Overview row). */
  lockSource?: boolean;
};

function newLineKey() {
  return `line-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function withKeys(lines: PlatformInvoiceEditorLine[]): EditorLineRow[] {
  return lines.map((line) => ({ ...line, key: newLineKey() }));
}

function defaultUsageMonth(usageMonths: string[]) {
  if (!usageMonths.length) {
    return '';
  }
  const now = new Date();
  const prior = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const target = `${prior.getFullYear()}-${String(prior.getMonth() + 1).padStart(2, '0')}`;
  return usageMonths.includes(target) ? target : usageMonths[0];
}

function lineUsesUpcharge(lineCode: string) {
  return lineCode === 'openai' || lineCode === 'sms' || lineCode === 'custom';
}

function lineTotal(line: PlatformInvoiceEditorLine) {
  const qty = line.qty > 0 ? line.qty : 1;
  const pct = Math.max(0, line.upchargePercent);
  const flat = Math.max(0, line.upchargeFlat ?? 0);
  return lineTotalFromParts(line.lineCode, line.baseAmount, pct, qty, flat);
}

export function AdminInvoiceEditor({
  open,
  onClose,
  onSaved,
  sourceId,
  sourceOptions,
  invoiceId = 0,
  lockSource = false,
}: AdminInvoiceEditorProps) {
  const [activeSourceId, setActiveSourceId] = useState(sourceId);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [tab, setTab] = useState<'usage' | 'invoice'>('usage');
  const [settings, setSettings] = useState<PlatformInvoiceSettings | null>(null);
  const [usageMonths, setUsageMonths] = useState<string[]>([]);
  const [usageMonth, setUsageMonth] = useState('');
  const [usage, setUsage] = useState<UsageTotalsResult | null>(null);
  const [usageLoading, setUsageLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [stripeDaysUntilDue, setStripeDaysUntilDue] = useState(30);
  const [platformInvoiceId, setPlatformInvoiceId] = useState(0);
  const [stripeInvoiceId, setStripeInvoiceId] = useState('');
  const [stripeHostedUrl, setStripeHostedUrl] = useState('');
  const [stripeDashboardUrl, setStripeDashboardUrl] = useState('');
  const [lines, setLines] = useState<EditorLineRow[]>([]);
  const [portalReady, setPortalReady] = useState(false);

  const isEdit = platformInvoiceId > 0;
  const isLocked = Boolean(stripeInvoiceId);
  const currency = settings?.stripeCurrency ?? 'usd';
  const activeSourceLabel =
    sourceOptions.find((option) => option.id === activeSourceId)?.label ?? activeSourceId;

  const grandTotal = useMemo(() => {
    if (!settings) {
      return 0;
    }
    return lines
      .filter((line) => line.description.trim())
      .reduce((sum, line) => sum + lineTotal(line), 0);
  }, [lines]);

  useEffect(() => {
    setPortalReady(true);
  }, []);

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
    if (!open) {
      return;
    }

    setActiveSourceId(sourceId);
    setTab(invoiceId > 0 ? 'invoice' : 'usage');
    setError('');
    setMessage('');
  }, [open, sourceId, invoiceId]);

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;

    async function loadEditor() {
      setLoading(true);
      setError('');
      setMessage('');

      const url =
        invoiceId > 0
          ? `/api/admin/platform-invoices/${encodeURIComponent(activeSourceId)}/${invoiceId}`
          : `/api/admin/platform-invoices/new?sourceId=${encodeURIComponent(activeSourceId)}`;

      try {
        const response = await fetch(url, { cache: 'no-store' });
        const payload = (await response.json()) as EditorLoadResponse;
        if (!response.ok || !payload.ok) {
          throw new Error(payload.error ?? 'Unable to load invoice editor.');
        }
        if (cancelled) {
          return;
        }

        setSettings(payload.settings);
        setUsageMonths(payload.usageMonths);
        setTitle(payload.invoice.title);
        setNotes(payload.invoice.notes);
        setPlatformInvoiceId(payload.invoice.platformInvoiceId);
        setStripeInvoiceId(payload.invoice.stripeInvoiceId);
        setStripeHostedUrl(payload.invoice.stripeHostedUrl);
        setStripeDashboardUrl(payload.invoice.stripeDashboardUrl);
        setLines(
          withKeys(payload.invoice.lines).map((line) => ({
            ...line,
            baseAmount: roundMoney(line.baseAmount),
          })),
        );
        setStripeDaysUntilDue(payload.settings.stripeDaysUntilDue);
        setUsageMonth(defaultUsageMonth(payload.usageMonths));
        setUsage(null);
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load invoice editor.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadEditor();

    return () => {
      cancelled = true;
    };
  }, [open, activeSourceId, invoiceId]);

  useEffect(() => {
    if (!open || loading || !usageMonth || !activeSourceId) {
      return;
    }

    let cancelled = false;

    async function loadUsageTotals() {
      setUsageLoading(true);
      setUsage(null);

      try {
        const response = await fetch('/api/admin/platform-invoices/usage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sourceId: activeSourceId, month: usageMonth }),
        });
        const payload = (await response.json()) as UsageTotalsResult & {
          ok: boolean;
          error?: string;
        };
        if (cancelled) {
          return;
        }
        if (!response.ok || !payload.ok) {
          setError(payload.error ?? 'Unable to load usage totals.');
          return;
        }
        setError('');
        setUsage(payload);
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load usage totals.');
        }
      } finally {
        if (!cancelled) {
          setUsageLoading(false);
        }
      }
    }

    void loadUsageTotals();

    return () => {
      cancelled = true;
    };
  }, [open, loading, activeSourceId, usageMonth]);

  if (!open) {
    return null;
  }

  function updateLine(key: string, patch: Partial<EditorLineRow>) {
    setLines((current) =>
      current.map((line) => {
        if (line.key !== key) {
          return line;
        }
        const next = { ...line, ...patch };
        if (patch.lineCode) {
          if (patch.lineCode === 'monthly_platform' || patch.lineCode === 'other_charges') {
            next.usageMonth = null;
            next.upchargePercent = 0;
            next.upchargeFlat = 0;
          } else if (patch.lineCode === 'openai' && settings) {
            next.upchargePercent = defaultUpchargePercent('openai', settings);
            next.upchargeFlat = defaultUpchargeFlat('openai', settings);
            next.usageMonth = next.usageMonth || usageMonth || null;
          } else if (patch.lineCode === 'sms' && settings) {
            next.upchargePercent = defaultUpchargePercent('sms', settings);
            next.upchargeFlat = defaultUpchargeFlat('sms', settings);
            next.usageMonth = next.usageMonth || usageMonth || null;
          }
        }
        return next;
      }),
    );
  }

  function addLine() {
    setLines((current) => [
      ...current,
      {
        key: newLineKey(),
        lineCode: 'custom',
        sortOrder: (current.length + 1) * 10,
        description: '',
        baseAmount: 0,
        upchargePercent: 0,
        upchargeFlat: 0,
        usageMonth: null,
        qty: 1,
      },
    ]);
  }

  function removeLine(key: string) {
    setLines((current) => current.filter((line) => line.key !== key));
  }

  function applyUsageToLines() {
    if (!usage || !settings) {
      return;
    }
    setLines((current) =>
      current.map((line) => {
        if (line.lineCode === 'sms') {
          return { ...line, baseAmount: roundMoney(usage.smsTotal), usageMonth };
        }
        if (line.lineCode === 'openai') {
          return { ...line, baseAmount: roundMoney(usage.openaiTotal), usageMonth };
        }
        return line;
      }),
    );
    setTab('invoice');
  }

  function buildPayload() {
    return {
      title,
      notes,
      stripeDaysUntilDue,
      lines: lines
        .filter((line) => line.description.trim())
        .map((line) => ({
          lineCode: line.lineCode,
          sortOrder: line.sortOrder,
          description: line.description.trim(),
          baseAmount: roundMoney(Number(line.baseAmount) || 0),
          upchargePercent: Number(line.upchargePercent) || 0,
          upchargeFlat: Number(line.upchargeFlat) || 0,
          usageMonth: line.usageMonth,
          qty: Number(line.qty) || 1,
        })),
    };
  }

  async function saveInvoice() {
    if (!settings || isLocked) {
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    const payload = buildPayload();
    const url =
      isEdit
        ? `/api/admin/platform-invoices/${encodeURIComponent(activeSourceId)}/${platformInvoiceId}`
        : '/api/admin/platform-invoices';
    const method = isEdit ? 'PUT' : 'POST';
    const body = isEdit ? payload : { sourceId: activeSourceId, ...payload };

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const result = (await response.json()) as { ok: boolean; error?: string; invoiceId?: number };
      if (!response.ok || !result.ok) {
        throw new Error(result.error ?? 'Unable to save invoice.');
      }

      if (!isEdit && result.invoiceId) {
        setPlatformInvoiceId(result.invoiceId);
      }

      setMessage('Invoice saved.');
      onSaved();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save invoice.');
    } finally {
      setSaving(false);
    }
  }

  async function createStripeInvoice() {
    if (!settings || !isEdit || isLocked) {
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(
        `/api/admin/platform-invoices/${encodeURIComponent(activeSourceId)}/${platformInvoiceId}/stripe`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(buildPayload()),
        },
      );
      const result = (await response.json()) as {
        ok: boolean;
        error?: string;
        stripe?: {
          id: string;
          hostedInvoiceUrl?: string | null;
          dashboardUrl?: string;
        };
      };
      if (!response.ok || !result.ok) {
        throw new Error(result.error ?? 'Unable to create Stripe invoice.');
      }

      setStripeInvoiceId(result.stripe?.id ?? '');
      setStripeHostedUrl(result.stripe?.hostedInvoiceUrl ?? '');
      setStripeDashboardUrl(result.stripe?.dashboardUrl ?? '');
      setMessage(`Stripe invoice created${result.stripe?.id ? `: ${result.stripe.id}` : '.'}`);
      onSaved();
    } catch (stripeError) {
      setError(stripeError instanceof Error ? stripeError.message : 'Unable to create Stripe invoice.');
    } finally {
      setSaving(false);
    }
  }

  async function deleteInvoice() {
    if (!isEdit || isLocked) {
      return;
    }
    if (!window.confirm('Delete this draft invoice?')) {
      return;
    }

    setSaving(true);
    setError('');

    try {
      const response = await fetch(
        `/api/admin/platform-invoices/${encodeURIComponent(activeSourceId)}/${platformInvoiceId}`,
        { method: 'DELETE' },
      );
      const result = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !result.ok) {
        throw new Error(result.error ?? 'Unable to delete invoice.');
      }
      onSaved();
      onClose();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete invoice.');
    } finally {
      setSaving(false);
    }
  }

  const showSourcePicker = !lockSource && !isEdit && sourceOptions.length > 1;
  const showUsageStep = Boolean(settings) && !isLocked && !isEdit;

  if (!open || !portalReady) {
    return null;
  }

  return createPortal(
    <div className="admin-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="admin-modal admin-modal-compact"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-invoice-editor-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="admin-modal-top">
          <div className="admin-modal-header admin-modal-header-compact">
            <div className="admin-modal-header-main">
              <h2 id="admin-invoice-editor-title" className="admin-modal-title">
                {isEdit ? 'Edit invoice' : 'New invoice'}
              </h2>
              <span className="admin-instance-pill" title="EMR database instance">
                {activeSourceLabel}
              </span>
              {showUsageStep ? (
                <span className="admin-step-pill">{tab === 'usage' ? 'Usage' : 'Lines'}</span>
              ) : null}
              {isLocked ? <span className="status-pill active">Stripe</span> : null}
            </div>
            {isLocked ? (
              <AdminInvoiceViewLinks
                className="admin-modal-header-links"
                stripeHostedUrl={stripeHostedUrl}
                stripeDashboardUrl={stripeDashboardUrl}
              />
            ) : null}
            <button
              type="button"
              className="btn ghost admin-modal-close"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>

        {showSourcePicker ? (
          <div className="admin-modal-source-inline">
            <label htmlFor="admin-invoice-source">DB</label>
            <select
              id="admin-invoice-source"
              className="form-control"
              value={activeSourceId}
              onChange={(event) => setActiveSourceId(event.target.value)}
              disabled={loading || saving}
            >
              {sourceOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        </div>

        <div className="admin-modal-body">
        {error ? <div className="admin-alert admin-alert-error">{error}</div> : null}
        {message ? <div className="admin-alert admin-alert-success">{message}</div> : null}

        {loading ? (
          <div className="admin-loading-block">
            <span className="admin-loading-dot" aria-hidden />
            Loading…
          </div>
        ) : null}

        {!loading && settings ? (
          <>
            {tab === 'usage' ? (
              <div className="admin-editor-pane admin-pane-card">
                <div className="admin-inline-field">
                  <label htmlFor="admin-usage-month">Month</label>
                  <select
                    id="admin-usage-month"
                    className="form-control"
                    value={usageMonth}
                    onChange={(event) => setUsageMonth(event.target.value)}
                    disabled={isLocked || usageLoading}
                  >
                    {usageMonths.map((month) => (
                      <option key={month} value={month}>
                        {formatUsageMonthLabel(month)}
                      </option>
                    ))}
                  </select>
                  {usageLoading ? <span className="small muted">Loading…</span> : null}
                </div>

                <table className="data-table admin-nested-table admin-table-compact admin-usage-costs-table">
                  <thead>
                    <tr>
                      <th>Source</th>
                      <th>Base</th>
                      <th>Upcharge %</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        SMS{usage ? ` (${usage.smsCount})` : ''}
                      </td>
                      <td>
                        {usageLoading
                          ? '…'
                          : usage
                            ? formatCurrency(usage.smsTotal, currency)
                            : '—'}
                      </td>
                      <td className="admin-upcharge-cell">
                        {formatUpchargeLabelFromValues(
                          settings.smsUpchargePercent,
                          settings.smsUpchargeFlat,
                          currency,
                        )}
                      </td>
                      <td>
                        {usageLoading
                          ? '…'
                          : usage
                            ? formatCurrency(
                                amountWithUpcharge(
                                  usage.smsTotal,
                                  settings.smsUpchargePercent,
                                  settings.smsUpchargeFlat,
                                ),
                                currency,
                              )
                            : '—'}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        OpenAI{usage ? ` (${usage.openaiLogCount})` : ''}
                      </td>
                      <td>
                        {usageLoading
                          ? '…'
                          : usage
                            ? formatCurrency(usage.openaiTotal, currency)
                            : '—'}
                      </td>
                      <td className="admin-upcharge-cell">
                        {formatUpchargeLabelFromValues(
                          settings.openaiUpchargePercent,
                          settings.openaiUpchargeFlat,
                          currency,
                        )}
                      </td>
                      <td>
                        {usageLoading
                          ? '…'
                          : usage
                            ? formatCurrency(
                                amountWithUpcharge(
                                  usage.openaiTotal,
                                  settings.openaiUpchargePercent,
                                  settings.openaiUpchargeFlat,
                                ),
                                currency,
                              )
                            : '—'}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <th>Sum</th>
                      <th>
                        {usageLoading
                          ? '…'
                          : usage
                            ? formatCurrency(usage.smsTotal + usage.openaiTotal, currency)
                            : '—'}
                      </th>
                      <th />
                      <th>
                        {usageLoading
                          ? '…'
                          : usage
                            ? formatCurrency(
                                amountWithUpcharge(
                                  usage.smsTotal,
                                  settings.smsUpchargePercent,
                                  settings.smsUpchargeFlat,
                                ) +
                                  amountWithUpcharge(
                                    usage.openaiTotal,
                                    settings.openaiUpchargePercent,
                                    settings.openaiUpchargeFlat,
                                  ),
                                currency,
                              )
                            : '—'}
                      </th>
                    </tr>
                  </tfoot>
                </table>

              </div>
            ) : (
              <div className="admin-editor-pane admin-pane-card">
                {isLocked ? (
                  <div className="admin-alert admin-alert-info admin-alert-compact">
                    Linked to Stripe — read only.
                  </div>
                ) : null}

                <div className="admin-form-grid admin-form-grid-tight">
                <div className="form-group">
                  <label htmlFor="admin-invoice-title">Title</label>
                  <input
                    id="admin-invoice-title"
                    className="form-control"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    disabled={isLocked}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="admin-invoice-notes">Notes</label>
                  <input
                    id="admin-invoice-notes"
                    className="form-control"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    disabled={isLocked}
                    placeholder="Optional"
                  />
                </div>
                </div>

                <div className="table-wrap admin-invoice-table-wrap">
                  <table className="data-table admin-nested-table admin-table-compact admin-invoice-lines-table">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Base</th>
                        <th>+ %</th>
                        <th>Total</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {lines.map((line) => {
                        const showUpcharge = lineUsesUpcharge(line.lineCode);

                        return (
                        <tr key={line.key}>
                          <td>
                            <select
                              className="form-control"
                              value={line.lineCode}
                              onChange={(event) =>
                                updateLine(line.key, { lineCode: event.target.value })
                              }
                              disabled={isLocked}
                            >
                              <option value="monthly_platform">Monthly platform</option>
                              <option value="openai">OpenAI / AI</option>
                              <option value="sms">SMS / Text</option>
                              <option value="other_charges">Other</option>
                              <option value="custom">Custom %</option>
                            </select>
                          </td>
                          <td>
                            <input
                              className="form-control"
                              value={line.description}
                              onChange={(event) =>
                                updateLine(line.key, { description: event.target.value })
                              }
                              disabled={isLocked}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              className="form-control"
                              value={line.baseAmount}
                              onChange={(event) =>
                                updateLine(line.key, { baseAmount: Number(event.target.value) })
                              }
                              onBlur={(event) =>
                                updateLine(line.key, {
                                  baseAmount: roundMoney(Number(event.target.value)),
                                })
                              }
                              disabled={isLocked}
                            />
                          </td>
                          <td className="admin-upcharge-cell">
                            {showUpcharge ? (
                              line.lineCode === 'custom' && !isLocked ? (
                                <div className="admin-upcharge-input-wrap">
                                  <input
                                    type="number"
                                    step="0.0001"
                                    min={0}
                                    className="form-control"
                                    value={line.upchargePercent}
                                    onChange={(event) =>
                                      updateLine(line.key, {
                                        upchargePercent: Number(event.target.value),
                                      })
                                    }
                                    disabled={isLocked}
                                    aria-label="Custom upcharge percent"
                                  />
                                  <span className="admin-upcharge-suffix">%</span>
                                </div>
                              ) : settings ? (
                                <span className="admin-upcharge-label">
                                  {formatUpchargeLabelFromValues(
                                    line.upchargePercent,
                                    line.upchargeFlat ?? 0,
                                    currency,
                                  )}
                                </span>
                              ) : (
                                <span className="admin-upcharge-label">—</span>
                              )
                            ) : (
                              <span className="admin-upcharge-label muted">—</span>
                            )}
                          </td>
                          <td>{formatCurrency(lineTotal(line), currency)}</td>
                          <td>
                            {!isLocked ? (
                              <button
                                type="button"
                                className="btn ghost admin-btn-icon"
                                onClick={() => removeLine(line.key)}
                                aria-label="Remove line"
                                title="Remove line"
                              >
                                ×
                              </button>
                            ) : null}
                          </td>
                        </tr>
                      );
                      })}
                    </tbody>
                    <tfoot>
                      <tr>
                        <th colSpan={4}>Total</th>
                        <th colSpan={2}>{formatCurrency(grandTotal, currency)}</th>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {!isLocked ? (
                  <div className="admin-lines-toolbar">
                    <button type="button" className="btn secondary" onClick={addLine}>
                      Add line
                    </button>
                  </div>
                ) : null}

              </div>
            )}
          </>
        ) : null}
        </div>

        {!loading && settings && !isLocked ? (
          <div className="admin-modal-footer">
            {tab === 'usage' ? (
              <button
                type="button"
                className="btn primary"
                onClick={applyUsageToLines}
                disabled={!usage || usageLoading}
              >
                Next
              </button>
            ) : (
              <>
                {showUsageStep ? (
                  <button
                    type="button"
                    className="btn ghost"
                    onClick={() => setTab('usage')}
                    disabled={saving}
                  >
                    ← Usage
                  </button>
                ) : null}
                <button
                  type="button"
                  className="btn primary"
                  onClick={() => void saveInvoice()}
                  disabled={saving}
                >
                  {saving ? 'Saving…' : 'Save invoice'}
                </button>
                {isEdit ? (
                  <button
                    type="button"
                    className="btn secondary"
                    onClick={() => void createStripeInvoice()}
                    disabled={saving}
                  >
                    {saving ? 'Creating Stripe invoice…' : 'Create Stripe invoice'}
                  </button>
                ) : null}
                {isEdit ? (
                  <button
                    type="button"
                    className="btn ghost admin-btn-danger"
                    onClick={() => void deleteInvoice()}
                    disabled={saving}
                  >
                    Delete
                  </button>
                ) : null}
                {tab === 'invoice' ? (
                  <div className="admin-modal-footer-stripe">
                    <label htmlFor="admin-stripe-days">Payment due (days)</label>
                    <input
                      id="admin-stripe-days"
                      type="number"
                      min={1}
                      max={365}
                      className="form-control"
                      value={stripeDaysUntilDue}
                      onChange={(event) => setStripeDaysUntilDue(Number(event.target.value))}
                      disabled={saving}
                      aria-label="Stripe payment due in days"
                    />
                  </div>
                ) : null}
              </>
            )}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
