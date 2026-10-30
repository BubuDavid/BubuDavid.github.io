// RELLENO: todo lo de este archivo es inventado. Reemplázalo y borra esta línea antes de publicar.
export const COMPANY = 'Ceiba Data';
export const EMAIL = 'hola@bubudavid.me';
export const NOW = `AI Engineer at ${COMPANY}, since 2023`;

export const STATS = [
  { value: '4+', label: 'years shipping software' },
  { value: '6', label: 'production systems' },
  { value: '1,400', label: 'weekly users on tools I built' },
  { value: '3', label: 'SQL engines supported', note: 'Postgres, Snowflake, Microsoft Fabric' },
];

// Which line each lab project started on.
export const LAB_LINES = {
  spotwipy: 1,
  socorro: 1,
  spotify: 2,
  color: 2,
  rrt: 3,
  dci: 3,
  bubufy: 4,
  resume: 4,
};

// The stops of each line, in the order the map draws them.
export const ROUTES = {
  1: ['spotwipy', 'socorro', 'mensajero', 'pulso'],
  2: ['spotify', 'color', 'gemelos', 'pulso', 'lienzo'],
  3: ['rrt', 'dci', 'ruta'],
  4: ['bubufy', 'resume', 'glosa', 'pulso'],
};

export const WORK = [
  {
    id: 'pulso',
    name: 'Pulso',
    icon: 'pulse',
    lines: [1, 2, 4],
    tagline: 'A KPI copilot that lives in Microsoft Teams',
    role: 'Backend & AI lead',
    period: '2024 – now',
    stack: ['Python', 'FastAPI', 'LangGraph', 'Azure OpenAI', 'Teams SDK', 'PostgreSQL', 'Next.js'],
    grew: [['socorro', 'A WhatsApp bot that guided families through missing-person reports']],
  },
  {
    id: 'lienzo',
    name: 'Lienzo',
    icon: 'canvas',
    lines: [2],
    tagline: 'Dashboards that design themselves from one question',
    role: 'Creator',
    period: '2025',
    stack: ['Claude', 'LangChain', 'Cube', 'Next.js', 'Recharts', 'LangSmith'],
    grew: [['spotify', 'Personal insights from your top 50 songs']],
  },
  {
    id: 'glosa',
    name: 'Glosa',
    icon: 'layers',
    lines: [4],
    tagline: 'A semantic layer, as code',
    role: 'Core engineer',
    period: '2024 – now',
    stack: ['Python', 'FastAPI', 'SQLGlot', 'Typer', 'Next.js', 'Docker'],
    grew: [['bubufy', "A small Python library over Spotify's API, my first API designed for other people"]],
  },
  {
    id: 'ruta',
    name: 'Ruta',
    icon: 'route',
    lines: [3],
    tagline: 'Route and shift planner for field promoters',
    role: 'Full-stack developer',
    period: '2023',
    stack: ['Python', 'OR-Tools', 'FastAPI', 'React', 'PostGIS'],
    grew: [
      ['dci', 'Every schedule combination for your subjects'],
      ['rrt', 'Path planning'],
    ],
  },
  {
    id: 'gemelos',
    name: 'Gemelos',
    icon: 'twins',
    lines: [2],
    tagline: 'Find the offices that look like yours',
    role: 'Data scientist',
    period: '2024',
    stack: ['pandas', 'scikit-learn', 'DuckDB', 'FastAPI'],
    grew: [['color', 'k-means palette extraction from any image']],
  },
  {
    id: 'mensajero',
    name: 'Mensajero',
    icon: 'plane',
    lines: [1],
    tagline: 'Proactive messaging that never double-sends',
    role: 'Backend engineer',
    period: '2024',
    stack: ['Python', 'Redis', 'Azure Service Bus', 'Bot Framework'],
    grew: [['spotwipy', 'A bot that tweeted 5 random songs']],
  },
];

// The three written-up case studies. `approach` has no footnote call: the stack comes from WORK.
export const CASES = [
  {
    id: 'pulso',
    no: '01',
    page: 6,
    routeLine: 1,
    layout: 'default',
    standfirst: 'A KPI copilot that lives in Microsoft Teams. It warns leaders before a number misses, helps them find out why, and checks whether the fix worked.',
    problem: 'Leaders learned a KPI had slipped weeks late, diagnosed it by hand in spreadsheets, and nobody checked whether the fix worked.',
    approach: 'A Teams bot and tab. People ask about company data in plain language. Pulso sends an alert when a KPI drifts off its trajectory, before it misses, and lets the team open an action plan with an owner, a date and a budget.',
    outcome: 'On the due date Pulso gives its own verdict. It compares the office with its peers to separate real wins from market-wide effects. It now has 1,400 weekly users across 3 companies and has verified 312 action plans.',
    pull: {
      label: 'Time to diagnose a drop',
      sr: 'From 5 days to 25 minutes',
      from: ['5', 'days'],
      to: ['25', 'min'],
    },
    mini: [
      ['1,400', 'weekly users across 3 companies'],
      ['312', 'action plans verified'],
    ],
  },
  {
    id: 'lienzo',
    no: '02',
    page: 14,
    routeLine: 2,
    layout: 'flip',
    standfirst: 'Dashboards that design themselves from one question. The model plans the page and Python does the arithmetic.',
    problem: 'Each new question from leadership meant someone had to build a dashboard by hand. Asking a language model directly was faster, but nobody could trust the figures it wrote.',
    approach: 'A planner model reads one question and designs the layout. Parallel workers fill each widget with queries over the semantic layer. Python computes every number. The model never writes one.',
    outcome: 'A question becomes a dashboard in about 40 seconds, built from 9 widget types. An audit of 500 answers found 0 hallucinated figures.',
    pull: {
      label: 'Audit of 500 answers',
      sr: '0 hallucinated figures',
      value: '0',
      caption: 'hallucinated figures',
    },
    mini: [
      ['~40 s', 'from question to dashboard'],
      ['9', 'widget types'],
    ],
  },
  {
    id: 'glosa',
    no: '03',
    page: 22,
    routeLine: 4,
    layout: 'wide',
    standfirst: 'A semantic layer, as code. Business questions go in, and SQL for Postgres, Snowflake or Microsoft Fabric comes out.',
    problem: 'Every client defines its metrics, hierarchies and business rules a little differently. Engineers rewrote the same questions by hand for whichever database the client ran, and onboarding a new client took six weeks.',
    approach: "A CLI and an API compile business questions into SQL for three engines. Each client's metrics, hierarchies and rules live in a versioned git repository, and an Explorer UI lets the team browse and test them.",
    outcome: 'Client onboarding dropped from 6 weeks to 4 days. The layer holds more than 180 metric definitions, and each one compiles for Postgres, Snowflake and Microsoft Fabric.',
    pull: {
      label: 'Client onboarding',
      sr: 'From 6 weeks to 4 days',
      from: ['6', 'weeks'],
      to: ['4', 'days'],
    },
    mini: [
      ['3', 'SQL engines'],
      ['180+', 'metrics defined'],
    ],
  },
];

// The three systems that get a row instead of a case study.
export const ALSO = [
  {
    id: 'ruta',
    no: '04',
    big: '18%',
    what: 'fewer km driven',
    more: '2,300 visits planned a week. Planning time cut from 1 day to 3 min.',
  },
  {
    id: 'gemelos',
    no: '05',
    big: '27%',
    what: 'of "successful" plans re-labelled as borrowed market effect',
    more: 'Runs the verification step in Pulso.',
  },
  {
    id: 'mensajero',
    no: '06',
    big: '0',
    what: 'duplicates since launch',
    more: '60k messages a month, 99.95% delivered.',
  },
];

export const TIMELINE = [
  {
    lines: [1, 2, 3, 4],
    period: '2023 – now',
    role: 'AI Engineer',
    roleNote: 'Software Engineer until 2024',
    desc: 'Teams copilot, semantic layer platform, agentic dashboards.',
    operator: COMPANY,
    status: 'on',
  },
  {
    lines: [1],
    period: '2022 – 2023',
    role: 'Full-stack developer',
    desc: 'Web apps and bots for NGOs and small businesses (Socorro Bot page among them).',
    operator: 'Freelance',
    status: 'arrived',
  },
  {
    lines: [1, 2, 3, 4],
    period: '2019 – 2022',
    role: 'Student & side projects',
    desc: 'Schedule generator used by classmates, Spotify tools, path-planning research.',
    operator: 'University (DCI)',
    status: 'arrived',
  },
];

// The lead paragraph under each part title (the page range is set by each component).
export const SECTION_COPY = {
  work: `Three systems I designed and shipped at ${COMPANY}, written up in full. Each one began as a student project: the strip at the top of every case shows the line it rode in on.`,
  also: 'Three more production systems, in brief. Gemelos also runs the verification step inside Pulso.',
  experience: 'Three services so far. The current one runs on all four lines.',
};
