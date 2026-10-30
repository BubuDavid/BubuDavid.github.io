import { useEffect, useState } from 'react';
import './TopNav.css';

const LINKS = [
  ['map', 'Map'],
  ['work', 'Work'],
  ['archive', 'Lab'],
  ['experience', 'Experience', 'opt'],
  ['contact', 'Contact'],
];

const hasObserver = () => 'IntersectionObserver' in window;

/* Fixed bar: it slides in once the masthead has gone, and marks the section crossing the middle of the screen. */
export default function TopNav() {
  const [on, setOn] = useState(() => !hasObserver()); // no observer, no way to know: always visible
  const [here, setHere] = useState('');

  useEffect(() => {
    if (!hasObserver()) return undefined;
    const masthead = document.getElementById('top');
    const mastObserver = new IntersectionObserver(
      ([entry]) => setOn(!entry.isIntersecting),
      { rootMargin: '-40px 0px 0px 0px' },
    );
    if (masthead) mastObserver.observe(masthead);

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setHere(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    LINKS.forEach(([id]) => {
      const section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });

    return () => {
      mastObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  return (
    <nav className={on ? 'topnav is-on' : 'topnav'} id="topnav" aria-label="Sections">
      <div className="wrap topnav-in">
        <a className="topnav-brand" href="#top">BUBU<span aria-hidden="true">🦕</span></a>
        <ul>
          {LINKS.map(([id, text, extra]) => (
            <li key={id} className={extra}>
              <a href={`#${id}`} className={here === id ? 'is-here' : undefined}>{text}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
