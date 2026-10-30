// Doubles for the browser APIs jsdom lacks, and the controls tests use to drive them.
// Tests import `setMedia`, `intersect`, `resizeObserved`, `scrollIntoView` and `lateFonts`.
// setup.js installs the rest (`matchMedia`, the two observer classes) and clears the registries.
import { act } from '@testing-library/react';
import { vi } from 'vitest';

const media = { mobile: false, reducedMotion: false };
const mediaLists = new Set(); // only the lists that have a listener
const intersectionObservers = new Set();
const resizeObservers = new Set();

function matchesFor(query, { mobile, reducedMotion }) {
  const q = query.replace(/\s+/g, '');
  if (q.includes('max-width:760px')) return mobile;
  if (q.includes('prefers-reduced-motion')) return reducedMotion;
  return false;
}

function listenerFn(listener) {
  return typeof listener === 'function' ? listener : (event) => listener.handleEvent(event);
}

export function matchMedia(query) {
  const listeners = new Map(); // listener -> callable, so removal works with objects too
  const list = {
    media: query,
    onchange: null,
    get matches() {
      return matchesFor(query, media);
    },
    addEventListener(type, listener) {
      if (type !== 'change' || !listener) return;
      listeners.set(listener, listenerFn(listener));
      mediaLists.add(list);
    },
    removeEventListener(type, listener) {
      if (type !== 'change') return;
      listeners.delete(listener);
      if (!listeners.size) mediaLists.delete(list);
    },
    addListener(listener) {
      list.addEventListener('change', listener);
    },
    removeListener(listener) {
      list.removeEventListener('change', listener);
    },
    dispatchEvent(event) {
      list.onchange?.(event);
      [...listeners.values()].forEach((call) => call(event));
      return true;
    },
  };
  return list;
}

export class FakeIntersectionObserver {
  constructor(callback, options = {}) {
    this.callback = callback;
    this.root = options.root ?? null;
    this.rootMargin = options.rootMargin ?? '0px';
    this.thresholds = [].concat(options.threshold ?? 0);
    this.targets = new Set();
    intersectionObservers.add(this);
  }
  observe(target) {
    this.targets.add(target);
  }
  unobserve(target) {
    this.targets.delete(target);
  }
  disconnect() {
    this.targets.clear();
  }
  takeRecords() {
    return [];
  }
}

export class FakeResizeObserver {
  constructor(callback) {
    this.callback = callback;
    this.targets = new Set();
    resizeObservers.add(this);
  }
  observe(target) {
    this.targets.add(target);
  }
  unobserve(target) {
    this.targets.delete(target);
  }
  disconnect() {
    this.targets.clear();
  }
}

export function clearObservers() {
  intersectionObservers.clear();
  resizeObservers.clear();
}

export const scrollIntoView = vi.fn();

export function setMedia({ mobile = false, reducedMotion = false } = {}) {
  const before = { ...media };
  Object.assign(media, { mobile, reducedMotion });
  const changed = [...mediaLists].filter(
    (list) => matchesFor(list.media, before) !== matchesFor(list.media, media),
  );
  if (!changed.length) return;
  act(() => {
    changed.forEach((list) => {
      const event = Object.assign(new Event('change'), { matches: list.matches, media: list.media });
      list.dispatchEvent(event);
    });
  });
}

export function intersect(target, isIntersecting) {
  const entry = { target, isIntersecting, intersectionRatio: isIntersecting ? 1 : 0 };
  act(() => {
    [...intersectionObservers]
      .filter((observer) => observer.targets.has(target))
      .forEach((observer) => observer.callback([entry], observer));
  });
}

export function resizeObserved(target) {
  const entry = { target, contentRect: target.getBoundingClientRect() };
  act(() => {
    [...resizeObservers]
      .filter((observer) => observer.targets.has(target))
      .forEach((observer) => observer.callback([entry], observer));
  });
}

/* Swaps document.fonts.ready for a promise the test settles; `restore` puts the setup's back. */
export function lateFonts() {
  const original = document.fonts.ready;
  let finish;
  document.fonts.ready = new Promise((resolve) => { finish = () => resolve(document.fonts); });
  return { finish: () => finish(), restore: () => { document.fonts.ready = original; } };
}
