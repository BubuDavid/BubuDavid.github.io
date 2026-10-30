import { Fragment } from 'react';
import { STATIONS, displayName, targetId } from '../../content/network';
import { ALSO, SECTION_COPY } from '../../content/work';
import LineBadge from '../shared/LineBadge';
import PartHead from '../shared/PartHead';
import './AlsoIndex.css';

const COLUMNS = [
  ['Nº', '5%'],
  ['Project', '39%'],
  ['Role', '16%'],
  ['Year', '8%'],
  ['Result', '32%'],
];

/* "Grew from A", "Grew from A and B": each name links to its entry in the archive. */
function GrewFrom({ grew }) {
  return (
    <p className="idx-grew">
      Grew from{' '}
      {grew.map(([labId], i) => (
        <Fragment key={labId}>
          {i > 0 && ' and '}
          <a className="ln" href={`#${targetId(labId)}`}>{displayName(labId)}</a>
        </Fragment>
      ))}
    </p>
  );
}

export default function AlsoIndex() {
  return (
    <section className="part wrap" id="also" aria-labelledby="also-h">
      <PartHead id="also-h" no="Part II" title="Also on the network" folio="pp. 30–33">
        {SECTION_COPY.also}
      </PartHead>

      <table className="idx" role="table">
        <caption className="sr-only">Three more systems: name, summary, role, year and headline result</caption>
        <thead role="rowgroup">
          <tr role="row">
            {COLUMNS.map(([title, width]) => (
              <th key={title} scope="col" role="columnheader" style={{ width }}>{title}</th>
            ))}
          </tr>
        </thead>
        <tbody role="rowgroup">
          {ALSO.map(({ id, no, big, what, more }) => {
            const s = STATIONS[id];
            return (
              <tr key={id} role="row" id={id}>
                <td role="cell" className="idx-n">{no}</td>
                <td role="cell" className="idx-p">
                  <h3 className="idx-name">
                    {s.name}
                    {s.lines.map(n => <LineBadge key={n} n={n} />)}
                  </h3>
                  <p className="idx-line">{`${s.tagline}.`}</p>
                  <GrewFrom grew={s.grew} />
                </td>
                <td role="cell" className="idx-role" data-label="Role">{s.role}</td>
                <td role="cell" className="idx-year" data-label="Year">{s.period}</td>
                <td role="cell" className="idx-res">
                  <span className="idx-big">{big}</span>
                  <span className="idx-what">{what}</span>
                  <span className="idx-more">{more}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
