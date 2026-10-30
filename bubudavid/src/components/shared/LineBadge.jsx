export default function LineBadge({ n, small = false }) {
  return (
    <span
      className={small ? 'badge sm' : 'badge'}
      style={{ '--c': `var(--l${n})`, '--ci': `var(--l${n}-ink)` }}
      aria-hidden="true"
    >
      {n}
    </span>
  );
}
