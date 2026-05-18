'use client';

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

export function AdminBillingQueue() {
  const { loading, error, invoices, sources, configuredSourceCount, refresh } = useAdminInvoices();

  return (
    <div className="card">
      <div className="section-header-row" style={{ marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>Billing Queue</h2>
        <button className="btn ghost" type="button" onClick={refresh} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
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

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Title</th>
              <th>Client</th>
              <th>Created</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Stripe</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7}>Loading invoices from connected databases...</td>
              </tr>
            ) : null}

            {!loading && invoices.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  {configuredSourceCount > 0
                    ? 'No rows returned from cic_platform_invoice.'
                    : 'Connect one or more invoice databases to populate this queue.'}
                </td>
              </tr>
            ) : null}

            {!loading
              ? invoices.map((row) => (
                  <tr key={row.id}>
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
                      {row.stripeDashboardUrl ? (
                        <a href={row.stripeDashboardUrl} target="_blank" rel="noreferrer" className="small">
                          Dashboard
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))
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
    </div>
  );
}
