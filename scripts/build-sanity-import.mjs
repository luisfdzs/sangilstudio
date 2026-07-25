#!/usr/bin/env node
/**
 * PREPARA LA MIGRACIÓN AL PANEL · `npm run migrate:build`
 *
 * Convierte el volcado del contenido que vivía en ficheros
 * (`scripts/migration/content-snapshot.json`) en un fichero NDJSON que el CLI de Sanity
 * importa de un tirón: 14 proyectos, 17 concursos, los textos del estudio y las 78
 * imágenes con su descripción en los dos idiomas.
 *
 * **Por qué NDJSON y no la API con un token:** el CLI usa la sesión de quien ha hecho
 * `sanity login`, así que no hay que crear, pegar ni guardar ninguna credencial en
 * ningún sitio. Menos secretos dando vueltas, menos que se pueda filtrar.
 *
 * Las imágenes se referencian con `_sanityAsset`, la forma que tiene el importador de
 * subir un archivo local y dejar la referencia apuntando a él. Se suben los derivados
 * de `public/media` (WebP, máx. 2560 px): es la mejor calidad que la web llega a servir
 * y hace la subida rápida. Para más resolución en una imagen concreta, se sustituye
 * luego desde el panel arrastrando el original.
 *
 * Después de generarlo:
 *   npm run migrate:import      (requiere `npx sanity login` una vez)
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SNAPSHOT = path.join(ROOT, 'scripts', 'migration', 'content-snapshot.json')
const OUTPUT = path.join(ROOT, 'scripts', 'migration', 'import.ndjson')

const snapshot = JSON.parse(readFileSync(SNAPSHOT, 'utf8'))

let missing = 0

/** Referencia a un archivo local para que el importador lo suba. */
function assetRef(localSrc) {
  const file = path.join(ROOT, 'public', localSrc.replace(/^\//, ''))
  if (!existsSync(file)) {
    console.warn(`  ✗ falta la imagen ${localSrc}`)
    missing++
  }
  // Ruta ABSOLUTA a propósito. Las relativas dan dos problemas: el importador las
  // resuelve respecto al directorio del NDJSON (no al del comando) y, si empiezan por
  // `../`, `file://../..` interpreta esa parte como nombre de host y falla. Al ser un
  // fichero generado y gitignorado, que contenga rutas de esta máquina no molesta.
  return { _type: 'image', _sanityAsset: `image@${pathToFileURL(file).href}` }
}

function toProjectImage(image) {
  return {
    _type: 'projectImage',
    _key: image.id.replaceAll('/', '-'),
    asset: assetRef(image.src),
    alt: { _type: 'localizedString', es: image.alt.es, en: image.alt.en },
  }
}

/** El plugin de orden por arrastre ordena por este campo de texto. */
const rank = (index) => `a${String(index).padStart(3, '0')}`

const documents = []

for (const [index, project] of snapshot.projects.entries()) {
  documents.push({
    _id: `project-${project.slug}`,
    _type: 'project',
    title: project.title,
    slug: { _type: 'slug', current: project.slug },
    location: { _type: 'localizedString', ...project.location },
    year: project.year,
    status: project.status,
    type: project.type,
    ...(project.area ? { area: project.area } : {}),
    ...(project.client ? { client: project.client } : {}),
    ...(project.collaboration ? { collaboration: project.collaboration } : {}),
    featured: Boolean(project.featured),
    summary: { _type: 'localizedString', ...project.summary },
    body: { _type: 'localizedParagraphs', es: project.body.es, en: project.body.en },
    images: project.images.map(toProjectImage),
    ...(project.plans?.length ? { plans: project.plans.map(toProjectImage) } : {}),
    orderRank: rank(index),
  })
}

for (const [index, competition] of snapshot.competitions.entries()) {
  documents.push({
    _id: `competition-${competition.slug}`,
    _type: 'competition',
    title: competition.title,
    slug: { _type: 'slug', current: competition.slug },
    location: { _type: 'localizedString', ...competition.location },
    year: competition.year,
    ...(competition.collaboration ? { collaboration: competition.collaboration } : {}),
    ...(competition.images?.length ? { images: competition.images.map(toProjectImage) } : {}),
    orderRank: rank(index),
  })
}

const s = snapshot.site
documents.push({
  _id: 'siteSettings',
  _type: 'siteSettings',
  statement: { _type: 'localizedParagraphs', es: s.statement.es, en: s.statement.en },
  team: s.team.map((member, index) => ({
    _key: `member-${index}`,
    name: member.name,
    role: { _type: 'localizedString', ...member.role },
    phone: member.phone,
  })),
  collaborators: s.collaborators,
  email: s.email,
  city: s.city,
  region: { _type: 'localizedString', ...s.region },
  country: { _type: 'localizedString', ...s.country },
  instagram: s.instagram,
  linkedin: s.linkedin,
})

writeFileSync(OUTPUT, documents.map((document) => JSON.stringify(document)).join('\n') + '\n')

const images = new Set()
for (const document of documents) {
  for (const image of [...(document.images ?? []), ...(document.plans ?? [])]) {
    images.add(image.asset._sanityAsset)
  }
}

console.log(
  `\n✓ ${documents.length} documentos y ${images.size} imágenes preparados en ` +
    `${path.relative(ROOT, OUTPUT)}`,
)
if (missing > 0) {
  console.error(`\n✗ Faltan ${missing} imágenes: la importación fallaría. Revisa public/media.\n`)
  process.exit(1)
}
console.log('  Siguiente paso: npm run migrate:import\n')
