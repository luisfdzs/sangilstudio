import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProjectBar } from '@/components/sections/ProjectBar'
import { ProjectMobile } from '@/components/sections/ProjectMobile'
import { ProjectViewer } from '@/components/sections/ProjectViewer'
import { ProjectPager } from '@/components/sections/ProjectPager'
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
        previous={previous}
        next={next}
        prevHref={href(locale, 'work', previous.slug)}
        nextHref={href(locale, 'work', next.slug)}
        backHref={href(locale, 'work')}
        backLabel={t.project.back}
        backTitle={t.project.backLong}
        locale={locale}
        dictionary={t}
      >
        <article className="page-gutter pt-16 pb-32 md:pt-6 md:pb-(--spacing-section)">
          <div className="md:hidden">
            <ProjectMobile project={project} locale={locale} dictionary={t} />
          </div>

          <div className="hidden md:-mx-(--spacing-gutter) md:block">
            <ProjectViewer
              project={project}
              locale={locale}
              prevLabel={t.home.heroPrev}
              nextLabel={t.home.heroNext}
            />
          </div>
        </article>
      </ProjectPager>

      <ProjectBar
        href={href(locale, 'work')}
        label={t.project.back}
        title={t.project.backLong}
        project={project.title}
        architects={project.collaboration}
      />
    </>
  )
}
