import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import CaseStudy from './CaseStudy';
import RouteStrip from './RouteStrip';
import { figureFor } from '../figures';

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
