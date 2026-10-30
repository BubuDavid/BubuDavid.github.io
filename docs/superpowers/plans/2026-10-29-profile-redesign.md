# Rediseño del perfil (Metro + Editorial): plan de implementación

> **Para agentes:** SUB-SKILL REQUERIDA: usa superpowers:subagent-driven-development (recomendado) o superpowers:executing-plans para implementar este plan tarea por tarea. Los pasos usan casillas (`- [ ]`) para el seguimiento.

**Objetivo:** Reemplazar el sitio de Create React App en `bubudavid/` por una página Vite + React que reproduce el prototipo `mockups/07-metro-editorial.html`, con el contenido guardado como datos en el repo.

**Arquitectura:** El contenido vive en módulos de `src/content/`, separado en real, borrador e inventado. `network.js` deriva de ahí lo que leen el mapa, los casos, el archivo y el tablero. Cada sección de la página es un componente con su propio CSS, copiado del prototipo. El mapa es SVG escrito en JSX a partir de coordenadas puestas a mano en `map-layout.js`.

**Tech stack:** Node 24, Vite 8, React 18.3.1, Vitest 5 con jsdom y Testing Library, gh-pages 6. CSS plano.

**Spec:** `docs/superpowers/specs/2026-10-29-profile-redesign-design.md`. La referencia visual es `mockups/07-metro-editorial.html`, que este plan llama "el prototipo". Los números de línea citados son de ese archivo.

## Restricciones globales

- Todo el código vive en `bubudavid/`. Los comandos de este plan se corren desde `bubudavid/`, salvo los de git.
- Rama de trabajo: `redesign/site`. Un commit al final de cada tarea. Nunca `git push` ni `npm run deploy`.
- No tocar el archivo `CNAME` de la raíz del repo.
- Dependencias de ejecución: solo `react` y `react-dom` 18.3.1. Nada de Tailwind, librerías de componentes, paquetes de íconos, `dotenv` ni Airtable. La página no hace peticiones de red al correr, salvo Google Fonts.
- Ningún secreto en el código y ninguna variable `VITE_*` o `REACT_APP_*`.
- Colores: papel `#F3EFE6`, tinta `#17160F`, verde editorial `#1F5C3A`. Líneas: L1 `#D6286F`, L2 `#57E089`, L3 `#1565D8`, L4 `#F28A1D`. El verde de L2 nunca es color de texto sobre papel.
- Tipografías de Google Fonts: Fraunces, Inter Tight y Barlow Condensed, con el mismo `<link>` que el prototipo (líneas 9–11).
- Copia en inglés. Se quedan las palabras de señalética en español del prototipo: Línea, Correspondencia, Salidas, Próxima estación, En servicio, Llegó, Horarios.
- Se conservan el alias "Bubu 🦕" y el pie `<> Made with 💖 in 🇲🇽🌮`.
- La consulta `(max-width: 760px)` cambia al mapa vertical. Todo movimiento respeta `(prefers-reduced-motion: reduce)`.
- CSS plano, un archivo por componente, al lado del componente. Los tokens van en `:root` dentro de `src/styles/base.css`. Los nombres de clase son los del prototipo, así su CSS se copia sin cambios. No se portan la píldora de mockup ni la retícula (prototipo, líneas 404–423 y 1469–1471).
- El contenido inventado vive solo en `src/content/work.js` y en `src/components/figures/`. Cada uno de esos archivos empieza con una línea `// RELLENO: ...`. El borrador de copia real vive en `src/content/profile.js`, que empieza con `// REVISAR: ...`.
- Las coordenadas del mapa se escriben a mano en `src/content/map-layout.js`.
- Scripts que se conservan: `npm start`, `npm run build` (salida en `build/`) y `npm run deploy` (`gh-pages -d build`).

## Puntos a revisar

Cinco situaciones que la spec implica y que es fácil romper, de la más probable a la menos:

1. Alguien corre `npm run deploy` con el contenido inventado todavía adentro. Esperado: el deploy se detiene antes de compilar y nombra los archivos que tienen `RELLENO` o `REVISAR`. Prueba en la Tarea 2.
2. Un reclutador abre un enlace con ancla, como `bubudavid.github.io/#glosa`. La página se dibuja en el navegador, así que el ancla no existe cuando el navegador la busca. Esperado: al montar, la página baja a esa sección. Prueba en la Tarea 3.
3. David cambia un proyecto o su línea en `work.js` y el mapa a mano deja de coincidir. Esperado: `npm test` falla con un mensaje que nombra la estación sin coordenadas o la ruta incoherente. Prueba en la Tarea 2.
4. Alguien usa el mapa solo con teclado o con lector de pantalla. Esperado: Enter y Espacio activan una estación, el foco cae en el título de la sección destino y la etiqueta aparece al enfocar. Pruebas en la Tarea 5.
5. La ventana cruza los 760 px con la etiqueta abierta o el tren en marcha, por ejemplo al girar el teléfono. Esperado: la etiqueta desaparece, se dibuja el mapa vertical y el tren corre en el mapa visible. Prueba en la Tarea 6.

---

## Antes de empezar

Los mockups, la spec y este plan no tienen commit. Un worktree creado ahora no los vería, y el plan cita el prototipo. En el checkout principal, antes de crear cualquier worktree:

```bash
git add mockups docs
git commit -m "docs: mockups, design and plan for the profile redesign"
git switch -c redesign/site        # o: git worktree add <ruta> -b redesign/site
```

`.claude/` queda fuera del commit.

## Estructura de archivos

```
bubudavid/
  index.html                  entrada de Vite: metadatos, fuentes, Open Graph
  vite.config.js              React, salida build/, puerto 3000, configuración de Vitest
  package.json
  README.md
  scripts/
    check-placeholders.mjs    detiene el deploy si queda RELLENO o REVISAR
    check-placeholders.test.mjs
  public/
    favicon.svg
    robots.txt                (se queda)
    assets/pp.jpg             (se queda)
    assets/pp-640.jpg         foto reducida, también es la imagen para compartir
  src/
    main.jsx
    App.jsx                   orden de secciones y saltos por ancla
    App.test.jsx              prueba de humo de la página completa
    meta.test.js              metadatos de index.html
    styles/base.css
    test/setup.js             jest-dom, limpieza y dobles de APIs del navegador
    test/browser.js           controles de esos dobles
    content/
      lines.js                nombres y colores de las cuatro líneas
      lab.js                  los 8 proyectos reales
      work.js                 RELLENO
      profile.js              REVISAR
      map-layout.js           coordenadas del mapa
      network.js              datos derivados para los componentes
      content.test.js
    lib/
      media.js                consultas de celular y de movimiento reducido
      jump.js                 saltar a una estación, destello, anclas
      jump.test.jsx
      time.js                 hora de la Ciudad de México
      time.test.js
    components/
      shared/                 Icon, ExternalLink, LineBadge, IndexLines, PartHead, Pictogram, pictograms.js
      TopNav/                 TopNav.jsx, TopNav.css, TopNav.test.jsx
      Masthead/               Masthead.jsx, Nameplate.jsx, Masthead.css, Masthead.test.jsx
      Cover/                  Cover.jsx, Cover.css, Cover.test.jsx
      NetworkMap/             NetworkMap.jsx, HorizontalMap.jsx, VerticalMap.jsx, MapTooltip.jsx, useTrain.js,
                              metroPath.js, NetworkMap.css, metroPath.test.js, NetworkMap.test.jsx, VerticalMap.test.jsx
      CaseStudy/              SelectedWork.jsx, CaseStudy.jsx, RouteStrip.jsx, CaseStudy.css, CaseStudy.test.jsx
      figures/                PulsoFigure.jsx, LienzoFigure.jsx, GlosaFigure.jsx, index.js, figures.css
      AlsoIndex/              AlsoIndex.jsx, AlsoIndex.css, AlsoIndex.test.jsx
      Archive/                Archive.jsx, Archive.css, Archive.test.jsx
      Timetable/              Timetable.jsx, Timetable.css, Timetable.test.jsx
      Contact/                Contact.jsx, Contact.css
      Colophon/               Colophon.jsx, Colophon.css
```

## De dónde sale el CSS de cada componente

El prototipo tiene dos capas: Editorial (líneas 13–423) y las adiciones de Metro + Editorial (425–669). Cada archivo junta las reglas de sus selectores de ambas capas. Si un bloque `@media` mezcla selectores de varios componentes, como 652–664, cada regla va al archivo de su componente dentro de un `@media` igual.

| Archivo | Líneas del prototipo |
|---|---|
| `styles/base.css` | 16–68, 145–157, 429–442, 648–650, 665–667 |
| `TopNav.css` | 444–455 |
| `Masthead.css` | 70–96, 457–462 |
| `Cover.css` | 97–144, 463–467 |
| `NetworkMap.css` | 469–537, más las reglas de mapa y `.net-tip` de 652–664 |
| `CaseStudy.css` | 158–221, 538–569, más las reglas `.r-*` de 652–664 |
| `figures.css` | 222–293 |
| `AlsoIndex.css` | 294–324, 570–572 |
| `Archive.css` | 325–345, 573–584, 668 |
| `Timetable.css` | 585–632 y `.board-clock` de 652–664; de 346–380 solo `.back-title` y `.tools` |
| `Contact.css` | 633–647; de 346–380 solo `.mail-big` y `.social` |
| `Colophon.css` | 381–403 |

---

### Tarea 1: Vite en lugar de Create React App

**Archivos:**
- Crear: `index.html`, `vite.config.js`, `src/main.jsx`, `src/styles/base.css`, `src/test/setup.js`, `src/test/browser.js`, `public/favicon.svg`, `public/assets/pp-640.jpg`
- Reescribir: `package.json`, `src/App.jsx`
- Borrar: `src/components/` (todo lo viejo), `src/customHooks/`, `src/data/`, `src/index.js`, `src/index.css`, `public/index.html`, `public/manifest.json`, `public/logo192.png`, `public/logo512.png`, `public/favicon.ico`, `public/assets/default.png`
- Pruebas: `src/App.test.jsx`, `src/meta.test.js`

**Interfaces:**
- Produce `src/test/browser.js`, que las pruebas de todas las tareas usan:
  - `setMedia({ mobile = false, reducedMotion = false } = {}): void` cambia lo que responde `matchMedia` y avisa a los listeners `change` de cada consulta cuyo resultado cambió. Una consulta con `max-width: 760px` sigue a `mobile`; una con `prefers-reduced-motion` sigue a `reducedMotion`; cualquier otra responde `false`.
  - `intersect(target: Element, isIntersecting: boolean): void` llama al callback de cada `IntersectionObserver` que observa `target` con `[{ target, isIntersecting, intersectionRatio: isIntersecting ? 1 : 0 }]`.
  - `resizeObserved(target: Element): void` llama al callback de cada `ResizeObserver` que observa `target`.
  - `scrollIntoView`: el `vi.fn()` instalado en `Element.prototype.scrollIntoView`.
- Produce `src/test/setup.js`: importa `@testing-library/jest-dom/vitest`; instala `matchMedia`, `IntersectionObserver` y `ResizeObserver` falsos (registran qué observan), `scrollIntoView`, `SVGElement.prototype.getTotalLength` (devuelve `100`), `SVGElement.prototype.getPointAtLength` (devuelve `{ x: 0, y: 0 }`), `document.fonts` con `ready` y `load()` ya resueltos, y `requestAnimationFrame`/`cancelAnimationFrame` si jsdom no los trae. En `afterEach`: `cleanup()`, `setMedia({})`, `vi.useRealTimers()`, `vi.restoreAllMocks()`, vacía los observadores registrados y `scrollIntoView.mockClear()`.
- Produce `App` (export default de `src/App.jsx`). Cada tarea siguiente le agrega su sección.

- [ ] **Paso 1: Reemplazar `package.json` y reinstalar**

```json
{
  "name": "bubudavid",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "start": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  },
  "dependencies": {
    "react": "18.3.1",
    "react-dom": "18.3.1"
  },
  "devDependencies": {
    "@testing-library/dom": "^10.4.2",
    "@testing-library/jest-dom": "^7.0.1",
    "@testing-library/react": "^16.3.3",
    "@testing-library/user-event": "^14.6.8",
    "@vitejs/plugin-react": "^6.1.2",
    "gh-pages": "^6.3.0",
    "jsdom": "^30.1.3",
    "vite": "^8.3.5",
    "vitest": "^5.0.5"
  }
}
```

```bash
rm -rf node_modules package-lock.json && npm install
```

Esperado: termina sin errores de dependencias. Si `@vitejs/plugin-react` pide un peer que falta, detente y repórtalo en lugar de bajar versiones.

- [ ] **Paso 2: Escribir `vite.config.js`**

`defineConfig` importado de `vitest/config`, con `plugins: [react()]`, `build: { outDir: 'build' }`, `server: { port: 3000 }` y `test: { environment: 'jsdom', setupFiles: ['./src/test/setup.js'], css: false }`.

- [ ] **Paso 3: Escribir las pruebas que fallan**

`src/App.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import App from './App';

test('renders the page shell', () => {
  render(<App />);
  expect(screen.getByRole('main')).toBeInTheDocument();
});
```

`src/meta.test.js`:

```js
import { existsSync, readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const meta = (attr, key) => html.match(new RegExp(`<meta ${attr}="${key}" content="([^"]*)"`))?.[1];
const DESCRIPTION = 'David Pedroza Segoviano, software engineer in México. AI agents and data platforms, written up as case studies.';

test('index.html carries the page metadata', () => {
  expect(html).toContain('<html lang="en">');
  expect(html).toContain('<title>David Pedroza Segoviano · Bubu</title>');
  expect(meta('name', 'description')).toBe(DESCRIPTION);
  expect(meta('name', 'theme-color')).toBe('#F3EFE6');
  expect(meta('property', 'og:title')).toBe('David Pedroza Segoviano · Bubu');
  expect(meta('property', 'og:description')).toBe(DESCRIPTION);
  expect(meta('property', 'og:url')).toBe('https://bubudavid.github.io/');
  expect(meta('property', 'og:image')).toBe('https://bubudavid.github.io/assets/pp-640.jpg');
  expect(meta('name', 'twitter:card')).toBe('summary');
  expect(html).not.toContain('%PUBLIC_URL%');
});

test('the reduced photo and the favicon exist', () => {
  expect(existsSync(new URL('../public/assets/pp-640.jpg', import.meta.url))).toBe(true);
  expect(existsSync(new URL('../public/favicon.svg', import.meta.url))).toBe(true);
});
```

- [ ] **Paso 4: Correrlas y ver que fallan**

Run: `npx vitest run`
Esperado: FAIL. El `App.jsx` viejo importa componentes que usan `react-icons`, y `index.html` no existe.

- [ ] **Paso 5: Borrar el sitio viejo**

`git rm -r` sobre la lista de "Borrar" de esta tarea.

- [ ] **Paso 6: Crear la entrada nueva**

- `index.html`: `<html lang="en">`, charset, viewport, el `<title>` y los `<meta>` de la prueba (cada uno en la forma `<meta name|property="..." content="...">`), además de `og:type` = `website` y `og:image:alt` con el `alt` de la foto (prototipo, línea 751). `<link rel="icon" href="/favicon.svg" type="image/svg+xml">`, el `<link>` de fuentes del prototipo, `<div id="root"></div>`, un `<noscript>` con el nombre y los enlaces a GitHub y LinkedIn, y `<script type="module" src="/src/main.jsx"></script>`.
- `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#17160F"/><rect x="6" y="25" width="5" height="3" fill="#D6286F"/><rect x="11" y="25" width="5" height="3" fill="#57E089"/><rect x="16" y="25" width="5" height="3" fill="#1565D8"/><rect x="21" y="25" width="5" height="3" fill="#F28A1D"/><text x="16" y="21" text-anchor="middle" font-family="Georgia,serif" font-size="19" font-weight="700" fill="#F3EFE6">B</text></svg>
```

- `public/assets/pp-640.jpg`: `magick public/assets/pp.jpg -resize 640x640 -strip -quality 82 public/assets/pp-640.jpg`
- `src/styles/base.css`: las líneas de la tabla de CSS.
- `src/main.jsx`: importa `./styles/base.css` y monta `<StrictMode><App /></StrictMode>` en `#root`.
- `src/App.jsx`: por ahora devuelve `<main />`.
- `src/test/setup.js` y `src/test/browser.js`, según las interfaces.

- [ ] **Paso 7: Correr las pruebas**

Run: `npx vitest run`
Esperado: PASS, 3 pruebas.

- [ ] **Paso 8: Compilar y buscar restos del sitio viejo**

Run: `npm run build && grep -rniE 'airtable|react_app|dotenv' src build index.html package.json`
Esperado: la compilación termina sin advertencias, `build/index.html` existe y grep no imprime nada.

- [ ] **Paso 9: Commit**

```bash
git add -A bubudavid
git commit -m "build: replace Create React App with Vite and drop the Airtable site"
```

---

### Tarea 2: El contenido como datos

**Archivos:**
- Crear: `src/content/lines.js`, `lab.js`, `work.js`, `profile.js`, `map-layout.js`, `network.js`, `scripts/check-placeholders.mjs`
- Modificar: `package.json` (`predeploy`)
- Pruebas: `src/content/content.test.js`, `scripts/check-placeholders.test.mjs`

**Interfaces:**
- Produce, en `src/content/` (las tareas siguientes leen solo de aquí):

```js
// lines.js (diseño; qué proyecto va en qué línea vive en work.js)
export const LINES   // { 1: { name: 'Bots & messaging', chip: 'Bots', color: '#D6286F', ink: '#FFFFFF' },
                     //   2: { name: 'Data & insight', chip: 'Data', color: '#57E089', ink: '#0B2A17' },
                     //   3: { name: 'Optimization', chip: 'Optimization', color: '#1565D8', ink: '#FFFFFF' },
                     //   4: { name: 'APIs & platforms', chip: 'APIs', color: '#F28A1D', ink: '#1D1206' } }
export const LINE_IDS = [1, 2, 3, 4];

// lab.js (real)
export const LAB     // Array<{ id, no: '01'..'08', name, short?, rshort?, icon, desc, tags: string[],
                     //         demo?: string, source?: string, demoOffline?: true }>

// work.js (// RELLENO)
export const COMPANY, EMAIL, NOW            // strings
export const STATS        // Array<{ value, label, note? }>
export const LAB_LINES    // { [labId]: 1 | 2 | 3 | 4 }
export const ROUTES       // { [line]: stationId[] } en el orden del mapa
export const WORK         // Array<{ id, name, icon, lines: number[], tagline, role, period,
                          //         stack: string[], grew: Array<[labId, note]> }>
export const CASES        // Array<{ id, no, page: number, routeLine: number, layout: 'default'|'flip'|'wide',
                          //         standfirst, problem, approach, outcome,
                          //         pull: { label, sr, from?: [num, unit], to?: [num, unit], value?, caption? },
                          //         mini: Array<[value, label]> }>
export const ALSO         // Array<{ id, no, big, what, more }>
export const TIMELINE     // Array<{ lines: number[], period, role, roleNote?, desc, operator, status: 'on'|'arrived' }>
export const SECTION_COPY // { work, also, experience }

// profile.js (// REVISAR)
export const NAME, HEADLINE, STANDFIRST, OPEN_TO   // strings
export const ISSUE        // { no: '04', season: 'Autumn 2026', place: 'México', est: '2019' }
export const STATEMENT    // { lead: "I build the layer between a company's data and ", em: 'the people who act on it.' }
export const BIO          // [[before, leadIn, after], secondParagraph]
export const SKILLS       // Array<[label, items]>
export const LINKS        // { github: { href, handle: 'BubuDavid' }, linkedin: { href, handle: 'davidpedrozasegoviano' } }
export const PHOTO        // { src: '/assets/pp.jpg', small: '/assets/pp-640.jpg', width: 960, height: 960, alt, caption }

// map-layout.js
export const VIEW = { w: 1280, h: 680 };
export const GRAD_X = 600;
export const yearX = year => 70 + (year - 2019) * 150;
export const HPATHS, HPOS     // prototipo 1687–1707; HPOS tiene toda estación menos la de correspondencia
export const XFER             // { id: 'pulso', hit, ring, pill, tile, name, meta, badges, period }, de hPulso (1739–1755)
export const TERMINI          // Array<[line, x, y]>: el inicio de cada HPATHS, más [2, 1160, 350] y [3, 760, 560]
export const TRAIN = { line: 1, from: 'spotwipy', to: 'pulso' };
export const VORDER, VX       // prototipo 1800–1801
export const COLORS           // { card: '#FFFDF8', ink: '#17160F', labStroke: '#4A463C', labGlyph: '#3D3A32',
                              //   zone: '#EFE9DC', dots: '#D6CDB9', axis: '#CBC2AF', tick: '#9C9584', leader: '#C9C0AD' }

// network.js
export const STATIONS                 // { [id]: entrada de LAB o WORK + { kind: 'lab' | 'work', lines: number[] } }
export function displayName(id)       // short ?? name
export function routeName(id)         // rshort ?? short ?? name
export function targetId(id)          // work: id; lab: `a-${no}`
export function stationForTarget(elementId)   // inversa de targetId, o undefined
export function linesText(lines)      // [2] → 'Line 2'; [2, 4] → 'Lines 2 and 4'; [1, 2, 4] → 'Lines 1, 2 and 4'
export function stationLabel(id)      // `${displayName}. ${where}. ${linesText}. Jump to its write-up.` (prototipo 1676–1680)
export function grewInto(labId)       // ids de WORK cuyo grew incluye labId, en el orden de WORK
export function archiveLine(n)        // { lab: estaciones lab de ROUTES[n], into: estaciones work de ROUTES[n]
                                      //   que crecieron de un lab de la línea n }
export function shortLine(text, max = 118)   // corta en límite de palabra y agrega '…' (prototipo 2002–2006)
```

- Produce `findPlaceholders(files: Array<{ path, text }>): Array<{ path, marker: 'RELLENO' | 'REVISAR' }>` en `scripts/check-placeholders.mjs`. Solo cuenta líneas que empiezan con `// RELLENO` o `// REVISAR`.

**De dónde sale cada valor.** Se copia textual del prototipo, con estas decisiones:
- `LAB`: `id`, `name`, `icon` y `tags` de `ST` (1557–1580). `desc` sale del archivo (1278, 1286, 1299, 1307, 1320, 1328, 1341, 1349), no de `ST`. Números: socorro 01, dci 02, rrt 03, spotify 04, spotwipy 05, color 06, resume 07, bubufy 08. `short`: socorro `'Socorro Bot'`, dci `'DCI · Hacedor de Horarios'`. `rshort`: rrt `'RRT Dijkstra'`, dci `'Hacedor de Horarios'`. Enlaces: socorro, dci y resume tienen `demo` (sus URLs de `ST`); rrt y bubufy tienen `source` (sus URLs de GitHub); spotwipy, spotify y color tienen `source` con su repositorio (`SpoTwipy`, `Personality-Analysis-Spotify`, `Color-Palette_Picker` bajo `https://github.com/BubuDavid/`) y `demoOffline: true`.
- `WORK`: de `ST` (1583–1626), solo los campos de la interfaz, en el orden pulso, lienzo, glosa, ruta, gemelos, mensajero.
- `CASES`: de los artículos (839–1196). `approach` va sin la llamada de nota. `pull`: pulso `{ label: 'Time to diagnose a drop', sr: 'From 5 days to 25 minutes', from: ['5', 'days'], to: ['25', 'min'] }`, lienzo `{ label: 'Audit of 500 answers', sr: '0 hallucinated figures', value: '0', caption: 'hallucinated figures' }`, glosa `{ label: 'Client onboarding', sr: 'From 6 weeks to 4 days', from: ['6', 'weeks'], to: ['4', 'days'] }`. Número, página, línea y diseño: pulso `'01'`, 6, 1, `'default'`; lienzo `'02'`, 14, 2, `'flip'`; glosa `'03'`, 22, 4, `'wide'`.
- `ALSO` (1222–1254), `TIMELINE` (1379–1399), `STATS` (776–779), `NOW` (763), `SKILLS` (1407–1411).
- `SECTION_COPY.work` usa `COMPANY` en lugar de escribir "Ceiba Data" (834). `also` es la línea 1206 y `experience` la 1365.
- `profile.js`: 704–705, 746, 751–753, 757–760, 764.
- Primera línea de `work.js`: `// RELLENO: todo lo de este archivo es inventado. Reemplázalo y borra esta línea antes de publicar.` Primera línea de `profile.js`: `// REVISAR: borrador basado en el trabajo real de David. Revísalo y borra esta línea antes de publicar.`

- [ ] **Paso 1: Escribir las pruebas que fallan**

`src/content/content.test.js`:

```js
import { describe, expect, test } from 'vitest';
import { LINE_IDS } from './lines';
import { LAB } from './lab';
import { ALSO, CASES, LAB_LINES, ROUTES, WORK } from './work';
import { HPOS, TERMINI, VORDER, VX, XFER } from './map-layout';
import {
  STATIONS, archiveLine, displayName, grewInto, linesText, routeName,
  shortLine, stationForTarget, stationLabel, targetId,
} from './network';

const ids = Object.keys(STATIONS);

describe('the network matches the hand-drawn map', () => {
  test('there are 8 lab and 6 work stations', () => {
    expect(ids.filter(id => STATIONS[id].kind === 'lab')).toHaveLength(8);
    expect(ids.filter(id => STATIONS[id].kind === 'work')).toHaveLength(6);
  });
  test.each(LINE_IDS)('every stop on line %i exists and lists that line', n => {
    for (const id of ROUTES[n]) {
      expect(STATIONS[id], `ROUTES[${n}] names unknown station "${id}"`).toBeDefined();
      expect(STATIONS[id].lines, `${id} is on ROUTES[${n}] but not on line ${n}`).toContain(n);
    }
  });
  test.each(ids)('%s is on the route of each of its lines', id => {
    for (const n of STATIONS[id].lines) expect(ROUTES[n], `add "${id}" to ROUTES[${n}]`).toContain(id);
  });
  test('every lab project has a line', () => {
    for (const p of LAB) expect(LAB_LINES[p.id], `LAB_LINES has no line for "${p.id}"`).toBeDefined();
  });
  test('the only interchange is the one drawn by hand', () => {
    expect(ids.filter(id => STATIONS[id].lines.length > 1)).toEqual([XFER.id]);
  });
  test.each(ids.filter(id => id !== XFER.id))('%s has coordinates', id => {
    expect(HPOS[id], `add "${id}" to HPOS in map-layout.js`).toBeDefined();
  });
  test('the vertical map lists every station once, plus its three markers', () => {
    expect([...VORDER].sort()).toEqual([...ids, '@lab', '@grad', '@work'].sort());
  });
  test('every line has a column on the vertical map and a badge on the horizontal one', () => {
    for (const n of LINE_IDS) {
      expect(VX[n], `VX has no column for line ${n}`).toBeTypeOf('number');
      expect(TERMINI.some(([line]) => line === n), `TERMINI has no badge for line ${n}`).toBe(true);
    }
  });
});

describe('content', () => {
  test('lab numbers run from 01 to 08', () => {
    expect(LAB.map(p => p.no).sort()).toEqual(['01', '02', '03', '04', '05', '06', '07', '08']);
  });
  test.each(LAB.map(p => [p.id, p]))('%s links to a demo or to its code over https', (_, p) => {
    expect(p.demo ?? p.source).toMatch(/^https:\/\//);
    if (p.source) expect(p.source).toMatch(/^https:\/\//);
    if (p.demoOffline) {
      expect(p.demo).toBeUndefined();
      expect(p.source).toBeDefined();
    }
  });
  test('the three Glitch demos point at their repositories', () => {
    const offline = Object.fromEntries(LAB.filter(p => p.demoOffline).map(p => [p.id, p.source]));
    expect(offline).toEqual({
      spotwipy: 'https://github.com/BubuDavid/SpoTwipy',
      spotify: 'https://github.com/BubuDavid/Personality-Analysis-Spotify',
      color: 'https://github.com/BubuDavid/Color-Palette_Picker',
    });
  });
  test('every "grew from" names a lab project', () => {
    for (const w of WORK) for (const [lab] of w.grew) {
      expect(STATIONS[lab]?.kind, `${w.id} grew from unknown "${lab}"`).toBe('lab');
    }
  });
  test('every work project is a case study or a brief, and only one of them', () => {
    const shown = [...CASES.map(c => c.id), ...ALSO.map(a => a.id)].sort();
    expect(shown).toEqual(WORK.map(w => w.id).sort());
  });
  test('each case rides in on one of its own lines', () => {
    for (const c of CASES) expect(STATIONS[c.id].lines).toContain(c.routeLine);
  });
});

describe('network helpers', () => {
  test('targets', () => {
    expect(targetId('lienzo')).toBe('lienzo');
    expect(targetId('spotify')).toBe('a-04');
    expect(stationForTarget('a-04')).toBe('spotify');
    expect(stationForTarget('map')).toBeUndefined();
  });
  test('names', () => {
    expect(displayName('dci')).toBe('DCI · Hacedor de Horarios');
    expect(routeName('dci')).toBe('Hacedor de Horarios');
    expect(routeName('spotify')).toBe('Spotify Analysis');
  });
  test('linesText', () => {
    expect(linesText([2])).toBe('Line 2');
    expect(linesText([2, 4])).toBe('Lines 2 and 4');
    expect(linesText([1, 2, 4])).toBe('Lines 1, 2 and 4');
  });
  test('stationLabel', () => {
    expect(stationLabel('pulso')).toBe('Pulso. Work station, Backend & AI lead, 2024 – now. Lines 1, 2 and 4. Jump to its write-up.');
    expect(stationLabel('rrt')).toBe('RRT Bidirectional Dijkstra. Lab station, student project. Line 3. Jump to its write-up.');
  });
  test('grewInto and archiveLine', () => {
    expect(grewInto('dci')).toEqual(['ruta']);
    expect(grewInto('resume')).toEqual([]);
    expect(archiveLine(1)).toEqual({ lab: ['spotwipy', 'socorro'], into: ['mensajero', 'pulso'] });
    expect(archiveLine(2)).toEqual({ lab: ['spotify', 'color'], into: ['gemelos', 'lienzo'] });
  });
  test('shortLine cuts on a word boundary', () => {
    expect(shortLine('short text')).toBe('short text');
    const cut = shortLine('word '.repeat(40).trim());
    expect(cut.length).toBeLessThanOrEqual(119);
    expect(cut.endsWith('word…')).toBe(true);
  });
});
```

`scripts/check-placeholders.test.mjs`:

```js
import { expect, test } from 'vitest';
import { findPlaceholders } from './check-placeholders.mjs';

test('finds the RELLENO and REVISAR markers', () => {
  expect(findPlaceholders([
    { path: 'src/content/work.js', text: '// RELLENO: everything here is invented\nexport const A = 1;\n' },
    { path: 'src/content/profile.js', text: '// REVISAR: draft copy\n' },
    { path: 'src/content/lab.js', text: "export const note = 'RELLENO';\n" },
  ])).toEqual([
    { path: 'src/content/work.js', marker: 'RELLENO' },
    { path: 'src/content/profile.js', marker: 'REVISAR' },
  ]);
});

test('clean files pass', () => {
  expect(findPlaceholders([{ path: 'a.js', text: 'export {};\n' }])).toEqual([]);
});
```

- [ ] **Paso 2: Correrlas y ver que fallan**

Run: `npx vitest run src/content scripts`
Esperado: FAIL, los módulos no existen.

- [ ] **Paso 3: Escribir los módulos de contenido y `network.js`**

Con las formas de la interfaz y los valores de la lista de arriba. `STATIONS` junta `LAB` (con `kind: 'lab'` y `lines: [LAB_LINES[id]]`) y `WORK` (con `kind: 'work'`).

- [ ] **Paso 4: Escribir `scripts/check-placeholders.mjs`**

Exporta `findPlaceholders`. Si se corre directo con `node`, lee todo `.js` y `.jsx` de `src/content/` y `src/components/figures/` (si la carpeta existe), imprime una línea `ruta: MARCA` por hallazgo y después `Replace or review these files, then delete the marker line, before deploying.`, y sale con código 1. Sin hallazgos no imprime nada y sale con 0. En `package.json`: `"predeploy": "node scripts/check-placeholders.mjs && npm run build"`.

- [ ] **Paso 5: Correr las pruebas**

Run: `npx vitest run`
Esperado: PASS.

- [ ] **Paso 6: Ver que el guardia detiene el deploy**

Run: `node scripts/check-placeholders.mjs; echo "exit $?"`
Esperado: lista `src/content/profile.js: REVISAR` y `src/content/work.js: RELLENO`, y termina con `exit 1`.

- [ ] **Paso 7: Commit**

```bash
git add bubudavid
git commit -m "feat: content as data, network helpers and a placeholder guard on deploy"
```

---

### Tarea 3: Saltos, hora y consultas de medios

**Archivos:**
- Crear: `src/lib/media.js`, `src/lib/jump.js`, `src/lib/time.js`
- Modificar: `src/App.jsx` (llama a `useJumpLinks()` y `useInitialHash()`)
- Pruebas: `src/lib/jump.test.jsx`, `src/lib/time.test.js`

**Interfaces:**
- Consume: `targetId`, `stationForTarget` de `network.js`.
- Produce:

```js
// media.js
export const MOBILE_QUERY = '(max-width: 760px)';
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
export function useMediaQuery(query)          // boolean; useSyncExternalStore sobre matchMedia
export const useIsMobile = () => useMediaQuery(MOBILE_QUERY);
export const usePrefersReducedMotion = () => useMediaQuery(REDUCED_MOTION_QUERY);
export function prefersReducedMotion()        // lectura puntual, fuera de React

// jump.js
export function jumpTo(stationId, { instant = false } = {})   // boolean: false si la sección no está en la página
export function flash(el)
export function useJumpLinks()
export function useInitialHash()

// time.js
export function mexicoCityTime(date)          // { h: '12', m: '05' }
export function useMexicoCityTime()           // igual, actualizado cada 15 s
```

Comportamiento de `jumpTo` (prototipo 1952–1961): busca el elemento `targetId(stationId)`. Llama a `scrollIntoView({ behavior, block })`, donde `behavior` es `'auto'` si `instant` o si el usuario pide menos movimiento, y `'smooth'` si no; `block` es `'center'` si el elemento cumple `.toc > li, .idx tr` y `'start'` si no. Luego `flash(el)`, y enfoca el primer `.case-title, .idx-name, .toc-title` de adentro con `tabindex="-1"` y `focus({ preventScroll: true })`. `flash` quita `is-flash`, fuerza un reflow, la vuelve a poner y la quita a los 2300 ms; un segundo `flash` cancela el temporizador anterior. `useJumpLinks` escucha clics en `document`: si el clic cae en un `a[href^="#"]` cuyo id es destino de una estación, cancela la navegación y llama a `jumpTo`. `useInitialHash`, al montar, lee `location.hash`: si nombra una estación llama a `jumpTo(id, { instant: true })`, y si nombra otro elemento llama a su `scrollIntoView({ block: 'start' })`. `mexicoCityTime` usa `Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'America/Mexico_City' })`.

- [ ] **Paso 1: Escribir las pruebas que fallan**

`src/lib/time.test.js`:

```js
import { expect, test } from 'vitest';
import { mexicoCityTime } from './time';

test('formats the time in Mexico City, which has no daylight saving', () => {
  expect(mexicoCityTime(new Date('2026-10-29T18:05:00Z'))).toEqual({ h: '12', m: '05' });
  expect(mexicoCityTime(new Date('2026-07-01T00:30:00Z'))).toEqual({ h: '18', m: '30' });
  expect(mexicoCityTime(new Date('2026-10-29T06:00:00Z'))).toEqual({ h: '00', m: '00' });
});
```

`src/lib/jump.test.jsx`:

```jsx
import { fireEvent, render } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import { jumpTo, useInitialHash, useJumpLinks } from './jump';
import { scrollIntoView, setMedia } from '../test/browser';

const PAGE = `
  <article id="lienzo" class="case"><header class="case-head"><h3 class="case-title">Lienzo</h3></header></article>
  <ol class="toc"><li id="a-04"><a class="toc-line" href="https://example.com/"><span class="toc-title">Spotify Analysis</span></a></li></ol>
  <section id="experience"></section>
  <a href="#a-04">to spotify</a><a href="#experience">to experience</a>`;

function Links() { useJumpLinks(); return <div dangerouslySetInnerHTML={{ __html: PAGE }} />; }
function Hash() { useInitialHash(); return <div dangerouslySetInnerHTML={{ __html: PAGE }} />; }

afterEach(() => {
  history.replaceState(null, '', '/');
  document.body.innerHTML = '';
});

test('jumpTo scrolls to a case, flashes it and focuses its title', () => {
  document.body.innerHTML = PAGE;
  const el = document.getElementById('lienzo');
  expect(jumpTo('lienzo')).toBe(true);
  expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
  expect(scrollIntoView.mock.contexts[0]).toBe(el);
  expect(el).toHaveClass('is-flash');
  expect(document.activeElement).toBe(el.querySelector('.case-title'));
});

test('archive rows are centred, and reduced motion scrolls at once', () => {
  setMedia({ reducedMotion: true });
  document.body.innerHTML = PAGE;
  jumpTo('spotify');
  expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'center' });
  expect(document.activeElement).toHaveTextContent('Spotify Analysis');
});

test('the flash clears after 2.3 s and restarts on a second jump', () => {
  vi.useFakeTimers();
  document.body.innerHTML = PAGE;
  const el = document.getElementById('lienzo');
  jumpTo('lienzo');
  vi.advanceTimersByTime(2000);
  jumpTo('lienzo');
  vi.advanceTimersByTime(2000);
  expect(el).toHaveClass('is-flash');
  vi.advanceTimersByTime(400);
  expect(el).not.toHaveClass('is-flash');
});

test('jumpTo returns false when the station is not on the page', () => {
  expect(jumpTo('glosa')).toBe(false);
  expect(scrollIntoView).not.toHaveBeenCalled();
});

test('in-page links to a station become jumps', () => {
  render(<Links />);
  expect(fireEvent.click(document.querySelector('a[href="#a-04"]'))).toBe(false);
  expect(scrollIntoView.mock.contexts[0]).toBe(document.getElementById('a-04'));
});

test('links to plain sections keep the browser default', () => {
  render(<Links />);
  expect(fireEvent.click(document.querySelector('a[href="#experience"]'))).toBe(true);
  expect(scrollIntoView).not.toHaveBeenCalled();
});

test('a shared link to a station scrolls there on load', () => {
  history.replaceState(null, '', '/#lienzo');
  render(<Hash />);
  expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' });
  expect(scrollIntoView.mock.contexts[0]).toBe(document.getElementById('lienzo'));
});

test('a shared link to a plain section scrolls there on load', () => {
  history.replaceState(null, '', '/#experience');
  render(<Hash />);
  expect(scrollIntoView.mock.contexts[0]).toBe(document.getElementById('experience'));
});
```

- [ ] **Paso 2: Correrlas y ver que fallan**

Run: `npx vitest run src/lib`
Esperado: FAIL, los módulos no existen.

- [ ] **Paso 3: Escribir `media.js`, `jump.js` y `time.js`, y llamar a los dos hooks desde `App`**

- [ ] **Paso 4: Correr las pruebas**

Run: `npx vitest run`
Esperado: PASS.

- [ ] **Paso 5: Commit**

```bash
git add bubudavid
git commit -m "feat: jumps to stations, shared links with anchors and the Mexico City clock"
```

---

### Tarea 4: Piezas compartidas, cabecera, barra fija y portada

**Archivos:**
- Crear: `src/components/shared/{Icon,ExternalLink,LineBadge,IndexLines,PartHead}.jsx`, `TopNav/TopNav.{jsx,css}`, `Masthead/{Masthead,Nameplate}.jsx`, `Masthead/Masthead.css`, `Cover/Cover.{jsx,css}`
- Modificar: `src/App.jsx`
- Pruebas: `TopNav/TopNav.test.jsx`, `Masthead/Masthead.test.jsx`, `Cover/Cover.test.jsx`

**Interfaces:**
- Consume: `profile.js`, `NOW`, `STATS`, `EMAIL`, `CASES`, `STATIONS`, `linesText`.
- Produce, para las tareas siguientes:
  - `Icon({ name })`, con `name` en `'ne' | 'gh' | 'in' | 'mail'`: un `<svg class="ico" aria-hidden="true" focusable="false">` con el trazo del `<symbol>` del prototipo (675–678).
  - `ExternalLink({ href, className, children })`: `<a target="_blank" rel="noreferrer">`, los hijos y `<span class="sr-only"> (opens in a new tab)</span>`.
  - `LineBadge({ n, small = false })`: `<span class="badge[ sm]" style="--c:var(--lN);--ci:var(--lN-ink)" aria-hidden="true">{n}</span>`.
  - `IndexLines({ lines })`: `<span class="ix-lines" role="img" aria-label={linesText(lines)}>` con un `<i>` por línea, como la línea 725.
  - `PartHead({ id, no, title, folio, as = 'div', className, children })`: el encabezado de parte de 787–794. `children` es el texto de la entradilla. `as="header"` y `className="wrap"` son para la Parte I (829).
- `TopNav()` es la barra de 688–699. Aparece (`is-on`) cuando `#top` sale de la vista: un `IntersectionObserver` con `rootMargin: '-40px 0px 0px 0px'`. Marca con `is-here` el link de la sección que cruza la mitad de la pantalla: otro con `rootMargin: '-45% 0px -50% 0px'`. Sin `IntersectionObserver`, siempre visible (prototipo 2047–2062).
- `Masthead()` es la cabecera de 702–737. El índice tiene páginas fijas para Cover story 02, The network map 04, Also on the network 30, Lab archive · 2019–2022 34, Experience 42 y Next stop 44. Las tres entradas de casos salen de `CASES` (página con dos dígitos) con `IndexLines` de las líneas de cada estación. `Nameplate` ajusta el tamaño de "BUBU" a su columna, como 1492–1516.
- `Cover()` es la portada de 742–783. La foto usa `srcSet="/assets/pp-640.jpg 640w, /assets/pp.jpg 960w"` y `sizes="(min-width: 1024px) 40vw, 100vw"`.

- [ ] **Paso 1: Escribir las pruebas que fallan**

`Masthead/Masthead.test.jsx`:

```jsx
import { render, screen, within } from '@testing-library/react';
import { expect, test } from 'vitest';
import Masthead from './Masthead';

test('the masthead names the person and indexes the issue', () => {
  render(<Masthead />);
  expect(screen.getByRole('heading', { level: 1, name: 'Bubu, the portfolio of David Pedroza Segoviano' })).toBeInTheDocument();
  const links = within(screen.getByRole('navigation', { name: 'In this issue' })).getAllByRole('link');
  expect(links.map(a => a.getAttribute('href'))).toEqual(
    ['#cover', '#map', '#pulso', '#lienzo', '#glosa', '#also', '#archive', '#experience', '#contact']);
  expect(within(links[2]).getByRole('img', { name: 'Lines 1, 2 and 4' })).toBeInTheDocument();
});
```

`TopNav/TopNav.test.jsx`:

```jsx
import { act, render, screen, within } from '@testing-library/react';
import { expect, test } from 'vitest';
import TopNav from './TopNav';
import Masthead from '../Masthead/Masthead';
import { intersect } from '../../test/browser';

test('the bar appears once the masthead scrolls away and marks the current section', () => {
  render(<><TopNav /><Masthead /><section id="work" /></>);
  const nav = screen.getByRole('navigation', { name: 'Sections' });
  expect(nav).not.toHaveClass('is-on');
  act(() => intersect(document.getElementById('top'), false));
  expect(nav).toHaveClass('is-on');
  act(() => intersect(document.getElementById('work'), true));
  expect(within(nav).getByRole('link', { name: 'Work' })).toHaveClass('is-here');
});
```

`Cover/Cover.test.jsx`:

```jsx
import { render, screen, within } from '@testing-library/react';
import { expect, test } from 'vitest';
import Cover from './Cover';
import { NOW } from '../../content/work';

test('the cover states the pitch, the current job and four numbers', () => {
  render(<Cover />);
  expect(screen.getByRole('heading', { level: 2, name: /^I build the layer between a company's data and the people who act on.it\.$/ })).toBeInTheDocument();
  expect(screen.getByText(NOW)).toBeInTheDocument();
  const numbers = within(screen.getByRole('complementary', { name: 'By the numbers' }));
  expect(numbers.getAllByRole('definition').map(dd => dd.textContent)).toEqual(['4+', '6', '1,400', '3']);
  expect(screen.getByRole('img', { name: /^David Pedroza Segoviano/ })).toHaveAttribute('srcset', '/assets/pp-640.jpg 640w, /assets/pp.jpg 960w');
});
```

- [ ] **Paso 2: Correrlas y ver que fallan**

Run: `npx vitest run src/components`
Esperado: FAIL, los componentes no existen.

- [ ] **Paso 3: Escribir las piezas compartidas, `TopNav`, `Masthead`, `Nameplate` y `Cover`, con su CSS según la tabla**

`App` queda: `<TopNav />`, `<Masthead />`, `<main><Cover /></main>`.

- [ ] **Paso 4: Correr las pruebas**

Run: `npx vitest run`
Esperado: PASS.

- [ ] **Paso 5: Commit**

```bash
git add bubudavid
git commit -m "feat: masthead, sticky nav and cover story"
```

---

### Tarea 5: El mapa horizontal

**Archivos:**
- Crear: `src/components/shared/pictograms.js`, `shared/Pictogram.jsx`, `NetworkMap/{NetworkMap,HorizontalMap,MapTooltip}.jsx`, `NetworkMap/metroPath.js`, `NetworkMap/NetworkMap.css`
- Modificar: `src/App.jsx` (agrega `<NetworkMap />` después de `<Cover />`)
- Pruebas: `NetworkMap/metroPath.test.js`, `NetworkMap/NetworkMap.test.jsx`

**Interfaces:**
- Consume: `LINES`, `STATIONS`, `ROUTES`, todo `map-layout.js`, `stationLabel`, `displayName`, `shortLine`, `jumpTo`, `useIsMobile`, `LineBadge`, `PartHead`.
- Produce:
  - `ICONS` en `pictograms.js` (prototipo 1538–1553).
  - `Pictogram({ id, x = 0, y = 0, size })`: el fragmento SVG de `tile()` (1641–1653) para usar dentro de otro SVG. `PictogramIcon({ id, className = 'vico' })`: un `<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">` con `<Pictogram id size={32} />`. El archivo los usa en la Tarea 8.
  - `metroPath(points: Array<[x, y]>, radius: number): string` (1659–1671).
  - `NetworkMap()`: la sección `#map` de 786–825, con el estado de la línea fija, la línea bajo el cursor y la etiqueta.
  - `HorizontalMap({ isDim, onActivate, onTip })`, con `isDim(lines: number[]): boolean`, `onActivate(id)` y `onTip(id | null, el?)`.
  - `MapTooltip({ id, anchor, cardRef })`.

**Comportamiento:**
- `HorizontalMap` dibuja lo mismo que `renderH()` (1757–1797): zonas, eje de años 2019–2026, graduación, HOY, encabezados de zona, cada línea en dos trazos recortados por `clipLab` y `clipWork`, las insignias de `TERMINI`, una estación por entrada de `HPOS` como en `hStation()` (1709–1737), la correspondencia como en `hPulso()` con las medidas de `XFER`, y el trayecto y el punto del tren con `data-train-path` y `data-train-dot`. La estación de correspondencia lleva `data-train-stop`.
- Cada estación es un `<g class="stn {kind}[ xfer]" role="button" tabIndex={0} aria-label={stationLabel(id)} data-id data-lines>`. Todo elemento con `data-lines` (estaciones, grupos de línea, insignias) recibe `is-dim` cuando `isDim(lines)`.
- Clic, Enter o Espacio en una estación llaman a `onActivate(id)`; Espacio cancela el desplazamiento por omisión. `NetworkMap` responde cerrando la etiqueta y llamando a `jumpTo(id)`.
- Las cuatro fichas de línea son `<button class="lchip" aria-pressed aria-label="Line {n}, {LINES[n].name}">`, con `LineBadge` y `LINES[n].chip` de texto visible. Entrar con el cursor o con el foco resalta esa línea; salir quita el resaltado. El clic fija o suelta la línea y además borra el resaltado temporal, como `setHL(pinned)` en 1874–1880. La línea activa es la temporal o, si no hay, la fija.
- La etiqueta aparece con `pointerover` o `focus` sobre una estación y se va con `pointerout` (al salir de la estación), `blur` o desplazamiento de `#map-scroll`. Su contenido y su posición son los de `showTip()` (2007–2020), medidos en `useLayoutEffect`. Cuando no hay etiqueta, el elemento lleva `hidden`.
- Un `ResizeObserver` sobre `#map-scroll` pone `is-overflowing` en la tarjeta cuando `scrollWidth > clientWidth + 2` (2065–2068), para mostrar la pista "Scroll the map sideways".
- En esta tarea `NetworkMap` siempre dibuja el mapa horizontal. La Tarea 6 agrega el vertical.

- [ ] **Paso 1: Escribir las pruebas que fallan**

`NetworkMap/metroPath.test.js`:

```js
import { expect, test } from 'vitest';
import { metroPath } from './metroPath';

test('metroPath rounds each corner with a quadratic curve', () => {
  expect(metroPath([[0, 0], [100, 0], [100, 100]], 16)).toBe('M0 0 L84.0 0.0 Q100 0 100.0 16.0 L100 100');
  expect(metroPath([[0, 0], [50, 0]], 16)).toBe('M0 0 L50 0');
});
```

`NetworkMap/NetworkMap.test.jsx`:

```jsx
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';
import NetworkMap from './NetworkMap';
import { scrollIntoView } from '../../test/browser';

const station = id => document.querySelector(`#hmap .stn[data-id="${id}"]`);

test('draws all fourteen stations as buttons with spoken labels', () => {
  render(<NetworkMap />);
  expect(within(document.getElementById('hmap')).getAllByRole('button')).toHaveLength(14);
  expect(station('pulso')).toHaveAccessibleName('Pulso. Work station, Backend & AI lead, 2024 – now. Lines 1, 2 and 4. Jump to its write-up.');
});

test('a line chip pins that line and dims the stations off it', async () => {
  const user = userEvent.setup();
  render(<NetworkMap />);
  const chip = screen.getByRole('button', { name: 'Line 2, Data & insight' });
  await user.click(chip);
  expect(chip).toHaveAttribute('aria-pressed', 'true');
  expect(station('spotwipy')).toHaveClass('is-dim');
  expect(station('lienzo')).not.toHaveClass('is-dim');
  expect(station('pulso')).not.toHaveClass('is-dim');
  await user.click(chip);
  expect(chip).toHaveAttribute('aria-pressed', 'false');
  expect(station('spotwipy')).not.toHaveClass('is-dim');
});

test('Enter on a station jumps to its write-up and moves focus there', async () => {
  const user = userEvent.setup();
  render(<><NetworkMap /><article id="lienzo" className="case"><h3 className="case-title">Lienzo</h3></article></>);
  act(() => station('lienzo').focus());
  await user.keyboard('{Enter}');
  expect(scrollIntoView.mock.contexts[0]).toBe(document.getElementById('lienzo'));
  expect(document.activeElement).toHaveTextContent('Lienzo');
});

test('Space jumps too, and a station whose section is missing does nothing', async () => {
  const user = userEvent.setup();
  render(<><NetworkMap /><ol className="toc"><li id="a-08"><span className="toc-title">Bubufy</span></li></ol></>);
  act(() => station('bubufy').focus());
  await user.keyboard(' ');
  expect(scrollIntoView.mock.contexts[0]).toBe(document.getElementById('a-08'));
  await user.click(station('glosa'));
  expect(scrollIntoView).toHaveBeenCalledTimes(1);
});

test('focusing a station shows its tooltip and leaving hides it', () => {
  render(<NetworkMap />);
  act(() => station('glosa').focus());
  const tip = screen.getByRole('tooltip');
  expect(tip).toHaveTextContent('Glosa');
  expect(tip).toHaveTextContent('A semantic layer, as code');
  expect(tip).toHaveTextContent('Work · 2024 – now · see the write-up');
  act(() => station('glosa').blur());
  expect(screen.queryByRole('tooltip')).toBeNull();
});
```

- [ ] **Paso 2: Correrlas y ver que fallan**

Run: `npx vitest run src/components/NetworkMap`
Esperado: FAIL, los módulos no existen.

- [ ] **Paso 3: Escribir `pictograms.js`, `Pictogram.jsx`, `metroPath.js`, `HorizontalMap`, `MapTooltip` y `NetworkMap`, con `NetworkMap.css` según la tabla**

- [ ] **Paso 4: Correr las pruebas**

Run: `npx vitest run`
Esperado: PASS.

- [ ] **Paso 5: Commit**

```bash
git add bubudavid
git commit -m "feat: the network map, with line highlight, tooltips and jumps"
```

---

### Tarea 6: El mapa vertical, el tren y el cambio de tamaño

**Archivos:**
- Crear: `NetworkMap/VerticalMap.jsx`, `NetworkMap/useTrain.js`
- Modificar: `NetworkMap/NetworkMap.jsx`
- Prueba: `NetworkMap/VerticalMap.test.jsx`

**Interfaces:**
- Consume: lo mismo que la Tarea 5, más `PictogramIcon`, `useIsMobile`, `usePrefersReducedMotion`.
- Produce:
  - `VerticalMap({ isDim, onActivate })`: `div.vmap#vmap` con `svg#vsvg` y `ol.vlist#vlist aria-label="Stations, oldest first"`.
  - `useTrain(cardRef, { isMobile, reducedMotion }): void`.

**Comportamiento:**
- La lista sigue `VORDER` como `buildVList()` (1803–1815). `@lab` y `@work` son `li.vhead`; `@grad` es `li.vgrad#v-grad`; cada estación es un `button.vstn` con `PictogramIcon`, nombre y una línea de detalle: para la correspondencia `${period} · Correspondencia ${lines.join(' · ')}`, para trabajo `${period} · ${role}`, para el Lab `Lab · ${tags.slice(0, 2).join(', ')}`. Clic llama a `onActivate(id)`.
- La capa SVG es la de `drawV()` (1817–1858). Mide en `useLayoutEffect` el centro vertical de cada botón y de `#v-grad`, y el alto de la lista; dibuja con eso y pone `viewBox="0 0 92 {alto}"`. Vuelve a medir cuando el `ResizeObserver` de `#vlist` avisa y cuando `document.fonts.ready` se resuelve. No se porta la guarda `offsetParent === null`: el componente solo existe en celular.
- `NetworkMap` dibuja `VerticalMap` cuando `useIsMobile()` es verdadero y `HorizontalMap` cuando no. Al pasar a celular cierra la etiqueta.
- `useTrain` porta 1885–1918. Arranca cuando la tarjeta (`#map-card`) está al menos 25 % a la vista (`IntersectionObserver` con `threshold: 0.25`) y se detiene cuando sale. Con movimiento reducido no corre. Busca `[data-train-path]`, `[data-train-dot]` y `[data-train-stop]` dentro de la tarjeta, así sirve para los dos mapas. Reinicia cuando cambia `isMobile` o `reducedMotion`, y al desmontarse cancela el `requestAnimationFrame` y los temporizadores. Duración: 5200 ms en celular y 6800 ms en escritorio.

- [ ] **Paso 1: Escribir las pruebas que fallan**

`NetworkMap/VerticalMap.test.jsx`:

```jsx
import { act, render, screen, within } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import NetworkMap from './NetworkMap';
import { VORDER } from '../../content/map-layout';
import { intersect, resizeObserved, setMedia } from '../../test/browser';

test('on a phone the map is a list of stations, oldest first', () => {
  setMedia({ mobile: true });
  render(<NetworkMap />);
  expect(document.getElementById('hmap')).toBeNull();
  const list = screen.getByRole('list', { name: 'Stations, oldest first' });
  expect(within(list).getAllByRole('button').map(b => b.dataset.id)).toEqual(VORDER.filter(id => !id.startsWith('@')));
  expect(within(list).getByRole('button', { name: /^Pulso\./ })).toHaveTextContent('2024 – now · Correspondencia 1 · 2 · 4');
});

test('turning the phone hides an open tooltip and draws the vertical map', () => {
  render(<NetworkMap />);
  act(() => document.querySelector('#hmap .stn[data-id="ruta"]').focus());
  expect(screen.getByRole('tooltip')).toBeInTheDocument();
  act(() => setMedia({ mobile: true }));
  expect(screen.queryByRole('tooltip')).toBeNull();
  expect(screen.getByRole('list', { name: 'Stations, oldest first' })).toBeInTheDocument();
});

test('the vertical map is redrawn when the list changes size', () => {
  setMedia({ mobile: true });
  render(<NetworkMap />);
  const svg = document.getElementById('vsvg');
  const before = svg.getAttribute('viewBox');
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(40);
  act(() => resizeObserved(document.getElementById('vlist')));
  expect(svg.getAttribute('viewBox')).not.toBe(before);
});

test('the train runs only while the map is on screen', () => {
  const raf = vi.spyOn(window, 'requestAnimationFrame');
  render(<NetworkMap />);
  expect(raf).not.toHaveBeenCalled();
  act(() => intersect(document.getElementById('map-card'), true));
  expect(raf).toHaveBeenCalled();
});

test('with reduced motion the train never runs', () => {
  setMedia({ reducedMotion: true });
  const raf = vi.spyOn(window, 'requestAnimationFrame');
  render(<NetworkMap />);
  act(() => intersect(document.getElementById('map-card'), true));
  expect(raf).not.toHaveBeenCalled();
});
```

- [ ] **Paso 2: Correrlas y ver que fallan**

Run: `npx vitest run src/components/NetworkMap/VerticalMap.test.jsx`
Esperado: FAIL, `VerticalMap` no existe y el mapa no cambia en celular.

- [ ] **Paso 3: Escribir `VerticalMap`, `useTrain` y los cambios en `NetworkMap`**

- [ ] **Paso 4: Correr las pruebas**

Run: `npx vitest run`
Esperado: PASS, incluidas las de la Tarea 5.

- [ ] **Paso 5: Commit**

```bash
git add bubudavid
git commit -m "feat: vertical map for phones and the Line 1 train"
```

---

### Tarea 7: Los casos de estudio

**Archivos:**
- Crear: `CaseStudy/{SelectedWork,CaseStudy,RouteStrip}.jsx`, `CaseStudy/CaseStudy.css`, `figures/{PulsoFigure,LienzoFigure,GlosaFigure}.jsx`, `figures/index.js`, `figures/figures.css`
- Modificar: `src/App.jsx` (agrega `<SelectedWork />` después de `<NetworkMap />`)
- Prueba: `CaseStudy/CaseStudy.test.jsx`

**Interfaces:**
- Consume: `CASES`, `SECTION_COPY`, `LINES`, `ROUTES`, `STATIONS`, `displayName`, `routeName`, `linesText`, `targetId`, `jumpTo`, `LineBadge`, `PartHead`.
- Produce:
  - `SelectedWork()`: `section.part#work` con `PartHead as="header" className="wrap"` (no `Part I`, título `Selected work`, id `work-h`, folio `pp. 06–29`, texto `SECTION_COPY.work`) y un `CaseStudy` por entrada de `CASES`.
  - `CaseStudy({ id })`: `article.case.wrap#{id}`, con `case--flip` o `case--wide` según `layout`, y el marcado de 839–955.
  - `RouteStrip({ caseId })`: la tira de `caseRoute()` (1968–1997).
  - `figureFor(id)` en `figures/index.js`: el componente de figura del caso, o `null`.
  - `PulsoFigure`, `LienzoFigure`, `GlosaFigure`: las `<figure>` de 884–947, 1006–1076 y 1132–1188 en JSX. Cada archivo empieza con `// RELLENO: figura de un proyecto inventado.`

**Comportamiento:**
- `CaseStudy`, en orden: `RouteStrip`; riel con `no` y `Case study` + `p. {página con dos dígitos}`; cabecera con las insignias de las líneas de la estación (`span.kick-lines`) y `{role} · {period}` en el kicker, el título `h3.case-title#{id}-h` y `standfirst`; nota al margen con una frase por cada `grew`: `<a class="ln" href="#{targetId(lab)}">{displayName(lab)}</a>, {nota con minúscula inicial}.` y `<span class="see">Archive Nº {no}, p. {33 + no}</span>`; las tres secciones Problem, Approach y Outcome (i., ii., iii.), con la llamada de nota `k` (posición del caso + 1) al final de Approach y la clase `end` en Outcome; el bloque de cifra (forma "de → a" o forma "valor", ver 875–882 y 994–1004) con `mini`; la figura de `figureFor(id)` si existe; y las notas: `Stack: {stack.join(', ')}.` con su enlace de regreso, y `<p class="to-map"><a href="#map">↑ Back to the map</a></p>`.
- `RouteStrip`: línea `routeLine` del caso, paradas `ROUTES[n]`. Cada `li` lleva `seg-lab` si la siguiente parada es del Lab, o `seg-grad` si esta es del Lab y la siguiente no. Cada parada es un `button.r-stop.{kind}` que llama a `jumpTo(id)`; la del caso lleva `aria-current="location"` y `<span class="r-here">You are here</span>`. Si la estación del caso está en más líneas, agrega `Correspondencia: {linesText(otras)} also stop here ({nombres de esas líneas separados por coma}).`

- [ ] **Paso 1: Escribir las pruebas que fallan**

`CaseStudy/CaseStudy.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import CaseStudy from './CaseStudy';
import RouteStrip from './RouteStrip';
import { figureFor } from '../figures';

test('the route strip shows the line a case rode in on', () => {
  render(<RouteStrip caseId="lienzo" />);
  const stops = screen.getAllByRole('button');
  expect(stops.map(b => b.querySelector('.r-name').firstChild.textContent))
    .toEqual(['Spotify Analysis', 'Color Picker', 'Gemelos', 'Pulso', 'Lienzo']);
  expect(stops[4]).toHaveAttribute('aria-current', 'location');
  expect(stops[4]).toHaveTextContent('You are here');
  const items = screen.getAllByRole('listitem');
  expect(items[0]).toHaveClass('seg-lab');
  expect(items[1]).toHaveClass('seg-grad');
});

test('the Pulso strip names the other lines that stop there', () => {
  render(<RouteStrip caseId="pulso" />);
  expect(screen.getByText('Correspondencia: Lines 2 and 4 also stop here (Data & insight, APIs & platforms).')).toBeInTheDocument();
});

test('a case study has its kicker, lineage, footnote and figure', () => {
  render(<CaseStudy id="glosa" />);
  expect(screen.getByRole('article', { name: 'Glosa' })).toHaveClass('case--wide');
  expect(screen.getByText('Core engineer · 2024 – now')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Bubufy' })).toHaveAttribute('href', '#a-08');
  expect(screen.getByText('Archive Nº 08, p. 41')).toBeInTheDocument();
  expect(screen.getByText('Stack: Python, FastAPI, SQLGlot, Typer, Next.js, Docker.')).toBeInTheDocument();
  expect(screen.getByText('Fig. 4')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: '↑ Back to the map' })).toHaveAttribute('href', '#map');
});

test('only the three case studies have figures', () => {
  expect(figureFor('pulso')).not.toBeNull();
  expect(figureFor('ruta')).toBeNull();
});
```

- [ ] **Paso 2: Correrlas y ver que fallan**

Run: `npx vitest run src/components/CaseStudy`
Esperado: FAIL, los módulos no existen.

- [ ] **Paso 3: Escribir las figuras, `RouteStrip`, `CaseStudy` y `SelectedWork`, con su CSS según la tabla**

- [ ] **Paso 4: Correr las pruebas y el guardia**

Run: `npx vitest run && node scripts/check-placeholders.mjs; echo "exit $?"`
Esperado: PASS, y el guardia lista también las tres figuras con `RELLENO`, con `exit 1`.

- [ ] **Paso 5: Commit**

```bash
git add bubudavid
git commit -m "feat: case studies with route strips and figures"
```

---

### Tarea 8: "Also on the network" y el archivo del Lab

**Archivos:**
- Crear: `AlsoIndex/AlsoIndex.{jsx,css}`, `Archive/Archive.{jsx,css}`
- Modificar: `src/App.jsx` (agrega `<AlsoIndex />` y `<Archive />` después de `<SelectedWork />`)
- Pruebas: `AlsoIndex/AlsoIndex.test.jsx`, `Archive/Archive.test.jsx`

**Interfaces:**
- Consume: `ALSO`, `SECTION_COPY`, `LAB`, `LINES`, `LINE_IDS`, `STATIONS`, `displayName`, `targetId`, `grewInto`, `archiveLine`, `LineBadge`, `PartHead`, `PictogramIcon`, `ExternalLink`, `Icon`.
- Produce:
  - `AlsoIndex()`: `section.part.wrap#also` con `PartHead` (no `Part II`, título `Also on the network`, folio `pp. 30–33`, texto `SECTION_COPY.also`) y la tabla de 1210–1256, una fila por entrada de `ALSO`. El `h3.idx-name` lleva las insignias de las líneas de la estación. `idx-line` es `{tagline}.` y `idx-grew` es `Grew from {A}` o `Grew from {A} and {B}`, con enlaces a `#{targetId(lab)}`.
  - `Archive()`: `section.part.wrap#archive` con `PartHead` (no `Part III`, título `Archive · 2019–2022`, folio `pp. 34–41`, texto de la línea 1266) y una `section.toc-sec` por línea, como 1270–1355. El encabezado es `LineBadge small`, `Línea {n} · {LINES[n].name}` y, si `archiveLine(n).into` no está vacío, `<small>→ {nombres separados por ' · '}</small>`.
  - `ArchiveItem({ item })`, exportado para las pruebas: el `li#a-{no}` de 1274–1281. El enlace principal va a `labLink(item).href`; `toc-pg` es `33 + no`; `toc-host` es `labLink(item).host`; agrega `<span class="toc-off">Demo offline</span>` si `demoOffline`, un segundo enlace `Code` si tiene `demo` y `source`, y un `Grew into {nombre}` por cada `grewInto(id)`.
  - `labLink(item): { href, host }`: `href` es `demo ?? source`; `host` es `href` sin protocolo ni `/` final.

- [ ] **Paso 1: Escribir las pruebas que fallan**

`Archive/Archive.test.jsx`:

```jsx
import { render, screen, within } from '@testing-library/react';
import { expect, test } from 'vitest';
import Archive, { ArchiveItem } from './Archive';
import { LAB } from '../../content/lab';

test('the archive groups the eight lab projects by line', () => {
  render(<Archive />);
  const headings = screen.getAllByRole('heading', { level: 3 });
  expect(headings).toHaveLength(4);
  expect(headings[1]).toHaveTextContent('Línea 2 · Data & insight→ Gemelos · Lienzo');
  expect(document.querySelectorAll('.toc > li')).toHaveLength(8);
  expect(screen.getAllByText('Demo offline')).toHaveLength(3);
  expect(screen.getByRole('link', { name: /^Spotwipy/ })).toHaveAttribute('href', 'https://github.com/BubuDavid/SpoTwipy');
  expect(within(document.getElementById('a-02')).getByRole('link', { name: 'Grew into Ruta' })).toHaveAttribute('href', '#ruta');
  expect(within(document.getElementById('a-07')).queryByText(/Grew into/)).toBeNull();
});

test('an item with a demo and its code links to both', () => {
  const item = { ...LAB.find(p => p.id === 'resume'), source: 'https://github.com/BubuDavid/Resume' };
  render(<ol className="toc"><ArchiveItem item={item} /></ol>);
  expect(screen.getByRole('link', { name: /^Resume/ })).toHaveAttribute('href', 'https://bubudavid.github.io/Resume/');
  expect(screen.getByRole('link', { name: /^Code/ })).toHaveAttribute('href', 'https://github.com/BubuDavid/Resume');
  expect(screen.getByText('bubudavid.github.io/Resume')).toBeInTheDocument();
});
```

`AlsoIndex/AlsoIndex.test.jsx`:

```jsx
import { render, screen, within } from '@testing-library/react';
import { expect, test } from 'vitest';
import AlsoIndex from './AlsoIndex';

test('three more systems, each with its lineage and result', () => {
  render(<AlsoIndex />);
  const rows = screen.getAllByRole('row').slice(1);
  expect(rows.map(r => r.id)).toEqual(['ruta', 'gemelos', 'mensajero']);
  const ruta = within(rows[0]);
  expect(ruta.getByRole('heading', { level: 3 })).toHaveTextContent('Ruta');
  expect(ruta.getByRole('link', { name: 'DCI · Hacedor de Horarios' })).toHaveAttribute('href', '#a-02');
  expect(ruta.getByRole('link', { name: 'RRT Bidirectional Dijkstra' })).toHaveAttribute('href', '#a-03');
  expect(ruta.getByText('18%')).toBeInTheDocument();
});
```

- [ ] **Paso 2: Correrlas y ver que fallan**

Run: `npx vitest run src/components/Archive src/components/AlsoIndex`
Esperado: FAIL, los módulos no existen.

- [ ] **Paso 3: Escribir `AlsoIndex` y `Archive`, con su CSS según la tabla**

- [ ] **Paso 4: Correr las pruebas**

Run: `npx vitest run`
Esperado: PASS.

- [ ] **Paso 5: Commit**

```bash
git add bubudavid
git commit -m "feat: brief entries and the lab archive grouped by line"
```

---

### Tarea 9: Tablero, contacto, colofón y la página completa

**Archivos:**
- Crear: `Timetable/Timetable.{jsx,css}`, `Contact/Contact.{jsx,css}`, `Colophon/Colophon.{jsx,css}`
- Modificar: `src/App.jsx`, `src/App.test.jsx`
- Prueba: `Timetable/Timetable.test.jsx`

**Interfaces:**
- Consume: `TIMELINE`, `SECTION_COPY`, `EMAIL`, `SKILLS`, `OPEN_TO`, `LINKS`, `ISSUE`, `useMexicoCityTime`, `linesText`, `LineBadge`, `PartHead`, `ExternalLink`, `Icon`.
- Produce:
  - `Timetable()`: `section.part.wrap#experience` con `PartHead` (no `Part IV · Horarios`, título `Experience`, folio `pp. 42–43`, texto `SECTION_COPY.experience`) y `div.g12.tt-grid` con el tablero de 1370–1402 y el Toolkit de 1404–1413. El reloj del tablero muestra `useMexicoCityTime()`. Cada fila de `TIMELINE` lleva sus insignias en `.t-lines` con `aria-label={linesText(lines)}`; `status: 'on'` es `<span class="status on">En servicio</span>` y `'arrived'` es `<span class="status">Llegó · Arrived</span>`.
  - `Contact()`: `section.dest.wrap#contact` de 1418–1437. El texto es `Open to {OPEN_TO con minúscula inicial}. Letters to the editor are welcome.` y la hora va en `.dest-clock`.
  - `Colophon()`: `footer.colophon.wrap#colophon` de 1442–1467. En el texto, la frase "I drew the map and every figure in SVG and CSS, without frameworks." queda como "I drew the map and every figure in SVG and CSS." El pie usa `ISSUE` y `© {año actual} David "Bubu" Pedroza Segoviano 🦕`.
- Orden final de `App`: `TopNav`, `Masthead`, `main` (`Cover`, `NetworkMap`, `SelectedWork`, `AlsoIndex`, `Archive`, `Timetable`, `Contact`), `Colophon`.

- [ ] **Paso 1: Escribir las pruebas que fallan**

`Timetable/Timetable.test.jsx`:

```jsx
import { render, screen, within } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import Timetable from './Timetable';

test('the departures board lists every service with the time in Mexico City', () => {
  vi.useFakeTimers({ toFake: ['Date', 'setInterval', 'clearInterval'] });
  vi.setSystemTime(new Date('2026-10-29T18:05:00Z'));
  render(<Timetable />);
  const rows = within(screen.getByRole('table', { name: 'Experience timeline' })).getAllByRole('row').slice(1);
  expect(rows).toHaveLength(3);
  expect(within(rows[0]).getByText('En servicio')).toHaveClass('status', 'on');
  expect(within(rows[0]).getByText('Ceiba Data')).toBeInTheDocument();
  expect(screen.getByLabelText('Current time in Mexico City')).toHaveTextContent('12:05');
});
```

Reemplazar `src/App.test.jsx`:

```jsx
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';
import App from './App';
import { scrollIntoView } from './test/browser';

test('the page has every section, in order', () => {
  render(<App />);
  const ids = [...document.querySelectorAll('#top, main > section, main > section > article, #colophon')].map(el => el.id);
  expect(ids).toEqual(['top', 'cover', 'map', 'work', 'pulso', 'lienzo', 'glosa', 'also', 'archive', 'experience', 'contact', 'colophon']);
});

test('a station on the map takes you to its section', async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(document.querySelector('#hmap .stn[data-id="glosa"]'));
  expect(scrollIntoView.mock.contexts.at(-1)).toBe(document.getElementById('glosa'));
  expect(document.activeElement).toHaveTextContent('Glosa');
});

test('a "grew from" link takes you to the archive row', async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(within(document.getElementById('lienzo')).getByRole('link', { name: 'Spotify Analysis' }));
  expect(scrollIntoView.mock.contexts.at(-1)).toBe(document.getElementById('a-04'));
});

test('the footer keeps the old line and the contact section links the email', () => {
  render(<App />);
  expect(screen.getByText('Made with 💖 in 🇲🇽🌮')).toBeInTheDocument();
  expect(within(document.getElementById('contact')).getAllByRole('link', { name: /hola@bubudavid\.me/ })[0])
    .toHaveAttribute('href', 'mailto:hola@bubudavid.me');
});
```

- [ ] **Paso 2: Correrlas y ver que fallan**

Run: `npx vitest run src/App.test.jsx src/components/Timetable`
Esperado: FAIL, faltan las secciones finales.

- [ ] **Paso 3: Escribir `Timetable`, `Contact` y `Colophon`, con su CSS según la tabla, y completar `App`**

- [ ] **Paso 4: Correr todas las pruebas**

Run: `npx vitest run`
Esperado: PASS.

- [ ] **Paso 5: Commit**

```bash
git add bubudavid
git commit -m "feat: timetable, contact and colophon complete the page"
```

---

### Tarea 10: README y verificación final

**Archivos:**
- Reescribir: `bubudavid/README.md`
- Modificar, sin commit: `.claude/launch.json` en la raíz del repo

- [ ] **Paso 1: Reescribir el README, en español**

Secciones:
- Qué es la página y dónde vive (GitHub Pages, rama `gh-pages`, `bubudavid.github.io`).
- Comandos: `npm start`, `npm test`, `npm run build`, `npm run preview` y `npm run deploy`, con la nota de que `deploy` se detiene mientras quede alguna línea `RELLENO` o `REVISAR`.
- Qué archivo guarda qué: la lista de `src/content/` y `src/components/figures/`.
- Antes de publicar: reemplazar `work.js` y las tres figuras por contenido real y borrar sus líneas `RELLENO`; revisar `profile.js` y borrar su línea `REVISAR`; usar un correo que funcione (`hola@bubudavid.me` es relleno y `bubudavid.me` no responde hoy); revocar en Airtable el token que quedó en el sitio publicado y en el historial de git.
- Si cambias proyectos o líneas: hay que mover coordenadas en `map-layout.js`, y `npm test` nombra lo que falta.
- El dominio `bubudavid.me` del `CNAME` no responde y este cambio no lo toca.

- [ ] **Paso 2: Ajustar `.claude/launch.json`**

La entrada `site-dev` queda como `npm --prefix /home/bubu/work/bubudavid.github.io/bubudavid start` en el puerto 3000, sin `env`. Agregar `site-preview`: `npm --prefix /home/bubu/work/bubudavid.github.io/bubudavid run preview -- --port 4174 --strictPort`, puerto 4174.

- [ ] **Paso 3: Pruebas, compilación y búsqueda de secretos**

Run: `npm test && npm run build && grep -rniE 'airtable|react_app_|import\.meta\.env' src index.html; grep -rli airtable build`
Esperado: todas las pruebas pasan, la compilación no imprime advertencias y los dos grep no imprimen nada.

Run: `node scripts/check-placeholders.mjs; echo "exit $?"`
Esperado: lista `profile.js`, `work.js` y las tres figuras, con `exit 1`.

- [ ] **Paso 4: Revisión a mano contra el prototipo**

Abrir `site-preview` y, al lado, el prototipo en la configuración `mockups` (`/mockups/07-metro-editorial.html`). En 320, 375, 768 y 1440 px de ancho:
- Las dos páginas se ven iguales, salvo la píldora y la retícula del prototipo.
- `document.documentElement.scrollWidth === innerWidth`: no hay desplazamiento horizontal.
- Hasta 760 px el mapa es vertical; arriba de eso, horizontal, y la etiqueta queda dentro de la tarjeta.
- "BUBU" llena su columna después de cargar las fuentes.
- La consola no muestra errores ni advertencias.

Con teclado: Tab hasta el mapa, Enter en Lienzo deja el foco en su título, y Espacio en una ficha de línea la fija. Con `prefers-reduced-motion: reduce` emulado: el tren no corre y los saltos son instantáneos. Abrir `/#glosa` en una pestaña nueva: la página baja a Glosa.

Anotar cualquier diferencia y corregirla antes del commit.

- [ ] **Paso 5: Commit**

```bash
git add bubudavid/README.md
git commit -m "docs: README for the new site and what to replace before publishing"
```
