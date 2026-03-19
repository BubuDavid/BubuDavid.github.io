/** Click Particle Bursts — toggled via sparkle button in nav */
import { themeColors, resizeCanvasToWindow } from './utils';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  life: number;
  maxLife: number;
}

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let particles: Particle[] = [];
let rafId = 0;
let enabled = false;

function ensureCanvas() {
  if (canvas && document.body.contains(canvas)) return;
  const dpr = window.devicePixelRatio || 1;
  canvas = document.createElement('canvas');
  canvas.id = 'click-particles-canvas';
  canvas.style.cssText =
    'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9999';
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx = canvas.getContext('2d')!;
  ctx.scale(dpr, dpr);
  document.body.appendChild(canvas);
}

function handleResize() {
  if (!canvas || !ctx) return;
  resizeCanvasToWindow(canvas, ctx);
}

function spawnBurst(x: number, y: number) {
  const colors = themeColors();
  const palette = [colors.accent, colors.highlight, colors.success, colors.accentSecondary];
  const count = 8 + Math.floor(Math.random() * 5); // 8-12
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
    const speed = 80 + Math.random() * 120;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: 2 + Math.random() * 3,
      color: palette[Math.floor(Math.random() * palette.length)],
      life: 0,
      maxLife: 0.6 + Math.random() * 0.4,
    });
  }
  if (!rafId) tick(performance.now());
}

let lastTime = 0;
function tick(now: number) {
  if (!ctx || !canvas) return;
  const dt = lastTime ? (now - lastTime) / 1000 : 0.016;
  lastTime = now;

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life += dt;
    if (p.life >= p.maxLife) {
      particles.splice(i, 1);
      continue;
    }
    p.vy += 300 * dt; // gravity
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    const alpha = 1 - p.life / p.maxLife;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * alpha, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  if (particles.length > 0) {
    rafId = requestAnimationFrame(tick);
  } else {
    rafId = 0;
    lastTime = 0;
  }
}

function handleClick(e: MouseEvent) {
  if (!enabled) return;
  ensureCanvas();
  spawnBurst(e.clientX, e.clientY);
}

let controller: AbortController | null = null;

export function setParticlesEnabled(on: boolean) {
  enabled = on;
  if (!on) {
    // Clean up canvas when disabled
    particles = [];
    cancelAnimationFrame(rafId);
    rafId = 0;
    lastTime = 0;
    document.getElementById('click-particles-canvas')?.remove();
    canvas = null;
    ctx = null;
  }
}

export function getParticlesEnabled() {
  return enabled;
}

export function setupClickParticles() {
  // Cleanup previous
  controller?.abort();
  cancelAnimationFrame(rafId);
  rafId = 0;
  lastTime = 0;
  particles = [];
  enabled = false;
  document.getElementById('click-particles-canvas')?.remove();
  canvas = null;
  ctx = null;

  controller = new AbortController();
  const { signal } = controller;

  document.addEventListener('click', handleClick, { signal });
  window.addEventListener('resize', handleResize, { signal });

  // Sparkle toggle button
  const sparkleBtn = document.getElementById('sparkle-toggle');
  if (sparkleBtn) {
    sparkleBtn.classList.remove('text-accent', 'bg-surface-border');
    sparkleBtn.addEventListener('click', () => {
      enabled = !enabled;
      if (enabled) {
        sparkleBtn.classList.add('text-accent', 'bg-surface-border');
      } else {
        sparkleBtn.classList.remove('text-accent', 'bg-surface-border');
        setParticlesEnabled(false);
      }
    }, { signal });
  }
}

setupClickParticles();
document.addEventListener('astro:after-swap', setupClickParticles);
