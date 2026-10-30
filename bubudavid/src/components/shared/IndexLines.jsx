import { linesText } from '../../content/network';

export default function IndexLines({ lines }) {
  return (
    <span className="ix-lines" role="img" aria-label={linesText(lines)}>
      {lines.map(n => (
        <i key={n} style={{ '--c': `var(--l${n})`, '--ci': `var(--l${n}-ink)` }}>{n}</i>
      ))}
    </span>
  );
}
