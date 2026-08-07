import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BackToWork } from '@/components/sections/BackToWork'
import { ProjectPager } from '@/components/sections/ProjectPager'
import { Media } from '@/components/ui/Media'
import { Reveal } from '@/components/ui/Reveal'
import { getProject, getProjects, getProjectSlugs } from '@/lib/content'
import { isLocale, locales } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { href } from '@/lib/i18n/routes'

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
    <>
      <ProjectPager
        prevHref={href(locale, 'work', previous.slug)}
        nextHref={href(locale, 'work', next.slug)}
        prevLabel={`${t.project.previous}: ${previous.title}`}
        nextLabel={`${t.project.next}: ${next.title}`}
      >
        <article className="page-gutter pt-16 pb-32 md:pt-24 md:pb-(--spacing-section)">
          <header>
            <h1 className="text-display tracking-tight uppercase">{project.title}</h1>

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

      <BackToWork href={href(locale, 'work')} label={t.project.back} title={t.project.backLong} />
    </>
  )
}
