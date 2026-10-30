import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StrictMode } from 'react';
import { expect, test, vi } from 'vitest';
import NetworkMap from './NetworkMap';
import { VORDER } from '../../content/map-layout';
import { intersect, lateFonts, resizeObserved, scrollIntoView, setMedia } from '../../test/browser';

const card = () => document.getElementById('map-card');

/* Holds back every animation frame, so a test hands the train the timestamps it wants. */
function frames() {
  const queue = [];
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => queue.push(callback));
  return ts => queue.shift()(ts);
}

test('on a phone the map is a list of stations, oldest first', () => {
  setMedia({ mobile: true });
  render(<NetworkMap />);
  expect(document.getElementById('hmap')).toBeNull();
  const list = screen.getByRole('list', { name: 'Stations, oldest first' });
  expect(within(list).getAllByRole('button').map(b => b.dataset.id)).toEqual(VORDER.filter(id => !id.startsWith('@')));
  expect(within(list).getByRole('button', { name: /^Pulso\./ })).toHaveTextContent('2024 – now · Correspondencia 1 · 2 · 4');
});

test('turning the phone hides an open tooltip and draws the vertical map', () => {
  render(<NetworkMap />);
  act(() => document.querySelector('#hmap .stn[data-id="ruta"]').focus());
  expect(screen.getByRole('tooltip')).toBeInTheDocument();
  act(() => setMedia({ mobile: true }));
  expect(screen.queryByRole('tooltip')).toBeNull();
  expect(screen.getByRole('list', { name: 'Stations, oldest first' })).toBeInTheDocument();
});

test('the vertical map is redrawn when the list changes size', () => {
  setMedia({ mobile: true });
  render(<NetworkMap />);
  const svg = document.getElementById('vsvg');
  const before = svg.getAttribute('viewBox');
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(40);
  act(() => resizeObserved(document.getElementById('vlist')));
  expect(svg.getAttribute('viewBox')).not.toBe(before);
});

test('the train runs only while the map is on screen', () => {
  const raf = vi.spyOn(window, 'requestAnimationFrame');
  render(<NetworkMap />);
  expect(raf).not.toHaveBeenCalled();
  act(() => intersect(document.getElementById('map-card'), true));
  expect(raf).toHaveBeenCalled();
});

test('with reduced motion the train never runs', () => {
  setMedia({ reducedMotion: true });
  const raf = vi.spyOn(window, 'requestAnimationFrame');
  render(<NetworkMap />);
  act(() => intersect(document.getElementById('map-card'), true));
  expect(raf).not.toHaveBeenCalled();
});

/* The tests below are beyond the brief's five: the overlay, the dim, the jump and the train's edges. */

test('the overlay is drawn from where the rows measure', () => {
  setMedia({ mobile: true });
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(60);
  vi.spyOn(HTMLElement.prototype, 'offsetTop', 'get').mockImplementation(function row() {
    const li = this.closest('li');
    return [...li.parentElement.children].indexOf(li) * 60;
  });
  render(<NetworkMap />);
  const svg = document.getElementById('vsvg');
  expect(svg).toHaveAttribute('viewBox', '0 0 92 60');
  // spotwipy is row 1 (centre 90), graduation row 9 (centre 570), pulso row 15 (centre 930)
  expect(document.querySelector('[data-train-path]')).toHaveAttribute('d', 'M16 90V930');
  const [thin, thick] = svg.querySelectorAll('g[data-lines="1"] > path');
  expect(thin).toHaveAttribute('d', 'M16 60V570');
  expect(thick).toHaveAttribute('d', 'M16 570V930');
  expect(document.querySelector('[data-train-stop] rect')).toHaveAttribute('y', '919');
});

test('a pinned line dims the stations off it, in the list and in the drawing', async () => {
  const user = userEvent.setup();
  setMedia({ mobile: true });
  render(<NetworkMap />);
  await user.click(screen.getByRole('button', { name: 'Line 2, Data & insight' }));
  const row = id => document.querySelector(`.vstn[data-id="${id}"]`);
  expect(row('spotwipy')).toHaveClass('is-dim');
  expect(row('lienzo')).not.toHaveClass('is-dim');
  expect(row('pulso')).not.toHaveClass('is-dim');
  expect(document.querySelector('#vsvg g[data-lines="1"]')).toHaveClass('is-dim');
  expect(document.querySelector('#vsvg g[data-lines="2"]')).not.toHaveClass('is-dim');
});

test('tapping a station in the list jumps to its write-up', async () => {
  const user = userEvent.setup();
  setMedia({ mobile: true });
  render(<><NetworkMap /><article id="glosa" className="case"><h3 className="case-title">Glosa</h3></article></>);
  await user.click(within(document.getElementById('vlist')).getByRole('button', { name: /^Glosa\./ }));
  expect(scrollIntoView.mock.contexts[0]).toBe(document.getElementById('glosa'));
  expect(document.activeElement).toHaveTextContent('Glosa');
});

test('on a phone the train rides the vertical map and reaches the interchange in 5.2 seconds', () => {
  setMedia({ mobile: true });
  const next = frames();
  render(<NetworkMap />);
  act(() => intersect(card(), true));
  const dot = document.querySelector('[data-train-dot]');
  const stop = document.querySelector('[data-train-stop]');
  expect(dot.closest('#vsvg')).not.toBeNull();
  next(0);
  expect(dot).toHaveAttribute('transform');
  expect(dot.style.opacity).toBe('1');
  next(5199);
  expect(stop).not.toHaveClass('arrive');
  next(5200);
  expect(stop).toHaveClass('arrive');
});

test('on a desktop the train takes 6.8 seconds', () => {
  const next = frames();
  render(<NetworkMap />);
  act(() => intersect(card(), true));
  const stop = document.querySelector('#hmap [data-train-stop]');
  next(0);
  next(5200);
  expect(stop).not.toHaveClass('arrive');
  next(6800);
  expect(stop).toHaveClass('arrive');
});

test('the train stops and disappears when the map scrolls out of view', () => {
  const next = frames();
  const cancel = vi.spyOn(window, 'cancelAnimationFrame');
  render(<NetworkMap />);
  act(() => intersect(card(), true));
  next(0);
  const dot = document.querySelector('[data-train-dot]');
  expect(dot.style.opacity).toBe('1');
  act(() => intersect(card(), false));
  expect(cancel).toHaveBeenCalled();
  expect(dot.style.opacity).toBe('0');
});

test('turning the phone while the train runs hands it to the new map, once', () => {
  const raf = vi.spyOn(window, 'requestAnimationFrame');
  render(<NetworkMap />);
  act(() => intersect(card(), true));
  expect(raf).toHaveBeenCalledTimes(1);
  setMedia({ mobile: true });
  expect(document.getElementById('hmap')).toBeNull();
  // the browser tells a new observer where the card stands; the old one must be gone
  act(() => intersect(card(), true));
  expect(raf).toHaveBeenCalledTimes(2);
  expect(document.querySelector('[data-train-dot]').closest('#vsvg')).not.toBeNull();
});

test('unmounting cancels the pending frame', () => {
  const raf = vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(7);
  const cancel = vi.spyOn(window, 'cancelAnimationFrame');
  const { unmount } = render(<NetworkMap />);
  act(() => intersect(card(), true));
  expect(raf).toHaveBeenCalled();
  unmount();
  expect(cancel).toHaveBeenCalledWith(7);
});

test('unmounting while the train waits at the interchange cancels its timers', () => {
  vi.useFakeTimers();
  const next = frames();
  const { unmount } = render(<NetworkMap />);
  act(() => intersect(card(), true));
  next(0);
  next(6800);
  expect(vi.getTimerCount()).toBe(1);
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});

test('under StrictMode the effects set up twice leave one train and one drawing', () => {
  setMedia({ mobile: true });
  const raf = vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(1);
  render(<StrictMode><NetworkMap /></StrictMode>);
  act(() => intersect(card(), true));
  expect(raf).toHaveBeenCalledTimes(1);
  expect(document.querySelectorAll('#vsvg [data-train-dot]')).toHaveLength(1);
});

test('the overlay is drawn again when the web fonts arrive', async () => {
  setMedia({ mobile: true });
  const fonts = lateFonts();
  try {
    render(<NetworkMap />);
    const svg = document.getElementById('vsvg');
    const before = svg.getAttribute('viewBox');
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(80);
    await act(async () => fonts.finish());
    expect(svg.getAttribute('viewBox')).not.toBe(before);
  } finally {
    fonts.restore();
  }
});

test('web fonts that arrive after the map is gone are not measured', async () => {
  setMedia({ mobile: true });
  const fonts = lateFonts();
  try {
    const { unmount } = render(<NetworkMap />);
    unmount();
    const height = vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(80);
    fonts.finish();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(height).not.toHaveBeenCalled();
  } finally {
    fonts.restore();
  }
});
