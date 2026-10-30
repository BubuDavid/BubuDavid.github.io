import { useCallback, useSyncExternalStore } from 'react';

export const MOBILE_QUERY = '(max-width: 760px)';
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export function useMediaQuery(query) {
  const subscribe = useCallback((onChange) => {
    const list = window.matchMedia(query);
    list.addEventListener('change', onChange);
    return () => list.removeEventListener('change', onChange);
  }, [query]);
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches);
}

export const useIsMobile = () => useMediaQuery(MOBILE_QUERY);

export const usePrefersReducedMotion = () => useMediaQuery(REDUCED_MOTION_QUERY);

/* A one-off read for code outside React: event handlers and timers. */
export function prefersReducedMotion() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}
