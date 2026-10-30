import { HEADLINE, ISSUE, NAME } from '../../content/profile';
import { CASES } from '../../content/work';
import { STATIONS, displayName } from '../../content/network';
import IndexLines from '../shared/IndexLines';
import Nameplate from './Nameplate';
import './Masthead.css';

const pg = page => String(page).padStart(2, '0');

// The issue's table of contents: fixed pages around the three case studies, which come from CASES.
const INDEX = [
  { href: '#cover', page: '02', text: 'Cover story' },
  { href: '#map', page: '04', text: 'The network map' },
  ...CASES.map(({ id, page }) => ({ href: `#${id}`, page: pg(page), text: displayName(id), lines: STATIONS[id].lines })),
  { href: '#also', page: '30', text: 'Also on the network' },
  { href: '#archive', page: '34', text: 'Lab archive · 2019–2022' },
  { href: '#experience', page: '42', text: 'Experience' },
  { href: '#contact', page: '44', text: 'Next stop' },
];

export default function Masthead() {
  return (
    <header className="mast wrap" id="top">
      <div className="mast-strip">
        <span className="label">{NAME}</span>
        <span className="label mast-mid">{HEADLINE}</span>
        <span className="label">Est. {ISSUE.est}</span>
      </div>

      <div className="mast-main">
        <h1 className="nameplate">
          <span className="sr-only">{`Bubu, the portfolio of ${NAME}`}</span>
          <Nameplate />
        </h1>

        <div className="mast-meta">
          <p className="issue">
            <span className="issue-no">Issue Nº {ISSUE.no}</span>
            <span className="label">{ISSUE.season} · {ISSUE.place}</span>
          </p>
          <nav className="mast-index" aria-label="In this issue">
            <p className="label">In this issue</p>
            <ol>
              {INDEX.map(({ href, page, text, lines }) => (
                <li key={href}>
                  <a href={href}>
                    <span className="pg">{page}</span>
                    {text}
                    {lines && <IndexLines lines={lines} />}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
      <span className="stripes" aria-hidden="true" />
    </header>
  );
}
