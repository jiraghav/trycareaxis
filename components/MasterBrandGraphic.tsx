type MasterBrandGraphicProps = {
  compact?: boolean;
  caption?: string;
};

export function MasterBrandGraphic({
  compact = false,
  caption,
}: MasterBrandGraphicProps) {
  return (
    <figure className={compact ? 'master-graphic master-graphic-ui compact' : 'master-graphic master-graphic-ui'} aria-hidden="true">
      <div className="master-graphic-media master-graphic-ui-grid">
        <div className="master-column">
          <h4>Vertical Packages</h4>
          <p>PI360 • DPC360 • Practice360 • Ortho360 • Pain360</p>
        </div>
        <div className="master-column master-column-core">
          <h4>Care Axis Core</h4>
          <p>Data model • Automation • Permissions • Communication</p>
        </div>
        <div className="master-column">
          <h4>Enterprise Layer</h4>
          <p>Analytics • API access • Security • Multi-location controls</p>
        </div>
        <div className="master-rail">
          Unified operations rail: scheduling, documentation, billing, growth, and admin visibility
        </div>
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
