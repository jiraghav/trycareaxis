export type InvoiceLineInput = {
  lineCode: string;
  sortOrder: number;
  description: string;
  baseAmount: number;
  upchargePercent: number;
  usageMonth: string | null;
  qty: number;
};

export type PlatformInvoiceSettings = {
  monthlyFee: number;
  otherCharges: number;
  openaiUpchargePercent: number;
  smsUpchargePercent: number;
  stripeCurrency: string;
  stripeDaysUntilDue: number;
  stripeSecretKey: string;
  stripeCustomerId: string;
};

export type PlatformInvoiceEditorLine = {
  lineCode: string;
  sortOrder: number;
  description: string;
  baseAmount: number;
  upchargePercent: number;
  usageMonth: string | null;
  qty: number;
};

export type PlatformInvoiceEditorState = {
  platformInvoiceId: number;
  title: string;
  notes: string;
  userId: number | null;
  currency: string;
  stripeInvoiceId: string;
  stripeHostedUrl: string;
  stripeDashboardUrl: string;
  lines: PlatformInvoiceEditorLine[];
};

export type PlatformInvoiceSavePayload = {
  title: string;
  notes: string;
  userId?: number | null;
  lines: InvoiceLineInput[];
  stripeDaysUntilDue?: number;
};

export type PlatformInvoiceDefaultsInput = {
  monthlyFee: number;
  otherCharges: number;
  openaiUpchargePercent: number;
  smsUpchargePercent: number;
  stripeDaysUntilDue: number;
  stripeWebhookSecret?: string;
};

export type PlatformInvoiceDefaultsView = PlatformInvoiceDefaultsInput & {
  stripeCurrency: string;
  hasStripeSecret: boolean;
  hasStripeCustomer: boolean;
  hasWebhookSecret: boolean;
  webhookUrl: string | null;
};

export type UsageTotalsResult = {
  month: string;
  smsTotal: number;
  smsCount: number;
  openaiTotal: number;
  openaiRows: number;
  openaiLogCount: number;
};
