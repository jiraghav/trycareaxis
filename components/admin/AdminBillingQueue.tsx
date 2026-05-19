'use client';

import { Fragment, useMemo, useState } from 'react';
import { AdminInvoiceActions } from '@/components/admin/AdminInvoiceActions';
import { AdminInvoiceEditor } from '@/components/admin/AdminInvoiceEditor';
import { AdminInvoiceLinesTable } from '@/components/admin/AdminInvoiceLinesTable';
import { useAdminInvoices } from '@/components/admin/AdminInvoiceProvider';

function stateClass(state: string) {
  const normalized = state.toLowerCase().replace(/\s+/g, '-');
  if (normalized === 'paid') {
    return 'active';
  }
  if (normalized === 'past-due') {
    return 'implementation';
  }
  if (normalized === 'void') {
    return 'pending';
  }
  return 'pending';
}

type EditorTarget = {
  sourceId: string;
  invoiceId?: number;
  lockSource?: boolean;
};

export function AdminBillingQueue() {
  const { loading, error, invoices, sources, configuredSourceCount, refresh } = useAdminInvoices();
  const [expandedInvoices, setExpandedInvoices] = useState<Set<string>>(() => new Set());
  const [editorTarget, setEditorTarget] = useState<EditorTarget | null>(null);

  const sourceOptions = useMemo(
    () => sources.map((source) => ({ id: source.sourceId, label: source.sourceLabel })),
    [sources],
  );

  function toggleInvoice(invoiceId: string) {
    setExpandedInvoices((current) => {
      const next = new Set(current);
      if (next.has(invoiceId)) {
        next.delete(invoiceId);
      } else {
        next.add(invoiceId);
      }
      return next;
    });
  }

  return (
    <div className="card">
      <div className="section-header-row" style={{ marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>Billing Queue</h2>
        <div className="btn-row">
          <button className="btn ghost" type="button" onClick={refresh} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {configuredSourceCount > 0 ? (
        <div className="btn-row" style={{ marginBottom: 14, flexWrap: 'wrap' }}>
          {sources.map((source) => (
            <span
              key={source.sourceId}
              className={`status-pill ${source.error ? 'implementation' : 'active'}`}
              title={source.error ?? `${source.invoices.length} invoices loaded`}
            >
              {source.sourceLabel}
              {source.error ? ' · error' : ` · ${source.invoices.length}`}
            </span>
          ))}
        </div>
      ) : (
        <p className="small muted" style={{ marginTop: 0 }}>
          No invoice databases configured. Add <code>CARE_AXIS_INVOICE_DB_SOURCES</code> to{' '}
          <code>.env.local</code> (see <code>.env.example</code>), then restart <code>npm run dev</code>.
        </p>
      )}

      {error ? (
        <p className="small" style={{ color: '#ffb3b3', marginTop: 0 }}>
          {error}
        </p>
      ) : null}

      <p className="small muted" style={{ marginTop: 0 }}>
        Expand an invoice to view all line items.
      </p>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 44 }} aria-label="Expand" />
              <th>Invoice #</th>
              <th>Title</th>
              <th>Client</th>
              <th>Created</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Stripe</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9}>Loading invoices from connected databases...</td>
              </tr>
            ) : null}

            {!loading && invoices.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  {configuredSourceCount > 0
                    ? 'No rows returned from cic_platform_invoice.'
                    : 'Connect one or more invoice databases to populate this queue.'}
                </td>
              </tr>
            ) : null}

            {!loading
              ? invoices.map((row) => {
                  const expanded = expandedInvoices.has(row.id);

                  return (
                    <Fragment key={row.id}>
                      <tr>
                        <td>
                          <button
                            type="button"
                            className="btn ghost admin-expand-btn"
                            onClick={() => toggleInvoice(row.id)}
                            aria-expanded={expanded}
                            aria-label={
                              expanded ? `Collapse ${row.invoiceNumber}` : `Expand ${row.invoiceNumber}`
                            }
                          >
                            {expanded ? '−' : '+'}
                          </button>
                        </td>
                        <td>
                          {row.stripeHostedUrl ? (
                            <a href={row.stripeHostedUrl} target="_blank" rel="noreferrer">
                              {row.invoiceNumber}
                            </a>
                          ) : (
                            row.invoiceNumber
                          )}
                        </td>
                        <td>{row.title}</td>
                        <td>{row.sourceLabel}</td>
                        <td>{row.dueDate || '—'}</td>
                        <td>{row.amountFormatted}</td>
                        <td>
                          <span className={`status-pill ${stateClass(row.state)}`}>{row.state}</span>
                        </td>
                        <td>
                          {row.stripeInvoiceId ? (
                            <span className="small muted">Linked</span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td>
                          <AdminInvoiceActions
                            invoice={row}
                            onOpenEditor={() =>
                              setEditorTarget({
                                sourceId: row.sourceId,
                                invoiceId: Number(row.platformInvoiceId) || undefined,
                              })
                            }
                          />
                        </td>
                      </tr>
                      {expanded ? (
                        <tr className="admin-expand-row">
                          <td colSpan={9}>
                            <div className="admin-expand-panel">
                              {row.notes ? (
                                <p className="small muted" style={{ marginTop: 0 }}>
                                  Notes: {row.notes}
                                </p>
                              ) : null}
                              <AdminInvoiceLinesTable lines={row.lines} currency={row.currency} />
                            </div>
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  );
                })
              : null}
          </tbody>
        </table>
      </div>

      {sources.some((source) => source.error) ? (
        <div className="list" style={{ marginTop: 16 }}>
          {sources
            .filter((source) => source.error)
            .map((source) => (
              <p className="small" key={source.sourceId} style={{ margin: 0, color: '#ffb3b3' }}>
                <strong>{source.sourceLabel}:</strong> {source.error}
              </p>
            ))}
        </div>
      ) : null}

      {editorTarget ? (
        <AdminInvoiceEditor
          open
          sourceId={editorTarget.sourceId}
          sourceOptions={sourceOptions}
          invoiceId={editorTarget.invoiceId}
          lockSource={Boolean(editorTarget.lockSource)}
          onClose={() => setEditorTarget(null)}
          onSaved={() => {
            refresh();
          }}
        />
      ) : null}

    </div>
  );
}
