/** Konami Code → Party Mode (10s of chaos) */
import { themeColors, resizeCanvasToWindow } from './utils';

const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

const DURATION = 10_000; // ms

interface Confetti {
  x: number; y: number; vx: number; vy: number;
  r: number; color: string; rotation: number; rotSpeed: number;
}

let controller: AbortController | null = null;
let partyActive = false;

function startParty() {
  if (partyActive) return;
  partyActive = true;

  const ac = new AbortController();
  const { signal } = ac;
  const colors = themeColors();
  const palette = [colors.accent, colors.highlight, colors.success, colors.accentSecondary];

  // --- Confetti canvas ---
  const dpr = window.devicePixelRatio || 1;
  const confettiCanvas = document.createElement('canvas');
  confettiCanvas.id = 'konami-confetti';
  confettiCanvas.style.cssText =
    'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9998';
  confettiCanvas.width = window.innerWidth * dpr;
  confettiCanvas.height = window.innerHeight * dpr;
  const cctx = confettiCanvas.getContext('2d')!;
  cctx.scale(dpr, dpr);
  document.body.appendChild(confettiCanvas);

  const onResize = () => resizeCanvasToWindow(confettiCanvas, cctx);
  window.addEventListener('resize', onResize, { signal });

  // Spawn confetti
  const confetti: Confetti[] = [];
  for (let i = 0; i < 150; i++) {
    confetti.push({
      x: Math.random() * window.innerWidth,
      y: -10 - Math.random() * window.innerHeight * 0.5,
      vx: (Math.random() - 0.5) * 100,
      vy: 120 + Math.random() * 200,
      r: 3 + Math.random() * 4,
      color: palette[Math.floor(Math.random() * palette.length)],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 8,
    });
  }

  // --- Injected styles ---
  const style = document.createElement('style');
  style.id = 'konami-styles';
  style.textContent = `
    @keyframes konami-wobble {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-2deg); }
      75% { transform: rotate(2deg); }
    }
    @keyframes konami-shake {
      0%, 100% { transform: translate(0, 0); }
      25% { transform: translate(-2px, 1px); }
      50% { transform: translate(2px, -1px); }
      75% { transform: translate(-1px, 2px); }
    }
    .konami-wobble { animation: konami-wobble 0.3s ease-in-out infinite; }
    body.konami-shake { animation: konami-shake 0.15s ease-in-out infinite; }
  `;
  document.head.appendChild(style);

  // Apply effects
  document.body.classList.add('konami-shake');
  const cards = document.querySelectorAll('[class*="card"], [class*="Card"], article, .group');
  cards.forEach((c) => c.classList.add('konami-wobble'));

  // Hue rotation on body
  let hue = 0;

  // Animation loop
  let lastTime = 0;
  let rafId = 0;
  function tick(now: number) {
    const dt = lastTime ? (now - lastTime) / 1000 : 0.016;
    lastTime = now;

    // Hue-rotate
    hue = (hue + 200 * dt) % 360;
    document.body.style.filter = `hue-rotate(${hue}deg)`;

    // Confetti
    cctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (const c of confetti) {
      c.x += c.vx * dt;
      c.y += c.vy * dt;
      c.rotation += c.rotSpeed * dt;
      // Wrap around
      if (c.y > window.innerHeight + 20) {
        c.y = -10;
        c.x = Math.random() * window.innerWidth;
      }
      cctx.save();
      cctx.translate(c.x, c.y);
      cctx.rotate(c.rotation);
      cctx.fillStyle = c.color;
      cctx.fillRect(-c.r, -c.r / 2, c.r * 2, c.r);
      cctx.restore();
    }

    rafId = requestAnimationFrame(tick);
  }
  rafId = requestAnimationFrame(tick);

  // Cleanup function
  function stopParty() {
    cancelAnimationFrame(rafId);
    ac.abort();
    confettiCanvas.remove();
    style.remove();
    document.body.classList.remove('konami-shake');
    document.body.style.filter = '';
    cards.forEach((c) => c.classList.remove('konami-wobble'));
    partyActive = false;
  }

  // ESC to stop early
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') stopParty();
  }, { signal });

  // Auto-stop after DURATION
  setTimeout(stopParty, DURATION);
}

export function setupKonamiParty() {
  controller?.abort();
  controller = new AbortController();
  const { signal } = controller;

  let seq: string[] = [];
  document.addEventListener('keydown', (e) => {
    seq.push(e.key);
    if (seq.length > KONAMI.length) seq.shift();
    if (seq.length === KONAMI.length && seq.every((k, i) => k === KONAMI[i])) {
      seq = [];
      startParty();
    }
  }, { signal });
}

setupKonamiParty();
document.addEventListener('astro:after-swap', setupKonamiParty);
