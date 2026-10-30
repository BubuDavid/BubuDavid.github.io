import { expect, test } from 'vitest';
import { mexicoCityTime } from './time';

test('formats the time in Mexico City, which has no daylight saving', () => {
  expect(mexicoCityTime(new Date('2026-10-29T18:05:00Z'))).toEqual({ h: '12', m: '05' });
  expect(mexicoCityTime(new Date('2026-07-01T00:30:00Z'))).toEqual({ h: '18', m: '30' });
  expect(mexicoCityTime(new Date('2026-10-29T06:00:00Z'))).toEqual({ h: '00', m: '00' });
});
