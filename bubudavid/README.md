# Perfil de David (bubudavid.github.io)

Esta es tu página de perfil, una página de React con Vite que cuenta tu trabajo como un mapa de metro dentro de una revista. Vive en GitHub Pages. `npm run deploy` publica la carpeta `build/` en la rama `gh-pages` y GitHub la sirve en https://bubudavid.github.io.

El prototipo que sirvió de modelo está en `mockups/07-metro-editorial.html`, en la raíz del repositorio.

## Comandos

Corre todo desde esta carpeta (`bubudavid/`).

| Comando | Qué hace |
|---|---|
| `npm start` | Servidor de desarrollo en http://localhost:3000. |
| `npm test` | Corre todas las pruebas una vez. |
| `npm run build` | Compila la página en `build/`. |
| `npm run preview` | Sirve `build/` tal como se publicaría. Corre `npm run build` antes. |
| `npm run deploy` | Revisa, compila y publica en la rama `gh-pages`. |

`npm run deploy` da tres pasos antes de publicar y se detiene en el primero que falla.

1. `scripts/check-placeholders.mjs` busca en `src/content/` y en `src/components/figures/` las líneas que empiezan con `// RELLENO` o `// REVISAR`. Si encuentra alguna, imprime los archivos que la tienen y sale con error. No revisa ninguna otra carpeta. Para ver la lista sin desplegar, corre `node scripts/check-placeholders.mjs`.
2. Corre las pruebas del mapa, `src/content/map.test.js` y `src/App.smoke.test.jsx`.
3. Compila con `npm run build`.

Las pruebas del mapa no nombran ningún proyecto, así que valen para el contenido de hoy y para el real. Fallan si una estación no tiene coordenadas, si `map-layout.js` conserva coordenadas de un proyecto que ya no existe, si una estación queda fuera del trazo de su línea, si la caja de la correspondencia no cruza todas sus líneas o si el mapa vertical ordena una línea distinto que `ROUTES`. También dibujan la página entera y fallan si no llega a dibujarse, que en el sitio publicado sería una página en blanco, o si a una estación le falta su sección.

No revisan cómo se ve el mapa. Una estación puede quedar sobre su línea pero en el año equivocado, o encima de la etiqueta de otra. Tampoco revisan textos, cifras ni enlaces. Antes de publicar, corre `npm run preview` y mira el mapa en una pantalla ancha y en un teléfono.

## Qué archivo guarda qué

Casi todo el contenido está en `src/content/`. Las figuras de los casos de estudio están aparte, en `src/components/figures/`.

- `lab.js` tiene los 8 proyectos reales de la escuela. Es contenido real.
- `profile.js` tiene tu nombre, el titular, la frase grande de la portada (`STATEMENT`), la presentación (`STANDFIRST`), lo que buscas (`OPEN_TO`), los datos del número de la revista (`ISSUE`), la biografía, las habilidades, los enlaces y la foto. Es un borrador escrito a partir de tu trabajo real y empieza con `// REVISAR:`. `ISSUE` dice "Autumn 2026" en la cabecera, así que cámbialo cuando cambie la temporada.
- `work.js` tiene la empresa, el correo, las cifras, los proyectos de trabajo, la línea y la ruta de cada proyecto (`LAB_LINES` y `ROUTES`), los casos de estudio, las notas breves y la cronología. Todo es inventado y empieza con `// RELLENO:`.
- `lines.js` tiene el nombre y el color de las cuatro líneas del metro.
- `map-layout.js` tiene las coordenadas del mapa, escritas a mano.
- `network.js` no se edita. Deriva de `lab.js` y `work.js` los datos que usan los componentes.

Las tres figuras (`PulsoFigure.jsx`, `LienzoFigure.jsx` y `GlosaFigure.jsx`) también son inventadas y cada una empieza con `// RELLENO:`.

### Quitar una figura

Un caso de estudio puede quedarse sin figura. Borra el archivo de la figura en `src/components/figures/` y quita su `import` y su entrada en `FIGURES`, en `src/components/figures/index.js`. El caso se dibuja sin figura y su cifra grande ocupa todo el ancho de la fila.

## Las pruebas

`npm test` corre dos clases de pruebas.

- `src/content/map.test.js` y `src/App.smoke.test.jsx` cuidan el mapa y la página entera. No nombran ningún proyecto y `npm run deploy` las corre antes de compilar.
- Las demás, que son las de los componentes, `src/App.test.jsx`, `src/content/content.test.js` y `src/meta.test.js`, revisan el texto de relleno de hoy: nombres, cifras y cuántos proyectos hay. Cuando cambies `work.js`, `profile.js`, las figuras o la descripción de `index.html`, van a fallar. Actualízalas junto con el contenido.

## Antes de publicar

1. Reemplaza `src/content/work.js` y las figuras de `src/components/figures/` por contenido real, o quita las figuras que no quieras. Después borra la línea `// RELLENO` de cada archivo.
2. Revisa `src/content/profile.js` y borra su línea `// REVISAR`.
3. Revisa la descripción de la página en `index.html`, que está dos veces: en `<meta name="description">` y en `<meta property="og:description">`. Es el texto que muestran los buscadores y las vistas previas de un enlace. Si la cambias, cambia también `src/meta.test.js`.
4. Cambia el correo. `hola@bubudavid.me` es de relleno (está en `EMAIL`, dentro de `work.js`) y el dominio `bubudavid.me` no responde hoy. Usa un correo que sí funcione.
5. Revoca en Airtable el token de la versión anterior. Estuvo a la vista en el código publicado del sitio y sigue en el historial de git, así que borrarlo de los archivos no basta. La página nueva no usa ningún token ni variable de entorno.
6. Actualiza las pruebas de los componentes al contenido nuevo. Después corre `npm test` y `npm run build`.
7. Corre `node scripts/check-placeholders.mjs`. Cuando ya no imprima nada, `npm run deploy` pasa a las pruebas del mapa y, si pasan, compila y publica.

## Si cambias proyectos o líneas

El mapa se dibuja con coordenadas puestas a mano, así que un proyecto nuevo o una línea distinta no aparece solo en el lugar correcto. Cuando cambies un proyecto o su línea en `work.js` o `lab.js`, cambia también `map-layout.js`.

- `HPOS` tiene el punto de cada estación en el mapa horizontal y `HPATHS` el trazo de cada línea. Cada estación va sobre el trazo de su línea.
- `VORDER` es el orden del mapa vertical, de arriba abajo. Las estaciones de cada línea van en el mismo orden que en `ROUTES`.
- `XFER` dibuja la correspondencia, que hoy es Pulso. Su caja tiene que cruzar todas las líneas de esa estación.
- `TRAIN` es el tren que corre al cargar la página. Hoy va de Spotwipy a Pulso por la Línea 1.
- `TERMINI` pone el número de cada línea en sus extremos. Los inicios salen de `HPATHS`. Los finales de las líneas 2 y 3 están escritos a mano, al final de los trazos que llegan hoy a Lienzo y a Ruta.

`XFER`, `TRAIN` y `TERMINI` también nombran estaciones inventadas o dependen de ellas. Revísalos cuando cambies `work.js`.

Si algo no coincide, `npm test` y `npm run deploy` fallan y nombran lo que falta. Los mensajes se ven así, con el identificador de la estación o el número de la línea.

```
add "nuevo" to HPOS in map-layout.js
add "nuevo" to ROUTES[2]
nuevo is on ROUTES[3] but not on line 3
nuevo is drawn 120 units off line 2: move it in HPOS or move HPATHS[2]
HPOS has "viejo", which is not a station: remove it from map-layout.js
line 4 does not pass through the pulso interchange: move XFER or HPATHS[4]
VORDER lists the stations of line 1 in another order than ROUTES[1]
```

## Dominio

El archivo `CNAME` de la raíz del repositorio apunta a `bubudavid.me`. Ese dominio no responde hoy y este rediseño no lo toca.
