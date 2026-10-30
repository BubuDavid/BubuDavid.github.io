import { render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import CaseStudy from './CaseStudy';
import RouteStrip from './RouteStrip';
import { figureFor } from '../figures';
import { CASES } from '../../content/work';

/* A test can take one case's figure away, as when David deletes a figure. */
const removed = vi.hoisted(() => ({ id: null }));
vi.mock('../figures', async (importOriginal) => {
  const real = await importOriginal();
  return { ...real, figureFor: id => (id === removed.id ? null : real.figureFor(id)) };
});

afterEach(() => {
  removed.id = null;
});

test('the route strip shows the line a case rode in on', () => {
  render(<RouteStrip caseId="lienzo" />);
  const stops = screen.getAllByRole('button');
  expect(stops.map(b => b.querySelector('.r-name').firstChild.textContent))
    .toEqual(['Spotify Analysis', 'Color Picker', 'Gemelos', 'Pulso', 'Lienzo']);
  expect(stops[4]).toHaveAttribute('aria-current', 'location');
  expect(stops[4]).toHaveTextContent('You are here');
  const items = screen.getAllByRole('listitem');
  expect(items[0]).toHaveClass('seg-lab');
  expect(items[1]).toHaveClass('seg-grad');
});

test('each stop on a route strip is named by the words it shows', () => {
  for (const { id } of CASES) {
    const { unmount } = render(<RouteStrip caseId={id} />);
    for (const stop of screen.getAllByRole('button')) {
      const shown = stop.querySelector('.r-name').firstChild.textContent;
      const here = stop.getAttribute('aria-current') === 'location';
      expect(stop).toHaveAccessibleName(`${shown}${here ? ', this case study' : ', go to it'}`);
    }
    unmount();
  }
});

test('the Pulso strip names the other lines that stop there', () => {
  render(<RouteStrip caseId="pulso" />);
  expect(screen.getByText('Correspondencia: Lines 2 and 4 also stop here (Data & insight, APIs & platforms).')).toBeInTheDocument();
});

test('a case study has its kicker, lineage, footnote and figure', () => {
  render(<CaseStudy id="glosa" />);
  expect(screen.getByRole('article', { name: 'Glosa' })).toHaveClass('case--wide');
  expect(screen.getByText('Core engineer · 2024 – now')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Bubufy' })).toHaveAttribute('href', '#a-08');
  expect(screen.getByText('Archive Nº 08, p. 41')).toBeInTheDocument();
  expect(screen.getByText('Stack: Python, FastAPI, SQLGlot, Typer, Next.js, Docker.')).toBeInTheDocument();
  expect(screen.getByText('Fig. 4')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: '↑ Back to the map' })).toHaveAttribute('href', '#map');
});

test('only the three case studies have figures', () => {
  expect(figureFor('pulso')).not.toBeNull();
  expect(figureFor('ruta')).toBeNull();
});

test('a case without a figure gives its big number the whole row', () => {
  const { unmount } = render(<CaseStudy id="lienzo" />);
  expect(document.querySelector('#lienzo .feature')).not.toHaveClass('feature--solo');
  unmount();
  removed.id = 'lienzo';
  render(<CaseStudy id="lienzo" />);
  expect(document.querySelector('#lienzo .fig')).toBeNull();
  expect(document.querySelector('#lienzo .feature')).toHaveClass('feature--solo');
});
