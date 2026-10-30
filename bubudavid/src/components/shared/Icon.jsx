// The four strokes of the prototype's <symbol> sprite, inlined so each icon is self-contained.
const ICONS = {
  ne: {
    viewBox: '0 0 12 12',
    paths: <path d="M3 9 9 3M4 3h5v5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square" />,
  },
  gh: {
    viewBox: '0 0 16 16',
    paths: (
      <path
        fill="currentColor"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
      />
    ),
  },
  in: {
    viewBox: '0 0 16 16',
    paths: (
      <>
        <rect x=".75" y=".75" width="14.5" height="14.5" rx="2" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <path
          fill="currentColor"
          d="M4 6.5h1.8V12H4zM4.9 3.6a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM7.1 6.5h1.7v.8c.3-.5.9-.95 1.85-.95 1.6 0 2.15 1 2.15 2.5V12H11V9.2c0-.7-.1-1.4-.95-1.4-.85 0-1.15.6-1.15 1.4V12H7.1z"
        />
      </>
    ),
  },
  mail: {
    viewBox: '0 0 16 16',
    paths: (
      <path
        d="M1.5 3.5h13v9h-13zM1.75 3.75 8 9l6.25-5.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    ),
  },
};

export default function Icon({ name }) {
  const { viewBox, paths } = ICONS[name];
  return (
    <svg className="ico" viewBox={viewBox} aria-hidden="true" focusable="false">
      {paths}
    </svg>
  );
}
