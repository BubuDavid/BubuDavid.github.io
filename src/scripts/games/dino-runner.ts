/** Dino Runner — triggered by clicking the "Bubu" logo 5x in 2s */
import { themeColors } from './utils';

const CLICK_THRESHOLD = 5;
const CLICK_WINDOW = 2000; // ms
const STRIP_HEIGHT = 150;
const GROUND_Y = STRIP_HEIGHT - 20;

interface Cactus {
  x: number;
  width: number;
  height: number;
}

let controller: AbortController | null = null;

function launchDino() {
  const colors = themeColors();
  const dpr = window.devicePixelRatio || 1;

  // Container
  const wrapper = document.createElement('div');
  wrapper.id = 'dino-game';
  wrapper.style.cssText = `
    position:fixed;bottom:0;left:0;width:100%;height:${STRIP_HEIGHT}px;z-index:9990;
    background:${colors.bg};border-top:2px solid ${colors.accent};
    transition:transform 0.3s ease;transform:translateY(100%);
  `;

  // Canvas
  const canvas = document.createElement('canvas');
  const width = window.innerWidth;
  canvas.width = width * dpr;
  canvas.height = STRIP_HEIGHT * dpr;
  canvas.style.cssText = `width:${width}px;height:${STRIP_HEIGHT}px;display:block;`;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(dpr, dpr);
  wrapper.appendChild(canvas);

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.style.cssText = `
    position:absolute;top:8px;right:12px;background:none;border:none;
    color:${colors.muted};font-size:20px;cursor:pointer;z-index:1;
    font-family:sans-serif;line-height:1;
  `;
  wrapper.appendChild(closeBtn);

  // Score display
  const scoreEl = document.createElement('div');
  scoreEl.style.cssText = `
    position:absolute;top:8px;left:12px;
    color:${colors.muted};font-size:14px;font-family:var(--font-mono);
  `;
  wrapper.appendChild(scoreEl);

  document.body.appendChild(wrapper);
  // Slide in
  requestAnimationFrame(() => {
    wrapper.style.transform = 'translateY(0)';
  });

  // Game state
  let dinoY = GROUND_Y;
  let dinoVY = 0;
  const dinoWidth = 24;
  const dinoHeight = 30;
  let jumping = false;
  let score = 0;
  let speed = 200;
  let gameOver = false;
  let rafId = 0;

  const cacti: Cactus[] = [];
  let spawnTimer = 0;
  const spawnInterval = () => 1.2 + Math.random() * 1.0;
  let nextSpawn = spawnInterval();

  const ac = new AbortController();
  const { signal } = ac;

  function jump() {
    if (!jumping && !gameOver) {
      jumping = true;
      dinoVY = -420;
    }
  }

  function cleanup() {
    cancelAnimationFrame(rafId);
    ac.abort();
    wrapper.style.transform = 'translateY(100%)';
    setTimeout(() => wrapper.remove(), 300);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'ArrowUp') { e.preventDefault(); jump(); }
    if (e.key === 'Escape') cleanup();
  }, { signal });
  canvas.addEventListener('touchstart', (e) => { e.preventDefault(); jump(); }, { signal, passive: false });
  closeBtn.addEventListener('click', cleanup, { signal });

  let lastTime = 0;
  function tick(now: number) {
    const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0.016;
    lastTime = now;

    if (gameOver) {
      // Draw game over
      ctx.clearRect(0, 0, width, STRIP_HEIGHT);
      drawScene(dt, true);
      ctx.fillStyle = colors.accent;
      ctx.font = `bold 24px ${getComputedStyle(document.documentElement).getPropertyValue('--font-heading').trim() || 'serif'}`;
      ctx.textAlign = 'center';
      ctx.fillText('Game Over!', width / 2, STRIP_HEIGHT / 2 - 10);
      ctx.font = '14px sans-serif';
      ctx.fillStyle = colors.muted;
      ctx.fillText('Tap or press Space to restart', width / 2, STRIP_HEIGHT / 2 + 15);
      return;
    }

    score += dt * 10;
    speed += dt * 8;
    scoreEl.textContent = `Score: ${Math.floor(score)}`;

    // Dino physics
    if (jumping) {
      dinoVY += 1000 * dt; // gravity
      dinoY += dinoVY * dt;
      if (dinoY >= GROUND_Y) {
        dinoY = GROUND_Y;
        dinoVY = 0;
        jumping = false;
      }
    }

    // Spawn cacti
    spawnTimer += dt;
    if (spawnTimer >= nextSpawn) {
      spawnTimer = 0;
      nextSpawn = spawnInterval();
      cacti.push({
        x: width + 20,
        width: 12 + Math.random() * 10,
        height: 25 + Math.random() * 20,
      });
    }

    // Move cacti
    for (let i = cacti.length - 1; i >= 0; i--) {
      cacti[i].x -= speed * dt;
      if (cacti[i].x < -30) cacti.splice(i, 1);
    }

    // Collision
    const dinoLeft = 40;
    const dinoTop = dinoY - dinoHeight;
    for (const c of cacti) {
      if (
        dinoLeft + dinoWidth > c.x &&
        dinoLeft < c.x + c.width &&
        dinoTop + dinoHeight > GROUND_Y - c.height
      ) {
        gameOver = true;
        // Allow restart
        const restartHandler = () => {
          gameOver = false;
          score = 0;
          speed = 200;
          cacti.length = 0;
          dinoY = GROUND_Y;
          dinoVY = 0;
          jumping = false;
          spawnTimer = 0;
          lastTime = 0;
          document.removeEventListener('keydown', restartOnKey);
          canvas.removeEventListener('touchstart', restartHandler);
          rafId = requestAnimationFrame(tick);
        };
        const restartOnKey = (e: KeyboardEvent) => {
          if (e.key === ' ' || e.key === 'ArrowUp') restartHandler();
        };
        document.addEventListener('keydown', restartOnKey, { signal });
        canvas.addEventListener('touchstart', restartHandler, { signal, once: true });
        break;
      }
    }

    ctx.clearRect(0, 0, width, STRIP_HEIGHT);
    drawScene(dt, false);

    rafId = requestAnimationFrame(tick);
  }

  function drawScene(_dt: number, frozen: boolean) {
    // Ground line
    ctx.strokeStyle = colors.muted;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(width, GROUND_Y);
    ctx.stroke();

    // Dino (simple rectangle dino shape)
    ctx.fillStyle = colors.accent;
    const dx = 40;
    const dy = dinoY - dinoHeight;
    // Body
    ctx.fillRect(dx, dy, dinoWidth, dinoHeight);
    // Head
    ctx.fillRect(dx + dinoWidth - 4, dy - 10, 12, 12);
    // Eye
    ctx.fillStyle = colors.bg;
    ctx.fillRect(dx + dinoWidth + 3, dy - 7, 3, 3);
    // Legs
    ctx.fillStyle = colors.accent;
    if (!frozen && !jumping) {
      const legOffset = Math.sin(performance.now() / 100) > 0 ? 0 : 4;
      ctx.fillRect(dx + 3, dinoY, 4, 6 + legOffset);
      ctx.fillRect(dx + dinoWidth - 7, dinoY, 4, 6 + (4 - legOffset));
    } else {
      ctx.fillRect(dx + 3, dinoY, 4, 6);
      ctx.fillRect(dx + dinoWidth - 7, dinoY, 4, 6);
    }

    // Cacti
    ctx.fillStyle = colors.success;
    for (const c of cacti) {
      ctx.fillRect(c.x, GROUND_Y - c.height, c.width, c.height);
      // Small arms
      ctx.fillRect(c.x - 4, GROUND_Y - c.height * 0.6, 4, 8);
      ctx.fillRect(c.x + c.width, GROUND_Y - c.height * 0.7, 4, 8);
    }
  }

  rafId = requestAnimationFrame(tick);

  // Cleanup on navigation
  document.addEventListener('astro:before-swap', cleanup, { signal, once: true });
}

export function setupDinoRunner() {
  controller?.abort();
  controller = new AbortController();
  const { signal } = controller;

  const clickTimes: number[] = [];

  // Find the logo link
  const logo = document.querySelector('nav a[href="/portfolio/"]');
  if (!logo) return;

  let navTimeout: ReturnType<typeof setTimeout> | null = null;
  const logoHref = logo.getAttribute('href') || '/portfolio/';

  logo.addEventListener('click', (e) => {
    e.preventDefault(); // Always prevent — we'll navigate manually if needed

    const now = Date.now();
    clickTimes.push(now);

    // Keep only clicks within the window
    while (clickTimes.length > 0 && now - clickTimes[0] > CLICK_WINDOW) {
      clickTimes.shift();
    }

    if (clickTimes.length >= CLICK_THRESHOLD) {
      clickTimes.length = 0;
      if (navTimeout) { clearTimeout(navTimeout); navTimeout = null; }
      // Don't launch if already active
      if (!document.getElementById('dino-game')) {
        launchDino();
      }
      return;
    }

    // If this is a single click, schedule navigation after a short delay.
    // Further clicks within the delay will cancel it.
    if (navTimeout) clearTimeout(navTimeout);
    navTimeout = setTimeout(() => {
      clickTimes.length = 0;
      window.location.href = logoHref;
    }, 400);
  }, { signal });
}

setupDinoRunner();
document.addEventListener('astro:after-swap', setupDinoRunner);
