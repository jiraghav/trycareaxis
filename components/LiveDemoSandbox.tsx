'use client';

import { useMemo, useState } from 'react';

type PackageKey = 'pi360' | 'dpc360' | 'practice360' | 'ortho360' | 'pain360';

const packageOptions: { key: PackageKey; label: string }[] = [
  { key: 'pi360', label: 'PI360' },
  { key: 'dpc360', label: 'DPC360' },
  { key: 'practice360', label: 'Practice360' },
  { key: 'ortho360', label: 'Ortho360' },
  { key: 'pain360', label: 'Pain360' },
];

const queueByPackage: Record<PackageKey, string[]> = {
  pi360: ['New referral received', 'Records request pending', 'Lawyer update due', 'Task handoff to back office'],
  dpc360: ['New member onboarding', 'Renewal follow-up', 'Care plan check-in', 'Patient message review'],
  practice360: ['Insurance verification', 'Cash-pay lead follow-up', 'Provider schedule block', 'Billing review queue'],
  ortho360: ['Pre-op workflow check', 'Imaging packet review', 'Procedure scheduling', 'Post-op follow-up queue'],
  pain360: ['Treatment milestone check', 'Procedure note review', 'Referral status update', 'Longitudinal care task'],
};

const kpisByPackage: Record<PackageKey, { label: string; value: string }[]> = {
  pi360: [
    { label: 'Active Cases', value: '214' },
    { label: 'Pending Referrals', value: '36' },
    { label: 'Open Tasks', value: '58' },
    { label: 'Records Requests', value: '17' },
  ],
  dpc360: [
    { label: 'Active Members', value: '1,284' },
    { label: 'Renewals Due', value: '42' },
    { label: 'Open Tasks', value: '21' },
    { label: 'Unread Messages', value: '14' },
  ],
  practice360: [
    { label: 'Daily Visits', value: '312' },
    { label: 'Pending Claims', value: '27' },
    { label: 'Open Tasks', value: '49' },
    { label: 'Lead Follow-ups', value: '33' },
  ],
  ortho360: [
    { label: 'Surgical Cases', value: '88' },
    { label: 'Pre-op Pending', value: '19' },
    { label: 'Open Tasks', value: '31' },
    { label: 'Care Path Alerts', value: '11' },
  ],
  pain360: [
    { label: 'Active Patients', value: '420' },
    { label: 'Progression Alerts', value: '26' },
    { label: 'Open Tasks', value: '37' },
    { label: 'Referral Updates', value: '18' },
  ],
};

export function LiveDemoSandbox() {
  const [selectedPackage, setSelectedPackage] = useState<PackageKey>('pi360');
  const [showAutomation, setShowAutomation] = useState(true);
  const [showAI, setShowAI] = useState(true);

  const queue = useMemo(() => {
    const base = queueByPackage[selectedPackage];
    const extras = [] as string[];
    if (showAutomation) extras.push('Automation cadence active');
    if (showAI) extras.push('AI assistant recommendations ready');
    return [...base, ...extras];
  }, [selectedPackage, showAutomation, showAI]);

  return (
    <div className="sandbox-shell" style={{ marginTop: 26 }}>
      <div className="sandbox-toolbar">
        <div className="sandbox-segment">
          {packageOptions.map((pkg) => (
            <button
              key={pkg.key}
              type="button"
              className={selectedPackage === pkg.key ? 'sandbox-pill active' : 'sandbox-pill'}
              onClick={() => setSelectedPackage(pkg.key)}
            >
              {pkg.label}
            </button>
          ))}
        </div>

        <div className="sandbox-toggles">
          <label><input type="checkbox" checked={showAutomation} onChange={(e) => setShowAutomation(e.target.checked)} /> Automation</label>
          <label><input type="checkbox" checked={showAI} onChange={(e) => setShowAI(e.target.checked)} /> AI Agent</label>
        </div>
      </div>

      <div className="sandbox-grid">
        <div className="sandbox-main">
          <h3 style={{ marginTop: 0 }}>{selectedPackage.toUpperCase()} live workspace</h3>
          <div className="sandbox-kpi-grid">
            {kpisByPackage[selectedPackage].map((kpi) => (
              <div className="sandbox-kpi" key={kpi.label}>
                <span>{kpi.label}</span>
                <strong>{kpi.value}</strong>
              </div>
            ))}
          </div>
          <div className="sandbox-queue">
            <h4>Active queue</h4>
            <ul className="list" style={{ marginBottom: 0 }}>
              {queue.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="sandbox-side">
          <h4 style={{ marginTop: 0 }}>Next step</h4>
          <p className="muted">Ready to move from demo to onboarding?</p>
          <div className="btn-row" style={{ marginTop: 8 }}>
            <a className="btn primary" href="/contact#quickstart-order">Get a Quote</a>
            <a className="btn secondary" href="/book-call">Schedule Call</a>
          </div>
          <p className="small" style={{ marginTop: 10 }}>
            Flow: Quote accepted to payment initiated to launch call booked.
          </p>
        </aside>
      </div>
    </div>
  );
}
