import { useEffect } from 'react';

const DURATION = { phone: 5200, desktop: 6800 };
const DWELL = 3200; // the train waits at the interchange
const PAUSE = 3800; // and the next run starts this long after it leaves

/* The Line 1 train: a dot that rides [data-train-path] from the first station to the interchange, then
   fades and starts over. It runs only while the map card is at least a quarter in view. It looks up its
   three elements inside the card on every frame, so the same hook serves both maps. */
export function useTrain(cardRef, { isMobile, reducedMotion }) {
  useEffect(() => {
    const card = cardRef.current;
    if (!card || reducedMotion) return undefined;

    const duration = isMobile ? DURATION.phone : DURATION.desktop;
    const find = () => ({
      path: card.querySelector('[data-train-path]'),
      dot: card.querySelector('[data-train-dot]'),
      stop: card.querySelector('[data-train-stop]'),
    });
    let onScreen = false;
    let raf = 0;
    let leave = 0;
    let again = 0;

    const hide = () => {
      const { dot } = find();
      if (dot) dot.style.opacity = '0';
    };

    const run = () => {
      if (!onScreen) return;
      let t0 = null;
      const step = (ts) => {
        const { path, dot, stop } = find();
        if (!path || !dot) {
          raf = 0;
          return;
        }
        if (t0 === null) t0 = ts;
        const t = Math.min(1, (ts - t0) / duration);
        const eased = -(Math.cos(Math.PI * t) - 1) / 2;
        const pt = path.getPointAtLength(eased * path.getTotalLength());
        dot.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
        dot.style.opacity = '1';
        if (t < 1) {
          raf = window.requestAnimationFrame(step);
          return;
        }
        raf = 0;
        if (stop) {
          stop.classList.remove('arrive');
          void stop.getBoundingClientRect(); // restart the ring's animation
          stop.classList.add('arrive');
        }
        leave = window.setTimeout(() => {
          hide();
          if (stop) stop.classList.remove('arrive');
          again = window.setTimeout(run, PAUSE);
        }, DWELL);
      };
      raf = window.requestAnimationFrame(step);
    };

    const halt = () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(leave);
      window.clearTimeout(again);
      raf = 0;
      hide();
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !onScreen) {
          onScreen = true;
          halt();
          run();
        } else if (!entry.isIntersecting && onScreen) {
          onScreen = false;
          halt();
        }
      });
    }, { threshold: 0.25 });
    observer.observe(card);

    return () => {
      observer.disconnect();
      onScreen = false;
      halt();
    };
  }, [cardRef, isMobile, reducedMotion]);
}
