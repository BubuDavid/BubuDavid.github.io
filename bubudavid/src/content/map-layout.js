// Hand-drawn coordinates for the network map. content.test.js fails if a station,
// a line or a vertical-map entry is missing here.

export const VIEW = { w: 1280, h: 680 };
export const GRAD_X = 600;
export const yearX = year => 70 + (year - 2019) * 150;

/* Horizontal map: where each line runs (corners are rounded by metroPath). */
export const HPATHS = {
  1: [[82, 190], [570, 190], [620, 240], [890, 240], [950, 300], [980, 300]],
  2: [[192, 350], [1160, 350]],
  3: [[252, 610], [575, 610], [625, 560], [760, 560]],
  4: [[122, 470], [880, 470], [950, 400], [980, 400]],
};

/* Every station except the interchange. lp: label above or below the dot. */
export const HPOS = {
  spotwipy: { x: 120, y: 190, lp: 'above' },
  socorro: { x: 450, y: 190, lp: 'above' },
  mensajero: { x: 820, y: 240, lp: 'above' },
  spotify: { x: 230, y: 350, lp: 'above' },
  color: { x: 420, y: 350, lp: 'above' },
  gemelos: { x: 770, y: 350, lp: 'above' },
  lienzo: { x: 1110, y: 350, lp: 'above' },
  bubufy: { x: 160, y: 470, lp: 'below' },
  resume: { x: 450, y: 470, lp: 'below' },
  glosa: { x: 820, y: 470, lp: 'below' },
  rrt: { x: 290, y: 610, lp: 'above' },
  dci: { x: 480, y: 610, lp: 'below', align: 'end' },
  ruta: { x: 720, y: 560, lp: 'below' },
};

/* The interchange, where lines 1, 2 and 4 meet. Every measure is in map units. */
export const XFER = {
  id: 'pulso',
  hit: 'M950 272H1010V426H1176V514H950Z',
  ring: { x: 955, y: 277, width: 50, height: 146, rx: 25 },
  pill: { x: 962, y: 284, width: 36, height: 132, rx: 18 },
  tile: { x: 958, y: 434, size: 44 },
  name: { x: 1012, y: 458 },
  meta: { x: 1013, y: 476 },
  badges: { cy: 495, r: 10, textY: 500.5, fontSize: 13, cx: { 1: 1022, 2: 1045, 4: 1068 } },
  period: { x: 1092, y: 499 },
};

/* Line badges at the ends of the lines: the start of each path, plus the two that end elsewhere. */
export const TERMINI = [
  ...Object.entries(HPATHS).map(([line, [[x, y]]]) => [Number(line), x, y]),
  [2, 1160, 350],
  [3, 760, 560],
];

/* The train that runs on load. */
export const TRAIN = { line: 1, from: 'spotwipy', to: 'pulso' };

/* Vertical map (phones): top to bottom, with the three markers, and the x of each line's column. */
export const VORDER = ['@lab', 'spotwipy', 'bubufy', 'spotify', 'rrt', 'color', 'dci', 'resume', 'socorro', '@grad', '@work', 'ruta', 'glosa', 'gemelos', 'mensajero', 'pulso', 'lienzo'];
export const VX = { 1: 16, 2: 36, 4: 56, 3: 76 };

export const COLORS = {
  card: '#FFFDF8',
  ink: '#17160F',
  labStroke: '#4A463C',
  labGlyph: '#3D3A32',
  zone: '#EFE9DC',
  dots: '#D6CDB9',
  axis: '#CBC2AF',
  tick: '#9C9584',
  leader: '#C9C0AD',
};
