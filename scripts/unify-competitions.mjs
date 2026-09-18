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
    orderRank: competition.orderRank ?? '',
  })

  console.log(`  · ${competition.title} → project-${slug} (${images.length} img)`)
}

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
