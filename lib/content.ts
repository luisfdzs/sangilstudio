import { cacheLife, cacheTag } from 'next/cache'
import { z } from 'zod'
import { client } from '@/sanity/client'
import { PROJECTS_QUERY, PROJECT_SLUGS_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/queries'
import type { Localized } from '@/lib/i18n/config'

export const CONTENT_TAG = 'sanity-content'

const localizedString = z.object({ es: z.string().min(1), en: z.string().min(1) })
const localizedParagraphs = z.object({
  es: z.array(z.string().min(1)).min(1),
  en: z.array(z.string().min(1)).min(1),
})

const optionalLocalizedString = z
  .object({ es: z.string().nullish(), en: z.string().nullish() })
  .nullish()
  .transform((value) => ({ es: value?.es ?? '', en: value?.en ?? '' }))

const imageSchema = z.object({
  id: z.string(),
  src: z.string().url(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  blur: z.string().startsWith('data:image/'),
  alt: optionalLocalizedString,
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
  collaboration: z.string().nullish(),
  featured: z.boolean().nullish(),
  summary: localizedString,
  body: localizedParagraphs,
  images: z.array(imageSchema).min(1),
  plans: z.array(imageSchema).nullish(),
})

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

export type SiteSettings = Omit<
  z.infer<typeof siteSettingsSchema>,
  'hero' | 'street' | 'postalCode' | 'phone' | 'website'
> & {
  heroImages: DescribedImage[]
  street: string
  postalCode: string
  phone: string
  website: string
  websiteLabel: string
  instagramHandle: string | null
}

async function fetchContent<T>(query: string): Promise<T> {
  'use cache'
  cacheTag(CONTENT_TAG)
  cacheLife('max')
  return client.fetch<T>(query)
}

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

export async function getHeroImages(): Promise<DescribedImage[]> {
  const settings = await getSiteSettings()
  if (settings.heroImages.length > 0) return settings.heroImages

  const featured = await getFeaturedProjects()
  return featured.map((project) => project.cover)
}

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

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

function lastPathSegment(url: string): string | null {
  try {
    const segments = new URL(url).pathname.split('/').filter(Boolean)
    return segments.at(-1) ?? null
  } catch {
    return null
  }
}

export type { Localized }
