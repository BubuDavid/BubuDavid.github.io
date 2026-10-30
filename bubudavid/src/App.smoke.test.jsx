// Draws the whole page from whatever is in src/content/. Like content/map.test.js it names no project, so
// it holds for real content too. `npm run predeploy` runs both before it builds.
import { render } from '@testing-library/react';
import { expect, test } from 'vitest';
import App from './App';
import { STATIONS, targetId } from './content/network';

test('the page renders, with every station on the map and its section on the page', () => {
  expect(() => render(<App />)).not.toThrow();
  for (const id of Object.keys(STATIONS)) {
    expect(document.querySelector(`#hmap .stn[data-id="${id}"]`), `"${id}" is not on the map`).not.toBeNull();
    expect(document.getElementById(targetId(id)), `"${id}" has no section with id "${targetId(id)}"`).not.toBeNull();
  }
});
