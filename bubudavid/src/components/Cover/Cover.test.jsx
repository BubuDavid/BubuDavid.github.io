import { render, screen, within } from '@testing-library/react';
import { expect, test } from 'vitest';
import Cover from './Cover';
import { NOW } from '../../content/work';

test('the cover states the pitch, the current job and four numbers', () => {
  render(<Cover />);
  expect(screen.getByRole('heading', { level: 2, name: /^I build the layer between a company's data and the people who act on.it\.$/ })).toBeInTheDocument();
  expect(screen.getByText(NOW)).toBeInTheDocument();
  const numbers = within(screen.getByRole('complementary', { name: 'By the numbers' }));
  expect(numbers.getAllByRole('definition').map(dd => dd.textContent)).toEqual(['4+', '6', '1,400', '3']);
  expect(screen.getByRole('img', { name: /^David Pedroza Segoviano/ })).toHaveAttribute('srcset', '/assets/pp-640.jpg 640w, /assets/pp.jpg 960w');
});
