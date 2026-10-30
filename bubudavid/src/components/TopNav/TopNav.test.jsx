import { act, render, screen, within } from '@testing-library/react';
import { expect, test } from 'vitest';
import TopNav from './TopNav';
import Masthead from '../Masthead/Masthead';
import { intersect } from '../../test/browser';

test('the bar appears once the masthead scrolls away and marks the current section', () => {
  render(<><TopNav /><Masthead /><section id="work" /></>);
  const nav = screen.getByRole('navigation', { name: 'Sections' });
  expect(nav).not.toHaveClass('is-on');
  act(() => intersect(document.getElementById('top'), false));
  expect(nav).toHaveClass('is-on');
  act(() => intersect(document.getElementById('work'), true));
  expect(within(nav).getByRole('link', { name: 'Work' })).toHaveClass('is-here');
});
