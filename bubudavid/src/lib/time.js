import { useEffect, useState } from 'react';

const TICK_MS = 15000;

const clock = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  timeZone: 'America/Mexico_City',
});

/* Mexico City has no daylight saving, so this is UTC-6 all year. */
export function mexicoCityTime(date) {
  const parts = clock.formatToParts(date);
  const part = (type) => parts.find((p) => p.type === type).value;
  return { h: part('hour'), m: part('minute') };
}

export function useMexicoCityTime() {
  const [time, setTime] = useState(() => mexicoCityTime(new Date()));
  useEffect(() => {
    const id = setInterval(() => {
      const next = mexicoCityTime(new Date());
      // Keep the same object while the minute has not changed, so a tick re-renders nothing.
      setTime((prev) => (prev.h === next.h && prev.m === next.m ? prev : next));
    }, TICK_MS);
    return () => clearInterval(id);
  }, []);
  return time;
}
