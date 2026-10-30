import { LINES } from '../../content/lines';
import { STATIONS, linesText, routeName } from '../../content/network';
import { CASES, ROUTES } from '../../content/work';
import { jumpTo } from '../../lib/jump';
import LineBadge from '../shared/LineBadge';

/* The line a case rode in on: the lab stations first, then the work stations they grew into.
   A segment is thinner where the next stop is a lab project, and dashed where the line graduates. */
function segment(stop, next) {
  if (!next) return undefined;
  if (next.kind === 'lab') return 'seg-lab';
  return stop.kind === 'lab' ? 'seg-grad' : undefined;
}

export default function RouteStrip({ caseId }) {
  const n = CASES.find(c => c.id === caseId).routeLine;
  const ids = ROUTES[n];
  const others = STATIONS[caseId].lines.filter(line => line !== n);

  return (
    <div className="route g12" style={{ '--c': LINES[n].color }}>
      <p className="route-h">
        <LineBadge n={n} />
        <span>Línea {n}<small>{LINES[n].name}</small></span>
      </p>
      <ol className="route-track" style={{ '--n': ids.length }} aria-label={`Línea ${n}, from the first lab station to the last stop`}>
        {ids.map((id, i) => {
          const stop = STATIONS[id];
          const here = id === caseId;
          const interchange = stop.lines.length > 1;
          return (
            <li key={id} className={segment(stop, STATIONS[ids[i + 1]])}>
              <button
                type="button"
                className={`r-stop ${stop.kind}${interchange ? ' xfer' : ''}`}
                aria-current={here ? 'location' : undefined}
                aria-label={`${routeName(id)}${here ? ', this case study' : ', go to it'}`}
                onClick={() => jumpTo(id)}
              >
                <span className="r-dot" />
                <span className="r-name">
                  {routeName(id)}
                  {here && <span className="r-here">You are here</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      {others.length > 0 && (
        <p className="route-xfer">
          {others.map(line => <LineBadge key={line} n={line} small />)}
          <span>{`Correspondencia: ${linesText(others)} also stop here (${others.map(line => LINES[line].name).join(', ')}).`}</span>
        </p>
      )}
    </div>
  );
}
