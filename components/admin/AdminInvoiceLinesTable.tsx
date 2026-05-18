import type { AdminInvoiceLine } from '@/lib/db/types';

type AdminInvoiceLinesTableProps = {
  lines: AdminInvoiceLine[];
  emptyMessage?: string;
};

export function AdminInvoiceLinesTable({
  lines,
  emptyMessage = 'No line items on this invoice.',
}: AdminInvoiceLinesTableProps) {
  if (!lines.length) {
    return <p className="small muted" style={{ margin: 0 }}>{emptyMessage}</p>;
  }

  return (
    <div className="table-wrap admin-nested-table-wrap">
      <table className="data-table admin-nested-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Description</th>
            <th>Usage month</th>
            <th>Qty</th>
            <th>Base</th>
            <th>Upcharge %</th>
            <th>Line total</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line) => (
            <tr key={line.id || `${line.lineCode}-${line.sortOrder}-${line.description}`}>
              <td>{line.lineTypeLabel}</td>
              <td>{line.description || '—'}</td>
              <td>{line.usageMonth || '—'}</td>
              <td>{line.qty}</td>
              <td>{line.baseAmountFormatted}</td>
              <td>{line.upchargePercent > 0 ? `${line.upchargePercent}%` : '—'}</td>
              <td>{line.totalFormatted}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
