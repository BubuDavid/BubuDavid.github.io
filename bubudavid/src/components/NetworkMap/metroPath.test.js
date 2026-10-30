import { expect, test } from 'vitest';
import { metroPath } from './metroPath';

test('metroPath rounds each corner with a quadratic curve', () => {
  expect(metroPath([[0, 0], [100, 0], [100, 100]], 16)).toBe('M0 0 L84.0 0.0 Q100 0 100.0 16.0 L100 100');
  expect(metroPath([[0, 0], [50, 0]], 16)).toBe('M0 0 L50 0');
});
