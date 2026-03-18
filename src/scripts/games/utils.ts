/** Shared helpers for easter-egg minigames */

/** Read a CSS custom property from :root (respects current theme) */
export function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** Return theme-aware game colors */
export function themeColors() {
  return {
    accent: cssVar('--color-accent'),
    accentSecondary: cssVar('--color-accent-secondary'),
    highlight: cssVar('--color-highlight'),
    success: cssVar('--color-success'),
    text: cssVar('--color-text'),
    bg: cssVar('--color-bg'),
    surface: cssVar('--color-surface'),
    muted: cssVar('--color-text-muted'),
  };
}

/** Create a DPR-aware canvas and return it with its 2d context */
export function createCanvas(
  width: number,
  height: number,
  opts?: { pointerEvents?: boolean; zIndex?: number },
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const dpr = window.devicePixelRatio || 1;
  const canvas = document.createElement('canvas');
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  if (opts?.pointerEvents === false) canvas.style.pointerEvents = 'none';
  if (opts?.zIndex !== undefined) canvas.style.zIndex = String(opts.zIndex);
  const ctx = canvas.getContext('2d')!;
  ctx.scale(dpr, dpr);
  return { canvas, ctx };
}

/** Resize a canvas to fill the window (DPR-aware) */
export function resizeCanvasToWindow(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.scale(dpr, dpr);
}
