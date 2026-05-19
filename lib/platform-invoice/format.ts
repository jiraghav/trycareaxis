/** YYYY-MM → "April 2026" */
export function formatUsageMonthLabel(yyyyMm: string) {
  const match = /^(\d{4})-(\d{2})$/.exec(yyyyMm.trim());
  if (!match) {
    return yyyyMm;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) {
    return yyyyMm;
  }
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(
    new Date(year, month - 1, 1),
  );
}

/** Remove legacy suffixes from stored line descriptions before Stripe display. */
export function sanitizeInvoiceLineDescription(description: string) {
  return description.replace(/\s*\(ChatGPT\)/gi, '').trim();
}
