export type InvoiceDbSource = {
  id: string;
  label: string;
  url?: string;
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
  query?: string;
  /** OpenEMR web root URL, e.g. https://clinic.example.com/openemr */
  openemrBaseUrl?: string;
  /** OpenEMR site id for webhook query param (default: default). */
  openemrSiteId?: string;
};

export type AdminInvoiceLine = {
  id: string;
  lineCode: string;
  lineTypeLabel: string;
  sortOrder: number;
  description: string;
  baseAmount: number;
  baseAmountFormatted: string;
  upchargePercent: number;
  upchargeFlat: number;
  usageMonth: string;
  qty: number;
  total: number;
  totalFormatted: string;
};

export type AdminInvoice = {
  id: string;
  platformInvoiceId: string;
  invoiceNumber: string;
  title: string;
  notes: string;
  client: string;
  organization: string;
  email: string;
  userId: string;
  dueDate: string;
  dueDateSort: string;
  amount: number;
  amountFormatted: string;
  currency: string;
  state: string;
  stripeHostedUrl: string;
  stripeDashboardUrl: string;
  stripeInvoiceId: string;
  sourceId: string;
  sourceLabel: string;
  lines: AdminInvoiceLine[];
};

export type InvoiceSourceResult = {
  sourceId: string;
  sourceLabel: string;
  invoices: AdminInvoice[];
  platformClientCount: number;
  error?: string;
};

export type AdminClientRow = {
  id: string;
  client: string;
  sourceLabel: string;
  platformClientCount: number;
  invoiceCount: number;
  latestInvoice: string;
  latestStatus: string;
  lastInvoiceDate: string;
  lastInvoiceDateSort: string;
  outstanding: string;
};

export type AdminDashboardMetrics = {
  platformClients: number;
  totalInvoices: number;
  openInvoices: number;
  paidInvoices: number;
  pastDueTotal: number;
  pastDueTotalFormatted: string;
};

export type InvoiceFetchSummary = {
  sources: InvoiceSourceResult[];
  invoices: AdminInvoice[];
  clients: AdminClientRow[];
  metrics: AdminDashboardMetrics;
  pastDueTotal: number;
  pastDueTotalFormatted: string;
  configuredSourceCount: number;
};
