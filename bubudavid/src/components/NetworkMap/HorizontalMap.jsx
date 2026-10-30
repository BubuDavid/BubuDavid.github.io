import { Fragment } from 'react';
import { LINE_IDS, LINES } from '../../content/lines';
import { COLORS, GRAD_X, HPATHS, HPOS, TERMINI, TRAIN, VIEW, XFER, yearX } from '../../content/map-layout';
import { STATIONS, displayName, stationLabel } from '../../content/network';
import { Pictogram } from '../shared/Pictogram';
import { metroPath } from './metroPath';

const YEARS = Array.from({ length: 8 }, (_, i) => 2019 + i);
const TOP = 52; // where the zones start, under the time axis
const CORNER = 16;
const PATHS = Object.fromEntries(LINE_IDS.map(n => [n, metroPath(HPATHS[n], CORNER)]));
const TRAIN_PATH = metroPath([[HPOS[TRAIN.from].x, HPOS[TRAIN.from].y], ...HPATHS[TRAIN.line].slice(1)], CORNER);

/* A station is one button: click, Enter and Space jump, hover and focus open the tooltip. */
function StationGroup({ id, xfer = false, isDim, onActivate, onTip, children, ...attrs }) {
  const s = STATIONS[id];
  const className = ['stn', s.kind, xfer && 'xfer', isDim(s.lines) && 'is-dim'].filter(Boolean).join(' ');
  const onKeyDown = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault(); // Space would scroll the page
    onActivate(id);
  };
  const onPointerOut = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) onTip(null);
  };
  return (
    <g
      className={className}
      data-id={id}
      data-lines={s.lines.join(' ')}
      tabIndex={0}
      role="button"
      aria-label={stationLabel(id)}
      onClick={() => onActivate(id)}
      onKeyDown={onKeyDown}
      onPointerOver={event => onTip(id, event.currentTarget)}
      onPointerOut={onPointerOut}
      onFocus={event => onTip(id, event.currentTarget)}
      onBlur={() => onTip(null)}
      {...attrs}
    >
      {children}
    </g>
  );
}

function Station({ id, ...handlers }) {
  const s = STATIONS[id];
  const p = HPOS[id];
  const work = s.kind === 'work';
  const size = work ? 30 : 24;
  const gap = work ? 18 : 14;
  const iy = p.lp === 'above' ? p.y - gap - size : p.y + gap;
  const ix = p.x - size / 2;
  const end = p.align === 'end';
  const label = displayName(id);
  const tx = end ? ix - 8 : ix + size + 8;
  const anchor = end ? 'end' : 'start';
  const w = work ? Math.max(label.length * 10.6, s.period.length * 7.4) : label.length * 7.1;
  const hx = end ? tx - w - 8 : ix - 6;
  const hw = size + 8 + w + 14;
  const r = work ? 9.5 : 6.5;
  return (
    <StationGroup id={id} {...handlers}>
      <rect className="hit" x={hx} y={iy - 6} width={hw} height={size + 12} rx="10" />
      <circle className="hitc" cx={p.x} cy={p.y} r={r + 8} />
      <circle className="ring" cx={p.x} cy={p.y} r={r + 6} />
      <circle
        cx={p.x}
        cy={p.y}
        r={r}
        fill={COLORS.card}
        stroke={work ? COLORS.ink : COLORS.labStroke}
        strokeWidth={work ? 3.6 : 2.6}
      />
      <Pictogram id={id} x={ix} y={iy} size={size} />
      {work ? (
        <>
          <text className="nm-w" x={tx} y={iy + 14} textAnchor={anchor}>{label.toUpperCase()}</text>
          <text className="meta" x={tx} y={iy + 29} textAnchor={anchor}>{s.period}</text>
        </>
      ) : (
        <text className="nm-l" x={tx} y={iy + size / 2 + 5} textAnchor={anchor}>{label}</text>
      )}
    </StationGroup>
  );
}

/* The interchange, drawn from the measures in XFER. */
function Interchange(handlers) {
  const { id, hit, ring, pill, tile, name, meta, badges, period } = XFER;
  const s = STATIONS[id];
  return (
    <StationGroup id={id} xfer data-train-stop="" {...handlers}>
      <path className="hit" d={hit} />
      <rect className="ring" {...ring} />
      <rect className="pring" {...pill} />
      <rect {...pill} fill={COLORS.card} stroke={COLORS.ink} strokeWidth="4.5" />
      <Pictogram id={id} {...tile} />
      <text className="nm-x" x={name.x} y={name.y}>{s.name.toUpperCase()}</text>
      <text className="meta-x" x={meta.x} y={meta.y}>CORRESPONDENCIA</text>
      {Object.entries(badges.cx).map(([n, cx]) => (
        <Fragment key={n}>
          <circle cx={cx} cy={badges.cy} r={badges.r} fill={LINES[n].color} />
          <text
            className="badge-t"
            x={cx}
            y={badges.textY}
            textAnchor="middle"
            fill={LINES[n].ink}
            style={{ fontSize: badges.fontSize }}
          >
            {n}
          </text>
        </Fragment>
      ))}
      <text className="meta" x={period.x} y={period.y}>{s.period}</text>
    </StationGroup>
  );
}

/* A line's number in its colour: at the ends of the lines here, at the top of each column in the vertical map. */
export function EndBadge({ n, x, y, r = 14, className }) {
  return (
    <g data-lines={n} className={className}>
      <circle cx={x} cy={y} r={r} fill={LINES[n].color} stroke="#fff" strokeWidth="3" />
      <text
        className="badge-t"
        x={x}
        y={y + r * 0.42}
        textAnchor="middle"
        fill={LINES[n].ink}
        style={{ fontSize: r * 1.3 }}
      >
        {n}
      </text>
    </g>
  );
}

/* The desktop map: the four lines against a 2019 to today time axis, lab on the left of graduation, work on the right. */
export default function HorizontalMap({ isDim, onActivate, onTip }) {
  const handlers = { isDim, onActivate, onTip };
  const dim = lines => (isDim(lines) ? 'is-dim' : undefined);
  const hoy = LINES[1].color;
  return (
    <svg
      id="hmap"
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      role="group"
      aria-label="Career map from 2019 to today. Four lines connect student projects to the work systems they grew into."
    >
      <title>Career map, 2019 to today</title>
      <defs>
        <pattern id="netdots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.1" fill={COLORS.dots} />
        </pattern>
        <clipPath id="clipLab"><rect x="0" y="0" width={GRAD_X} height={VIEW.h} /></clipPath>
        <clipPath id="clipWork"><rect x={GRAD_X} y="0" width={VIEW.w - GRAD_X} height={VIEW.h} /></clipPath>
      </defs>

      <rect x="0" y={TOP} width={GRAD_X} height={VIEW.h - TOP} fill={COLORS.zone} />
      <rect x="0" y={TOP} width={GRAD_X} height={VIEW.h - TOP} fill="url(#netdots)" />

      <g aria-hidden="true">
        <path d="M40 40H1252" stroke={COLORS.axis} strokeWidth="2" />
        {YEARS.map(year => (
          <Fragment key={year}>
            <path d={`M${yearX(year)} 34V46`} stroke={COLORS.tick} strokeWidth="2" />
            <text className="axis-t" x={yearX(year)} y="25" textAnchor="middle">{year}</text>
          </Fragment>
        ))}
        <path d={`M${GRAD_X} 33l7 7-7 7-7-7z`} fill={COLORS.ink} />
        <text className="axis-g" x={GRAD_X} y="25" textAnchor="middle">GRADUATION</text>
        <path d="M1243 47l-7-11h14z" fill={hoy} />
        <text className="axis-g" x="1243" y="25" textAnchor="middle" style={{ fill: hoy }}>HOY</text>

        <rect x="24" y="64" width="44" height="22" rx="5" fill={COLORS.ink} />
        <text className="zone-tag" x="46" y="79" textAnchor="middle">LAB</text>
        <text className="zone-t" x="78" y="79">2019 – 2022 · student projects</text>
        <rect x="624" y="64" width="58" height="22" rx="5" fill={COLORS.ink} />
        <text className="zone-tag" x="653" y="79" textAnchor="middle">WORK</text>
        <text className="zone-t" x="692" y="79">2023 – now · in production</text>
        <path d={`M${GRAD_X} ${TOP}V${VIEW.h}`} stroke={COLORS.ink} strokeWidth="1.6" strokeDasharray="6 6" opacity=".55" />
      </g>

      {/* Lines: thinner and softer in the lab zone, full weight after graduation. */}
      {LINE_IDS.map(n => (
        <g key={n} data-lines={n} className={dim([n])} aria-hidden="true">
          <path className="ln" d={PATHS[n]} stroke={LINES[n].color} strokeWidth="7" opacity=".8" clipPath="url(#clipLab)" />
          <path className="ln" d={PATHS[n]} stroke={LINES[n].color} strokeWidth="11" clipPath="url(#clipWork)" />
        </g>
      ))}

      <g aria-hidden="true">
        {TERMINI.map(([n, x, y]) => <EndBadge key={`${n}-${x}`} n={n} x={x} y={y} className={dim([n])} />)}
      </g>

      {Object.keys(HPOS).map(id => <Station key={id} id={id} {...handlers} />)}
      <Interchange {...handlers} />

      <path data-train-path="" d={TRAIN_PATH} fill="none" stroke="none" />
      <g data-train-dot="" className="train" aria-hidden="true">
        <circle r="15" fill={LINES[TRAIN.line].color} opacity=".22" />
        <circle r="7" fill={COLORS.ink} stroke="#fff" strokeWidth="3" />
      </g>
    </svg>
  );
}
