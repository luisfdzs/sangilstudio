#!/usr/bin/env node
/**
 * FICHEROS .SVG DEL WORDMARK · `npm run wordmark`
 *
 * Escribe los dos montajes del logotipo como vectores:
 *
 *   public/brand/wordmark-vertical.svg     STUDIO bajo SANGIL (el montaje original)
 *   public/brand/wordmark-horizontal.svg   STUDIO a la derecha — el que usa la web
 *
 * Van en `public/brand/` **a propósito, y no en el archivo maestro**: son ficheros de
 * texto de 7 KB, se versionan sin coste y así viajan con el repositorio y quedan además
 * descargables desde la web. El archivo maestro (`IMAGENES PROYECTOS/LOGO REDES/`) está
 * en .gitignore y sólo guarda los rásters pesados del logotipo, de los que `npm run
 * brand` recorta el favicon.
 *
 * Hasta ahora el trazo vectorial existía únicamente dentro del componente de React, así
 * que no había forma de abrir el logotipo en Illustrator ni de mandárselo a una imprenta.
 * Estos dos ficheros lo arreglan.
 *
 * Los trazos NO se escriben aquí: salen de `lib/brand/wordmark.ts`, el mismo módulo que
 * usa la cabecera de la web. Los dos montajes son la misma pareja de letras con distinta
 * transformación del grupo de STUDIO, así que no pueden divergir en el dibujo.
 *
 * La web no consume estos ficheros: la cabecera usa SVG en línea porque necesita heredar
 * `currentColor` para cambiar de tinta a papel sobre el hero (ver
 * `components/layout/Wordmark.tsx`). Son el entregable de marca, no un asset de la web.
 */

import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  INK,
  SANGIL_PATH,
  STUDIO_OPACITY,
  STUDIO_PATH,
  STUDIO_TRANSFORM,
  VIEW_BOX,
} from '../lib/brand/wordmark.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = path.join(ROOT, 'public', 'brand')

/**
 * A diferencia del componente, los ficheros llevan el color escrito: `currentColor` no
 * tiene nada de quien heredar cuando el .svg se abre suelto o se coloca en un documento.
 */
function svg(variante) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEW_BOX[variante]}" fill="${INK}">
  <title>Sangil Studio</title>
  <path fill-rule="evenodd" d="${SANGIL_PATH}"/>
  <g transform="${STUDIO_TRANSFORM[variante]}" opacity="${STUDIO_OPACITY}">
    <path fill-rule="evenodd" d="${STUDIO_PATH}"/>
  </g>
</svg>
`
}

await mkdir(OUT_DIR, { recursive: true })

for (const variante of ['vertical', 'horizontal']) {
  const file = path.join(OUT_DIR, `wordmark-${variante}.svg`)
  const contenido = svg(variante)
  await writeFile(file, contenido, 'utf8')
  console.log(`  ✓ ${path.relative(ROOT, file)}  ${(contenido.length / 1024).toFixed(1)} KB`)
}

console.log(
  `\n✓ Los dos montajes escritos. El que usa la web es el horizontal ` +
    `(components/layout/Wordmark.tsx).\n`,
)
