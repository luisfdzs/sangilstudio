/**
 * FUNDE LOS CONCURSOS EN LOS PROYECTOS (dataset ya en producción)
 *   npx sanity exec scripts/unify-competitions.mjs --with-user-token
 *
 * Los concursos dejaron de ser un tipo de documento aparte: ahora son proyectos con el
 * estado «Concurso». `npm run migrate:build` ya genera el dataset unificado, pero eso
 * sólo sirve para una importación desde cero; el dataset de producción tiene 17
 * documentos `competition` con sus imágenes YA SUBIDAS, y volver a importar significaría
 * resubir 34 archivos y pisar lo que se haya editado en el panel.
 *
 * Este script convierte en vez de reimportar:
 *
 * 1. Lee cada `competition` del dataset y crea el `project` equivalente **reutilizando la
 *    referencia a los assets** (ni una subida nueva).
 * 2. Los textos que el tipo `competition` no tenía —tipo, resumen y memoria en los dos
 *    idiomas— salen de `scripts/migration/content-snapshot.json`, para que no haya dos
 *    copias de lo mismo en el repositorio.
 * 3. Reparte de nuevo los `orderRank` de los 31 proyectos: la obra primero, los concursos
 *    después. Hace falta porque los dos tipos tenían secuencias independientes que
 *    arrancaban en el mismo valor, así que al juntarlos el orden habría salido intercalado.
 * 4. Borra los `competition` (y sus borradores) en la MISMA transacción que crea los
 *    proyectos: o se hace todo, o no se hace nada.
 *
 * Es idempotente: si ya no quedan documentos `competition`, no toca nada.
 *
 * Caso aparte: «Health Center, Pamplona» estaba sin imágenes, porque como índice no las
 * necesitaba. Un proyecto sí exige portada, así que se sube el único render que hay en el
 * archivo maestro (ya derivado en public/media por `npm run images`).
 */

import { createReadStream, existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { getCliClient } from 'sanity/cli'
import { LexoRank } from 'lexorank'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const client = getCliClient()

const snapshot = JSON.parse(
  readFileSync(path.join(ROOT, 'scripts', 'migration', 'content-snapshot.json'), 'utf8'),
)
/** slug → los campos que el tipo `competition` no tenía. */
const editorial = new Map(
  snapshot.projects.map((project) => [
    project.slug,
    { type: project.type, summary: project.summary, body: project.body },
  ]),
)

const competitions = await client.fetch(
  `*[_type == "competition"] | order(coalesce(orderRank, "zzz") asc)`,
)

if (competitions.length === 0) {
  console.log('✓ No queda ningún documento «competition»: ya está unificado.')
  process.exit(0)
}

console.log(`· ${competitions.length} concursos por convertir\n`)

const convertidos = []

for (const competition of competitions) {
  const slug = competition.slug?.current
  if (!slug) {
    fail(`El concurso ${competition._id} no tiene identificador (slug). Arréglalo en /admin.`)
  }

  const textos = editorial.get(slug)
  if (!textos) {
    fail(
      `No hay resumen ni memoria para «${slug}» en content-snapshot.json.\n` +
        `  Añádelos allí (o escríbelos en /admin después) antes de convertirlo.`,
    )
  }

  const images = competition.images?.length
    ? competition.images
    : [await subirPortadaQueFaltaba(slug, competition)]

  convertidos.push({
    _id: `project-${slug}`,
    _type: 'project',
    title: competition.title,
    slug: { _type: 'slug', current: slug },
    location: competition.location,
    year: competition.year,
    status: 'competition',
    type: textos.type,
    ...(competition.collaboration ? { collaboration: competition.collaboration } : {}),
    featured: false,
    summary: { _type: 'localizedString', es: textos.summary.es, en: textos.summary.en },
    body: { _type: 'localizedParagraphs', es: textos.body.es, en: textos.body.en },
    images,
    // El orden definitivo se reparte más abajo, con todos los proyectos a la vista.
    orderRank: competition.orderRank ?? '',
  })

  console.log(`  · ${competition.title} → project-${slug} (${images.length} img)`)
}

/**
 * Sube el derivado local de la única imagen que existe de un concurso que estaba sin
 * ninguna. Se hace aquí y no en el importador porque es un caso único.
 */
async function subirPortadaQueFaltaba(slug, competition) {
  const file = path.join(ROOT, 'public', 'media', 'competitions', slug, '01.webp')
  if (!existsSync(file)) {
    fail(
      `«${slug}» no tiene imágenes en el panel y tampoco encuentro ${path.relative(ROOT, file)}.\n` +
        `  Ejecuta \`npm run images\` (necesita la carpeta maestra) o sube una portada en /admin.`,
    )
  }

  console.log(`  ↑ subiendo la portada que faltaba de «${slug}»…`)
  const asset = await client.assets.upload('image', createReadStream(file), {
    filename: `${slug}-01.webp`,
  })

  const alt = `${competition.title}, ${competition.location?.es ?? ''}`.replace(/, $/, '')
  return {
    _type: 'projectImage',
    _key: `${slug}-01`,
    asset: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
    alt: {
      _type: 'localizedString',
      es: alt,
      en: `${competition.title}, ${competition.location?.en ?? ''}`.replace(/, $/, ''),
    },
  }
}

// --- Orden final: la obra primero, los concursos después ----------------------------
const existentes = await client.fetch(
  `*[_type == "project"]{ _id, orderRank } | order(coalesce(orderRank, "zzz") asc)`,
)
const nuevos = new Set(convertidos.map((documento) => documento._id))
const orden = [
  ...existentes.filter((documento) => !nuevos.has(documento._id)).map((documento) => documento._id),
  ...convertidos.map((documento) => documento._id),
]

let rank = LexoRank.middle()
const ranks = new Map()
for (const id of orden) {
  ranks.set(id, rank.toString())
  rank = rank.genNext()
}

const transaction = client.transaction()

for (const documento of convertidos) {
  transaction.createOrReplace({ ...documento, orderRank: ranks.get(documento._id) })
}
// A los proyectos que ya existían sólo se les toca el orden: nada de reemplazarlos, que
// pisaría cualquier edición hecha en el panel.
for (const documento of existentes) {
  if (nuevos.has(documento._id)) continue
  transaction.patch(documento._id, { set: { orderRank: ranks.get(documento._id) } })
}
for (const competition of competitions) {
  transaction.delete(competition._id)
  transaction.delete(`drafts.${competition._id}`)
}

await transaction.commit()

console.log(
  `\n✓ ${convertidos.length} concursos convertidos en proyectos y ${orden.length} ` +
    `ordenados de nuevo.\n` +
    `  Comprueba en /admin que «Proyectos» carga con ${orden.length} fichas y que se arrastra,\n` +
    `  y publica cualquier cambio para que el webhook regenere la web.\n`,
)

function fail(message) {
  console.error(`\n✗ ${message}\n`)
  process.exit(1)
}
