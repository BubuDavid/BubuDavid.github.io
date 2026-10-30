// The hand-drawn map in map-layout.js against the network in lab.js and work.js. No check here names a
// project, so they hold for any content. `npm run predeploy` runs this file with App.smoke.test.jsx.
import { describe, expect, test } from 'vitest';
import { LINE_IDS } from './lines';
import { LAB } from './lab';
import { LAB_LINES, ROUTES } from './work';
import { HPATHS, HPOS, TERMINI, VORDER, VX, XFER } from './map-layout';
import { STATIONS } from './network';

const ids = Object.keys(STATIONS);

describe('the network matches the hand-drawn map', () => {
  test.each(LINE_IDS)('every stop on line %i exists and lists that line', n => {
    for (const id of ROUTES[n]) {
      expect(STATIONS[id], `ROUTES[${n}] names unknown station "${id}"`).toBeDefined();
      expect(STATIONS[id].lines, `${id} is on ROUTES[${n}] but not on line ${n}`).toContain(n);
    }
  });
  test.each(ids)('%s is on the route of each of its lines', id => {
    for (const n of STATIONS[id].lines) expect(ROUTES[n], `add "${id}" to ROUTES[${n}]`).toContain(id);
  });
  test('every lab project has a line', () => {
    for (const p of LAB) expect(LAB_LINES[p.id], `LAB_LINES has no line for "${p.id}"`).toBeDefined();
  });
  test('the only interchange is the one drawn by hand', () => {
    expect(ids.filter(id => STATIONS[id].lines.length > 1)).toEqual([XFER.id]);
  });
  test.each(ids.filter(id => id !== XFER.id))('%s has coordinates', id => {
    expect(HPOS[id], `add "${id}" to HPOS in map-layout.js`).toBeDefined();
  });
  test('the vertical map lists every station once, plus its three markers', () => {
    expect([...VORDER].sort()).toEqual([...ids, '@lab', '@grad', '@work'].sort());
  });
  test('every line has a column on the vertical map and a badge on the horizontal one', () => {
    for (const n of LINE_IDS) {
      expect(VX[n], `VX has no column for line ${n}`).toBeTypeOf('number');
      expect(TERMINI.some(([line]) => line === n), `TERMINI has no badge for line ${n}`).toBe(true);
    }
  });
});

const TOLERANCE = 2; // map units a station may sit off its line

/* The straight pieces of a line, as [from, to] point pairs. */
const segments = points => points.slice(1).map((to, i) => [points[i], to]);

function distanceToSegment([px, py], [ax, ay], [bx, by]) {
  const dx = bx - ax;
  const dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

/* Whether the segment from a to b touches the rectangle (Liang–Barsky clipping). */
function crossesRect([ax, ay], [bx, by], { x, y, width, height }) {
  const dx = bx - ax;
  const dy = by - ay;
  let from = 0;
  let to = 1;
  for (const [p, q] of [[-dx, ax - x], [dx, x + width - ax], [-dy, ay - y], [dy, y + height - ay]]) {
    if (p === 0) {
      if (q < 0) return false;
      continue;
    }
    const t = q / p;
    if (p < 0) from = Math.max(from, t);
    else to = Math.min(to, t);
    if (from > to) return false;
  }
  return true;
}

describe('the stations sit on their lines', () => {
  test.each(Object.keys(HPOS))('%s sits on the path of its line', id => {
    expect(STATIONS[id], `HPOS has "${id}", which is not a station: remove it from map-layout.js`).toBeDefined();
    const n = STATIONS[id].lines[0];
    expect(HPATHS[n], `HPATHS has no path for line ${n}`).toBeDefined();
    const { x, y } = HPOS[id];
    const off = Math.min(...segments(HPATHS[n]).map(([a, b]) => distanceToSegment([x, y], a, b)));
    expect(off, `${id} is drawn ${Math.round(off)} units off line ${n}: move it in HPOS or move HPATHS[${n}]`)
      .toBeLessThanOrEqual(TOLERANCE);
  });
  test('the interchange box crosses each of its lines', () => {
    expect(STATIONS[XFER.id], `XFER names unknown station "${XFER.id}"`).toBeDefined();
    for (const n of STATIONS[XFER.id].lines) {
      const crosses = segments(HPATHS[n]).some(([a, b]) => crossesRect(a, b, XFER.pill));
      expect(crosses, `line ${n} does not pass through the ${XFER.id} interchange: move XFER or HPATHS[${n}]`).toBe(true);
    }
  });
  test.each(LINE_IDS)('the stations of line %i run down the vertical map in route order', n => {
    const rows = ROUTES[n].map(id => VORDER.indexOf(id));
    expect(rows, `VORDER lists the stations of line ${n} in another order than ROUTES[${n}]`)
      .toEqual([...rows].sort((a, b) => a - b));
  });
});
