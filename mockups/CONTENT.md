# Mockup content (shared by every prototype)

Everything under "Work" is invented placeholder content. The company, numbers and project names are fictional. The "Lab" projects are the real ones from the current site.

## Profile

- Name: David Pedroza Segoviano
- Alias: Bubu 🦕
- Headline: Software Engineer · AI agents & data platforms
- Location: México 🇲🇽
- Photo: `../bubudavid/public/assets/pp.jpg` (960×960, night city skyline behind him, grey beanie, black "FUTURE LAB" hoodie)
- Short bio: I build the layer between a company's data and the people who act on it: conversational agents in Microsoft Teams, semantic layers that turn business questions into SQL, and dashboards that design themselves.
- Long bio: I started out writing schedule generators for my classmates and Spotify bots for fun. Today I ship LLM systems that leadership teams open every Monday morning. I care about numbers you can trust: the model plans, Python computes, and every answer can be traced back to a query.
- Now: AI Engineer at Ceiba Data (fictional), since 2023
- Available for: interesting problems at the intersection of LLMs, data and product
- Links: GitHub https://github.com/BubuDavid · LinkedIn https://www.linkedin.com/in/davidpedrozasegoviano/ · Email hola@bubudavid.me (placeholder)
- Footer line kept from the current site: `<> Made with 💖 in 🇲🇽🌮`

## Quick stats (invented)

- 4+ years shipping software
- 6 production systems
- 1,400 weekly users on tools I built
- 3 SQL engines supported (Postgres, Snowflake, Microsoft Fabric)

## Experience timeline (invented)

- 2023 – now · Ceiba Data · AI Engineer (Software Engineer until 2024). Teams copilot, semantic layer platform, agentic dashboards.
- 2022 – 2023 · Freelance · Full-stack developer. Web apps and bots for NGOs and small businesses (Socorro Bot page among them).
- 2019 – 2022 · University (DCI) · Student and side projects. Schedule generator used by classmates, Spotify tools, path-planning research.

## Skills

- Languages: Python, TypeScript, JavaScript, SQL
- AI: LangGraph, LangChain, Claude, Azure OpenAI, LangSmith, evals
- Backend & data: FastAPI, PostgreSQL, Cube, SQLGlot, DuckDB, pandas, scikit-learn, Redis
- Frontend: React, Next.js, Tailwind, Recharts
- Platforms: Microsoft Teams, Azure, Docker

## Work projects (all invented)

Each one "grew from" a real student project. Use that link when a concept shows lineage.

### 1. Pulso — A KPI copilot that lives in Microsoft Teams
- Role: Backend & AI lead · 2024 – now
- Problem: Leaders learned a KPI had slipped weeks late, diagnosed it by hand in spreadsheets, and nobody checked whether the fix worked.
- What I built: A Teams bot and tab. People ask about company data in plain language, get alerts when a KPI drifts off its trajectory (before it misses), open action plans with owner, date and budget, and get an automatic verdict on the due date that compares against peer offices to separate real wins from market-wide effects.
- Stack: Python, FastAPI, LangGraph, Azure OpenAI, Teams SDK, PostgreSQL, Next.js
- Impact: 1,400 weekly users across 3 companies · time to diagnose a drop: 5 days → 25 min · 312 action plans verified
- Grew from: Socorro Bot (a WhatsApp bot that guided families through missing-person reports)

### 2. Lienzo — Dashboards that design themselves from one question
- Role: Creator · 2025
- What I built: A planner model designs the dashboard layout from a single question, parallel workers fill each widget with queries over the semantic layer, and every number is computed in Python, never by the model.
- Stack: Claude, LangChain, Cube, Next.js, Recharts, LangSmith
- Impact: question → dashboard in ~40 s · 0 hallucinated figures in a 500-answer audit · 9 widget types
- Grew from: Spotify Analysis (personal insights from your top 50 songs)

### 3. Glosa — A semantic layer, as code
- Role: Core engineer · 2024 – now
- What I built: A CLI and API that compile business questions into SQL for Postgres, Snowflake and Microsoft Fabric. Each client's metrics, hierarchies and rules live in a versioned git repository, with an Explorer UI to browse and test them.
- Stack: Python, FastAPI, SQLGlot, Typer, Next.js, Docker
- Impact: client onboarding 6 weeks → 4 days · 3 SQL engines · 180+ metrics defined
- Grew from: Bubufy (a small Python library over Spotify's API, my first API designed for other people)

### 4. Ruta — Route and shift planner for field promoters
- Role: Full-stack developer · 2023
- What I built: Assigns weekly store visits to retail promoters under shift, distance and priority constraints. Graph search for routes, combinatorial search for shifts, mobile check-in at each store.
- Stack: Python, OR-Tools, FastAPI, React, PostGIS
- Impact: 18% fewer km driven · 2,300 visits planned per week · planning time 1 day → 3 min
- Grew from: DCI Hacedor de Horarios (every schedule combination for your subjects) and RRT Bidirectional Dijkstra (path planning)

### 5. Gemelos — Find the offices that look like yours
- Role: Data scientist · 2024
- What I built: A clustering engine that finds comparable "twin" units (offices, stores, regions) to use as control groups, so an improvement is credited to a plan only if its twins did not improve too.
- Stack: pandas, scikit-learn, DuckDB, FastAPI
- Impact: 27% of "successful" plans re-labelled as borrowed market effect · powers Pulso's verification step
- Grew from: Color Picker (k-means palette extraction from any image)

### 6. Mensajero — Proactive messaging that never double-sends
- Role: Backend engineer · 2024
- What I built: A queue-backed service that delivers adaptive cards to Teams and WhatsApp with retries, idempotency keys and quiet hours.
- Stack: Python, Redis, Azure Service Bus, Bot Framework
- Impact: 60k messages a month · 99.95% delivered · 0 duplicates since launch
- Grew from: Spotwipy (a bot that tweeted 5 random songs)

## Lab projects (real, from the current site)

| Name | Description | Tags | Link |
|---|---|---|---|
| Socorro Bot Page | Information and support page for a WhatsApp bot that helps families through missing-person cases. | JavaScript, HTML, CSS | https://socorrobot.org/ |
| DCI · Hacedor de Horarios 🐝 | Full-stack app that generates every possible schedule combination from your subjects. | Python, FastAPI, ReactJS | https://bubudavid.github.io/dci-hh/ |
| RRT Bidirectional Dijkstra | Bidirectional RRT to sample a map, then Dijkstra for the shortest path. Notebook. | Python, pandas, numpy | https://github.com/BubuDavid/RRT-Bidirectional-Dijstrak |
| Spotify Analysis | Insights into your top 50 songs over 2 weeks, 6 months and all time. Flask + Spotify API, built on my own PyPI library, Bubufy. | Python, Flask, HTML, CSS | https://personality-analysis-spotify.glitch.me/ |
| Spotwipy | Connects Spotify and Twitter: picks 5 random songs and a bot tweets them. | Flask, Python, JavaScript | http://spotwipy-shuffle.glitch.me/ |
| Color Picker | Finds the color palette of any public image with numpy, OpenCV and scikit-learn. | Python, numpy, scikit-learn | https://palette-bubupicker.glitch.me/ |
| Resume | Responsive HTML, CSS and JS resume. | HTML, CSS, JavaScript | https://bubudavid.github.io/Resume/ |
| Bubufy | Small Python API client for Spotify, published on PyPI. | Python | https://github.com/BubuDavid/Bubufy |

## Current site identity (to reuse or react to)

- Background: radial gradient `rgba(53,120,76)` center → `rgba(22,39,28)` edges
- Accent: neon green `#57E089` with glow (`box-shadow: 0 0 10px #57E089`)
- Card background: `#16271C`
- Font: Poppins
- Signature element: circular photo with project icons orbiting it (30 s spin)
- Tone: friendly, emoji ("Hi there 👋", "Link Tree 🎄", 🦕)
