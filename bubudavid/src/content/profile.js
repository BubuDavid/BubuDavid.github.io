// REVISAR: borrador basado en el trabajo real de David. Revísalo y borra esta línea antes de publicar.
export const NAME = 'David Pedroza Segoviano';
export const HEADLINE = 'Software Engineer · AI agents & data platforms';
export const STANDFIRST = 'Conversational agents in Microsoft Teams, semantic layers that turn business questions into SQL, and dashboards that design themselves.';
export const OPEN_TO = 'Interesting problems at the intersection of LLMs, data and product';

export const ISSUE = { no: '04', season: 'Autumn 2026', place: 'México', est: '2019' };

// The non-breaking space keeps "it." from wrapping alone onto the last line.
export const STATEMENT = {
  lead: "I build the layer between a company's data and ",
  em: 'the people who act on it.',
};

// [[text before, lead-in, text after], second paragraph]
export const BIO = [
  [
    'I ',
    'started out',
    ' writing schedule generators for my classmates and Spotify bots for fun. Today I ship LLM systems that leadership teams open every Monday morning.',
  ],
  'I care about numbers you can trust: the model plans, Python computes, and every answer can be traced back to a query.',
];

export const SKILLS = [
  ['Languages', 'Python, TypeScript, JavaScript, SQL'],
  ['AI', 'LangGraph, LangChain, Claude, Azure OpenAI, LangSmith, evals'],
  ['Backend & data', 'FastAPI, PostgreSQL, Cube, SQLGlot, DuckDB, pandas, scikit-learn, Redis'],
  ['Frontend', 'React, Next.js, Tailwind, Recharts'],
  ['Platforms', 'Microsoft Teams, Azure, Docker'],
];

export const LINKS = {
  github: { href: 'https://github.com/BubuDavid', handle: 'BubuDavid' },
  linkedin: { href: 'https://www.linkedin.com/in/davidpedrozasegoviano/', handle: 'davidpedrozasegoviano' },
};

export const PHOTO = {
  src: '/assets/pp.jpg',
  small: '/assets/pp-640.jpg',
  width: 960,
  height: 960,
  alt: 'David Pedroza Segoviano in a grey beanie and a black Future Lab hoodie, looking up and to the right, with a city skyline lit up at night behind him.',
  caption: 'David Pedroza Segoviano, Bubu to his friends, with a city at night behind him. Printed as a duotone in house green.',
};
