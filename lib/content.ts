import { competitionSources } from '@/content/competitions'
import { projectSources } from '@/content/projects'
import { competitionSchema, projectSchema, type Competition, type Project } from '@/content/schema'
import { getImages, getPlans, knownSlugs, type MediaImage } from '@/lib/media'
import type { Localized } from '@/lib/i18n/config'

/**
 * ÚNICA PUERTA DE ACCESO AL CONTENIDO
 *
 * Ninguna página importa `content/` directamente: todas pasan por aquí. Eso es lo
 * que hace que la decisión "contenido en ficheros" sea reversible — si algún día
 * el contenido viene de un CMS, se reescribe este módulo y las vistas no se tocan.
 */

/**
 * Una imagen lista para pintar: la del manifiesto más su texto alternativo ya
 * resuelto en los dos idiomas. Las vistas no calculan alt nunca; lo reciben hecho.
 */
export type DescribedImage = MediaImage & { alt: Localized }

export type ProjectEntry = Project & {
  images: DescribedImage[]
  plans: DescribedImage[]
  cover: DescribedImage | null
}

export type CompetitionEntry = Competition & {
  images: DescribedImage[]
  cover: DescribedImage | null
}

/** Genérico para cuando falta el alt curado: peor que uno descriptivo, pero válido. */
function fallbackAlt(title: string, location: Localized): Localized {
  return {
    es: `${title}, ${location.es}`,
    en: `${title}, ${location.en}`,
  }
}

function describe(
  images: MediaImage[],
  alts: Localized[] | undefined,
  fallback: Localized,
): DescribedImage[] {
  return images.map((image, index) => ({ ...image, alt: alts?.[index] ?? fallback }))
}

function validate(): { projects: ProjectEntry[]; competitions: CompetitionEntry[] } {
  const projects = projectSources
    .map((source) => projectSchema.parse(source))
    .map((project) => {
      const fallback = fallbackAlt(project.title, project.location)
      const images = describe(getImages('projects', project.slug), project.alts, fallback)
      return {
        ...project,
        images,
        // Los planos no llevan alt curado: se describen por lo que son.
        plans: describe(getPlans('projects', project.slug), undefined, {
          es: `${project.title} — plano`,
          en: `${project.title} — drawing`,
        }),
        // La portada es siempre la primera de la curaduría.
        cover: images[0] ?? null,
      }
    })
    .sort((a, b) => a.order - b.order)

  const competitions = competitionSources
    .map((source) => competitionSchema.parse(source))
    .map((competition) => {
      const fallback = fallbackAlt(competition.title, competition.location)
      const images = describe(getImages('competitions', competition.slug), undefined, fallback)
      return { ...competition, images, cover: images[0] ?? null }
    })
    .sort((a, b) => a.order - b.order)

  assertUniqueSlugs(
    projects.map((p) => p.slug),
    'projects',
  )
  assertUniqueSlugs(
    competitions.map((c) => c.slug),
    'competitions',
  )
  assertMediaExists(projects, 'projects')

  return { projects, competitions }
}

function assertUniqueSlugs(slugs: string[], label: string) {
  const duplicated = slugs.filter((slug, index) => slugs.indexOf(slug) !== index)
  if (duplicated.length > 0) {
    throw new Error(`[content] slugs duplicados en ${label}: ${duplicated.join(', ')}`)
  }
}

/**
 * Un proyecto sin imágenes es un error de curaduría, no un caso válido: la web es
 * fotografía. Si falla aquí, revisa `scripts/curation.mjs` y ejecuta `npm run images`.
 */
function assertMediaExists(projects: ProjectEntry[], collection: 'projects') {
  const orphans = projects.filter((project) => project.images.length === 0)
  if (orphans.length > 0) {
    throw new Error(
      `[content] proyectos sin imágenes: ${orphans.map((p) => p.slug).join(', ')}. ` +
        `Slugs disponibles en el manifiesto: ${knownSlugs(collection).join(', ')}`,
    )
  }
}

const { projects, competitions } = validate()

export function getProjects(): ProjectEntry[] {
  return projects
}

export function getFeaturedProjects(limit = 6): ProjectEntry[] {
  const featured = projects.filter((project) => project.featured)
  return (featured.length >= limit ? featured : projects).slice(0, limit)
}

export function getProject(slug: string): ProjectEntry | undefined {
  return projects.find((project) => project.slug === slug)
}

export function getProjectSlugs(): string[] {
  return projects.map((project) => project.slug)
}

/** Proyecto anterior y siguiente, en bucle, para navegar sin volver al índice. */
export function getProjectNeighbours(slug: string): {
  previous: ProjectEntry
  next: ProjectEntry
} | null {
  const index = projects.findIndex((project) => project.slug === slug)
  if (index === -1 || projects.length < 2) return null
  const previous = projects[(index - 1 + projects.length) % projects.length]
  const next = projects[(index + 1) % projects.length]
  if (!previous || !next) return null
  return { previous, next }
}

export function getCompetitions(): CompetitionEntry[] {
  return competitions
}

/** Años presentes en la obra, de más reciente a más antiguo (para filtros). */
export function getProjectYears(): number[] {
  return [...new Set(projects.map((project) => project.year))].sort((a, b) => b - a)
}
