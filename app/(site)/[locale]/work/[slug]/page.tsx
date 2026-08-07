import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BackToWork } from '@/components/sections/BackToWork'
import { ProjectPager } from '@/components/sections/ProjectPager'
import { Gallery, ratioOf } from '@/components/ui/Gallery'
import { GalleryToggle } from '@/components/ui/GalleryToggle'
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
        previous={previous}
        next={next}
        prevHref={href(locale, 'work', previous.slug)}
        nextHref={href(locale, 'work', next.slug)}
        prevLabel={`${t.project.previous}: ${previous.title}`}
        nextLabel={`${t.project.next}: ${next.title}`}
        locale={locale}
        dictionary={t}
      >
        <article className="page-gutter pt-16 pb-32 md:pt-24 md:pb-(--spacing-section)">
          <header>
            <h1 data-t="projectTitle" className="text-display tracking-tight uppercase">
              {project.title}
            </h1>

            <div data-t="projectMeta" className="mt-6 text-body md:mt-8">
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

          <div className="mt-12 flex justify-end md:mt-16">
            <GalleryToggle dictionary={t} />
          </div>

          <div className="mt-6 md:mt-8">
            <Gallery
              items={project.images.map((image, index) => ({
                key: image.id,
                ratio: ratioOf(image),
                content: (
                  <Reveal className="gallery-frame">
                    <Media
                      image={image}
                      alt={index === 0 ? image.alt[locale] || project.title : image.alt[locale]}
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, 40vw"
                    />
                  </Reveal>
                ),
              }))}
            />
          </div>
        </article>
      </ProjectPager>

      <BackToWork href={href(locale, 'work')} label={t.project.back} title={t.project.backLong} />
    </>
  )
}
