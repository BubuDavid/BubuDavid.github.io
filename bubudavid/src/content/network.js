// Everything the components need to know about the network, derived from lab.js and work.js.
import { LAB } from './lab';
import { LAB_LINES, ROUTES, WORK } from './work';

export const STATIONS = Object.fromEntries([
  ...LAB.map(p => [p.id, { ...p, kind: 'lab', lines: [LAB_LINES[p.id]] }]),
  ...WORK.map(w => [w.id, { ...w, kind: 'work' }]),
]);

export const displayName = id => STATIONS[id].short ?? STATIONS[id].name;

export const routeName = id => STATIONS[id].rshort ?? displayName(id);

/* The id of the element a station jumps to: its write-up (work) or its archive entry (lab). */
export const targetId = id => (STATIONS[id].kind === 'work' ? id : `a-${STATIONS[id].no}`);

/* A Map, not an object: element ids come from the URL, and 'constructor' must not match. */
const stationByTarget = new Map(Object.keys(STATIONS).map(id => [targetId(id), id]));

export const stationForTarget = elementId => stationByTarget.get(elementId);

export function linesText(lines) {
  if (lines.length === 1) return `Line ${lines[0]}`;
  return `Lines ${lines.slice(0, -1).join(', ')} and ${lines[lines.length - 1]}`;
}

export function stationLabel(id) {
  const s = STATIONS[id];
  const where = s.kind === 'work' ? `Work station, ${s.role}, ${s.period}` : 'Lab station, student project';
  return `${displayName(id)}. ${where}. ${linesText(s.lines)}. Jump to its write-up.`;
}

/* The work stations that grew from a lab project, in WORK order. */
export const grewInto = labId => WORK.filter(w => w.grew.some(([lab]) => lab === labId)).map(w => w.id);

/* For the archive's section on line n: its lab stations, and the work stations on that line that grew from them. */
export function archiveLine(n) {
  const lab = ROUTES[n].filter(id => STATIONS[id].kind === 'lab');
  const into = ROUTES[n].filter(id => STATIONS[id].kind === 'work'
    && STATIONS[id].grew.some(([labId]) => LAB_LINES[labId] === n));
  return { lab, into };
}

/* Cut on a word boundary and add an ellipsis. */
export function shortLine(text, max = 118) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const at = cut.lastIndexOf(' ');
  return `${at > 0 ? cut.slice(0, at) : cut}…`;
}
