#!/usr/bin/env node
/**
 * MIGRACIÓN AL PANEL · `npm run migrate:sanity`
 *
 * Sube al CMS el contenido que vivía en ficheros del repositorio: 14 proyectos, 17
 * concursos, los textos del estudio y las 78 imágenes con su descripción. A partir de
 * ahí, todo eso se edita desde /admin y **ya no hay contenido en el código**.
 *
 * Se ejecuta una sola vez, pero es **idempotente**: cada documento lleva un `_id`
 * derivado de su slug, así que repetirla actualiza en lugar de duplicar. Si algo sale
 * mal a mitad, se vuelve a lanzar sin miedo.
 *
 * Las imágenes que sube son los derivados optimizados de `public/media` (WebP, máx.
 * 2560 px, ~31 MB en total), no los originales de 80–95 MB: son la mejor calidad que la
 * web llega a servir y hacen la subida rápida. Si algún día se necesita más resolución
 * para una imagen concreta, se sustituye desde el panel arrastrando el original.
 *
 * Necesita un token de escritura en `.env.local` (SANITY_API_WRITE_TOKEN). Se crea en
 * sanity.io/manage › API › Tokens, con permiso «Editor».
 */

import { createClient } from '@sanity/client'
import { createReadStream, existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SNAPSHOT = path.join(ROOT, 'scripts', 'migration', 'content-snapshot.json')

// Carga .env.local sin dependencias extra.
for (const file of ['.env.local', '.env']) {
  const full = path.join(ROOT, file)
  if (!existsSync(full)) continue
  for (const line of readFileSync(full, 'utf8').split('\n')) {
    const match = /^([A-Z0-9_]+)\s*=\s*"?([^"\n\r]*)"?\s*$/.exec(line.trim())
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2]
  }
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !token) {
  console.error(
    '\n✗ Faltan datos de conexión.\n' +
      '  Necesito en .env.local:\n' +
      '    NEXT_PUBLIC_SANITY_PROJECT_ID=...\n' +
      '    SANITY_API_WRITE_TOKEN=...   (sanity.io/manage › API › Tokens, permiso Editor)\n',
  )
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2026-07-25',
  useCdn: false,
})

const snapshot = JSON.parse(readFileSync(SNAPSHOT, 'utf8'))

/** Sube una imagen (si no está ya subida) y devuelve la referencia al asset. */
const uploaded = new Map()
async function uploadImage(localSrc, label) {
  if (uploaded.has(localSrc)) return uploaded.get(localSrc)

  const file = path.join(ROOT, 'public', localSrc.replace(/^\//, ''))
  if (!existsSync(file)) {
    throw new Error(`No encuentro la imagen ${localSrc} (esperada en ${file})`)
  }

  const asset = await client.assets.upload('image', createReadStream(file), {
    filename: path.basename(file),
    label,
  })
  uploaded.set(localSrc, asset._id)
  console.log(`  ↑ ${localSrc}  →  ${asset._id}`)
  return asset._id
}

/** Convierte una imagen del volcado al formato del esquema `projectImage`. */
async function toProjectImage(image, label) {
  const assetId = await uploadImage(image.src, label)
  return {
    _type: 'projectImage',
    _key: image.id.replaceAll('/', '-'),
    asset: { _type: 'image', asset: { _type: 'reference', _ref: assetId } },
    alt: { _type: 'localizedString', es: image.alt.es, en: image.alt.en },
  }
}

/**
 * Orden por arrastre: el plugin de Sanity ordena por un campo de texto. Se generan
 * claves crecientes ("a00", "a01", …) que respetan el orden que ya tenía la web.
 */
const rank = (index) => `a${String(index).padStart(3, '0')}`

async function main() {
  console.log(`\nMigrando a Sanity · proyecto ${projectId} · dataset ${dataset}\n`)

  const documents = []

  // ---- Proyectos ------------------------------------------------------------
  for (const [index, project] of snapshot.projects.entries()) {
    console.log(`Proyecto ${index + 1}/${snapshot.projects.length}: ${project.title}`)
    const images = []
    for (const image of project.images) images.push(await toProjectImage(image, project.title))
    const plans = []
    for (const plan of project.plans ?? []) {
      plans.push(await toProjectImage(plan, `${project.title} (plano)`))
    }

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
      body: {
        _type: 'localizedParagraphs',
        es: project.body.es,
        en: project.body.en,
      },
      images,
      ...(plans.length ? { plans } : {}),
      orderRank: rank(index),
    })
  }

  // ---- Concursos ------------------------------------------------------------
  for (const [index, competition] of snapshot.competitions.entries()) {
    console.log(`Concurso ${index + 1}/${snapshot.competitions.length}: ${competition.title}`)
    const images = []
    for (const image of competition.images ?? []) {
      images.push(await toProjectImage(image, competition.title))
    }

    documents.push({
      _id: `competition-${competition.slug}`,
      _type: 'competition',
      title: competition.title,
      slug: { _type: 'slug', current: competition.slug },
      location: { _type: 'localizedString', ...competition.location },
      year: competition.year,
      ...(competition.collaboration ? { collaboration: competition.collaboration } : {}),
      ...(images.length ? { images } : {}),
      orderRank: rank(index),
    })
  }

  // ---- Estudio y contacto (documento único) ---------------------------------
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

  // ---- Escritura en una sola transacción ------------------------------------
  const transaction = client.transaction()
  for (const document of documents) transaction.createOrReplace(document)
  await transaction.commit()

  console.log(
    `\n✓ ${documents.length} documentos y ${uploaded.size} imágenes en Sanity.\n` +
      `  Revísalo en /admin y publica lo que quieras cambiar.\n`,
  )
}

await main()
