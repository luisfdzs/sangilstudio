#!/usr/bin/env node
/**
 * PIPELINE DE IMÁGENES · `npm run images`
 *
 * Toma los originales del archivo maestro (`IMAGENES PROYECTOS/`, fuera de git,
 * PNG/JPG de hasta 95 MB) y genera para la web:
 *
 *   public/media/<coleccion>/<slug>/<nn>.webp   derivado único, máx. 2560 px
 *   content/media-manifest.json                 dimensiones + placeholder LQIP
 *
 * Por qué un solo derivado y no un srcset completo: `next/image` ya genera las
 * variantes responsive y las cachea en el CDN de Vercel. Duplicar aquí esa lógica
 * multiplicaría el peso del repo sin ganar nada. Lo que sí necesitamos versionar
 * es el manifiesto: con ancho y alto conocidos en build no hay salto de layout
 * (CLS = 0) y el placeholder difuminado evita el "flash" de hueco vacío.
 *
 * Es idempotente: sólo reprocesa lo que ha cambiado. `--force` rehace todo.
 */

import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { MASTER_DIR, competitionsCuration, curation } from './curation.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const MASTER = path.join(ROOT, MASTER_DIR)
const OUT_DIR = path.join(ROOT, 'public', 'media')
const MANIFEST = path.join(ROOT, 'content', 'media-manifest.json')

/** Tope de ancho del derivado. Por encima de 2560 px nadie nota la diferencia. */
const MAX_WIDTH = 2560
const QUALITY = 82
/** Los planos son documentos técnicos: interesa nitidez de línea, no ancho. */
const PLAN_MAX_WIDTH = 2000
const PLAN_QUALITY = 88
/** Ancho del placeholder LQIP embebido en base64. */
const BLUR_WIDTH = 16

const force = process.argv.includes('--force')

async function main() {
  if (!existsSync(MASTER)) {
    fail(
      `No encuentro la carpeta maestra "${MASTER_DIR}/".\n` +
        `Descomprime "IMAGENES PROYECTOS.zip" en la raíz del proyecto y vuelve a ejecutar.\n` +
        `(Está gitignorada a propósito: los originales nunca van al repo.)`,
    )
  }

  const collections = [
    { name: 'projects', entries: curation },
    { name: 'competitions', entries: competitionsCuration },
  ]

  /** @type {Record<string, Record<string, { images: unknown[], plans: unknown[] }>>} */
  const manifest = {}
  const stats = { processed: 0, skipped: 0, missing: 0, bytes: 0 }

  for (const { name: collection, entries } of collections) {
    manifest[collection] = {}

    for (const [slug, entry] of Object.entries(entries)) {
      const images = []
      const plans = []

      for (const [index, source] of (entry.images ?? []).entries()) {
        const record = await processOne({ collection, slug, entry, source, index, stats })
        if (record) images.push(record)
      }

      for (const [index, source] of (entry.plans ?? []).entries()) {
        const record = await processOne({
          collection,
          slug,
          entry,
          source,
          index,
          stats,
          kind: 'plan',
        })
        if (record) plans.push(record)
      }

      manifest[collection][slug] = { images, plans }
    }
  }

  await mkdir(path.dirname(MANIFEST), { recursive: true })
  await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')

  console.log(
    `\n✓ ${stats.processed} generadas · ${stats.skipped} sin cambios · ` +
      `${stats.missing} no encontradas · ${(stats.bytes / 1024 / 1024).toFixed(1)} MB en public/media`,
  )
  console.log(`  manifiesto → ${path.relative(ROOT, MANIFEST)}`)
  if (stats.missing > 0) {
    console.log(
      `\n⚠ Hay ${stats.missing} imágenes de la curaduría que no existen en el archivo maestro.\n` +
        `  Revisa las rutas en scripts/curation.mjs (mayúsculas, acentos y dobles espacios cuentan).`,
    )
  }
}

/**
 * Procesa un original y devuelve su entrada de manifiesto.
 * @returns {Promise<null | { id: string, src: string, width: number, height: number, blur: string, source: string }>}
 */
async function processOne({ collection, slug, entry, source, index, stats, kind = 'image' }) {
  const absolute = path.resolve(MASTER, entry.dir, source)
  if (!existsSync(absolute)) {
    console.warn(`  ✗ falta: ${path.relative(MASTER, absolute)}`)
    stats.missing++
    return null
  }

  const prefix = kind === 'plan' ? 'plan-' : ''
  const name = `${prefix}${String(index + 1).padStart(2, '0')}.webp`
  const outPath = path.join(OUT_DIR, collection, slug, name)
  const publicSrc = `/media/${collection}/${slug}/${name}`
  const id = `${collection}/${slug}/${prefix}${String(index + 1).padStart(2, '0')}`

  const upToDate = !force && (await isUpToDate(absolute, outPath))

  if (!upToDate) {
    await mkdir(path.dirname(outPath), { recursive: true })
    const pipeline = sharp(absolute, { limitInputPixels: false }).rotate()
    await pipeline
      .clone()
      .resize({
        width: kind === 'plan' ? PLAN_MAX_WIDTH : MAX_WIDTH,
        withoutEnlargement: true,
        fit: 'inside',
      })
      .webp({ quality: kind === 'plan' ? PLAN_QUALITY : QUALITY, effort: 6 })
      .toFile(outPath)
    stats.processed++
  } else {
    stats.skipped++
  }

  const meta = await sharp(outPath).metadata()
  const size = (await stat(outPath)).size
  stats.bytes += size

  if (!upToDate) {
    console.log(`  ✓ ${publicSrc}  ${meta.width}×${meta.height}  ${(size / 1024).toFixed(0)} KB`)
  }

  return {
    id,
    src: publicSrc,
    width: meta.width ?? 0,
    height: meta.height ?? 0,
    blur: await makeBlurDataUrl(absolute),
    source: path.posix.join(entry.dir.replaceAll('\\', '/'), source),
  }
}

/** Un derivado está al día si existe y es más nuevo que su original. */
async function isUpToDate(source, output) {
  if (!existsSync(output)) return false
  const [a, b] = await Promise.all([stat(source), stat(output)])
  return b.mtimeMs >= a.mtimeMs
}

/** Placeholder difuminado, embebido como data URL en el manifiesto. */
async function makeBlurDataUrl(source) {
  const buffer = await sharp(source, { limitInputPixels: false })
    .rotate()
    .resize({ width: BLUR_WIDTH, fit: 'inside' })
    .webp({ quality: 45, effort: 4 })
    .toBuffer()
  return `data:image/webp;base64,${buffer.toString('base64')}`
}

/** Hash corto de contenido: útil si algún día queremos nombres cache-busting. */
export async function contentHash(file) {
  return createHash('sha256')
    .update(await readFile(file))
    .digest('hex')
    .slice(0, 8)
}

function fail(message) {
  console.error(`\n✗ ${message}\n`)
  process.exit(1)
}

await main()
