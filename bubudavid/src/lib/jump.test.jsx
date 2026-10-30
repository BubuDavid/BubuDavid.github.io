import { fireEvent, render } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import { jumpTo, useInitialHash, useJumpLinks } from './jump';
import { scrollIntoView, setMedia } from '../test/browser';

const PAGE = `
  <article id="lienzo" class="case"><header class="case-head"><h3 class="case-title">Lienzo</h3></header></article>
  <ol class="toc"><li id="a-04"><a class="toc-line" href="https://example.com/"><span class="toc-title">Spotify Analysis</span></a></li></ol>
  <section id="experience"></section>
  <a href="#a-04">to spotify</a><a href="#experience">to experience</a>`;

function Links() { useJumpLinks(); return <div dangerouslySetInnerHTML={{ __html: PAGE }} />; }
function Hash() { useInitialHash(); return <div dangerouslySetInnerHTML={{ __html: PAGE }} />; }

afterEach(() => {
  history.replaceState(null, '', '/');
  document.body.innerHTML = '';
});

test('jumpTo scrolls to a case, flashes it and focuses its title', () => {
  document.body.innerHTML = PAGE;
  const el = document.getElementById('lienzo');
  expect(jumpTo('lienzo')).toBe(true);
  expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
  expect(scrollIntoView.mock.contexts[0]).toBe(el);
  expect(el).toHaveClass('is-flash');
  expect(document.activeElement).toBe(el.querySelector('.case-title'));
});

test('archive rows are centred, and reduced motion scrolls at once', () => {
  setMedia({ reducedMotion: true });
  document.body.innerHTML = PAGE;
  jumpTo('spotify');
  expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'center' });
  expect(document.activeElement).toHaveTextContent('Spotify Analysis');
});

test('the flash clears after 2.3 s and restarts on a second jump', () => {
  vi.useFakeTimers();
  document.body.innerHTML = PAGE;
  const el = document.getElementById('lienzo');
  jumpTo('lienzo');
  vi.advanceTimersByTime(2000);
  jumpTo('lienzo');
  vi.advanceTimersByTime(2000);
  expect(el).toHaveClass('is-flash');
  vi.advanceTimersByTime(400);
  expect(el).not.toHaveClass('is-flash');
});

test('jumpTo returns false when the station is not on the page', () => {
  expect(jumpTo('glosa')).toBe(false);
  expect(scrollIntoView).not.toHaveBeenCalled();
});

test('in-page links to a station become jumps', () => {
  render(<Links />);
  expect(fireEvent.click(document.querySelector('a[href="#a-04"]'))).toBe(false);
  expect(scrollIntoView.mock.contexts[0]).toBe(document.getElementById('a-04'));
});

test('links to plain sections keep the browser default', () => {
  render(<Links />);
  expect(fireEvent.click(document.querySelector('a[href="#experience"]'))).toBe(true);
  expect(scrollIntoView).not.toHaveBeenCalled();
});

test('a shared link to a station scrolls there on load', () => {
  history.replaceState(null, '', '/#lienzo');
  render(<Hash />);
  expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' });
  expect(scrollIntoView.mock.contexts[0]).toBe(document.getElementById('lienzo'));
});

test('a shared link to a plain section scrolls there on load', () => {
  history.replaceState(null, '', '/#experience');
  render(<Hash />);
  expect(scrollIntoView.mock.contexts[0]).toBe(document.getElementById('experience'));
});

test('a shared link named after an Object.prototype property is not a station', () => {
  history.replaceState(null, '', '/#constructor');
  expect(() => render(<Hash />)).not.toThrow();
  expect(scrollIntoView).not.toHaveBeenCalled();
});

test('an in-page link named after an Object.prototype property keeps the browser default', () => {
  render(<Links />);
  const link = document.body.appendChild(document.createElement('a'));
  link.setAttribute('href', '#constructor');
  const errors = []; // jsdom reports an exception in a listener as an error event on window
  const onError = (event) => { event.preventDefault(); errors.push(event.error); };
  window.addEventListener('error', onError);
  const notCancelled = fireEvent.click(link);
  window.removeEventListener('error', onError);
  expect(errors).toEqual([]);
  expect(notCancelled).toBe(true);
  expect(scrollIntoView).not.toHaveBeenCalled();
});
