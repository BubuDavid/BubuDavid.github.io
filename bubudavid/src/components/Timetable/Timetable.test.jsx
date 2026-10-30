import { render, screen, within } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import Timetable from './Timetable';

test('the departures board lists every service with the time in Mexico City', () => {
  vi.useFakeTimers({ toFake: ['Date', 'setInterval', 'clearInterval'] });
  vi.setSystemTime(new Date('2026-10-29T18:05:00Z'));
  render(<Timetable />);
  const rows = within(screen.getByRole('table', { name: 'Experience timeline' })).getAllByRole('row').slice(1);
  expect(rows).toHaveLength(3);
  expect(within(rows[0]).getByText('En servicio')).toHaveClass('status', 'on');
  expect(within(rows[0]).getByText('Ceiba Data')).toBeInTheDocument();
  expect(screen.getByLabelText('Current time in Mexico City')).toHaveTextContent('12:05');
});
