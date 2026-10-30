import { LAB } from '../../content/lab';
import { LINES, LINE_IDS } from '../../content/lines';
import { STATIONS, archiveLine, displayName, grewInto, targetId } from '../../content/network';
import ExternalLink from '../shared/ExternalLink';
import Icon from '../shared/Icon';
import LineBadge from '../shared/LineBadge';
import PartHead from '../shared/PartHead';
import { PictogramIcon } from '../shared/Pictogram';
import './Archive.css';

const DEK = 'Student and side projects, grouped by the line each one started. Three demos lived on Glitch, which no longer hosts apps, so they link to their code.';

/* The archive's first page is 34; its entries run in order from Nº 01. */
const archivePage = no => 33 + Number(no);

/* Where a project's main link goes (its demo, or its code when the demo is gone) and how that address reads. */
function labLink({ demo, source }) {
  const href = demo ?? source;
  return { href, host: href.replace(/^https?:\/\//, '').replace(/\/$/, '') };
}

export function ArchiveItem({ item }) {
  const { href, host } = labLink(item);
  return (
    <li id={`a-${item.no}`}>
      <span className="toc-n toc-ico" aria-hidden="true"><PictogramIcon id={item.id} /></span>
      <div>
        <ExternalLink className="toc-line" href={href}>
          <span className="toc-title">{item.name}</span>
          <span className="toc-dots" aria-hidden="true" />
          <span className="toc-pg" aria-hidden="true">{archivePage(item.no)}<Icon name="ne" /></span>
        </ExternalLink>
        <p className="toc-desc">{item.desc}</p>
        <p className="toc-meta">
          <span>{item.tags.join(' · ')}</span>
          <span className="toc-host">{host}</span>
          {item.demoOffline && <span className="toc-off">Demo offline</span>}
          {item.demo && item.source && <ExternalLink className="ln" href={item.source}>Code</ExternalLink>}
          {grewInto(item.id).map(id => (
            <a key={id} className="toc-into" href={`#${targetId(id)}`}>{`Grew into ${displayName(id)}`}</a>
          ))}
        </p>
      </div>
    </li>
  );
}

function LineSection({ n }) {
  const { lab, into } = archiveLine(n);
  return (
    <section className="toc-sec" style={{ '--c': `var(--l${n})` }} aria-labelledby={`tl-${n}`}>
      <h3 className="toc-sec-h" id={`tl-${n}`}>
        <LineBadge n={n} small />
        {`Línea ${n} · ${LINES[n].name}`}
        {into.length > 0 && <small>{`→ ${into.map(displayName).join(' · ')}`}</small>}
      </h3>
      <ol className="toc">
        {lab.map(id => <ArchiveItem key={id} item={LAB.find(p => p.id === id)} />)}
      </ol>
    </section>
  );
}

export default function Archive() {
  return (
    <section className="part wrap" id="archive" aria-labelledby="archive-h">
      <PartHead id="archive-h" no="Part III" title="Archive · 2019–2022" folio="pp. 34–41">
        {DEK}
      </PartHead>
      <div className="toc-lines">
        {LINE_IDS.map(n => <LineSection key={n} n={n} />)}
      </div>
    </section>
  );
}
