// RELLENO: figura de un proyecto inventado.
export default function LienzoFigure() {
  return (
    <figure className="fig" aria-labelledby="fig3-cap">
      <div className="fig-head"><span className="fig-n">Fig. 3</span><span className="fig-title">From one question to a dashboard</span></div>
      <div className="fig-split">
        <svg className="svg-flow" viewBox="0 0 400 470" role="img" aria-labelledby="flow-t flow-d">
          <title id="flow-t">How Lienzo builds a dashboard</title>
          <desc id="flow-d">A question goes to a planner model, which designs the layout. Four workers run queries over the semantic layer in parallel. Python computes every number. The dashboard is ready about 40 seconds after the question.</desc>
          <defs>
            <marker id="ah-flow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto" markerUnits="userSpaceOnUse"><path className="mk" d="M2 1.5 8 5 2 8.5"/></marker>
          </defs>
          <rect x="20" y="12" width="320" height="58" className="f-paper"/>
          <text x="34" y="34" className="t-lab">QUESTION</text>
          <text x="34" y="57" className="t-q">Why did margin dip in the north?</text>
          <path className="s" markerEnd="url(#ah-flow)" d="M180 70V94"/>
          <rect x="95" y="96" width="170" height="48" className="f-tint"/>
          <text x="180" y="116" textAnchor="middle" className="t-lab t-g">PLANNER MODEL</text>
          <text x="180" y="133" textAnchor="middle" className="t-sm">designs the layout</text>
          <path className="s" d="M180 144V156M60 156H300"/>
          <path className="s" markerEnd="url(#ah-flow)" d="M60 156V174"/>
          <path className="s" markerEnd="url(#ah-flow)" d="M140 156V174"/>
          <path className="s" markerEnd="url(#ah-flow)" d="M220 156V174"/>
          <path className="s" markerEnd="url(#ah-flow)" d="M300 156V174"/>
          <rect x="28" y="176" width="64" height="50" className="f-paper"/>
          <rect x="108" y="176" width="64" height="50" className="f-paper"/>
          <rect x="188" y="176" width="64" height="50" className="f-paper"/>
          <rect x="268" y="176" width="64" height="50" className="f-paper"/>
          <text x="60" y="199" textAnchor="middle" className="t-num">W1</text>
          <text x="140" y="199" textAnchor="middle" className="t-num">W2</text>
          <text x="220" y="199" textAnchor="middle" className="t-num">W3</text>
          <text x="300" y="199" textAnchor="middle" className="t-num">W4</text>
          <text x="60" y="216" textAnchor="middle" className="t-sm">query</text>
          <text x="140" y="216" textAnchor="middle" className="t-sm">query</text>
          <text x="220" y="216" textAnchor="middle" className="t-sm">query</text>
          <text x="300" y="216" textAnchor="middle" className="t-sm">query</text>
          <path className="s" d="M60 226V240M140 226V240M220 226V240M300 226V240M60 240H300"/>
          <path className="s" markerEnd="url(#ah-flow)" d="M180 240V258"/>
          <rect x="95" y="260" width="170" height="48" className="f-ink"/>
          <text x="180" y="280" textAnchor="middle" className="t-lab t-inv">PYTHON</text>
          <text x="180" y="297" textAnchor="middle" className="t-sm t-inv">computes every number</text>
          <text x="276" y="281" className="t-it t-g">never</text>
          <text x="276" y="297" className="t-it t-g">the model</text>
          <path className="s" markerEnd="url(#ah-flow)" d="M180 308V332"/>
          <rect x="20" y="334" width="320" height="122" className="f-paper"/>
          <text x="34" y="354" className="t-lab">DASHBOARD</text>
          <line className="s" x1="20" y1="364" x2="340" y2="364"/>
          <rect x="34" y="376" width="144" height="68" className="s-hair"/>
          <line className="s-hair" x1="42" y1="436" x2="170" y2="436"/>
          <polyline className="s-g" points="42,428 58,420 74,424 90,410 106,414 122,400 138,404 154,392 170,386"/>
          <rect x="188" y="376" width="138" height="36" className="s-hair"/>
          <rect x="198" y="394" width="12" height="12" className="f-ink"/>
          <rect x="219" y="386" width="12" height="20" className="f-ink"/>
          <rect x="240" y="390" width="12" height="16" className="f-ink"/>
          <rect x="261" y="382" width="12" height="24" className="f-ink"/>
          <rect x="282" y="388" width="12" height="18" className="f-ink"/>
          <rect x="303" y="380" width="12" height="26" className="f-g"/>
          <rect x="188" y="418" width="138" height="26" className="s-hair"/>
          <path className="s-hair" d="M196 427H266M298 427H318M196 436H252M294 436H318"/>
          <line className="s-dot" x1="372" y1="24" x2="372" y2="446"/>
          <line className="s" x1="366" y1="24" x2="378" y2="24"/>
          <line className="s" x1="366" y1="446" x2="378" y2="446"/>
          <text x="372" y="15" textAnchor="middle" className="t-sm">0 s</text>
          <text x="372" y="463" textAnchor="middle" className="t-sm">~40 s</text>
        </svg>
        <ol className="legend">
          <li><b>Plan</b>The planner model turns the question into a layout of widgets.</li>
          <li><b>Fetch</b>One worker per widget queries the semantic layer, all in parallel.</li>
          <li><b>Compute</b>Python computes every figure from the query results.</li>
          <li><b>Render</b>Next.js and Recharts draw the page. LangSmith traces each step.</li>
        </ol>
      </div>
      <figcaption id="fig3-cap">The planner never touches a number. Workers fetch data through the semantic layer, Python computes the figures, and the page is ready in about 40 seconds.</figcaption>
    </figure>
  );
}
