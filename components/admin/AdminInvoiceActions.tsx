'use client';

import type { AdminInvoice } from '@/lib/db/types';

export type AdminInvoiceViewLinksProps = {
  stripeHostedUrl?: string;
  stripeDashboardUrl?: string;
  onOpenEditor?: () => void;
  className?: string;
};

export function AdminInvoiceViewLinks({
  stripeHostedUrl = '',
  stripeDashboardUrl = '',
  onOpenEditor,
  className,
}: AdminInvoiceViewLinksProps) {
  const hostedUrl = stripeHostedUrl.trim();
  const dashboardUrl = stripeDashboardUrl.trim();

  function viewInvoice() {
    if (hostedUrl) {
      window.open(hostedUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    onOpenEditor?.();
  }

  return (
    <div className={className ? `${className} admin-table-actions-row` : 'admin-table-actions-row'}>
      <button type="button" className="btn ghost admin-btn-compact" onClick={viewInvoice}>
        View invoice
      </button>
      {dashboardUrl ? (
        <a
          href={dashboardUrl}
          target="_blank"
          rel="noreferrer"
          className="btn secondary admin-btn-compact"
        >
          View in Stripe dashboard
        </a>
      ) : (
        <button
          type="button"
          className="btn secondary admin-btn-compact"
          disabled
          title="Available after a Stripe invoice is created"
        >
          View in Stripe dashboard
        </button>
      )}
    </div>
  );
}

type AdminInvoiceActionsProps = {
  invoice: AdminInvoice;
  onOpenEditor: () => void;
};

export function AdminInvoiceActions({ invoice, onOpenEditor }: AdminInvoiceActionsProps) {
  return (
    <AdminInvoiceViewLinks
      stripeHostedUrl={invoice.stripeHostedUrl}
      stripeDashboardUrl={invoice.stripeDashboardUrl}
      onOpenEditor={onOpenEditor}
    />
  );
}
