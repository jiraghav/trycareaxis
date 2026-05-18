'use client';

import { useAdminInvoices } from '@/components/admin/AdminInvoiceProvider';

export function AdminPastDueKpi() {
  const { loading, pastDueTotalFormatted } = useAdminInvoices();

  return <strong>{loading ? '...' : pastDueTotalFormatted}</strong>;
}
