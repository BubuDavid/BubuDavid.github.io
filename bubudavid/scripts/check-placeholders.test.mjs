import { expect, test } from 'vitest';
import { findPlaceholders } from './check-placeholders.mjs';

test('finds the RELLENO and REVISAR markers', () => {
  expect(findPlaceholders([
    { path: 'src/content/work.js', text: '// RELLENO: everything here is invented\nexport const A = 1;\n' },
    { path: 'src/content/profile.js', text: '// REVISAR: draft copy\n' },
    { path: 'src/content/lab.js', text: "export const note = 'RELLENO';\n" },
  ])).toEqual([
    { path: 'src/content/work.js', marker: 'RELLENO' },
    { path: 'src/content/profile.js', marker: 'REVISAR' },
  ]);
});

test('clean files pass', () => {
  expect(findPlaceholders([{ path: 'a.js', text: 'export {};\n' }])).toEqual([]);
});
