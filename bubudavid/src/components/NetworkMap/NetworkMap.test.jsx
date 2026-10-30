import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import NetworkMap from './NetworkMap';
import { resizeObserved, scrollIntoView } from '../../test/browser';

const station = id => document.querySelector(`#hmap .stn[data-id="${id}"]`);
const rect = (left, top, width, height) => ({ left, top, width, height, x: left, y: top, right: left + width, bottom: top + height });

test('draws all fourteen stations as buttons with spoken labels', () => {
  render(<NetworkMap />);
  expect(within(document.getElementById('hmap')).getAllByRole('button')).toHaveLength(14);
  expect(station('pulso')).toHaveAccessibleName('Pulso. Work station, Backend & AI lead, 2024 – now. Lines 1, 2 and 4. Jump to its write-up.');
});

test('a line chip pins that line and dims the stations off it', async () => {
  const user = userEvent.setup();
  render(<NetworkMap />);
  const chip = screen.getByRole('button', { name: 'Line 2, Data & insight' });
  await user.click(chip);
  expect(chip).toHaveAttribute('aria-pressed', 'true');
  expect(station('spotwipy')).toHaveClass('is-dim');
  expect(station('lienzo')).not.toHaveClass('is-dim');
  expect(station('pulso')).not.toHaveClass('is-dim');
  await user.click(chip);
  expect(chip).toHaveAttribute('aria-pressed', 'false');
  expect(station('spotwipy')).not.toHaveClass('is-dim');
});

test('Enter on a station jumps to its write-up and moves focus there', async () => {
  const user = userEvent.setup();
  render(<><NetworkMap /><article id="lienzo" className="case"><h3 className="case-title">Lienzo</h3></article></>);
  act(() => station('lienzo').focus());
  await user.keyboard('{Enter}');
  expect(scrollIntoView.mock.contexts[0]).toBe(document.getElementById('lienzo'));
  expect(document.activeElement).toHaveTextContent('Lienzo');
});

test('Space jumps too, and a station whose section is missing does nothing', async () => {
  const user = userEvent.setup();
  render(<><NetworkMap /><ol className="toc"><li id="a-08"><span className="toc-title">Bubufy</span></li></ol></>);
  act(() => station('bubufy').focus());
  await user.keyboard(' ');
  expect(scrollIntoView.mock.contexts[0]).toBe(document.getElementById('a-08'));
  await user.click(station('glosa'));
  expect(scrollIntoView).toHaveBeenCalledTimes(1);
});

test('focusing a station shows its tooltip and leaving hides it', () => {
  render(<NetworkMap />);
  act(() => station('glosa').focus());
  const tip = screen.getByRole('tooltip');
  expect(tip).toHaveTextContent('Glosa');
  expect(tip).toHaveTextContent('A semantic layer, as code');
  expect(tip).toHaveTextContent('Work · 2024 – now · see the write-up');
  act(() => station('glosa').blur());
  expect(screen.queryByRole('tooltip')).toBeNull();
});

test('hovering a line chip highlights that line until the pointer leaves, and a pinned line stays after', async () => {
  const user = userEvent.setup();
  render(<NetworkMap />);
  const chip = screen.getByRole('button', { name: 'Line 3, Optimization' });
  await user.hover(chip);
  expect(station('ruta')).not.toHaveClass('is-dim');
  expect(station('pulso')).toHaveClass('is-dim');
  await user.unhover(chip);
  expect(station('pulso')).not.toHaveClass('is-dim');
  await user.click(screen.getByRole('button', { name: 'Line 1, Bots & messaging' }));
  await user.hover(chip);
  expect(station('pulso')).toHaveClass('is-dim');
  expect(station('ruta')).not.toHaveClass('is-dim');
  await user.unhover(chip);
  expect(station('pulso')).not.toHaveClass('is-dim');
  expect(station('ruta')).toHaveClass('is-dim');
});

test('hovering a station shows its tooltip, and scrolling the map hides it', async () => {
  const user = userEvent.setup();
  render(<NetworkMap />);
  await user.hover(station('socorro'));
  expect(screen.getByRole('tooltip')).toHaveTextContent('Lab · student project · see the archive');
  await user.unhover(station('socorro'));
  expect(screen.queryByRole('tooltip')).toBeNull();
  await user.hover(station('socorro'));
  fireEvent.scroll(document.getElementById('map-scroll'));
  expect(screen.queryByRole('tooltip')).toBeNull();
});

test('a tooltip opened by focus stays when the map scrolls, and follows its station', () => {
  render(<NetworkMap />);
  vi.spyOn(document.getElementById('map-card'), 'getBoundingClientRect').mockReturnValue(rect(0, 0, 1000, 700));
  const at = vi.spyOn(station('lienzo'), 'getBoundingClientRect').mockReturnValue(rect(700, 300, 40, 40));
  act(() => station('lienzo').focus()); // at 761 to ~950 px, focus itself scrolls the map to the station
  expect(screen.getByRole('tooltip').style.transform).toBe('translate(720px, 290px)');
  at.mockReturnValue(rect(300, 300, 40, 40));
  fireEvent.scroll(document.getElementById('map-scroll'));
  expect(screen.getByRole('tooltip')).toHaveTextContent('Lienzo');
  expect(screen.getByRole('tooltip').style.transform).toBe('translate(320px, 290px)');
});

test('the sideways-scroll hint shows only while the map is wider than its frame', () => {
  render(<NetworkMap />);
  const scroll = document.getElementById('map-scroll');
  const card = document.getElementById('map-card');
  const size = (scrollWidth, clientWidth) => Object.defineProperties(scroll, {
    scrollWidth: { configurable: true, value: scrollWidth },
    clientWidth: { configurable: true, value: clientWidth },
  });
  size(1060, 800);
  resizeObserved(scroll);
  expect(card).toHaveClass('is-overflowing');
  size(1060, 1059);
  resizeObserved(scroll);
  expect(card).not.toHaveClass('is-overflowing');
});

test('the HOY label is in the darker Line 1 pink made for small text', () => {
  render(<NetworkMap />);
  const hoy = [...document.querySelectorAll('#hmap text')].find(text => text.textContent === 'HOY');
  expect(hoy.style.fill).toBe('var(--l1-text)');
});

test('marks where the train runs: its path, its dot and the interchange it stops at', () => {
  render(<NetworkMap />);
  expect(document.querySelector('#hmap [data-train-path]')).toHaveAttribute('d');
  expect(document.querySelector('#hmap [data-train-dot]')).toBeInTheDocument();
  expect(document.querySelector('#hmap [data-train-stop]')).toBe(station('pulso'));
});
