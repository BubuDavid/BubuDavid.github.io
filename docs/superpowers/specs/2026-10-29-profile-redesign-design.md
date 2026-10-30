# Rediseño del perfil: Metro + Editorial

Fecha: 2026-10-29 · Rama: `redesign/mockups` · Prototipo de referencia: `mockups/07-metro-editorial.html`

## Para qué

La página actual (2022) es un "link tree" de proyectos estudiantiles que se cargan desde Airtable. David ya trabaja como ingeniero de IA y datos, y quiere que su perfil presente su experiencia laboral sin perder de dónde viene. De seis mockups eligió combinar dos:

- **Metro**: su carrera como mapa del Metro de la CDMX. Cada línea une proyectos estudiantiles con el proyecto laboral que salió de ellos.
- **Editorial**: casos de estudio con formato de revista (problema, enfoque, resultado, cifras grandes), legibles para reclutadores.

## Objetivos

- Que el visitante vea primero a un ingeniero con sistemas en producción, no a un estudiante.
- Que el mapa cuente la historia: 4 líneas, Lab 2019–2022, Graduación, Trabajo 2023–hoy, con Pulso como estación de correspondencia.
- Casos de estudio completos para Pulso, Lienzo y Glosa. Entradas cortas para Ruta, Gemelos y Mensajero.
- Los 8 proyectos reales de la página actual se quedan como "Lab", con sus links.
- Conservar la personalidad: alias Bubu 🦕, el verde `#57E089` de la página actual como color de la Línea 2, y el footer `<> Made with 💖 in 🇲🇽🌮`.
- Que funcione bien en celular, con el mapa en vertical.
- Ningún secreto en el código publicado.

## Fuera de alcance (v1)

- Versión en español o selector de idioma. La página queda en inglés, como la actual.
- Modo oscuro.
- CMS, blog, analítica, formulario de contacto.
- Publicar. El trabajo se queda en la rama hasta que David decida hacer deploy.

## Lo que contaría como fracaso aunque funcione

- Publicar la empresa y las cifras inventadas como si fueran reales.
- Un mapa ilegible o imposible de usar en celular.
- Volver a depender de un token dentro del navegador.

## Contenido

Todo el texto sale de `mockups/CONTENT.md`. Hay tres tipos:

- **Inventado (relleno):** los seis proyectos laborales con sus cifras, la empresa "Ceiba Data", las cuatro cifras de la portada, la línea de tiempo de experiencia, el correo `hola@bubudavid.me` y los enlaces "grew into" entre proyectos del Lab y proyectos laborales. Esos enlaces deciden qué proyecto va en qué línea, así que las líneas también son relleno.
- **Borrador basado en el trabajo real de David:** el titular de portada, las dos bios, "Open to" y las habilidades. Hay que revisarlos, pero no son ficción.
- **Real:** los 8 proyectos del Lab, sus links, GitHub, LinkedIn y la foto.

Tres demos del Lab (Spotwipy, Spotify Analysis y Color Picker) vivían en Glitch, que ya no aloja apps: hoy responden 410. La página enlaza a su repositorio en GitHub (`SpoTwipy`, `Personality-Analysis-Spotify` y `Color-Palette_Picker`) y las marca como "Demo offline". Cada proyecto del Lab tiene un link a la demo y otro al código, ambos opcionales, y una marca de demo caída.

## Estructura de la página (decidida con el prototipo 07)

1. Barra fija delgada: "BUBU" y links a Map, Work, Lab, Experience y Contact.
2. Cabecera de revista: nombre, titular, "Est. 2019", la palabra "BUBU" grande y el índice "Issue Nº 04" con insignias de línea junto a cada proyecto.
3. Portada: titular "I build the layer between a company's data and the people who act on it.", foto, bio corta y cuatro cifras.
4. El mapa, a todo lo ancho. Las estaciones son botones. Al hacer clic, la página baja hasta donde vive ese proyecto y lo resalta un momento: el caso de estudio, la entrada corta o la fila del archivo. Al pasar el cursor o enfocar con teclado aparece una etiqueta con el nombre y una línea de descripción. Los chips de leyenda resaltan una línea. En celular el mapa es vertical.
5. Casos de estudio de Pulso, Lienzo y Glosa. Cada uno empieza con una "tira de ruta": el tramo de línea que va del proyecto estudiantil a este, con el proyecto actual destacado. Termina con un link de regreso al mapa.
6. "Also on the network": Ruta, Gemelos y Mensajero en formato corto.
7. Archivo del Lab 2019–2022: los 8 proyectos reales agrupados por línea, con pictograma, etiquetas, link al proyecto y link "grew into" al proyecto laboral.
8. Experiencia como tablero de salidas del Metro sobre papel, con habilidades al lado o debajo.
9. Contacto y colofón, con el footer de la página actual.

## Dirección visual

- Papel `#F3EFE6`, tinta `#17160F`, verde editorial `#1F5C3A` para acentos de texto y links.
- Colores de línea del Metro solo para líneas e insignias: L1 `#D6286F`, L2 `#57E089`, L3 `#1565D8`, L4 `#F28A1D`. El verde de L2 nunca como color de texto sobre papel, porque no tiene contraste suficiente.
- Tipografías de Google Fonts: Fraunces (titulares y cifras), Inter Tight (texto) y Barlow Condensed (señalética: estaciones, insignias, tablero).
- Animaciones discretas que respetan `prefers-reduced-motion`.

## Decisiones técnicas (propuestas por Claude, David puede cambiarlas)

- **Migrar de Create React App a Vite + React 18.** CRA ya no recibe mantenimiento. El proyecto se queda en la carpeta `bubudavid/` y se conservan `npm start`, `npm run build` y `npm run deploy` (con el paquete `gh-pages`).
- **Contenido como datos en el repo**, en `bubudavid/src/content/` (perfil, líneas, proyectos, experiencia, habilidades). El mapa, los casos, el archivo y el tablero leen de esa misma fuente. Se eliminan el hook de Airtable, las variables `REACT_APP_AIRTABLE_*`, `dotenv` y las dependencias que ya no se usen.
- **Todo el contenido inventado vive en un solo archivo** (`src/content/work.js`): proyectos, linaje, empresa, cifras, línea de tiempo y correo, marcado con un comentario de "relleno". El borrador real va en `src/content/profile.js` marcado como "revisar". El README lista ambos como lo que hay que reemplazar o revisar antes de publicar.
- **El mapa se dibuja con coordenadas a mano**, en un archivo de trazado (`src/content/map-layout.js`), como en el prototipo. Nombres, líneas y enlaces salen de los datos, pero si cambia cuántos proyectos hay, en qué línea va cada uno o cuál es la correspondencia, hay que mover coordenadas en ese archivo. Un trazado automático de un mapa de metro no vale la pena para catorce estaciones.
- **Las figuras de cada caso de estudio son componentes propios de su proyecto.** Si un proyecto real sustituye a uno inventado, necesita su propia figura o se queda sin ella.
- **CSS plano por componente** con variables en `:root`, como el sitio actual. Sin Tailwind ni librerías de componentes.
- **Las miniaturas de Airtable se sustituyen por los pictogramas de estación**, porque las URLs de imágenes de Airtable caducan.
- **Se borra el sitio viejo** (Header, Main, ProjectsSection, SocialBar, Context, FadeInSection) en lugar de mantenerlo en paralelo.
- **Metadatos**: título, descripción e imagen para compartir (Open Graph) nuevos. La foto `pp.jpg` se sirve también en un tamaño reducido.
- **Pruebas**: la compilación de producción pasa sin advertencias, una prueba de humo con Vitest y Testing Library (la página renderiza y un clic en una estación lleva a su sección), revisión manual a 375, 768 y 1440 px, navegación del mapa con teclado y consola sin errores.

## Restricciones

- GitHub Pages, sitio de usuario `bubudavid.github.io`, publicado desde la rama `gh-pages`.
- El archivo `CNAME` de `main` apunta a `bubudavid.me`, pero ese dominio no responde hoy y la rama `gh-pages` no tiene `CNAME`. El sitio vive en `bubudavid.github.io` y el dominio no se toca.
- El token de Airtable que está en el sitio publicado lo revoca David en Airtable. El código nuevo no lo usa.

## Revisión

Un revisor independiente leyó este documento antes de entregarlo. Hizo tres preguntas: cómo se adapta el mapa si cambian los proyectos, qué contenido es inventado y qué hacer con los links caídos. Las tres están respondidas arriba como decisiones de Claude.

## Lo que se deja al constructor

- La división exacta en componentes y los nombres de archivos.
- El detalle de las figuras SVG de los casos de estudio.
- Cómo se dibuja el mapa por dentro (SVG, CSS o una mezcla), siempre que se vea como el prototipo y funcione con teclado.
