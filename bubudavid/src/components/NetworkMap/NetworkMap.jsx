import { useEffect, useRef, useState } from 'react';
import { LINE_IDS, LINES } from '../../content/lines';
import { COLORS, TRAIN } from '../../content/map-layout';
import { jumpTo } from '../../lib/jump';
import { useIsMobile, usePrefersReducedMotion } from '../../lib/media';
import LineBadge from '../shared/LineBadge';
import PartHead from '../shared/PartHead';
import HorizontalMap from './HorizontalMap';
import MapTooltip from './MapTooltip';
import VerticalMap from './VerticalMap';
import { useTrain } from './useTrain';
import './NetworkMap.css';

function MapKey() {
  return (
    <div className="map-key" role="group" aria-label="Map key">
      <span>
        <svg width="18" height="18" aria-hidden="true">
          <circle cx="9" cy="9" r="5" fill={COLORS.card} stroke={COLORS.labStroke} strokeWidth="2.4" />
        </svg>
        Lab station · student project
      </span>
      <span>
        <svg width="22" height="22" aria-hidden="true">
          <circle cx="11" cy="11" r="7.5" fill={COLORS.card} stroke={COLORS.ink} strokeWidth="3.4" />
        </svg>
        Work station · in production
      </span>
      <span>
        <svg width="38" height="20" aria-hidden="true">
          <rect x="2" y="2" width="34" height="16" rx="8" fill={COLORS.card} stroke={COLORS.ink} strokeWidth="3.2" />
        </svg>
        Correspondencia · interchange
      </span>
      <span>
        <svg width="30" height="14" aria-hidden="true">
          <path d="M2 7h26" stroke={COLORS.ink} strokeWidth="2" strokeDasharray="5 4" />
        </svg>
        Graduation
      </span>
      <span className="k-train">
        <svg width="20" height="20" aria-hidden="true">
          <circle cx="10" cy="10" r="9" fill={LINES[TRAIN.line].color} opacity=".25" />
          <circle cx="10" cy="10" r="5" fill={COLORS.ink} stroke="#fff" strokeWidth="2" />
        </svg>
        Tren on Línea {TRAIN.line}
      </span>
    </div>
  );
}

export default function NetworkMap() {
  const [pinned, setPinned] = useState(null); // the line a click holds on
  const [hovered, setHovered] = useState(null); // the line under the pointer or focus, until it leaves
  const [tip, setTip] = useState(null); // { id, el } of the station the tooltip names
  const [overflowing, setOverflowing] = useState(false);
  const cardRef = useRef(null);
  const scrollRef = useRef(null);
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();

  useTrain(cardRef, { isMobile, reducedMotion });

  const active = hovered ?? pinned;
  const isDim = lines => active != null && !lines.includes(active);

  const onTip = (id, el) => setTip(prev => {
    if (!id) return null;
    return prev?.id === id ? prev : { id, el };
  });
  /* Scrolling moves the stations out from under a hover tooltip, so it closes. A tooltip opened by focus stays
     and is measured again: focusing an off-screen station scrolls the map by itself. */
  const onMapScroll = () => {
    const focused = document.activeElement;
    setTip(prev => (prev && prev.el === focused ? { ...prev } : null));
  };
  const onActivate = (id) => {
    setTip(null);
    jumpTo(id);
  };

  /* Crossing to the phone layout leaves no station for the tooltip to name. */
  useEffect(() => {
    if (isMobile) setTip(null);
  }, [isMobile]);

  /* The sideways-scroll hint shows only while the horizontal map is wider than its frame. */
  useEffect(() => {
    const scroll = scrollRef.current;
    if (!scroll) {
      setOverflowing(false);
      return undefined;
    }
    const check = () => setOverflowing(scroll.scrollWidth > scroll.clientWidth + 2);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(scroll);
    return () => observer.disconnect();
  }, [isMobile]);

  return (
    <section className="part net wrap" id="map" aria-labelledby="map-h">
      <PartHead id="map-h" no="The map" title="From student to engineer" folio="pp. 04–05">
        Four lines run from what I built at university to what I run today. <strong>Lab stations</strong> on the left are real student projects; <strong>work stations</strong> on the right are the systems they grew into. Select a station to jump to it.
      </PartHead>

      <div className={overflowing ? 'map-card is-overflowing' : 'map-card'} id="map-card" ref={cardRef}>
        <div className="map-bar">
          <div className="map-title"><b>Mapa de la red</b>2019 → hoy</div>
          <div className="chips-lines" role="group" aria-label="Highlight a line">
            {LINE_IDS.map(n => (
              <button
                key={n}
                className="lchip"
                type="button"
                aria-pressed={pinned === n}
                aria-label={`Line ${n}, ${LINES[n].name}`}
                style={{ '--c': `var(--l${n})`, '--ci': `var(--l${n}-ink)` }}
                onMouseEnter={() => setHovered(n)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(n)}
                onBlur={() => setHovered(null)}
                onClick={() => {
                  setPinned(pinned === n ? null : n);
                  setHovered(null);
                }}
              >
                <LineBadge n={n} />{LINES[n].chip}
              </button>
            ))}
          </div>
        </div>

        <div className="map-hint" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
          </svg>
          Scroll the map sideways
        </div>

        {isMobile ? (
          <VerticalMap isDim={isDim} onActivate={onActivate} />
        ) : (
          <div className="hmap-wrap">
            <div className="map-scroll" id="map-scroll" ref={scrollRef} onScroll={onMapScroll}>
              <HorizontalMap isDim={isDim} onActivate={onActivate} onTip={onTip} />
            </div>
          </div>
        )}

        <MapKey />
        <MapTooltip tip={tip} cardRef={cardRef} />
      </div>
    </section>
  );
}
