'use client';

import { useAdminInvoices } from '@/components/admin/AdminInvoiceProvider';

export function AdminKpiGrid() {
  const { loading, metrics, configuredSourceCount } = useAdminInvoices();

  if (loading) {
    return (
      <div className="admin-kpi-grid" style={{ marginTop: 14 }}>
        {['Platform Clients', 'Total Invoices', 'Outstanding Total', 'Open Invoices'].map((label) => (
          <div className="admin-kpi" key={label}>
            <span>{label}</span>
            <strong>...</strong>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="admin-kpi-grid" style={{ marginTop: 14 }}>
      <div className="admin-kpi">
        <span>Platform Clients</span>
        <strong>{configuredSourceCount > 0 ? configuredSourceCount : '—'}</strong>
      </div>
      <div className="admin-kpi">
        <span>Total Invoices</span>
        <strong>{configuredSourceCount > 0 ? metrics.totalInvoices : '—'}</strong>
      </div>
      <div className="admin-kpi">
        <span>Outstanding Total</span>
        <strong>{metrics.pastDueTotalFormatted}</strong>
      </div>
      <div className="admin-kpi">
        <span>Open Invoices</span>
        <strong>{configuredSourceCount > 0 ? metrics.openInvoices : '—'}</strong>
      </div>
    </div>
  );
}
