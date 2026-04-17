export function EngineGraphic() {
  return (
    <div className="graphic-shell premium" aria-hidden="true">
      <svg viewBox="0 0 640 340" role="img">
        <defs>
          <linearGradient id="engBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#11263d" />
            <stop offset="100%" stopColor="#0a1728" />
          </linearGradient>
          <linearGradient id="engAccent" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#63bcff" />
            <stop offset="100%" stopColor="#7ef1d2" />
          </linearGradient>
        </defs>

        <rect x="20" y="18" width="600" height="304" rx="24" fill="url(#engBg)" stroke="rgba(255,255,255,0.2)" />
        <rect x="40" y="38" width="560" height="264" rx="16" fill="rgba(5,14,24,0.66)" stroke="rgba(255,255,255,0.1)" />

        <rect x="54" y="54" width="532" height="26" rx="9" fill="rgba(255,255,255,0.05)" />
        <circle cx="72" cy="67" r="4" fill="#7ef1d2" />
        <circle cx="87" cy="67" r="4" fill="#63bcff" />
        <circle cx="102" cy="67" r="4" fill="#8ea7ff" />

        <rect x="90" y="118" width="152" height="84" rx="14" fill="rgba(99,188,255,0.14)" stroke="rgba(99,188,255,0.45)" />
        <text x="166" y="153" textAnchor="middle" fontSize="12" fill="#dbedff" fontWeight="700">Vertical Packages</text>
        <text x="166" y="171" textAnchor="middle" fontSize="10" fill="#9eb8d2">PI360 • DPC360 • Ortho360</text>

        <rect x="252" y="102" width="138" height="116" rx="16" fill="rgba(126,241,210,0.12)" stroke="rgba(126,241,210,0.48)" />
        <text x="321" y="138" textAnchor="middle" fontSize="12" fill="#e6fff9" fontWeight="700">Care Axis Core</text>
        <text x="321" y="158" textAnchor="middle" fontSize="10" fill="#a6c4dc">Data Model</text>
        <text x="321" y="174" textAnchor="middle" fontSize="10" fill="#a6c4dc">Automation Engine</text>
        <text x="321" y="190" textAnchor="middle" fontSize="10" fill="#a6c4dc">Permissions + Audit</text>

        <rect x="404" y="118" width="150" height="84" rx="14" fill="rgba(142,167,255,0.14)" stroke="rgba(142,167,255,0.45)" />
        <text x="479" y="153" textAnchor="middle" fontSize="12" fill="#edf2ff" fontWeight="700">Enterprise Layer</text>
        <text x="479" y="171" textAnchor="middle" fontSize="10" fill="#aebdd5">Analytics • APIs • Security</text>

        <path d="M242 160H252" stroke="url(#engAccent)" strokeWidth="3" strokeLinecap="round" />
        <path d="M390 160H404" stroke="url(#engAccent)" strokeWidth="3" strokeLinecap="round" />

        <rect x="90" y="238" width="464" height="38" rx="10" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" />
        <path d="M112 257H528" stroke="url(#engAccent)" strokeWidth="3" strokeLinecap="round" />
        <text x="320" y="262" textAnchor="middle" fontSize="10" fill="#d7e8fb" fontWeight="700">Unified Operations Rail: Scheduling, Communications, Billing Coordination, Growth</text>
      </svg>
    </div>
  );
}

export function WorkflowGraphic() {
  return (
    <div className="graphic-shell premium" aria-hidden="true">
      <svg viewBox="0 0 640 340" role="img">
        <defs>
          <linearGradient id="wfBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#122740" />
            <stop offset="100%" stopColor="#0a1627" />
          </linearGradient>
          <linearGradient id="wfLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#63bcff" />
            <stop offset="100%" stopColor="#7ef1d2" />
          </linearGradient>
        </defs>

        <rect x="20" y="18" width="600" height="304" rx="24" fill="url(#wfBg)" stroke="rgba(255,255,255,0.2)" />
        <rect x="40" y="38" width="560" height="264" rx="16" fill="rgba(6,15,26,0.66)" stroke="rgba(255,255,255,0.1)" />

        <rect x="68" y="102" width="116" height="56" rx="12" fill="rgba(99,188,255,0.14)" stroke="rgba(99,188,255,0.45)" />
        <text x="126" y="136" textAnchor="middle" fontSize="11" fill="#dcefff" fontWeight="700">Intake</text>

        <rect x="214" y="102" width="116" height="56" rx="12" fill="rgba(126,241,210,0.14)" stroke="rgba(126,241,210,0.45)" />
        <text x="272" y="136" textAnchor="middle" fontSize="11" fill="#e9fff8" fontWeight="700">Clinical Flow</text>

        <rect x="360" y="102" width="116" height="56" rx="12" fill="rgba(142,167,255,0.14)" stroke="rgba(142,167,255,0.45)" />
        <text x="418" y="136" textAnchor="middle" fontSize="11" fill="#eef2ff" fontWeight="700">Documentation</text>

        <rect x="506" y="102" width="66" height="56" rx="12" fill="rgba(97,184,255,0.14)" stroke="rgba(97,184,255,0.45)" />
        <text x="539" y="136" textAnchor="middle" fontSize="11" fill="#dcf0ff" fontWeight="700">Ops</text>

        <path d="M184 130H214" stroke="url(#wfLine)" strokeWidth="3" strokeLinecap="round" />
        <path d="M330 130H360" stroke="url(#wfLine)" strokeWidth="3" strokeLinecap="round" />
        <path d="M476 130H506" stroke="url(#wfLine)" strokeWidth="3" strokeLinecap="round" />

        <rect x="68" y="202" width="504" height="70" rx="14" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" />
        <text x="88" y="226" fontSize="10" fill="#cfe4fa" fontWeight="700">Automation Layer</text>

        <rect x="88" y="236" width="86" height="14" rx="7" fill="rgba(99,188,255,0.23)" />
        <rect x="184" y="236" width="116" height="14" rx="7" fill="rgba(126,241,210,0.23)" />
        <rect x="310" y="236" width="98" height="14" rx="7" fill="rgba(142,167,255,0.23)" />
        <rect x="418" y="236" width="74" height="14" rx="7" fill="rgba(99,188,255,0.23)" />
        <rect x="500" y="236" width="52" height="14" rx="7" fill="rgba(126,241,210,0.23)" />
      </svg>
    </div>
  );
}

export function BillingGraphic() {
  return (
    <div className="graphic-shell premium compact" aria-hidden="true">
      <svg viewBox="0 0 640 260" role="img">
        <defs>
          <linearGradient id="billBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#122740" />
            <stop offset="100%" stopColor="#0a1627" />
          </linearGradient>
          <linearGradient id="billBars" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6ec6ff" />
            <stop offset="100%" stopColor="#7ef1d2" />
          </linearGradient>
        </defs>

        <rect x="20" y="20" width="600" height="220" rx="22" fill="url(#billBg)" stroke="rgba(255,255,255,0.2)" />
        <rect x="40" y="40" width="560" height="180" rx="14" fill="rgba(6,15,26,0.66)" stroke="rgba(255,255,255,0.1)" />

        <g opacity="0.22">
          <path d="M68 192H572" stroke="rgba(255,255,255,0.2)" />
          <path d="M68 160H572" stroke="rgba(255,255,255,0.16)" />
          <path d="M68 128H572" stroke="rgba(255,255,255,0.16)" />
          <path d="M68 96H572" stroke="rgba(255,255,255,0.16)" />
        </g>

        <rect x="88" y="142" width="34" height="50" rx="6" fill="url(#billBars)" />
        <rect x="150" y="118" width="34" height="74" rx="6" fill="url(#billBars)" />
        <rect x="212" y="98" width="34" height="94" rx="6" fill="url(#billBars)" />
        <rect x="274" y="132" width="34" height="60" rx="6" fill="url(#billBars)" />
        <rect x="336" y="86" width="34" height="106" rx="6" fill="url(#billBars)" />
        <rect x="398" y="74" width="34" height="118" rx="6" fill="url(#billBars)" />
        <rect x="460" y="104" width="34" height="88" rx="6" fill="url(#billBars)" />

        <path d="M105 130L167 108L229 90L291 124L353 80L415 70L477 98"
          fill="none"
          stroke="rgba(255,255,255,0.75)"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <text x="72" y="68" fontSize="11" fill="#d9ecff" fontWeight="700">Revenue Performance</text>
        <text x="458" y="68" fontSize="10" fill="#b2c8df">Month over month signal</text>
      </svg>
    </div>
  );
}
