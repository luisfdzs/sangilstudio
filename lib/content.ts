import { z } from 'zod'
import { client } from '@/sanity/client'
import {
  COMPETITIONS_QUERY,
  PROJECTS_QUERY,
  PROJECT_SLUGS_QUERY,
  SITE_SETTINGS_QUERY,
} from '@/sanity/queries'
import type { Localized } from '@/lib/i18n/config'

/**
 * ÚNICA PUERTA DE ACCESO AL CONTENIDO
 *
 * Ninguna página consulta Sanity directamente: todas pasan por aquí. Cuando el
 * contenido vivía en ficheros del repositorio, este módulo era el que lo leía; ahora
 * lee del CMS y **las vistas no cambiaron**. Era exactamente para esto.
 *
 * Diferencia importante de criterio respecto a la etapa de ficheros: antes, un
 * proyecto sin imágenes **rompía el build a propósito**. Ahora el contenido lo edita
 * una persona desde el navegador, así que un documento a medio rellenar **no puede
 * tumbar la web**: se descarta ese documento, se avisa por consola y el resto sigue
 * publicándose.
 */

/** Etiqueta de caché: el webhook de Sanity la invalida al publicar. */
export const CONTENT_TAG = 'sanity-content'

const localizedString = z.object({ es: z.string().min(1), en: z.string().min(1) })
const localizedParagraphs = z.object({
  es: z.array(z.string().min(1)).min(1),
  en: z.array(z.string().min(1)).min(1),
})

const imageSchema = z.object({
  id: z.string(),
  src: z.string().url(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  blur: z.string().startsWith('data:image/'),
  alt: localizedString,
})

const projectSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  location: localizedString,
  year: z.number().int(),
  status: z.enum(['built', 'in-progress', 'project', 'competition']),
  type: z.enum(['housing', 'multi-family', 'refurbishment', 'offices', 'cultural']),
  area: z.string().nullish(),
  client: z.string().nullish(),
  collaboration: z.string().nullish(),
  featured: z.boolean().nullish(),
  summary: localizedString,
  body: localizedParagraphs,
  images: z.array(imageSchema).min(1),
  plans: z.array(imageSchema).nullish(),
})

const competitionSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  location: localizedString,
  year: z.number().int(),
  collaboration: z.string().nullish(),
  images: z.array(imageSchema).nullish(),
})

const siteSettingsSchema = z.object({
  statement: localizedParagraphs,
  team: z
    .array(z.object({ name: z.string().min(1), role: localizedString, phone: z.string().min(1) }))
    .min(1),
  collaborators: z.array(z.string()).nullish(),
  email: z.string().email(),
  city: z.string().min(1),
  region: localizedString,
  country: localizedString,
  instagram: z.string().url().nullish(),
  linkedin: z.string().url().nullish(),
})

export type DescribedImage = z.infer<typeof imageSchema>
export type ProjectEntry = z.infer<typeof projectSchema> & {
  plans: DescribedImage[]
  cover: DescribedImage
}
export type CompetitionEntry = z.infer<typeof competitionSchema> & {
  images: DescribedImage[]
  cover: DescribedImage | null
}
export type SiteSettings = z.infer<typeof siteSettingsSchema>

/** Lee de Sanity con la etiqueta de caché puesta: la web es estática hasta que se publique algo. */
async function fetchContent<T>(query: string): Promise<T> {
  return client.fetch<T>(query, {}, { next: { tags: [CONTENT_TAG], revalidate: 3600 } })
}

/**
 * Valida cada documento por separado y descarta los que no cumplen, en vez de fallar
 * en bloque. Así un proyecto sin imágenes o sin traducir no deja la web fuera de servicio.
 */
function keepValid<T>(items: unknown[], schema: z.ZodType<T>, label: string): T[] {
  const valid: T[] = []
  for (const item of items) {
    const result = schema.safeParse(item)
    if (result.success) {
      valid.push(result.data)
    } else {
      const name =
        (item as { title?: string; slug?: string })?.title ??
        (item as { slug?: string })?.slug ??
        '(sin título)'
      console.warn(
        `[contenido] Se omite ${label} «${name}»: ${result.error.issues
          .map((issue) => `${issue.path.join('.')} ${issue.message}`)
          .join('; ')}`,
      )
    }
  }
  return valid
}

export async function getProjects(): Promise<ProjectEntry[]> {
  const raw = await fetchContent<unknown[]>(PROJECTS_QUERY)
  return keepValid(raw, projectSchema, 'el proyecto').map((project) => ({
    ...project,
    plans: project.plans ?? [],
    // La portada es siempre la primera de la galería; el esquema garantiza que existe.
    cover: project.images[0]!,
  }))
}

export async function getFeaturedProjects(limit = 6): Promise<ProjectEntry[]> {
  const projects = await getProjects()
  const featured = projects.filter((project) => project.featured)
  return (featured.length > 0 ? featured : projects).slice(0, limit)
}

export async function getProject(slug: string): Promise<ProjectEntry | undefined> {
  const projects = await getProjects()
  return projects.find((project) => project.slug === slug)
}

export async function getProjectSlugs(): Promise<string[]> {
  const raw = await fetchContent<{ slug: string | null }[]>(PROJECT_SLUGS_QUERY)
  return raw.map((row) => row.slug).filter((slug): slug is string => Boolean(slug))
}

/** Proyecto anterior y siguiente, en bucle, para navegar sin volver al índice. */
export async function getProjectNeighbours(
  slug: string,
): Promise<{ previous: ProjectEntry; next: ProjectEntry } | null> {
  const projects = await getProjects()
  const index = projects.findIndex((project) => project.slug === slug)
  if (index === -1 || projects.length < 2) return null
  const previous = projects[(index - 1 + projects.length) % projects.length]
  const next = projects[(index + 1) % projects.length]
  if (!previous || !next) return null
  return { previous, next }
}

export async function getCompetitions(): Promise<CompetitionEntry[]> {
  const raw = await fetchContent<unknown[]>(COMPETITIONS_QUERY)
  return keepValid(raw, competitionSchema, 'el concurso').map((competition) => ({
    ...competition,
    images: competition.images ?? [],
    cover: competition.images?.[0] ?? null,
  }))
}

/**
 * Ajustes del estudio. Si faltan o están incompletos es un fallo grave (afecta al pie
 * de todas las páginas), así que aquí sí se lanza error con un mensaje claro.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  const raw = await fetchContent<unknown>(SITE_SETTINGS_QUERY)
  const result = siteSettingsSchema.safeParse(raw)
  if (!result.success) {
    throw new Error(
      `[contenido] El documento «Estudio y contacto» del panel está incompleto: ` +
        result.error.issues.map((i) => `${i.path.join('.')} ${i.message}`).join('; '),
    )
  }
  return result.data
}

export type { Localized }
