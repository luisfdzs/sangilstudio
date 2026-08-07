import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProjectPager } from '@/components/sections/ProjectPager'
import { Media } from '@/components/ui/Media'
import { Reveal } from '@/components/ui/Reveal'
import { getProject, getProjects, getProjectSlugs } from '@/lib/content'
import { isLocale, locales } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { href } from '@/lib/i18n/routes'

/** Las fichas × 2 idiomas se prerrenderizan: no hay render en petición. */
export async function generateStaticParams() {
  const slugs = await getProjectSlugs()
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const project = await getProject(slug)
  if (!isLocale(locale) || !project) return {}

  return {
    title: project.title,
    description: project.summary[locale],
    alternates: {
      canonical: href(locale, 'work', slug),
      languages: Object.fromEntries(locales.map((l) => [l, href(l, 'work', slug)])),
    },
    openGraph: {
      title: project.title,
      description: project.summary[locale],
      images: project.cover ? [{ url: project.cover.src }] : undefined,
    },
  }
}

/**
 * LA FICHA DE UN PROYECTO. Cinco líneas de datos y las fotos, en este orden y sin nada
 * más. Es literalmente lo que pidió el estudio.
 *
 * Lo que había antes y ya no está: portada a sangre, resumen, memoria de varios
 *
 * Las imágenes van a **una sola columna**, cada una a todo el ancho de la caja de texto
 * y con su proporción real, sin recortar. Un proyecto se entiende viendo las fotos
 * grandes y en el orden en que el estudio las ordenó, no en una rejilla que las mezcla.
 */
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const project = await getProject(slug)
  if (!project) notFound()

  const t = getDictionary(locale)

  const projects = await getProjects()
  const position = projects.findIndex((entry) => entry.slug === slug)
  const previous = projects[(position - 1 + projects.length) % projects.length]!
  const next = projects[(position + 1) % projects.length]!

  return (
    <ProjectPager
      prevHref={href(locale, 'work', previous.slug)}
      nextHref={href(locale, 'work', next.slug)}
      prevLabel={`${t.project.previous}: ${previous.title}`}
      nextLabel={`${t.project.next}: ${next.title}`}
    >
      <article className="page-gutter pt-16 pb-(--spacing-section) md:pt-24">
        <header>
          <h1 className="text-display tracking-tight uppercase">{project.title}</h1>

          {/* Las líneas de datos, una debajo de otra y pegadas al margen. Sin filete, sin
            rejilla y sin rótulos salvo donde hace falta decir qué es cada nombre: en
            «Pamplona, Navarra · 2023» y «Vivienda» ya se ve, y en una lista de personas,
            no. */}
          <div className="mt-6 text-body md:mt-8">
            <p>
              {project.location[locale]}, {project.year}
            </p>
            <p>{t.type[project.type]}</p>
            {project.collaboration && (
              <p>
                {t.project.architects}: {project.collaboration}
              </p>
            )}
            {project.client && (
              <p>
                {t.project.client}: {project.client}
              </p>
            )}
          </div>
        </header>

        <div className="mt-12 flex flex-col gap-8 md:mt-16 md:gap-12">
          {project.images.map((image, index) => (
            <Reveal key={image.id}>
              <Media
                image={image}
                alt={index === 0 ? image.alt[locale] || project.title : image.alt[locale]}
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, 76vw"
              />
            </Reveal>
          ))}
        </div>
      </article>
    </ProjectPager>
  )
}
