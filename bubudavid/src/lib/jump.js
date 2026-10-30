import { useEffect } from 'react';
import { stationForTarget, targetId } from '../content/network';
import { prefersReducedMotion } from './media';

const FLASH_MS = 2300;
const CENTRED = '.toc > li, .idx tr'; // archive rows sit mid-screen; write-ups start at the top
const HEADING = '.case-title, .idx-name, .toc-title';

const flashTimers = new WeakMap();

/* Highlight a section for a moment. A second flash restarts the animation and the clock. */
export function flash(el) {
  clearTimeout(flashTimers.get(el));
  el.classList.remove('is-flash');
  void el.offsetWidth; // reflow, so the animation starts again
  el.classList.add('is-flash');
  flashTimers.set(el, setTimeout(() => el.classList.remove('is-flash'), FLASH_MS));
}

/* 'auto' follows html { scroll-behavior: smooth }, so an instant scroll turns smooth scrolling off for the call. */
function scrollToTarget(el, instant) {
  const root = document.documentElement;
  const before = root.style.scrollBehavior;
  if (instant) root.style.scrollBehavior = 'auto';
  try {
    el.scrollIntoView({ behavior: instant ? 'auto' : 'smooth', block: el.matches(CENTRED) ? 'center' : 'start' });
  } finally {
    if (instant) root.style.scrollBehavior = before;
  }
}

/* Scroll to a station's section, flash it and move focus to its heading. False if it is not on the page. */
export function jumpTo(stationId, { instant = false } = {}) {
  const el = document.getElementById(targetId(stationId));
  if (!el) return false;
  scrollToTarget(el, instant || prefersReducedMotion());
  flash(el);
  const heading = el.querySelector(HEADING);
  if (heading) {
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  }
  return true;
}

/* In-page links to a station's section jump there, with the flash and the focus. Other anchors are left alone. */
export function useJumpLinks() {
  useEffect(() => {
    const onClick = (event) => {
      const link = event.target.closest?.('a[href^="#"]');
      const station = link && stationForTarget(link.getAttribute('href').slice(1));
      if (station && jumpTo(station)) event.preventDefault();
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
}

const READER_MOVES = ['wheel', 'touchstart', 'keydown', 'pointerdown'];

/* The page is drawn in the browser, so the anchor of a shared link does not exist when the browser looks for it.
   The web fonts arrive after that first jump and change the height of everything above the target, so the page
   lands on it once more when they are in, unless the reader has started moving. */
export function useInitialHash() {
  useEffect(() => {
    const id = location.hash.slice(1);
    if (!id) return undefined;
    const station = stationForTarget(id);
    const el = document.getElementById(station ? targetId(station) : id);
    if (!el) return undefined;
    if (station) jumpTo(station, { instant: true });
    else scrollToTarget(el, true);

    let waiting = true;
    let frame = 0;
    const stop = () => {
      waiting = false;
      cancelAnimationFrame(frame);
      READER_MOVES.forEach(type => window.removeEventListener(type, stop));
    };
    READER_MOVES.forEach(type => window.addEventListener(type, stop, { passive: true }));
    document.fonts?.ready?.then(() => {
      if (!waiting) return;
      frame = requestAnimationFrame(() => {
        stop();
        scrollToTarget(el, true);
      });
    });
    return stop;
  }, []);
}
