'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  AdminClientRow,
  AdminDashboardMetrics,
  AdminInvoice,
  InvoiceFetchSummary,
  InvoiceSourceResult,
} from '@/lib/db/types';

type InvoiceContextValue = {
  loading: boolean;
  error: string;
  invoices: AdminInvoice[];
  clients: AdminClientRow[];
  metrics: AdminDashboardMetrics;
  sources: InvoiceSourceResult[];
  pastDueTotalFormatted: string;
  configuredSourceCount: number;
  refresh: () => void;
};

const emptyMetrics: AdminDashboardMetrics = {
  platformClients: 0,
  totalInvoices: 0,
  openInvoices: 0,
  paidInvoices: 0,
  pastDueTotal: 0,
  pastDueTotalFormatted: '$0.00',
};

const InvoiceContext = createContext<InvoiceContextValue | null>(null);

export function AdminInvoiceProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState<InvoiceFetchSummary | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadInvoices() {
      setLoading(true);
      setError('');

      try {
        const response = await fetch('/api/admin/invoices', { cache: 'no-store' });
        const payload = (await response.json()) as InvoiceFetchSummary & {
          ok?: boolean;
          error?: string;
        };

        if (!response.ok || payload.ok === false) {
          throw new Error(payload.error ?? 'Unable to load invoices.');
        }

        if (!cancelled) {
          setSummary(payload);
        }
      } catch (loadError) {
        if (!cancelled) {
          setSummary(null);
          setError(loadError instanceof Error ? loadError.message : 'Unable to load invoices.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadInvoices();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const value = useMemo<InvoiceContextValue>(
    () => ({
      loading,
      error,
      invoices: summary?.invoices ?? [],
      clients: summary?.clients ?? [],
      metrics: summary?.metrics ?? emptyMetrics,
      sources: summary?.sources ?? [],
      pastDueTotalFormatted: summary?.pastDueTotalFormatted ?? '$0.00',
      configuredSourceCount: summary?.configuredSourceCount ?? 0,
      refresh: () => setReloadKey((current) => current + 1),
    }),
    [error, loading, summary],
  );

  return <InvoiceContext.Provider value={value}>{children}</InvoiceContext.Provider>;
}

export function useAdminInvoices() {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useAdminInvoices must be used within AdminInvoiceProvider.');
  }
  return context;
}
