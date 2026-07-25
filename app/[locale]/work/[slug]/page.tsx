import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Media } from '@/components/ui/Media'
import { Reveal } from '@/components/ui/Reveal'
import { getProject, getProjectNeighbours, getProjectSlugs } from '@/lib/content'
import { isLocale, locales } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { href } from '@/lib/i18n/routes'
import { isPortrait } from '@/lib/media'

/** Las 14 fichas × 2 idiomas se prerrenderizan: no hay render en petición. */
export function generateStaticParams() {
  return locales.flatMap((locale) => getProjectSlugs().map((slug) => ({ locale, slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const project = getProject(slug)
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

  const project = getProject(slug)
  if (!project) notFound()

  const t = getDictionary(locale)
  const neighbours = getProjectNeighbours(slug)
  const [cover, ...gallery] = project.images

  const facts = [
    { label: t.project.year, value: String(project.year) },
    { label: t.project.location, value: project.location[locale] },
    { label: t.project.type, value: t.type[project.type] },
    { label: t.project.status, value: t.status[project.status] },
    project.area && { label: t.project.area, value: project.area },
    project.client && { label: t.project.client, value: project.client },
    project.collaboration && { label: t.project.collaboration, value: project.collaboration },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact))

  return (
    <article>
      {/* Portada a sangre: la imagen entra antes que cualquier texto. */}
      {cover && (
        <Media
          image={cover}
          alt={cover.alt[locale]}
          sizes="100vw"
          priority
          // Proporción panorámica fija: la portada es una banda a sangre, no una
          // pantalla completa (eso queda reservado al hero de la home).
          ratio="21 / 9"
        />
      )}

      <div className="page-gutter">
        <header className="grid gap-10 py-16 md:grid-cols-[1.4fr_1fr] md:gap-20 md:py-24">
          <div>
            <h1 className="text-display font-serif text-balance">{project.title}</h1>
            <p className="mt-6 max-w-xl text-lead text-ink-soft">{project.summary[locale]}</p>
          </div>

          {/* Ficha técnica: lista de definición, semántica correcta y sobria. */}
          <dl className="grid grid-cols-2 gap-x-8 gap-y-6 self-start border-t border-line pt-6 md:grid-cols-1 md:border-t-0 md:pt-2">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="eyebrow">{fact.label}</dt>
                <dd className="mt-1 text-small">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </header>

        <div className="max-w-2xl space-y-6 pb-16 md:pb-24">
          {project.body[locale].map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
      </div>

      {/* Galería: verticales a media anchura, horizontales a anchura completa. */}
      {gallery.length > 0 && (
        <section className="page-gutter grid gap-8 md:grid-cols-2 md:gap-12">
          {gallery.map((image, index) => (
            <Reveal
              key={image.id}
              className={isPortrait(image) ? 'md:col-span-1' : 'md:col-span-2'}
              step={index % 2}
            >
              <Media
                image={image}
                alt={image.alt[locale]}
                sizes={
                  isPortrait(image)
                    ? '(max-width: 768px) 100vw, 46vw'
                    : '(max-width: 768px) 100vw, 92vw'
                }
              />
            </Reveal>
          ))}
        </section>
      )}

      {project.plans.length > 0 && (
        <section className="page-gutter pt-(--spacing-section)">
          <h2 className="eyebrow border-b border-line pb-4">{t.project.plans}</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {project.plans.map((plan, index) => (
              <Reveal key={plan.id} step={index}>
                {/* Los planos van sobre papel y sin recorte: son documentos. */}
                <Media
                  image={plan}
                  alt={plan.alt[locale]}
                  sizes="(max-width: 768px) 100vw, 46vw"
                  className="bg-paper"
                />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {neighbours && (
        <nav className="page-gutter mt-(--spacing-section) flex items-center justify-between gap-6 border-t border-line py-10">
          <Link
            href={href(locale, 'work', neighbours.previous.slug)}
            className="group max-w-[45%]"
            rel="prev"
          >
            <span className="eyebrow">{t.project.previous}</span>
            <span className="mt-2 block font-serif text-lead group-hover:opacity-70">
              {neighbours.previous.title}
            </span>
          </Link>

          <Link href={href(locale, 'work')} className="link-underline tap eyebrow shrink-0">
            {t.project.backToWork}
          </Link>

          <Link
            href={href(locale, 'work', neighbours.next.slug)}
            className="group max-w-[45%] text-right"
            rel="next"
          >
            <span className="eyebrow">{t.project.next}</span>
            <span className="mt-2 block font-serif text-lead group-hover:opacity-70">
              {neighbours.next.title}
            </span>
          </Link>
        </nav>
      )}
    </article>
  )
}
