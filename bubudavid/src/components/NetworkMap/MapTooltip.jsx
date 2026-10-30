import { useLayoutEffect, useRef } from 'react';
import { STATIONS, displayName, shortLine } from '../../content/network';

const GAP = 10;
const EDGE = 8;
const NAV = 64; // height of the sticky nav: a tooltip above the station must not slide under it

/* The card that names a station on hover or focus. `tip` is { id, el }: the station and its element, or
   null. `cardRef` is the map card it floats in. The position is measured once the content is in, and again
   each time `tip` is a new object, as when the map scrolls under a focused station. */
export default function MapTooltip({ tip: shown, cardRef }) {
  const id = shown?.id;
  const anchor = shown?.el;
  const tipRef = useRef(null);

  useLayoutEffect(() => {
    const tip = tipRef.current;
    const card = cardRef.current;
    if (!id || !anchor || !tip || !card) return;
    const r = anchor.getBoundingClientRect();
    const c = card.getBoundingClientRect();
    let x = r.left - c.left + r.width / 2 - tip.offsetWidth / 2;
    x = Math.max(EDGE, Math.min(x, c.width - tip.offsetWidth - EDGE));
    let y = r.top - c.top - tip.offsetHeight - GAP;
    if (r.top - tip.offsetHeight - GAP < NAV) y = r.bottom - c.top + GAP;
    tip.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
  }, [shown, id, anchor, cardRef]);

  const s = id ? STATIONS[id] : null;
  return (
    <div className="net-tip" id="net-tip" role="tooltip" hidden={!s} ref={tipRef}>
      {s && (
        <>
          <b>{displayName(id)}</b>
          <span>{shortLine(s.kind === 'work' ? s.tagline : s.desc)}</span>
          <small>
            {s.kind === 'work' ? `Work · ${s.period} · see the write-up` : 'Lab · student project · see the archive'}
          </small>
        </>
      )}
    </div>
  );
}
