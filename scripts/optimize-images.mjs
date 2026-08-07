#!/usr/bin/env node

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

const MAX_WIDTH = 2560
const QUALITY = 82
const PLAN_MAX_WIDTH = 2000
const PLAN_QUALITY = 88
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

async function isUpToDate(source, output) {
  if (!existsSync(output)) return false
  const [a, b] = await Promise.all([stat(source), stat(output)])
  return b.mtimeMs >= a.mtimeMs
}

async function makeBlurDataUrl(source) {
  const buffer = await sharp(source, { limitInputPixels: false })
    .rotate()
    .resize({ width: BLUR_WIDTH, fit: 'inside' })
    .webp({ quality: 45, effort: 4 })
    .toBuffer()
  return `data:image/webp;base64,${buffer.toString('base64')}`
}

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
