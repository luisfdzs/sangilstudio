import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Hero } from '@/components/sections/Hero'
import { ProjectCard } from '@/components/sections/ProjectCard'
import { Reveal } from '@/components/ui/Reveal'
import { studioStatement } from '@/content/site'
import { getFeaturedProjects } from '@/lib/content'
import { isLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { href } from '@/lib/i18n/routes'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const t = getDictionary(locale)
  const featured = getFeaturedProjects(6)
  const [hero, ...rest] = featured
  if (!hero) notFound()

  return (
    <>
      <Hero project={hero} locale={locale} />

      {/* Manifiesto: una sola idea, mucho aire alrededor. */}
      <section className="page-gutter py-(--spacing-section)">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">{t.home.heroLead}</p>
          <p className="mt-8 text-title font-serif text-balance">{studioStatement[locale][0]}</p>
          <p className="mt-6 max-w-2xl text-ink-soft">{studioStatement[locale][1]}</p>
          <Link
            href={href(locale, 'studio')}
            className="link-underline tap mt-10 inline-block text-small"
          >
            {t.nav.studio}
          </Link>
        </Reveal>
      </section>

      {/* Obra seleccionada: ritmo alterno ancho/mitad para que no parezca catálogo. */}
      <section className="page-gutter">
        <div className="flex items-baseline justify-between border-b border-line pb-4">
          <h2 className="eyebrow">{t.home.selectedWork}</h2>
          <Link href={href(locale, 'work')} className="link-underline tap text-small">
            {t.home.viewAllWork}
          </Link>
        </div>

        <div className="mt-10 grid gap-x-8 gap-y-16 md:mt-16 md:grid-cols-2 md:gap-y-24">
          {rest.map((project, index) => {
            // Cada tercera pieza ocupa el ancho completo: rompe el ritmo del grid
            // para que no se lea como un catálogo. El col-span va en el hijo
            // directo del grid (Reveal), no en la tarjeta.
            const wide = index % 3 === 0
            return (
              <Reveal
                key={project.slug}
                step={index % 2}
                className={wide ? 'md:col-span-2' : undefined}
              >
                <ProjectCard project={project} locale={locale} span={wide ? 'wide' : 'half'} />
              </Reveal>
            )
          })}
        </div>
      </section>

      <section className="page-gutter py-(--spacing-section)">
        <Reveal className="border-t border-line pt-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <p className="max-w-xl text-lead font-serif">{studioStatement[locale][2]}</p>
            <Link href={href(locale, 'competitions')} className="link-underline tap text-small">
              {t.home.viewAllCompetitions}
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}
