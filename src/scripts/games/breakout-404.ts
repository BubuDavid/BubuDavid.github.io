/** Breakout 404 — playable on the 404 page */
import { themeColors } from './utils';

// 5×7 pixel font for "4", "0", "4"
const FONT_4 = [
  [1,0,0,1,0],
  [1,0,0,1,0],
  [1,0,0,1,0],
  [1,1,1,1,0],
  [0,0,0,1,0],
  [0,0,0,1,0],
  [0,0,0,1,0],
];
const FONT_0 = [
  [0,1,1,1,0],
  [1,0,0,0,1],
  [1,0,0,0,1],
  [1,0,0,0,1],
  [1,0,0,0,1],
  [1,0,0,0,1],
  [0,1,1,1,0],
];

const BRICK_W = 28;
const BRICK_H = 14;
const BRICK_PAD = 3;
const BALL_R = 5;
const PADDLE_H = 12;

export function setupBreakout404() {
  const container = document.getElementById('breakout-container');
  if (!container) return;

  // Remove previous button/canvas if re-swapped
  container.innerHTML = '';

  const btn = document.createElement('button');
  btn.textContent = 'Play Breakout?';
  btn.className =
    'inline-block px-6 py-3 bg-accent text-white rounded-full font-medium hover:bg-accent-secondary transition-colors cursor-pointer mt-4';
  container.appendChild(btn);

  btn.addEventListener('click', () => startBreakout(container), { once: true });
}

function startBreakout(container: HTMLElement) {
  const colors = themeColors();
  const palette = [colors.accent, colors.highlight, colors.success, colors.accentSecondary];
  const parent = container.closest('.flex.flex-col') as HTMLElement || container.parentElement!;

  // Hide sibling content
  const originalDisplay: Map<Element, string> = new Map();
  for (const child of Array.from(parent.children)) {
    if (child === container) continue;
    const el = child as HTMLElement;
    originalDisplay.set(el, el.style.display);
    el.style.display = 'none';
  }
  container.innerHTML = '';

  const dpr = window.devicePixelRatio || 1;
  const canvasW = Math.min(480, window.innerWidth - 32);
  const canvasH = Math.min(560, window.innerHeight - 100);

  const canvas = document.createElement('canvas');
  canvas.width = canvasW * dpr;
  canvas.height = canvasH * dpr;
  canvas.style.cssText = `width:${canvasW}px;height:${canvasH}px;display:block;margin:0 auto;border-radius:8px;border:2px solid ${colors.accent};cursor:none;`;
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d')!;
  ctx.scale(dpr, dpr);

  // Build bricks from "404" pixel font
  interface Brick { x: number; y: number; alive: boolean; color: string; }
  const bricks: Brick[] = [];

  const digits = [FONT_4, FONT_0, FONT_4];
  const digitWidths = [5, 5, 5];
  const totalCols = digitWidths.reduce((a, b) => a + b, 0) + 2 * 2; // 2-col gaps
  const totalW = totalCols * (BRICK_W + BRICK_PAD);
  const startX = (canvasW - totalW) / 2;
  const startY = 40;

  let colOffset = 0;
  for (const digit of digits) {
    const cols = digit[0].length;
    for (let row = 0; row < digit.length; row++) {
      for (let col = 0; col < cols; col++) {
        if (digit[row][col]) {
          bricks.push({
            x: startX + (colOffset + col) * (BRICK_W + BRICK_PAD),
            y: startY + row * (BRICK_H + BRICK_PAD),
            alive: true,
            color: palette[(row + col) % palette.length],
          });
        }
      }
    }
    colOffset += cols + 2; // gap between digits
  }

  // Bonus rows below "404"
  const bonusY = startY + 7 * (BRICK_H + BRICK_PAD) + 20;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < Math.floor(canvasW / (BRICK_W + BRICK_PAD)) - 1; col++) {
      const bx = 10 + col * (BRICK_W + BRICK_PAD);
      if (bx + BRICK_W < canvasW - 10) {
        bricks.push({
          x: bx,
          y: bonusY + row * (BRICK_H + BRICK_PAD),
          alive: true,
          color: palette[(row + col) % palette.length],
        });
      }
    }
  }

  // Paddle & ball
  const paddleW = 70;
  let paddleX = canvasW / 2 - paddleW / 2;
  let ballX = canvasW / 2;
  let ballY = canvasH - 60;
  let ballVX = 150;
  let ballVY = -250;
  let lives = 3;
  let won = false;
  let gameOver = false;

  const ac = new AbortController();
  const { signal } = ac;

  // Mouse/touch control
  function updatePaddle(clientX: number) {
    const rect = canvas.getBoundingClientRect();
    paddleX = ((clientX - rect.left) / rect.width) * canvasW - paddleW / 2;
    paddleX = Math.max(0, Math.min(canvasW - paddleW, paddleX));
  }

  canvas.addEventListener('mousemove', (e) => updatePaddle(e.clientX), { signal });
  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    updatePaddle(e.touches[0].clientX);
  }, { signal, passive: false });
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    updatePaddle(e.touches[0].clientX);
  }, { signal, passive: false });

  let lastTime = 0;
  let rafId = 0;

  function tick(now: number) {
    const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0.016;
    lastTime = now;

    if (!won && !gameOver) {
      // Ball movement
      ballX += ballVX * dt;
      ballY += ballVY * dt;

      // Wall bounces
      if (ballX - BALL_R < 0) { ballX = BALL_R; ballVX = Math.abs(ballVX); }
      if (ballX + BALL_R > canvasW) { ballX = canvasW - BALL_R; ballVX = -Math.abs(ballVX); }
      if (ballY - BALL_R < 0) { ballY = BALL_R; ballVY = Math.abs(ballVY); }

      // Paddle bounce
      if (
        ballVY > 0 &&
        ballY + BALL_R >= canvasH - PADDLE_H - 10 &&
        ballY + BALL_R <= canvasH - 10 + PADDLE_H &&
        ballX >= paddleX &&
        ballX <= paddleX + paddleW
      ) {
        ballVY = -Math.abs(ballVY) * 1.02;
        ballVX += ((ballX - (paddleX + paddleW / 2)) / (paddleW / 2)) * 80;
        // Cap speed
        const maxVX = 400;
        ballVX = Math.max(-maxVX, Math.min(maxVX, ballVX));
      }

      // Brick collision
      for (const b of bricks) {
        if (!b.alive) continue;
        if (
          ballX + BALL_R > b.x &&
          ballX - BALL_R < b.x + BRICK_W &&
          ballY + BALL_R > b.y &&
          ballY - BALL_R < b.y + BRICK_H
        ) {
          b.alive = false;
          // Determine bounce direction
          const overlapX = Math.min(
            Math.abs(ballX - b.x),
            Math.abs(ballX - (b.x + BRICK_W))
          );
          const overlapY = Math.min(
            Math.abs(ballY - b.y),
            Math.abs(ballY - (b.y + BRICK_H))
          );
          if (overlapX < overlapY) {
            ballVX = -ballVX;
          } else {
            ballVY = -ballVY;
          }
          break;
        }
      }

      // Ball lost
      if (ballY > canvasH + 20) {
        lives--;
        if (lives <= 0) {
          gameOver = true;
        } else {
          ballX = canvasW / 2;
          ballY = canvasH - 60;
          ballVX = 150 * (Math.random() > 0.5 ? 1 : -1);
          ballVY = -250;
        }
      }

      // Win check
      if (bricks.every((b) => !b.alive)) {
        won = true;
      }
    }

    // Draw
    ctx.clearRect(0, 0, canvasW, canvasH);

    // Bricks
    for (const b of bricks) {
      if (!b.alive) continue;
      ctx.fillStyle = b.color;
      ctx.beginPath();
      const r = 3;
      ctx.roundRect(b.x, b.y, BRICK_W, BRICK_H, r);
      ctx.fill();
    }

    // Paddle
    ctx.fillStyle = colors.accent;
    ctx.beginPath();
    ctx.roundRect(paddleX, canvasH - PADDLE_H - 10, paddleW, PADDLE_H, 6);
    ctx.fill();

    // Ball
    ctx.fillStyle = colors.text;
    ctx.beginPath();
    ctx.arc(ballX, ballY, BALL_R, 0, Math.PI * 2);
    ctx.fill();

    // Lives
    ctx.fillStyle = colors.muted;
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Lives: ${'♥'.repeat(lives)}`, 8, canvasH - 2);

    // Win/lose messages
    if (won) {
      ctx.fillStyle = colors.accent;
      ctx.font = `bold 22px ${getComputedStyle(document.documentElement).getPropertyValue('--font-heading').trim() || 'serif'}`;
      ctx.textAlign = 'center';
      ctx.fillText('You found all the missing pages!', canvasW / 2, canvasH / 2);
    } else if (gameOver) {
      ctx.fillStyle = colors.accent;
      ctx.font = `bold 22px ${getComputedStyle(document.documentElement).getPropertyValue('--font-heading').trim() || 'serif'}`;
      ctx.textAlign = 'center';
      ctx.fillText('Game Over', canvasW / 2, canvasH / 2 - 10);
      ctx.font = '14px sans-serif';
      ctx.fillStyle = colors.muted;
      ctx.fillText('Click to try again', canvasW / 2, canvasH / 2 + 15);
    }

    rafId = requestAnimationFrame(tick);
  }

  rafId = requestAnimationFrame(tick);

  // Restart on click after game over
  canvas.addEventListener('click', () => {
    if (gameOver || won) {
      bricks.forEach((b) => (b.alive = true));
      lives = 3;
      won = false;
      gameOver = false;
      ballX = canvasW / 2;
      ballY = canvasH - 60;
      ballVX = 150;
      ballVY = -250;
    }
  }, { signal });

  // Cleanup on navigation
  function cleanup() {
    cancelAnimationFrame(rafId);
    ac.abort();
    container.innerHTML = '';
    for (const [el, display] of originalDisplay) {
      (el as HTMLElement).style.display = display;
    }
  }
  document.addEventListener('astro:before-swap', cleanup, { signal, once: true });
}

setupBreakout404();
document.addEventListener('astro:after-swap', setupBreakout404);
