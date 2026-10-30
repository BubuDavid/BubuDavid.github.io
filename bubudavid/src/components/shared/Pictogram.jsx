import { COLORS } from '../../content/map-layout';
import { LINES } from '../../content/lines';
import { STATIONS } from '../../content/network';
import { ICONS } from './pictograms';

/* A station's pictogram tile as a fragment of another SVG: x, y and size are in that SVG's units.
   The glyphs in ICONS are our own static markup, so they go in as innerHTML. */
export function Pictogram({ id, x = 0, y = 0, size }) {
  const s = STATIONS[id];
  const work = s.kind === 'work';
  const xfer = s.lines.length > 1;
  const line = LINES[s.lines[0]];
  const fill = xfer ? COLORS.ink : work ? line.color : COLORS.card;
  const glyph = xfer ? '#FFFFFF' : work ? line.ink : COLORS.labGlyph;
  const pad = size * 0.2;
  const sw = work ? 0 : Math.max(1.6, size * 0.075);
  return (
    <>
      <rect
        x={x + sw / 2}
        y={y + sw / 2}
        width={size - sw}
        height={size - sw}
        rx={size * 0.22}
        fill={fill}
        stroke={work ? undefined : line.color}
        strokeWidth={work ? undefined : sw}
      />
      <svg
        x={x + pad}
        y={y + pad}
        width={size - pad * 2}
        height={size - pad * 2}
        viewBox="0 0 24 24"
        fill="none"
        stroke={glyph}
        strokeWidth={work ? 2.2 : 2}
        strokeLinecap="round"
        strokeLinejoin="round"
        dangerouslySetInnerHTML={{ __html: ICONS[s.icon] }}
      />
    </>
  );
}

/* The same tile as a small icon of its own, for lists. */
export function PictogramIcon({ id, className = 'vico' }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <Pictogram id={id} size={32} />
    </svg>
  );
}
