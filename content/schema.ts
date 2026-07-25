import { z } from 'zod'
import { locales } from '@/lib/i18n/config'

/**
 * ESQUEMA DEL CONTENIDO
 *
 * Todo lo editorial (proyectos, concursos, estudio) se valida contra estos
 * esquemas al construir. Un año que falta, un slug duplicado o una traducción
 * sin rellenar rompen el build, que es exactamente donde queremos enterarnos.
 */

const localized = <T extends z.ZodTypeAny>(inner: T) =>
  z.object(
    Object.fromEntries(locales.map((locale) => [locale, inner])) as Record<
      (typeof locales)[number],
      T
    >,
  )

export const localizedText = localized(z.string().min(1))
export const localizedParagraphs = localized(z.array(z.string().min(1)).min(1))

export const projectStatus = z.enum(['built', 'in-progress', 'project', 'competition'])
export const projectType = z.enum([
  'housing',
  'multi-family',
  'refurbishment',
  'offices',
  'cultural',
])

export const projectSchema = z.object({
  /** Identificador en la URL y clave del manifiesto de imágenes. */
  slug: z.string().regex(/^[a-z0-9-]+$/, 'sólo minúsculas, números y guiones'),
  /** El título no se traduce: es el nombre propio del proyecto. */
  title: z.string().min(1),
  location: localizedText,
  year: z.number().int().min(1990).max(2100),
  status: projectStatus,
  type: projectType,
  /** Superficie construida, ya formateada (p. ej. "1.240 m²"). */
  area: z.string().optional(),
  client: z.string().optional(),
  collaboration: z.string().optional(),
  /** Frase corta que acompaña a la portada en el grid. */
  summary: localizedText,
  /** Memoria del proyecto: un elemento por párrafo. */
  body: localizedParagraphs,
  /**
   * Texto alternativo de cada imagen, **en el mismo orden que `scripts/curation.mjs`**.
   * Describe lo que se ve, no repite el nombre del proyecto: quien usa un lector de
   * pantalla ya sabe en qué ficha está. Si falta, se usa un genérico (proyecto +
   * ubicación), que funciona pero es peor: conviene rellenarlo.
   */
  alts: z.array(localizedText).optional(),
  /** Orden en la web: menor número, más arriba. La home coge los 6 primeros. */
  order: z.number().int(),
  featured: z.boolean().default(false),
})

export const competitionSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  location: localizedText,
  year: z.number().int().min(1990).max(2100),
  /** Colaboración; casi todos son con la plataforma VIA. */
  collaboration: z.string().optional(),
  order: z.number().int(),
})

export type Project = z.infer<typeof projectSchema>
export type Competition = z.infer<typeof competitionSchema>
export type ProjectStatus = z.infer<typeof projectStatus>
export type ProjectType = z.infer<typeof projectType>

/** Helper para declarar un proyecto con inferencia y autocompletado. */
export function defineProject(project: z.input<typeof projectSchema>) {
  return project
}

export function defineCompetition(competition: z.input<typeof competitionSchema>) {
  return competition
}
