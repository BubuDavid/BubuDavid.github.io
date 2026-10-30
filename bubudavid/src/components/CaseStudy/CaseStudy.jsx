import { Fragment } from 'react';
import { STATIONS, displayName, targetId } from '../../content/network';
import { CASES } from '../../content/work';
import { figureFor } from '../figures';
import LineBadge from '../shared/LineBadge';
import RouteStrip from './RouteStrip';
import './CaseStudy.css';

const LAYOUT_CLASS = { flip: ' case--flip', wide: ' case--wide' };

const lowerFirst = text => text[0].toLowerCase() + text.slice(1);

/* The archive's first page is 34; its entries run in order from Nº 01. */
const archivePage = labId => 33 + Number(STATIONS[labId].no);

/* The big figure of a case: a before-and-after pair, or one number with a caption. */
function Pull({ pull, mini }) {
  const { label, sr, from, to, value, caption } = pull;
  return (
    <div className="pull">
      <p className="label">{label}</p>
      {from ? (
        <p className="pull-num">
          <span className="sr-only">{sr}</span>
          <span aria-hidden="true">
            <span className="line">{from[0]}<span className="u">{from[1]}</span></span>
            <span className="line"><span className="arr">→</span>{to[0]}<span className="u">{to[1]}</span></span>
          </span>
        </p>
      ) : (
        <div className="zero">
          <p className="pull-num">{value}</p>
          <p className="zero-cap">{caption}</p>
        </div>
      )}
      <dl className="mini">
        {mini.map(([figure, what]) => (
          <div key={what}><dt>{what}</dt><dd>{figure}</dd></div>
        ))}
      </dl>
    </div>
  );
}

export default function CaseStudy({ id }) {
  const index = CASES.findIndex(c => c.id === id);
  const c = CASES[index];
  const work = STATIONS[id];
  const k = index + 1; // footnote number
  const Figure = figureFor(id);

  return (
    <article className={`case${LAYOUT_CLASS[c.layout] ?? ''} wrap`} id={id} aria-labelledby={`${id}-h`}>
      <div className="case-route"><RouteStrip caseId={id} /></div>
      <div className="g12 case-grid">
        <div className="case-rail">
          <span className="case-num" aria-hidden="true">{c.no}</span>
          <p className="label"><b>Case study</b>{`p. ${String(c.page).padStart(2, '0')}`}</p>
        </div>

        <header className="case-head">
          <p className="kicker">
            <span className="kick-lines">{work.lines.map(n => <LineBadge key={n} n={n} />)}</span>
            {`${work.role} · ${work.period}`}
          </p>
          <h3 className="case-title" id={`${id}-h`}>{work.name}</h3>
          <p className="standfirst">{c.standfirst}</p>
        </header>

        <aside className="margin-note" aria-label="Lineage">
          <span className="label">Grew from</span>
          {work.grew.map(([labId, note]) => (
            <Fragment key={labId}>
              <a className="ln" href={`#${targetId(labId)}`}>{displayName(labId)}</a>{`, ${lowerFirst(note)}.`}
              <span className="see">{`Archive Nº ${STATIONS[labId].no}, p. ${archivePage(labId)}`}</span>
            </Fragment>
          ))}
        </aside>

        <div className="pao">
          <section>
            <h4 className="label"><i>i.</i>Problem</h4>
            <div className="body"><p>{c.problem}</p></div>
          </section>
          <section>
            <h4 className="label"><i>ii.</i>Approach</h4>
            <div className="body">
              <p>
                {c.approach}
                <sup className="fnref"><a id={`fnref-${k}`} href={`#fn-${k}`} aria-label={`Footnote ${k}`}>{k}</a></sup>
              </p>
            </div>
          </section>
          <section>
            <h4 className="label"><i>iii.</i>Outcome</h4>
            <div className="body"><p className="end">{c.outcome}</p></div>
          </section>
        </div>

        <div className="feature">
          <Pull pull={c.pull} mini={c.mini} />
          {Figure && <Figure />}
        </div>

        <footer className="case-notes">
          <p id={`fn-${k}`}>
            <a className="fn-n" href={`#fnref-${k}`} aria-label={`Back to text, footnote ${k}`}>{k}</a>
            {`Stack: ${work.stack.join(', ')}.`}
          </p>
          <p className="to-map"><a href="#map">↑ Back to the map</a></p>
        </footer>
      </div>
    </article>
  );
}
