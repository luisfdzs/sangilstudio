import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { connection, NextResponse } from 'next/server'

/**
 * Puente entre el panel de tipografía y el repositorio.
 *
 * El panel vive en el navegador, así que sus valores se quedarían en el
 * `localStorage` y nadie más podría verlos. Esta ruta los vuelca a un fichero
 * local (`typelab.local.json`) cada vez que se mueve un control, de modo que al
 * decir «ya está» los ajustes elegidos se pueden leer y llevar al código.
 *
 * Sólo existe en desarrollo: en producción responde 404.
 */

const FILE = path.join(process.cwd(), 'typelab.local.json')
const DEV = process.env.NODE_ENV !== 'production'

export async function GET() {
  // El proyecto usa `cacheComponents`: sin esto, la lectura se intentaría prerenderizar.
  await connection()
  if (!DEV) return new NextResponse(null, { status: 404 })

  try {
    return NextResponse.json(JSON.parse(await readFile(FILE, 'utf8')))
  } catch {
    return NextResponse.json({ styles: null })
  }
}

export async function POST(request: Request) {
  if (!DEV) return new NextResponse(null, { status: 404 })

  const body: unknown = await request.json()
  if (typeof body !== 'object' || body === null || !('styles' in body)) {
    return NextResponse.json({ ok: false, error: 'Falta «styles»' }, { status: 400 })
  }

  const saved = { savedAt: new Date().toISOString(), ...body }
  await writeFile(FILE, `${JSON.stringify(saved, null, 2)}\n`, 'utf8')

  return NextResponse.json({ ok: true, savedAt: saved.savedAt })
}
