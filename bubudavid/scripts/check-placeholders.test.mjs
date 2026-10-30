import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
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

test('a run through a symlink checks the same files as a direct run', () => {
  const script = path.resolve(import.meta.dirname, 'check-placeholders.mjs');
  const dir = mkdtempSync(path.join(tmpdir(), 'guard-'));
  try {
    const link = path.join(dir, 'guard.mjs');
    symlinkSync(script, link);
    const run = file => spawnSync(process.execPath, [file], { encoding: 'utf8' });
    const direct = run(script);
    const linked = run(link);
    expect([linked.status, linked.stdout]).toEqual([direct.status, direct.stdout]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
