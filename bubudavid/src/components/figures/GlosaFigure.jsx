// RELLENO: figura de un proyecto inventado.
/* Built in HTML, not SVG, so the code stays real text. Inside <pre> every newline counts,
   so the code sits in template strings and JSX does not trim it. */
export default function GlosaFigure() {
  return (
    <figure className="fig gl" aria-labelledby="fig4-cap">
      <div className="fig-head"><span className="fig-n">Fig. 4</span><span className="fig-title">One definition, three dialects</span></div>

      <div className="gl-box gl-q">
        <span className="label">Question</span>
        <p>Net revenue by region, last three months, top five.</p>
      </div>
      <div className="gl-step" aria-hidden="true"><span>finds the metric</span></div>
      <div className="gl-box gl-layer">
        <span className="label">Semantic layer · versioned in git</span>
        <pre><code><span className="c"># metrics/net_revenue.yml</span>{`
metric: net_revenue
label: Net revenue
sql: SUM(amount - refund)
dimensions: [region, ts]
owner: finance`}</code></pre>
      </div>
      <div className="gl-step gl-step--fan" aria-hidden="true"><span>compiles to SQL</span></div>
      <div className="gl-engines">
        <div className="gl-box gl-eng">
          <span className="label">PostgreSQL</span>
          <pre><code>{`SELECT region,
  SUM(amount - refund)
    AS net_revenue
FROM orders
WHERE ts >= `}<b>now()</b>{`
  `}<b>- interval '3 months'</b>{`
GROUP BY region
ORDER BY net_revenue DESC
`}<b>LIMIT 5</b>;</code></pre>
        </div>
        <div className="gl-box gl-eng">
          <span className="label">Snowflake</span>
          <pre><code>{`SELECT region,
  SUM(amount - refund)
    AS net_revenue
FROM orders
WHERE ts >= `}<b>DATEADD(</b>{`
  `}<b>month, -3, CURRENT_DATE)</b>{`
GROUP BY region
ORDER BY net_revenue DESC
`}<b>LIMIT 5</b>;</code></pre>
        </div>
        <div className="gl-box gl-eng">
          <span className="label">Microsoft Fabric <span>T-SQL</span></span>
          <pre><code>{`SELECT `}<b>TOP 5</b>{` region,
  SUM(amount - refund)
    AS net_revenue
FROM orders
WHERE ts >= `}<b>DATEADD(</b>{`
  `}<b>month, -3, GETDATE())</b>{`
GROUP BY region
ORDER BY net_revenue DESC;`}</code></pre>
        </div>
      </div>
      <figcaption id="fig4-cap">The metric is defined once, in git. Glosa compiles the same question for each engine, and the parts that differ by dialect are set in green.</figcaption>
    </figure>
  );
}
