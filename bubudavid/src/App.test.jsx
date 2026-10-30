import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';
import App from './App';
import { scrollIntoView } from './test/browser';

test('the page has every section, in order', () => {
  render(<App />);
  const ids = [...document.querySelectorAll('#top, main > section, main > section > article, #colophon')].map(el => el.id);
  expect(ids).toEqual(['top', 'cover', 'map', 'work', 'pulso', 'lienzo', 'glosa', 'also', 'archive', 'experience', 'contact', 'colophon']);
});

test('a station on the map takes you to its section', async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(document.querySelector('#hmap .stn[data-id="glosa"]'));
  expect(scrollIntoView.mock.contexts.at(-1)).toBe(document.getElementById('glosa'));
  expect(document.activeElement).toHaveTextContent('Glosa');
});

test('a "grew from" link takes you to the archive row', async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(within(document.getElementById('lienzo')).getByRole('link', { name: 'Spotify Analysis' }));
  expect(scrollIntoView.mock.contexts.at(-1)).toBe(document.getElementById('a-04'));
});

test('the footer keeps the old line and the contact section links the email', () => {
  render(<App />);
  expect(screen.getByText('Made with 💖 in 🇲🇽🌮')).toBeInTheDocument();
  expect(within(document.getElementById('contact')).getAllByRole('link', { name: /hola@bubudavid\.me/ })[0])
    .toHaveAttribute('href', 'mailto:hola@bubudavid.me');
});
