import { useLayoutEffect, useRef, useState } from 'react';
import { LINES } from '../../content/lines';
import { COLORS, TRAIN, VORDER, VX } from '../../content/map-layout';
import { STATIONS, displayName, stationLabel } from '../../content/network';
import { ROUTES } from '../../content/work';
import { PictogramIcon } from '../shared/Pictogram';
import { EndBadge } from './HorizontalMap';

const COLUMNS = [1, 2, 4, 3]; // drawn in this order, so line 3 ends up on top
const STATION_IDS = VORDER.filter(id => !id.startsWith('@'));
const ZONES = {
  '@lab': ['LAB', '2019 – 2022 · student projects'],
  '@work': ['WORK', '2023 – now · in production'],
};
const PULSO_PILL = { x: 5, width: 62, height: 22, rx: 11 }; // the interchange's pill; its leader starts at x 70
const LEADER_END = 94;

function detail(s) {
  if (s.lines.length > 1) return `${s.period} · Correspondencia ${s.lines.join(' · ')}`;
  if (s.kind === 'work') return `${s.period} · ${s.role}`;
  return `Lab · ${s.tags.slice(0, 2).join(', ')}`;
}

/* Where everything sits, read from the list: the height, the centre of each station's row and of the
   graduation row. */
function measure(list) {
  const y = {};
  list.querySelectorAll('.vstn').forEach((button) => {
    y[button.dataset.id] = Math.round(button.offsetTop + button.offsetHeight / 2);
  });
  const grad = list.querySelector('#v-grad');
  return { h: list.offsetHeight, y, gy: grad.offsetTop + grad.offsetHeight / 2 };
}

const sameGeo = (a, b) => a !== null && a.h === b.h && a.gy === b.gy && STATION_IDS.every(id => a.y[id] === b.y[id]);

function Station({ id, isDim, onActivate }) {
  const s = STATIONS[id];
  const xfer = s.lines.length > 1;
  const className = ['vstn', s.kind, xfer && 'xfer', isDim(s.lines) && 'is-dim'].filter(Boolean).join(' ');
  return (
    <li>
      <button
        type="button"
        className={className}
        data-id={id}
        data-lines={s.lines.join(' ')}
        aria-label={stationLabel(id)}
        onClick={() => onActivate(id)}
      >
        <PictogramIcon id={id} />
        <span>
          <span className="v-name">{displayName(id)}</span>
          <span className="v-meta">{detail(s)}</span>
        </span>
      </button>
    </li>
  );
}

/* The overlay: leaders, the four columns, their badges, the stations and the train, in a box 92 wide
   and as tall as the list. */
function Overlay({ geo, isDim }) {
  const { y, gy } = geo;
  const dim = lines => (isDim(lines) ? 'is-dim' : undefined);
  return (
    <>
      {STATION_IDS.map((id) => {
        const s = STATIONS[id];
        const x0 = s.lines.length > 1 ? 70 : VX[s.lines[0]] + 9;
        return (
          <path
            key={id}
            data-lines={s.lines.join(' ')}
            className={dim(s.lines)}
            d={`M${x0} ${y[id]}H${LEADER_END}`}
            stroke={COLORS.leader}
            strokeWidth="1.5"
            strokeDasharray="2 3"
          />
        );
      })}
      {COLUMNS.map((n) => {
        const ids = ROUTES[n];
        const x = VX[n];
        const top = y[ids[0]] - 30;
        const bottom = y[ids[ids.length - 1]];
        return (
          <g key={n} data-lines={n} className={dim([n])}>
            <path className="ln" d={`M${x} ${top}V${gy}`} stroke={LINES[n].color} strokeWidth="5" opacity=".8" />
            <path className="ln" d={`M${x} ${gy}V${bottom}`} stroke={LINES[n].color} strokeWidth="8" />
          </g>
        );
      })}
      {COLUMNS.map(n => <EndBadge key={n} n={n} x={VX[n]} y={y[ROUTES[n][0]] - 30} r={10} className={dim([n])} />)}
      {STATION_IDS.map((id) => {
        const s = STATIONS[id];
        if (s.lines.length > 1) {
          return (
            <g key={id} data-lines={s.lines.join(' ')} className={dim(s.lines)} data-train-stop="">
              <rect className="pring" y={y[id] - 11} {...PULSO_PILL} />
              <rect y={y[id] - 11} {...PULSO_PILL} fill={COLORS.card} stroke={COLORS.ink} strokeWidth="3.5" />
            </g>
          );
        }
        const work = s.kind === 'work';
        return (
          <circle
            key={id}
            data-lines={s.lines[0]}
            className={dim(s.lines)}
            cx={VX[s.lines[0]]}
            cy={y[id]}
            r={work ? 6.5 : 4.5}
            fill={COLORS.card}
            stroke={work ? COLORS.ink : COLORS.labStroke}
            strokeWidth={work ? 3 : 2.2}
          />
        );
      })}
      <path data-train-path="" d={`M${VX[TRAIN.line]} ${y[TRAIN.from]}V${y[TRAIN.to]}`} fill="none" stroke="none" />
      <g data-train-dot="" className="train" aria-hidden="true">
        <circle r="12" fill={LINES[TRAIN.line].color} opacity=".22" />
        <circle r="5.5" fill={COLORS.ink} stroke="#fff" strokeWidth="2.5" />
      </g>
    </>
  );
}

/* The phone map: the stations as a list, oldest first, with the lines drawn down its left side. The
   overlay is measured from the list, so it follows the text however it wraps. */
export default function VerticalMap({ isDim, onActivate }) {
  const listRef = useRef(null);
  const [geo, setGeo] = useState(null);

  /* Measure before paint, and again when the list changes size or the web fonts arrive. A measure that
     finds nothing new sets no state. */
  useLayoutEffect(() => {
    const list = listRef.current;
    let current = null;
    let alive = true;
    const redraw = () => {
      if (!alive) return;
      const next = measure(list);
      if (sameGeo(current, next)) return;
      current = next;
      setGeo(next);
    };
    redraw();
    const observer = new ResizeObserver(redraw);
    observer.observe(list);
    document.fonts?.ready?.then(redraw);
    return () => {
      alive = false;
      observer.disconnect();
    };
  }, []);

  return (
    <div className="vmap" id="vmap">
      <svg
        id="vsvg"
        aria-hidden="true"
        viewBox={geo ? `0 0 92 ${geo.h}` : undefined}
        height={geo?.h}
        style={geo ? { height: geo.h } : undefined}
      >
        {geo && <Overlay geo={geo} isDim={isDim} />}
      </svg>
      <ol className="vlist" id="vlist" aria-label="Stations, oldest first" ref={listRef}>
        {VORDER.map((id) => {
          if (id in ZONES) {
            const [tag, text] = ZONES[id];
            return <li className="vhead" key={id}><b>{tag}</b><span>{text}</span></li>;
          }
          if (id === '@grad') return <li className="vgrad" id="v-grad" key={id}><span>Graduation</span></li>;
          return <Station key={id} id={id} isDim={isDim} onActivate={onActivate} />;
        })}
      </ol>
    </div>
  );
}
