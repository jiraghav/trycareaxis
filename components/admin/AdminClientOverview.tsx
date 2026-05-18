'use client';

import { useAdminInvoices } from '@/components/admin/AdminInvoiceProvider';

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

export function AdminClientOverview() {
  const { loading, clients, configuredSourceCount, error } = useAdminInvoices();

  return (
    <div className="container card">
      <h2 style={{ marginTop: 0 }}>Client Overview</h2>

      {error ? (
        <p className="small" style={{ color: '#ffb3b3' }}>
          {error}
        </p>
      ) : null}

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Invoices</th>
              <th>Latest Invoice</th>
              <th>Status</th>
              <th>Last Invoice</th>
              <th>Outstanding</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6}>Loading client billing data...</td>
              </tr>
            ) : null}

            {!loading && clients.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  {configuredSourceCount > 0
                    ? 'No platform databases connected.'
                    : 'Connect a database in .env.local to load client overview.'}
                </td>
              </tr>
            ) : null}

            {!loading
              ? clients.map((row) => (
                  <tr key={row.id}>
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
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
