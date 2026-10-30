import { useLayoutEffect, useRef } from 'react';

const LETTERS = ['B', 'U', 'B', 'U'];

/* Size BUBU so the four letters fill their column exactly. */
export default function Nameplate() {
  const np = useRef(null);

  useLayoutEffect(() => {
    const row = np.current;
    const host = row.parentElement;
    let lastWidth = 0;

    function fit(force) {
      const width = host.clientWidth;
      if (!width || (!force && width === lastWidth)) return;
      lastWidth = width;
      row.style.fontSize = '';
      const sum = [...row.children].reduce((total, letter) => total + letter.getBoundingClientRect().width, 0);
      if (!sum) return;
      const fontSize = parseFloat(getComputedStyle(row).fontSize);
      row.style.fontSize = `${(fontSize * (width * 0.975) / sum).toFixed(2)}px`;
    }
    const refit = () => fit(true);

    fit(true);
    // The serif loads after first paint and changes the letters' widths.
    const fonts = document.fonts;
    fonts?.load?.('560 100px "Fraunces"').then(refit, () => {});
    fonts?.ready?.then(refit);
    fonts?.addEventListener?.('loadingdone', refit);
    const observer = new ResizeObserver(() => fit(false));
    observer.observe(host);

    return () => {
      fonts?.removeEventListener?.('loadingdone', refit);
      observer.disconnect();
    };
  }, []);

  return (
    <span className="np" aria-hidden="true" ref={np}>
      {LETTERS.map((letter, i) => <span key={i}>{letter}</span>)}
    </span>
  );
}
