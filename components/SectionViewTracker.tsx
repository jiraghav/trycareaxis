'use client';

import { useEffect, useMemo, useRef } from 'react';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

type TrackSection = {
  id: string;
  label: string;
};

type SectionViewTrackerProps = {
  sections: TrackSection[];
  eventPrefix: string;
};

export function SectionViewTracker({ sections, eventPrefix }: SectionViewTrackerProps) {
  const seen = useRef<Set<string>>(new Set());

  const observed = useMemo(() => {
    return sections
      .map((section) => ({
        ...section,
        selector: `#${section.id}`,
      }));
  }, [sections]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = (entry.target as HTMLElement).id;
          if (!id || seen.current.has(id)) continue;
          seen.current.add(id);

          const section = sections.find((item) => item.id === id);
          const payload = {
            event: `${eventPrefix}_section_view`,
            section: id,
            label: section?.label ?? id,
            path: window.location.pathname,
          };

          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push(payload);
          if (typeof window.gtag === 'function') {
            window.gtag('event', `${eventPrefix}_section_view`, payload);
          }
        }
      },
      { rootMargin: '-10% 0px -70% 0px', threshold: 0.1 },
    );

    const els: HTMLElement[] = [];
    for (const section of observed) {
      const el = document.querySelector(section.selector) as HTMLElement | null;
      if (!el) continue;
      els.push(el);
      observer.observe(el);
    }

    return () => {
      for (const el of els) observer.unobserve(el);
      observer.disconnect();
    };
  }, [eventPrefix, observed, sections]);

  return null;
}
