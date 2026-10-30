// RELLENO: figura de un proyecto inventado.
export default function PulsoFigure() {
  return (
    <figure className="fig" aria-labelledby="fig2-cap">
      <div className="fig-head"><span className="fig-n">Fig. 2</span><span className="fig-title">Detect, diagnose, act, verify</span></div>
      <div className="fig-pair">
        <div>
          <span className="sub" aria-hidden="true">a</span>
          <svg className="svg-ring" viewBox="0 0 360 360" role="img" aria-labelledby="ring-t ring-d">
            <title id="ring-t">The Pulso loop</title>
            <desc id="ring-d">A cycle of four steps. Detect a KPI drifting off its trajectory. Diagnose by asking the data in plain words. Act with a plan that has an owner, date and budget. Verify the result against twin offices, then start again.</desc>
            <defs>
              <marker id="ah-ring" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto" markerUnits="userSpaceOnUse"><path className="mk" d="M2 1.5 8 5 2 8.5"/></marker>
            </defs>
            <path className="s" markerEnd="url(#ah-ring)" d="M200.65 49.62 A132 132 0 0 1 310.38 159.35"/>
            <path className="s" markerEnd="url(#ah-ring)" d="M310.38 200.65 A132 132 0 0 1 200.65 310.38"/>
            <path className="s" markerEnd="url(#ah-ring)" d="M159.35 310.38 A132 132 0 0 1 49.62 200.65"/>
            <path className="s" markerEnd="url(#ah-ring)" d="M49.62 159.35 A132 132 0 0 1 159.35 49.62"/>
            <circle cx="180" cy="48" r="11" className="s-gt"/>
            <circle cx="180" cy="48" r="6.5" className="f-g"/>
            <circle cx="312" cy="180" r="6.5" className="f-paper"/>
            <circle cx="180" cy="312" r="6.5" className="f-paper"/>
            <circle cx="48" cy="180" r="6.5" className="f-paper"/>
            <text x="180" y="88" textAnchor="middle" className="t-lab t-g">01 DETECT</text>
            <text x="180" y="107" textAnchor="middle" className="t-it">a KPI drifts off</text>
            <text x="180" y="124" textAnchor="middle" className="t-it">its trajectory</text>
            <text x="292" y="170" textAnchor="end" className="t-lab">02 DIAGNOSE</text>
            <text x="292" y="189" textAnchor="end" className="t-it">ask the data</text>
            <text x="292" y="205" textAnchor="end" className="t-it">in plain words</text>
            <text x="180" y="244" textAnchor="middle" className="t-lab">03 ACT</text>
            <text x="180" y="263" textAnchor="middle" className="t-it">a plan with owner,</text>
            <text x="180" y="279" textAnchor="middle" className="t-it">date and budget</text>
            <text x="68" y="170" className="t-lab">04 VERIFY</text>
            <text x="68" y="189" className="t-it">verdict against</text>
            <text x="68" y="205" className="t-it">twin offices</text>
          </svg>
        </div>
        <div>
          <span className="sub" aria-hidden="true">b</span>
          <svg className="svg-drift" viewBox="0 0 320 210" role="img" aria-labelledby="drift-t drift-d">
            <title id="drift-t">A KPI drifting off its trajectory</title>
            <desc id="drift-d">The target rises steadily inside a tolerance band. The real KPI follows it, then slips below the band. Pulso raises the alert at that point, well before the due date, where the projected value would miss the target.</desc>
            <polygon className="band" points="24,147 300,27 300,53 24,173"/>
            <line className="s-dash" x1="24" y1="160" x2="300" y2="40"/>
            <line className="s-dot" x1="200" y1="110" x2="200" y2="180"/>
            <polyline className="s-a" points="24,162 46,151 68,144 90,133 112,124 134,116 156,110 178,104 200,103"/>
            <polyline className="s-dot" points="200,103 250,101.5 300,100"/>
            <circle cx="300" cy="100" r="3.5" className="f-paper"/>
            <path className="s-gt" d="M307 41h4v58h-4"/>
            <line className="s" x1="24" y1="180" x2="300" y2="180"/>
            <line className="s" x1="24" y1="176" x2="24" y2="184"/>
            <line className="s" x1="300" y1="176" x2="300" y2="184"/>
            <line className="s-gt" x1="183" y1="66" x2="183" y2="94"/>
            <circle cx="183" cy="104" r="9.5" className="s-gt"/>
            <circle cx="183" cy="104" r="5" className="f-g"/>
            <text x="183" y="44" textAnchor="middle" className="t-lab t-g">ALERT</text>
            <text x="183" y="60" textAnchor="middle" className="t-it">before the miss</text>
            <text x="294" y="20" textAnchor="end" className="t-it">trajectory</text>
            <text x="300" y="121" textAnchor="end" className="t-it">projected miss</text>
            <text x="24" y="199" className="t-sm">week 1</text>
            <text x="200" y="199" textAnchor="middle" className="t-sm">today</text>
            <text x="300" y="199" textAnchor="end" className="t-sm">due date</text>
          </svg>
        </div>
      </div>
      <figcaption id="fig2-cap"><b>a.</b> The loop Pulso runs for every KPI. The verdict compares each office with its twins, found by <a className="ln" href="#gemelos">Gemelos</a> (p. 31). <b>b.</b> Pulso raises the alert when the KPI leaves its tolerance band, while there is still time to act.</figcaption>
    </figure>
  );
}
