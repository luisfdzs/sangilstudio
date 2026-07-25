#!/usr/bin/env node
/**
 * ASSETS DE MARCA · `npm run brand`
 *
 * Genera, desde los originales de `LOGO REDES/` (archivo maestro, fuera de git):
 *
 *   app/icon.png             favicon 512×512 (Next lo sirve en todos los tamaños)
 *   app/apple-icon.png       icono 180×180 para iOS
 *   app/opengraph-image.jpg  1200×630 para compartir en WhatsApp, LinkedIn, X…
 *
 * La marca es la **"S" del propio wordmark** del estudio, recortada de `LINKEDIN.png`.
 * Se descartó `sss+ S.jpg` (la "S" construida con "s" pequeñas): es bonita en grande,
 * pero a 16 px —el tamaño que de verdad importa en un favicon— se convierte en una
 * mancha gris. Un solo glifo con mucho contraste sí se lee.
 *
 * Los resultados SÍ se versionan (son 3 ficheros pequeños); los originales no.
 * Sólo hay que volver a ejecutarlo si cambia el logo o la foto de portada.
 *
 * El rótulo de la tarjeta es **neutro de idioma** ("SANGIL STUDIO · Pamplona · Navarra"):
 * la convención de ficheros de Next sirve una sola imagen para todo el sitio, así que
 * un subtítulo en español aparecería también al compartir las páginas en inglés.
 */

import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { MASTER_DIR, curation } from './curation.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const MARK = path.join(ROOT, MASTER_DIR, 'LOGO REDES', 'LINKEDIN.png')
const APP = path.join(ROOT, 'app')

const PAPER = { r: 0xf4, g: 0xf2, b: 0xee }

/**
 * Recorte de la "S" de "SANGIL" en el logotipo. Las coordenadas salen de medir la
 * caja del primer glifo oscuro del wordmark (x 165–260, y 293–449) más 10 px de aire.
 */
const MARK_CROP = { left: 155, top: 283, width: 115, height: 176 }

/** Foto de la imagen de compartir: la misma portada que abre la home. */
const OG_PROJECT = 'arrosadia-social-housing'

async function main() {
  if (!existsSync(MARK)) {
    console.error(
      `\n✗ No encuentro "${path.relative(ROOT, MARK)}".\n` +
        `  Descomprime el archivo maestro en la raíz y vuelve a ejecutar.\n`,
    )
    process.exit(1)
  }

  await mkdir(APP, { recursive: true })

  // --- Favicon e icono de iOS -------------------------------------------------
  // La marca es más alta que ancha, así que se escala por altura y se centra en un
  // lienzo cuadrado de color papel: nunca se deforma y siempre queda con aire.
  const icon = (size) =>
    sharp(MARK)
      .flatten({ background: PAPER })
      .extract(MARK_CROP)
      .resize({ height: Math.round(size * 0.62), fit: 'inside' })
      // Sube el contraste para que a 16 px la S se lea negra y no gris.
      .linear(1.15, -18)
      .flatten({ background: PAPER })
      // Segundo pase: centra lo escalado en un cuadrado exacto, rellenando con papel.
      .resize(size, size, { fit: 'contain', background: PAPER })
      .png({ compressionLevel: 9 })

  await icon(512).toFile(path.join(APP, 'icon.png'))
  await icon(180).toFile(path.join(APP, 'apple-icon.png'))

  // --- Imagen para compartir --------------------------------------------------
  // Foto oscurecida + la "S" en blanco encima. El blanco se consigue invirtiendo
  // la marca (negro sobre blanco → blanco sobre negro) y componiendo en modo
  // `screen`, que descarta el negro: así no hace falta recortar nada a mano.
  const cover = path.join(ROOT, 'public', 'media', 'projects', OG_PROJECT, '01.webp')
  if (!existsSync(cover)) {
    console.error(
      `\n✗ Falta la portada ${path.relative(ROOT, cover)}. Ejecuta antes: npm run images\n`,
    )
    process.exit(1)
  }

  const markWhite = await sharp(MARK)
    .flatten({ background: '#ffffff' })
    .extract(MARK_CROP)
    .resize({ height: 96, fit: 'inside' })
    .negate({ alpha: false })
    .linear(1.4, -40)
    .toColorspace('b-w')
    .png()
    .toBuffer()

  // Degradado + rótulo en un único SVG del tamaño de la tarjeta. El texto se
  // rasteriza aquí y se versiona como JPG, así que no hay dependencia de fuentes
  // en tiempo de ejecución.
  const overlay = Buffer.from(`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="veil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="45%" stop-color="#000" stop-opacity="0"/>
          <stop offset="100%" stop-color="#000" stop-opacity="0.78"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#veil)"/>
      <text x="72" y="512" fill="#ffffff" font-family="Segoe UI, Helvetica, Arial, sans-serif"
            font-size="30" letter-spacing="7.5">SANGIL STUDIO</text>
      <text x="72" y="566" fill="#ffffff" fill-opacity="0.82" font-family="Georgia, serif"
            font-size="34">Pamplona · Navarra</text>
    </svg>`)

  await sharp(cover)
    .resize(1200, 630, { fit: 'cover', position: 'centre' })
    .modulate({ brightness: 0.88 })
    .composite([
      { input: markWhite, top: 64, left: 72, blend: 'screen' },
      { input: overlay, top: 0, left: 0 },
    ])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(path.join(APP, 'opengraph-image.jpg'))

  console.log('✓ app/icon.png · app/apple-icon.png · app/opengraph-image.jpg')
  console.log(
    `  marca: ${path.basename(MARK)} · foto: ${OG_PROJECT} (${Object.keys(curation).length} proyectos en curaduría)`,
  )
}

await main()
