import { cacheLife, cacheTag } from 'next/cache'
import { z } from 'zod'
import { client } from '@/sanity/client'
import { PROJECTS_QUERY, PROJECT_SLUGS_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/queries'
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
  type: z.enum([
    'housing',
    'multi-family',
    'refurbishment',
    'offices',
    'cultural',
    'education',
    'sports',
    'health',
    'commercial',
  ]),
  area: z.string().nullish(),
  client: z.string().nullish(),
  /** Nombres de los arquitectos que firman la obra, separados por comas. */
  collaboration: z.string().nullish(),
  featured: z.boolean().nullish(),
  summary: localizedString,
  body: localizedParagraphs,
  images: z.array(imageSchema).min(1),
  plans: z.array(imageSchema).nullish(),
})

/**
 * DATOS DE CONTACTO POR DEFECTO
 *
 * El bloque de contacto de la portada es un texto fijo, línea a línea, y se compone de
 * campos del panel. Los cuatro de aquí abajo se añadieron con el rediseño, así que el
 * documento que está publicado todavía no los trae: `initialValue` sólo se aplica a
 * documentos nuevos, no a los que ya existen.
 *
 * Si se declararan obligatorios, la web entera dejaría de servirse hasta que alguien
 * abriera el panel y volviera a publicar. Se declaran opcionales y se rellenan con
 * estos valores —los que el estudio dio—, así que la web sale bien desde el primer
 * despliegue y en cuanto Yago escriba los suyos mandan los del panel.
 */
const CONTACT_FALLBACK = {
  street: 'Castillo de Maya 35, bajo',
  postalCode: '31004',
  phone: '+34 664 197 624',
  website: 'https://www.sangilstudio.com',
} as const

const siteSettingsSchema = z.object({
  hero: z.array(z.object({ image: imageSchema.nullish() })).nullish(),
  statement: localizedParagraphs,
  team: z
    .array(z.object({ name: z.string().min(1), role: localizedString, phone: z.string().min(1) }))
    .min(1),
  collaborators: z.array(z.string()).nullish(),
  street: z.string().nullish(),
  postalCode: z.string().nullish(),
  city: z.string().min(1),
  region: localizedString,
  country: localizedString,
  phone: z.string().nullish(),
  email: z.string().email(),
  website: z.string().url().nullish(),
  instagram: z.string().url().nullish(),
  linkedin: z.string().url().nullish(),
})

export type DescribedImage = z.infer<typeof imageSchema>
export type ProjectEntry = z.infer<typeof projectSchema> & {
  plans: DescribedImage[]
  cover: DescribedImage
}

/**
 * Los ajustes ya resueltos: sin nulos en lo que el bloque de contacto necesita sí o sí,
 * con las imágenes de la portada aplanadas y con el nombre de usuario de Instagram ya
 * extraído de su dirección.
 */
export type SiteSettings = Omit<
  z.infer<typeof siteSettingsSchema>,
  'hero' | 'street' | 'postalCode' | 'phone' | 'website'
> & {
  heroImages: DescribedImage[]
  street: string
  postalCode: string
  phone: string
  website: string
  /** `www.sangilstudio.com`: la dirección tal y como se enseña, sin protocolo. */
  websiteLabel: string
  /** `sangilstudio`: el usuario, sin arroba, sacado de la URL del perfil. */
  instagramHandle: string | null
}

/**
 * Lee de Sanity y **cachea con etiqueta**: la web se sirve estática hasta que alguien
 * publica, y entonces el webhook invalida esta etiqueta y se regenera.
 *
 * Ojo, aquí hubo un fallo silencioso: antes se pasaba `{ next: { tags, revalidate } }`
 * como tercer argumento de `client.fetch`, pero **`@sanity/client` ignora esa opción**
 * (no usa el `fetch` de Next con sus extensiones). Resultado: los datos quedaban
 * horneados en el build sin etiqueta alguna, el webhook respondía 200 y la web no se
 * actualizaba nunca. La forma correcta en Next 16 es la directiva `use cache` con
 * `cacheTag`, que sí registra la dependencia. Verificado midiendo el tiempo real desde
 * «Publicar» hasta ver el cambio.
 */
async function fetchContent<T>(query: string): Promise<T> {
  'use cache'
  cacheTag(CONTENT_TAG)
  // 'max': se sirve de caché indefinidamente y sólo cambia cuando se publica algo.
  cacheLife('max')
  return client.fetch<T>(query)
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

/**
 * Todos los proyectos, **incluidos los concursos**: son proyectos con
 * `status: 'competition'`, no otro tipo de documento. Si alguna vista necesitara
 * separarlos, se filtra por `status` aquí mismo y no hace falta otra consulta.
 */
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
  const raw = await fetchContent<unknown[]>(PROJECT_SLUGS_QUERY)
  return (raw as { slug: string | null }[])
    .map((row) => row.slug)
    .filter((slug): slug is string => Boolean(slug))
}

/**
 * Las imágenes que se funden en la portada.
 *
 * Salen de los proyectos que el estudio elige en el panel. Si esa lista está vacía
 * —o los proyectos elegidos se quedaron sin galería—, se recurre a los destacados: la
 * portada de esta web es sólo imágenes, así que quedarse sin ninguna la dejaría en
 * blanco, y eso no puede pasar por no haber rellenado un campo.
 */
export async function getHeroImages(limit = 6): Promise<DescribedImage[]> {
  const settings = await getSiteSettings()
  const chosen = settings.heroImages.slice(0, limit)
  if (chosen.length > 0) return chosen

  const featured = await getFeaturedProjects(limit)
  return featured.map((project) => project.cover)
}

/**
 * Ajustes del estudio. Si faltan o están incompletos es un fallo grave (afecta al
 * bloque de contacto de la portada), así que aquí sí se lanza error con un mensaje claro.
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

  const { hero, street, postalCode, phone, website, ...rest } = result.data
  const resolvedWebsite = website || CONTACT_FALLBACK.website

  return {
    ...rest,
    // Un proyecto de la lista puede haberse quedado sin galería: ese hueco se cae aquí.
    heroImages: (hero ?? [])
      .map((entry) => entry.image)
      .filter((image): image is DescribedImage => Boolean(image)),
    street: street || CONTACT_FALLBACK.street,
    postalCode: postalCode || CONTACT_FALLBACK.postalCode,
    phone: phone || CONTACT_FALLBACK.phone,
    website: resolvedWebsite,
    websiteLabel: hostnameOf(resolvedWebsite),
    instagramHandle: rest.instagram ? lastPathSegment(rest.instagram) : null,
  }
}

/** `https://www.sangilstudio.com/` → `www.sangilstudio.com`. */
function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

/** `https://instagram.com/sangilstudio/` → `sangilstudio`. */
function lastPathSegment(url: string): string | null {
  try {
    const segments = new URL(url).pathname.split('/').filter(Boolean)
    return segments.at(-1) ?? null
  } catch {
    return null
  }
}

export type { Localized }
