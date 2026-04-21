'use client';

import { useEffect, useId, useState } from 'react';

function withAutoplay(url: string) {
  try {
    const parsed = new URL(url);
    parsed.searchParams.set('autoplay', '1');
    return parsed.toString();
  } catch {
    const joiner = url.includes('?') ? '&' : '?';
    return `${url}${joiner}autoplay=1`;
  }
}

type VideoModalProps = {
  embedUrl: string;
  title: string;
  buttonLabel?: string;
  buttonClassName?: string;
  buttonAriaLabel?: string;
  children?: React.ReactNode;
};

export function VideoModal({
  embedUrl,
  title,
  buttonLabel = 'Watch Demo',
  buttonClassName = 'btn primary cta-large',
  buttonAriaLabel,
  children,
}: VideoModalProps) {
  const [open, setOpen] = useState(false);
  const [primed, setPrimed] = useState(false);
  const [openNonce, setOpenNonce] = useState(0);
  const titleId = useId();
  const ariaLabel = buttonAriaLabel ?? buttonLabel;

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prime = () => setPrimed(true);

    if (document.readyState === 'complete') {
      prime();
      return;
    }

    window.addEventListener('load', prime, { once: true });
    return () => window.removeEventListener('load', prime);
  }, []);

  return (
    <>
      <button
        type="button"
        className={buttonClassName}
        onClick={() => {
          setOpen(true);
          setOpenNonce((value) => value + 1);
        }}
        aria-label={ariaLabel}
      >
        {children ?? buttonLabel}
      </button>

      {primed ? (
        <div className="ca-modal-preload" aria-hidden="true">
          <iframe
            tabIndex={-1}
            title={`${title} (preload)`}
            src={embedUrl}
            allow="autoplay; fullscreen; picture-in-picture"
            referrerPolicy="no-referrer"
            loading="eager"
          />
        </div>
      ) : null}

      {open ? (
        <div className="ca-modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
          <button
            type="button"
            className="ca-modal-backdrop"
            aria-label="Close video modal"
            onClick={() => setOpen(false)}
          />

          <div className="ca-modal-panel">
            <div className="ca-modal-header">
              <h3 id={titleId} className="ca-modal-title">
                {title}
              </h3>
              <button type="button" className="btn ghost" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>

            <div className="ca-modal-video">
              <iframe
                title={title}
                src={withAutoplay(embedUrl)}
                allow="autoplay; fullscreen; picture-in-picture"
                referrerPolicy="no-referrer"
                loading="eager"
                allowFullScreen
                key={openNonce}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
