import { linesText } from '../../content/network';
import { SKILLS } from '../../content/profile';
import { SECTION_COPY, TIMELINE } from '../../content/work';
import { useMexicoCityTime } from '../../lib/time';
import LineBadge from '../shared/LineBadge';
import PartHead from '../shared/PartHead';
import './Timetable.css';

function Status({ status }) {
  if (status === 'on') return <span className="status on">En servicio</span>;
  return <span className="status">Llegó · Arrived</span>;
}

export default function Timetable() {
  const { h, m } = useMexicoCityTime();
  return (
    <section className="part wrap" id="experience" aria-labelledby="exp-h">
      <PartHead id="exp-h" no="Part IV · Horarios" title="Experience" folio="pp. 42–43">
        {SECTION_COPY.experience}
      </PartHead>

      <div className="g12 tt-grid">
        <div className="board">
          <div className="board-head">
            <div className="board-title">Salidas <small>· Departures</small></div>
            <div className="board-clock" aria-label="Current time in Mexico City">
              <small>CDMX</small>{h}<span className="blink">:</span>{m}
            </div>
          </div>
          <table>
            <caption className="sr-only">Experience timeline</caption>
            <thead>
              <tr>
                <th scope="col">Línea</th>
                <th scope="col">Periodo</th>
                <th scope="col">Destino · Role</th>
                <th scope="col">Operador</th>
                <th scope="col">Estado</th>
              </tr>
            </thead>
            <tbody>
              {TIMELINE.map(({ lines, period, role, roleNote, desc, operator, status }) => (
                <tr key={`${period} ${role}`}>
                  <td className="c-lines">
                    <span className="t-lines" aria-label={linesText(lines)}>
                      {lines.map(n => <LineBadge key={n} n={n} />)}
                    </span>
                  </td>
                  <td className="c-period"><span className="t-period">{period}</span></td>
                  <td className="c-dest">
                    <span className="t-role">{role}{roleNote && <small>{roleNote}</small>}</span>
                    <span className="t-desc">{desc}</span>
                  </td>
                  <td className="c-op"><span className="t-op">{operator}</span></td>
                  <td className="c-status"><Status status={status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="back-tools">
          <h3 className="back-title">Toolkit</h3>
          <dl className="tools">
            {SKILLS.map(([label, items]) => (
              <div key={label}><dt className="label">{label}</dt><dd>{items}</dd></div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
