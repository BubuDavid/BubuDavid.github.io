import { describe, expect, test } from 'vitest';
import { LINE_IDS } from './lines';
import { LAB } from './lab';
import { ALSO, CASES, LAB_LINES, ROUTES, WORK } from './work';
import { HPOS, TERMINI, VORDER, VX, XFER } from './map-layout';
import {
  STATIONS, archiveLine, displayName, grewInto, linesText, routeName,
  shortLine, stationForTarget, stationLabel, targetId,
} from './network';

const ids = Object.keys(STATIONS);

describe('the network matches the hand-drawn map', () => {
  test('there are 8 lab and 6 work stations', () => {
    expect(ids.filter(id => STATIONS[id].kind === 'lab')).toHaveLength(8);
    expect(ids.filter(id => STATIONS[id].kind === 'work')).toHaveLength(6);
  });
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

describe('content', () => {
  test('lab numbers run from 01 to 08', () => {
    expect(LAB.map(p => p.no).sort()).toEqual(['01', '02', '03', '04', '05', '06', '07', '08']);
  });
  test.each(LAB.map(p => [p.id, p]))('%s links to a demo or to its code over https', (_, p) => {
    expect(p.demo ?? p.source).toMatch(/^https:\/\//);
    if (p.source) expect(p.source).toMatch(/^https:\/\//);
    if (p.demoOffline) {
      expect(p.demo).toBeUndefined();
      expect(p.source).toBeDefined();
    }
  });
  test('the three Glitch demos point at their repositories', () => {
    const offline = Object.fromEntries(LAB.filter(p => p.demoOffline).map(p => [p.id, p.source]));
    expect(offline).toEqual({
      spotwipy: 'https://github.com/BubuDavid/SpoTwipy',
      spotify: 'https://github.com/BubuDavid/Personality-Analysis-Spotify',
      color: 'https://github.com/BubuDavid/Color-Palette_Picker',
    });
  });
  test('every "grew from" names a lab project', () => {
    for (const w of WORK) for (const [lab] of w.grew) {
      expect(STATIONS[lab]?.kind, `${w.id} grew from unknown "${lab}"`).toBe('lab');
    }
  });
  test('every work project is a case study or a brief, and only one of them', () => {
    const shown = [...CASES.map(c => c.id), ...ALSO.map(a => a.id)].sort();
    expect(shown).toEqual(WORK.map(w => w.id).sort());
  });
  test('each case rides in on one of its own lines', () => {
    for (const c of CASES) expect(STATIONS[c.id].lines).toContain(c.routeLine);
  });
});

describe('network helpers', () => {
  test('targets', () => {
    expect(targetId('lienzo')).toBe('lienzo');
    expect(targetId('spotify')).toBe('a-04');
    expect(stationForTarget('a-04')).toBe('spotify');
    expect(stationForTarget('map')).toBeUndefined();
    expect(['constructor', 'toString', '__proto__'].map(stationForTarget)).toEqual([undefined, undefined, undefined]);
  });
  test('names', () => {
    expect(displayName('dci')).toBe('DCI · Hacedor de Horarios');
    expect(routeName('dci')).toBe('Hacedor de Horarios');
    expect(routeName('spotify')).toBe('Spotify Analysis');
  });
  test('linesText', () => {
    expect(linesText([2])).toBe('Line 2');
    expect(linesText([2, 4])).toBe('Lines 2 and 4');
    expect(linesText([1, 2, 4])).toBe('Lines 1, 2 and 4');
  });
  test('stationLabel', () => {
    expect(stationLabel('pulso')).toBe('Pulso. Work station, Backend & AI lead, 2024 – now. Lines 1, 2 and 4. Jump to its write-up.');
    expect(stationLabel('rrt')).toBe('RRT Bidirectional Dijkstra. Lab station, student project. Line 3. Jump to its write-up.');
  });
  test('grewInto and archiveLine', () => {
    expect(grewInto('dci')).toEqual(['ruta']);
    expect(grewInto('resume')).toEqual([]);
    expect(archiveLine(1)).toEqual({ lab: ['spotwipy', 'socorro'], into: ['mensajero', 'pulso'] });
    expect(archiveLine(2)).toEqual({ lab: ['spotify', 'color'], into: ['gemelos', 'lienzo'] });
  });
  test('shortLine cuts on a word boundary', () => {
    expect(shortLine('short text')).toBe('short text');
    const cut = shortLine('word '.repeat(40).trim());
    expect(cut.length).toBeLessThanOrEqual(119);
    expect(cut.endsWith('word…')).toBe(true);
  });
});
