import { render, screen, within } from '@testing-library/react';
import { expect, test } from 'vitest';
import Archive, { ArchiveItem } from './Archive';
import { LAB } from '../../content/lab';

test('the archive groups the eight lab projects by line', () => {
  render(<Archive />);
  const headings = screen.getAllByRole('heading', { level: 3 });
  expect(headings).toHaveLength(4);
  expect(headings[1]).toHaveTextContent('Línea 2 · Data & insight→ Gemelos · Lienzo');
  expect(document.querySelectorAll('.toc > li')).toHaveLength(8);
  expect(screen.getAllByText('Demo offline')).toHaveLength(3);
  expect(screen.getByRole('link', { name: /^Spotwipy/ })).toHaveAttribute('href', 'https://github.com/BubuDavid/SpoTwipy');
  expect(within(document.getElementById('a-02')).getByRole('link', { name: 'Grew into Ruta' })).toHaveAttribute('href', '#ruta');
  expect(within(document.getElementById('a-07')).queryByText(/Grew into/)).toBeNull();
});

test('an item with a demo and its code links to both', () => {
  const item = { ...LAB.find(p => p.id === 'resume'), source: 'https://github.com/BubuDavid/Resume' };
  render(<ol className="toc"><ArchiveItem item={item} /></ol>);
  expect(screen.getByRole('link', { name: /^Resume/ })).toHaveAttribute('href', 'https://bubudavid.github.io/Resume/');
  expect(screen.getByRole('link', { name: /^Code/ })).toHaveAttribute('href', 'https://github.com/BubuDavid/Resume');
  expect(screen.getByText('bubudavid.github.io/Resume')).toBeInTheDocument();
});
