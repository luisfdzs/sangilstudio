#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { LexoRank } from 'lexorank'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SNAPSHOT = path.join(ROOT, 'scripts', 'migration', 'content-snapshot.json')
const OUTPUT = path.join(ROOT, 'scripts', 'migration', 'import.ndjson')

const snapshot = JSON.parse(readFileSync(SNAPSHOT, 'utf8'))

let missing = 0

function assetRef(localSrc) {
  const file = path.join(ROOT, 'public', localSrc.replace(/^\//, ''))
  if (!existsSync(file)) {
    console.warn(`  ✗ falta la imagen ${localSrc}`)
    missing++
  }
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

let siguienteRank = LexoRank.middle()
const rank = () => {
  const actual = siguienteRank.toString()
  siguienteRank = siguienteRank.genNext()
  return actual
}

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
    orderRank: rank(),
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
