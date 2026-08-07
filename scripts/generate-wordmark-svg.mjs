#!/usr/bin/env node

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
