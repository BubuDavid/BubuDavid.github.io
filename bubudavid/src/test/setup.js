import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import {
  FakeIntersectionObserver,
  FakeResizeObserver,
  clearObservers,
  matchMedia,
  scrollIntoView,
  setMedia,
} from './browser';

window.matchMedia = matchMedia;
window.IntersectionObserver = FakeIntersectionObserver;
window.ResizeObserver = FakeResizeObserver;
Element.prototype.scrollIntoView = scrollIntoView;
SVGElement.prototype.getTotalLength = () => 100;
SVGElement.prototype.getPointAtLength = () => ({ x: 0, y: 0 });

const fonts = { load: () => Promise.resolve([]) };
fonts.ready = Promise.resolve(fonts);
Object.defineProperty(document, 'fonts', { configurable: true, value: fonts });

if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (callback) => setTimeout(() => callback(performance.now()), 16);
  window.cancelAnimationFrame = (id) => clearTimeout(id);
}

afterEach(() => {
  cleanup();
  setMedia({});
  vi.useRealTimers();
  vi.restoreAllMocks();
  clearObservers();
  scrollIntoView.mockClear();
});
