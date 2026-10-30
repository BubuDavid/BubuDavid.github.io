# Perfil de David (bubudavid.github.io)

Mi página de perfil. Es una página de React con Vite que cuenta mi trabajo como un mapa de metro dentro de una revista. Vive en GitHub Pages: `npm run deploy` publica la carpeta `build/` en la rama `gh-pages` y GitHub la sirve en https://bubudavid.github.io.

El prototipo que sirvió de modelo está en `mockups/07-metro-editorial.html`, en la raíz del repositorio.

## Comandos

Corre todo desde esta carpeta (`bubudavid/`).

| Comando | Qué hace |
|---|---|
| `npm start` | Servidor de desarrollo en http://localhost:3000. |
| `npm test` | Corre todas las pruebas una vez. |
| `npm run build` | Compila la página en `build/`. |
| `npm run preview` | Sirve `build/` tal como se publicaría. Corre `npm run build` antes. |
| `npm run deploy` | Compila y publica en la rama `gh-pages`. |

`npm run deploy` se detiene mientras quede en el código alguna línea que empiece con `// RELLENO` o `// REVISAR`. Antes de compilar, `scripts/check-placeholders.mjs` imprime los archivos que todavía la tienen y sale con error. Para ver la lista sin desplegar, corre `node scripts/check-placeholders.mjs`.

## Qué archivo guarda qué

Todo el contenido está en `src/content/`.

- `lab.js` tiene los 8 proyectos reales de la escuela. Es contenido real.
- `profile.js` tiene tu nombre, el titular, la presentación, la biografía, las habilidades, los enlaces y la foto. Es un borrador escrito a partir de tu trabajo real y empieza con `// REVISAR:`.
- `work.js` tiene la empresa, el correo, las cifras, los proyectos de trabajo, la línea y la ruta de cada proyecto (`LAB_LINES` y `ROUTES`), los casos de estudio, las notas breves y la cronología. Todo es inventado y empieza con `// RELLENO:`.
- `lines.js` tiene el nombre y el color de las cuatro líneas del metro.
- `map-layout.js` tiene las coordenadas del mapa, escritas a mano.
- `network.js` no se edita. Deriva de `lab.js` y `work.js` los datos que usan los componentes.

Las tres figuras de los casos de estudio están en `src/components/figures/` (`PulsoFigure.jsx`, `LienzoFigure.jsx` y `GlosaFigure.jsx`). También son inventadas y cada una empieza con `// RELLENO:`.

## Antes de publicar

1. Reemplaza `src/content/work.js` y las tres figuras de `src/components/figures/` por contenido real. Después borra la línea `// RELLENO` de cada archivo.
2. Revisa `src/content/profile.js` y borra su línea `// REVISAR`.
3. Cambia el correo. `hola@bubudavid.me` es de relleno (está en `EMAIL`, dentro de `work.js`) y el dominio `bubudavid.me` no responde hoy. Usa un correo que sí funcione.
4. Revoca en Airtable el token de la versión anterior. Estuvo a la vista en el código publicado del sitio y sigue en el historial de git, así que borrarlo de los archivos no basta. La página nueva no usa ningún token ni variable de entorno.
5. Corre `npm test`, `npm run build` y `node scripts/check-placeholders.mjs`. Cuando el último ya no imprima nada, `npm run deploy` va a funcionar.

## Si cambias proyectos o líneas

El mapa se dibuja con coordenadas puestas a mano, así que un proyecto nuevo o una línea distinta no aparece solo en el lugar correcto. Cuando cambies un proyecto o su línea en `work.js` o `lab.js`, mueve también sus coordenadas en `map-layout.js`, tanto las del mapa horizontal (`HPOS`, `HPATHS`) como el orden del mapa vertical (`VORDER`).

Si algo no coincide, `npm test` falla y nombra lo que falta. Los mensajes se ven así, con el identificador de la estación en cuestión.

```
add "nuevo" to HPOS in map-layout.js
add "nuevo" to ROUTES[2]
nuevo is on ROUTES[3] but not on line 3
```

## Dominio

El archivo `CNAME` de la raíz del repositorio apunta a `bubudavid.me`. Ese dominio no responde hoy y este rediseño no lo toca.
