type FinalCtaPanelProps = {
  eyebrow: string;
  title: string;
  copy: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  tertiaryHref?: string;
  tertiaryLabel?: string;
};

export function FinalCtaPanel({
  eyebrow,
  title,
  copy,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  tertiaryHref,
  tertiaryLabel,
}: FinalCtaPanelProps) {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container card final-cta-panel" style={{ padding: 36 }}>
        <div className="eyebrow">{eyebrow}</div>
        <h2 className="section-title" style={{ marginTop: 8 }}>{title}</h2>
        <p className="section-copy">{copy}</p>
        <div className="btn-row">
          <a className="btn primary cta-large" href={primaryHref} data-track={`cta_primary_${primaryLabel.toLowerCase().replaceAll(' ', '_')}`}>{primaryLabel}</a>
          {secondaryHref && secondaryLabel ? <a className="btn secondary" href={secondaryHref} data-track={`cta_secondary_${secondaryLabel.toLowerCase().replaceAll(' ', '_')}`}>{secondaryLabel}</a> : null}
          {tertiaryHref && tertiaryLabel ? <a className="btn ghost" href={tertiaryHref} data-track={`cta_tertiary_${tertiaryLabel.toLowerCase().replaceAll(' ', '_')}`}>{tertiaryLabel}</a> : null}
        </div>
      </div>
    </section>
  );
}
