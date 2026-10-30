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

/* Scroll to a station's section, flash it and move focus to its heading. False if it is not on the page. */
export function jumpTo(stationId, { instant = false } = {}) {
  const el = document.getElementById(targetId(stationId));
  if (!el) return false;
  el.scrollIntoView({
    behavior: instant || prefersReducedMotion() ? 'auto' : 'smooth',
    block: el.matches(CENTRED) ? 'center' : 'start',
  });
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

/* The page is drawn in the browser, so the anchor of a shared link does not exist when the browser looks for it. */
export function useInitialHash() {
  useEffect(() => {
    const id = location.hash.slice(1);
    if (!id) return;
    const station = stationForTarget(id);
    if (station) jumpTo(station, { instant: true });
    else document.getElementById(id)?.scrollIntoView({ block: 'start' });
  }, []);
}
