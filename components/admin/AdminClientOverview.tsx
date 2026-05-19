'use client';

import { Fragment, useMemo, useState } from 'react';
import { AdminInvoiceEditor } from '@/components/admin/AdminInvoiceEditor';
import { AdminInvoiceSettings } from '@/components/admin/AdminInvoiceSettings';
import { AdminInvoiceActions } from '@/components/admin/AdminInvoiceActions';
import { AdminInvoiceLinesTable } from '@/components/admin/AdminInvoiceLinesTable';
import { useAdminInvoices } from '@/components/admin/AdminInvoiceProvider';
import type { AdminInvoice } from '@/lib/db/types';

function statusClass(status: string) {
  const normalized = status.toLowerCase().replace(/\s+/g, '-');
  if (normalized === 'paid' || normalized === 'active') {
    return 'active';
  }
  if (normalized === 'past-due' || normalized === 'at-risk') {
    return 'implementation';
  }
  return 'pending';
}

function ExpandToggle({
  expanded,
  onClick,
  label,
}: {
  expanded: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      className="btn ghost admin-expand-btn"
      onClick={onClick}
      aria-expanded={expanded}
      aria-label={label}
    >
      {expanded ? '−' : '+'}
    </button>
  );
}

function InvoiceBlock({
  invoice,
  expanded,
  onToggle,
  onEdit,
}: {
  invoice: AdminInvoice;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
}) {
  const lineCount = invoice.lines.length;

  return (
    <article className="admin-invoice-block">
      <div className="admin-invoice-block-header admin-invoice-block-header-toggle">
        <ExpandToggle
          expanded={expanded}
          onClick={onToggle}
          label={
            expanded
              ? `Collapse invoice ${invoice.invoiceNumber}`
              : `Expand invoice ${invoice.invoiceNumber}`
          }
        />
        <div className="admin-invoice-block-title">
          <strong>
            {invoice.stripeHostedUrl ? (
              <a href={invoice.stripeHostedUrl} target="_blank" rel="noreferrer">
                {invoice.invoiceNumber}
              </a>
            ) : (
              invoice.invoiceNumber
            )}
          </strong>
          <span className="small muted"> · {invoice.title}</span>
          {invoice.client &&
          invoice.client !== invoice.sourceLabel &&
          invoice.client.toLowerCase() !== 'unknown client' ? (
            <span className="small muted"> · {invoice.client}</span>
          ) : null}
          {!expanded && lineCount > 0 ? (
            <span className="small muted"> · {lineCount} line items</span>
          ) : null}
        </div>
        <div className="admin-invoice-block-meta">
          <span>{invoice.dueDate || '—'}</span>
          <span className={`status-pill ${statusClass(invoice.state)}`}>{invoice.state}</span>
          <strong>{invoice.amountFormatted}</strong>
          <AdminInvoiceActions invoice={invoice} onOpenEditor={onEdit} />
        </div>
      </div>
      {expanded ? (
        <div className="admin-invoice-block-body">
          {invoice.notes ? (
            <p className="small muted" style={{ margin: '0 0 10px' }}>
              Notes: {invoice.notes}
            </p>
          ) : null}
          <AdminInvoiceLinesTable lines={invoice.lines} />
        </div>
      ) : null}
    </article>
  );
}

type EditorTarget = {
  sourceId: string;
  invoiceId?: number;
  lockSource: boolean;
};

export function AdminClientOverview() {
  const { loading, clients, invoices, sources, configuredSourceCount, error, refresh } =
    useAdminInvoices();
  const [expandedClients, setExpandedClients] = useState<Set<string>>(() => new Set());
  const [expandedInvoices, setExpandedInvoices] = useState<Set<string>>(() => new Set());
  const [editorTarget, setEditorTarget] = useState<EditorTarget | null>(null);
  const [settingsSourceId, setSettingsSourceId] = useState<string | null>(null);

  const sourceOptions = useMemo(
    () => sources.map((source) => ({ id: source.sourceId, label: source.sourceLabel })),
    [sources],
  );

  const invoicesBySource = useMemo(() => {
    const map = new Map<string, AdminInvoice[]>();
    for (const invoice of invoices) {
      const list = map.get(invoice.sourceId) ?? [];
      list.push(invoice);
      map.set(invoice.sourceId, list);
    }
    for (const [sourceId, list] of map) {
      list.sort((left, right) => right.dueDateSort.localeCompare(left.dueDateSort));
      map.set(sourceId, list);
    }
    return map;
  }, [invoices]);

  function toggleClient(clientId: string) {
    const willCollapse = expandedClients.has(clientId);
    setExpandedClients((current) => {
      const next = new Set(current);
      if (willCollapse) {
        next.delete(clientId);
      } else {
        next.add(clientId);
      }
      return next;
    });

    if (willCollapse) {
      setExpandedInvoices((current) => {
        const next = new Set(current);
        for (const invoice of invoicesBySource.get(clientId) ?? []) {
          next.delete(invoice.id);
        }
        return next;
      });
    }
  }

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
    <div className="container card">
      <h2 style={{ marginTop: 0 }}>Client Overview</h2>
      <p className="small muted" style={{ marginTop: 0 }}>
        Expand a client to view invoices, then expand an invoice to see line items. Use Add invoice or
        Invoice defaults per instance.
      </p>

      {error ? (
        <p className="small" style={{ color: '#ffb3b3' }}>
          {error}
        </p>
      ) : null}

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 44 }} aria-label="Expand" />
              <th>Client</th>
              <th>Invoices</th>
              <th>Latest Invoice</th>
              <th>Status</th>
              <th>Last Invoice</th>
              <th>Outstanding</th>
              <th className="admin-table-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8}>Loading client billing data...</td>
              </tr>
            ) : null}

            {!loading && clients.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  {configuredSourceCount > 0
                    ? 'No platform databases connected.'
                    : 'Connect a database in .env.local to load client overview.'}
                </td>
              </tr>
            ) : null}

            {!loading
              ? clients.map((row) => {
                  const expanded = expandedClients.has(row.id);
                  const clientInvoices = invoicesBySource.get(row.id) ?? [];

                  return (
                    <Fragment key={row.id}>
                      <tr>
                        <td>
                          <ExpandToggle
                            expanded={expanded}
                            onClick={() => toggleClient(row.id)}
                            label={expanded ? `Collapse ${row.client}` : `Expand ${row.client}`}
                          />
                        </td>
                        <td>{row.client}</td>
                        <td>{row.invoiceCount}</td>
                        <td>{row.latestInvoice}</td>
                        <td>
                          <span className={`status-pill ${statusClass(row.latestStatus)}`}>
                            {row.latestStatus}
                          </span>
                        </td>
                        <td>{row.lastInvoiceDate}</td>
                        <td>{row.outstanding}</td>
                        <td className="admin-table-actions">
                          <div className="admin-table-actions-row">
                            <button
                              type="button"
                              className="btn primary admin-btn-compact"
                              onClick={() =>
                                setEditorTarget({
                                  sourceId: row.id,
                                  lockSource: true,
                                })
                              }
                            >
                              Add invoice
                            </button>
                            <button
                              type="button"
                              className="btn secondary admin-btn-compact"
                              onClick={() => setSettingsSourceId(row.id)}
                            >
                              Invoice defaults
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expanded ? (
                        <tr className="admin-expand-row">
                          <td colSpan={8}>
                            <div className="admin-expand-panel">
                              {clientInvoices.length === 0 ? (
                                <p className="small muted" style={{ margin: 0 }}>
                                  No invoices for this client.{' '}
                                  <button
                                    type="button"
                                    className="btn ghost admin-btn-compact"
                                    style={{ marginLeft: 6 }}
                                    onClick={() =>
                                      setEditorTarget({
                                        sourceId: row.id,
                                        lockSource: true,
                                      })
                                    }
                                  >
                                    Add first invoice
                                  </button>
                                </p>
                              ) : (
                                clientInvoices.map((invoice) => (
                                  <InvoiceBlock
                                    key={invoice.id}
                                    invoice={invoice}
                                    expanded={expandedInvoices.has(invoice.id)}
                                    onToggle={() => toggleInvoice(invoice.id)}
                                    onEdit={() =>
                                      setEditorTarget({
                                        sourceId: row.id,
                                        invoiceId: Number(invoice.platformInvoiceId) || undefined,
                                        lockSource: true,
                                      })
                                    }
                                  />
                                ))
                              )}
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

      {editorTarget ? (
        <AdminInvoiceEditor
          open
          sourceId={editorTarget.sourceId}
          sourceOptions={sourceOptions}
          invoiceId={editorTarget.invoiceId}
          lockSource={editorTarget.lockSource}
          onClose={() => setEditorTarget(null)}
          onSaved={() => {
            refresh();
          }}
        />
      ) : null}

      <AdminInvoiceSettings
        open={settingsSourceId !== null}
        sourceOptions={sourceOptions}
        initialSourceId={settingsSourceId ?? ''}
        onClose={() => setSettingsSourceId(null)}
      />
    </div>
  );
}
