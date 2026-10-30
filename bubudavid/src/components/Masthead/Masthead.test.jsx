import { render, screen, within } from '@testing-library/react';
import { expect, test } from 'vitest';
import Masthead from './Masthead';

test('the masthead names the person and indexes the issue', () => {
  render(<Masthead />);
  expect(screen.getByRole('heading', { level: 1, name: 'Bubu, the portfolio of David Pedroza Segoviano' })).toBeInTheDocument();
  const links = within(screen.getByRole('navigation', { name: 'In this issue' })).getAllByRole('link');
  expect(links.map(a => a.getAttribute('href'))).toEqual(
    ['#cover', '#map', '#pulso', '#lienzo', '#glosa', '#also', '#archive', '#experience', '#contact']);
  expect(within(links[2]).getByRole('img', { name: 'Lines 1, 2 and 4' })).toBeInTheDocument();
});
