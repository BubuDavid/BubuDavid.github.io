import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, test } from 'vitest';

// Not `new URL('../index.html', import.meta.url)`: under jsdom, Vite rewrites that literal into an http URL.
const fromHere = (path) => resolve(import.meta.dirname, path);
const html = readFileSync(fromHere('../index.html'), 'utf8');
const meta = (attr, key) => html.match(new RegExp(`<meta ${attr}="${key}" content="([^"]*)"`))?.[1];
const DESCRIPTION = 'David Pedroza Segoviano, software engineer in México. AI agents and data platforms, written up as case studies.';

test('index.html carries the page metadata', () => {
  expect(html).toContain('<html lang="en">');
  expect(html).toContain('<title>David Pedroza Segoviano · Bubu</title>');
  expect(meta('name', 'description')).toBe(DESCRIPTION);
  expect(meta('name', 'theme-color')).toBe('#F3EFE6');
  expect(meta('property', 'og:title')).toBe('David Pedroza Segoviano · Bubu');
  expect(meta('property', 'og:description')).toBe(DESCRIPTION);
  expect(meta('property', 'og:url')).toBe('https://bubudavid.github.io/');
  expect(meta('property', 'og:image')).toBe('https://bubudavid.github.io/assets/pp-640.jpg');
  expect(meta('name', 'twitter:card')).toBe('summary');
  expect(html).not.toContain('%PUBLIC_URL%');
});

test('the reduced photo and the favicon exist', () => {
  expect(existsSync(fromHere('../public/assets/pp-640.jpg'))).toBe(true);
  expect(existsSync(fromHere('../public/favicon.svg'))).toBe(true);
});
