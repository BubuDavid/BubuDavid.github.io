export interface Experience {
  title: string;
  company: string;
  period: string;
  current?: boolean;
  secondary?: boolean;
  description: string;
  bullets: string[];
}

export const experience: Experience[] = [
  {
    title: 'Lead Software Engineer',
    company: 'PeopleOPTI',
    period: '11/2023 – Present',
    current: true,
    description:
      'Joined as a data algorithm specialist while completing my Physics degree and rapidly advanced to leading complex LLM multi-agent system development for HR analytics clients.',
    bullets: [
      'Optimized Organizational Network Analysis algorithm, reducing processing time from 4 hours to 10 minutes for 20 million data points (95% improvement)',
      'Redesigned ETL pipelines, cutting processing time by 98% (from 30 minutes per 200K records to 2 minutes per 1M records)',
      'Developed cloud-based interactive dashboard with NextJS/FastAPI that decreased execution time by 80% and development time by 70%',
      'Created agent-based LLM systems using Langchain/Langgraph that reduced insight generation time by 70% through RAG and CAG approaches',
      'Built ML correlation models that helped a key client (FEMSA) reduce employee turnover by 20%',
      'Applied Azure cloud best practices, reducing cloud costs up to 50%',
    ],
  },
  {
    title: 'Instructor & Course Developer',
    company: 'Código Facilito',
    period: '06/2024 – Present',
    current: true,
    secondary: true,
    description:
      'Delivering specialized technical instruction for Latin America\'s leading Spanish-language technology academy across Data Science, ML, Data Engineering, and Python Backend programs.',
    bullets: [
      'Created complete course materials for 10+ courses including Data Visualization, ETL/ELT, ML Model Deployment, and FastAPI',
      'Maintained 90% average student completion rate across all programs',
      'Designed practical projects that improved knowledge retention by 40% over theoretical approaches',
      'Provided personalized mentorship to 500+ students',
    ],
  },
  {
    title: 'Analyst',
    company: 'Deloitte',
    period: '01/2022 – 01/2023',
    description:
      'Designed and applied efficient cloud infrastructure solutions for enterprise clients, focusing on cost optimization and workflow automation.',
    bullets: [
      'Reduced cloud infrastructure costs by 30% through strategic AWS resource optimization',
      'Enhanced data processing efficiency by 15% by developing streamlined data engineering pipelines',
      'Automated manual reporting workflows using AWS CLI and bash scripting, saving teams 15+ hours weekly',
    ],
  },
  {
    title: 'Full Stack Developer',
    company: 'Codeando México',
    period: '10/2021 – 03/2022',
    description:
      'Led development of an open-source humanitarian platform that helps users locate missing people.',
    bullets: [
      'Spearheaded development of the Socorro Bot Web Page, serving 100+ daily users searching for missing persons',
      'Developed a user-friendly data visualization interface using Airtable API, Jekyll, JavaScript, and Leaflet',
    ],
  },
];

export const education = {
  degree: 'B.Sc. in Physics',
  institution: 'University of Guanajuato',
  period: '08/2018 – 12/2023',
  location: 'León, Guanajuato, México',
  highlights: [
    'Overall score 91/100 (~3.7/4.0 GPA)',
    'Capstone project in computational astrophysics — galaxy formation simulation',
    'Active member of the university\'s Tech Club',
  ],
};

export interface Extracurricular {
  name: string;
  role: string;
  period: string;
  url: string;
  description: string;
}

export const extracurriculars: Extracurricular[] = [
  {
    name: 'Clubes de Ciencia México',
    role: 'Instructor',
    period: '08/2019 – Present',
    url: 'https://www.clubesdeciencia.mx/',
    description:
      'Developing and leading programming-oriented workshops that integrate computational methods with physics, chemistry, and biology.',
  },
  {
    name: 'GitHub Campus Expert',
    role: 'Campus Alumni',
    period: '08/2022 – 08/2024',
    url: 'https://githubcampus.expert/',
    description:
      'Organized events and workshops focused on software development, open source, and technical skills across Mexico.',
  },
  {
    name: 'Future Lab',
    role: 'Coordinator',
    period: '08/2019 – Present',
    url: 'https://futurelab.mx/',
    description:
      'Conducting workshops on emerging technologies and collaborating on projects aimed at solving real-world problems.',
  },
];

export interface Award {
  title: string;
  event: string;
  date: string;
}

export const awards: Award[] = [
  { title: '1st Place', event: 'UST D3CODE Hackathon — Mexico', date: '09/2024' },
  { title: '1st Place', event: 'NASA Space Apps Challenge — Guanajuato', date: '11/2023' },
  { title: '2nd Place', event: 'Lincehack — State Hackathon', date: '09/2019' },
  { title: '3rd Place', event: 'HackLeon — State Hackathon', date: '04/2019' },
  { title: 'Gold Medal', event: 'Regional Programming Olympiad of Guanajuato', date: '11/2017' },
  { title: '2nd Place', event: 'World Educational Robot Contest — Mexico', date: '10/2016' },
];
