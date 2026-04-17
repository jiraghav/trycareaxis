'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

export function AnalyticsTracker() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const el = target.closest('[data-track], a.btn, button.btn') as HTMLElement | null;
      if (!el) return;

      const explicitAction = el.getAttribute('data-track');
      const implicitAction =
        el.tagName === 'A'
          ? `cta_link_${(el as HTMLAnchorElement).getAttribute('href') ?? 'unknown'}`
          : `cta_button_${el.textContent?.trim().toLowerCase().replaceAll(' ', '_') ?? 'unknown'}`;
      const action = explicitAction || implicitAction;

      const label =
        el.getAttribute('aria-label') ||
        el.textContent?.trim() ||
        'unknown';

      const payload = {
        event: 'careaxis_cta_click',
        action,
        label,
        path: window.location.pathname,
      };

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(payload);

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'careaxis_cta_click', payload);
      }
    }

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}
