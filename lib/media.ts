import { z } from 'zod'
import manifest from '@/content/media-manifest.json'

/**
 * Acceso tipado al manifiesto que genera `npm run images`.
 *
 * El manifiesto es la única fuente de verdad sobre qué imágenes existen y qué
 * dimensiones tienen. Se valida con zod al arrancar: si alguien edita el JSON a
 * mano o el pipeline cambia de forma, el build falla aquí y no en producción.
 */

const imageSchema = z.object({
  id: z.string(),
  src: z.string().startsWith('/media/'),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  blur: z.string().startsWith('data:image/'),
  source: z.string(),
})

const entrySchema = z.object({
  images: z.array(imageSchema),
  plans: z.array(imageSchema),
})

const manifestSchema = z.object({
  projects: z.record(z.string(), entrySchema),
  competitions: z.record(z.string(), entrySchema),
})

const media = manifestSchema.parse(manifest)

export type MediaImage = z.infer<typeof imageSchema>
export type MediaCollection = keyof typeof media

/** Relación de aspecto, para reservar el hueco exacto antes de cargar. */
export function aspectRatio(image: MediaImage): number {
  return image.width / image.height
}

export function isPortrait(image: MediaImage): boolean {
  return aspectRatio(image) < 0.95
}

export function getMedia(collection: MediaCollection, slug: string) {
  return media[collection][slug] ?? { images: [], plans: [] }
}

export function getImages(collection: MediaCollection, slug: string): MediaImage[] {
  return getMedia(collection, slug).images
}

export function getPlans(collection: MediaCollection, slug: string): MediaImage[] {
  return getMedia(collection, slug).plans
}

/** Portada: la primera imagen de la curaduría. */
export function getCover(collection: MediaCollection, slug: string): MediaImage | null {
  return getImages(collection, slug)[0] ?? null
}

/** Slugs que el manifiesto conoce, para validar el contenido contra la realidad. */
export function knownSlugs(collection: MediaCollection): string[] {
  return Object.keys(media[collection])
}
