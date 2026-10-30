import { render, screen, within } from '@testing-library/react';
import { expect, test } from 'vitest';
import AlsoIndex, { moreSystems } from './AlsoIndex';
import { ALSO } from '../../content/work';

test('three more systems, each with its lineage and result', () => {
  render(<AlsoIndex />);
  const rows = screen.getAllByRole('row').slice(1);
  expect(rows.map(r => r.id)).toEqual(['ruta', 'gemelos', 'mensajero']);
  const ruta = within(rows[0]);
  expect(ruta.getByRole('heading', { level: 3 })).toHaveTextContent('Ruta');
  expect(ruta.getByRole('link', { name: 'DCI · Hacedor de Horarios' })).toHaveAttribute('href', '#a-02');
  expect(ruta.getByRole('link', { name: 'RRT Bidirectional Dijkstra' })).toHaveAttribute('href', '#a-03');
  expect(ruta.getByText('18%')).toBeInTheDocument();
});

test('the caption counts the rows: in words up to nine, in digits after', () => {
  expect([1, 3, 9, 10, 12].map(moreSystems))
    .toEqual(['One more system', 'Three more systems', 'Nine more systems', '10 more systems', '12 more systems']);
  render(<AlsoIndex />);
  expect(screen.getByRole('table'))
    .toHaveAccessibleName(`${moreSystems(ALSO.length)}: name, summary, role, year and headline result`);
});
