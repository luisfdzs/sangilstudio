import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Media } from '@/components/ui/Media'
import { Reveal } from '@/components/ui/Reveal'
import { getCompetitions } from '@/lib/content'
import { isLocale, locales } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'

/** Prerrenderiza esta página para cada idioma. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return { title: getDictionary(locale).competitions.title }
}

/**
 * Índice de concursos: deliberadamente distinto de la obra construida — más
 * denso, tabular, con la imagen como apoyo y no como protagonista.
 */
export default async function CompetitionsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const t = getDictionary(locale)
  const competitions = getCompetitions()

  return (
    <div className="page-gutter pt-16 pb-(--spacing-section) md:pt-24">
      <header className="max-w-2xl">
        <h1 className="text-display font-serif">{t.competitions.title}</h1>
        <p className="mt-6 text-lead text-ink-soft">{t.competitions.lead}</p>
      </header>

      <ul className="mt-16 md:mt-24">
        {competitions.map((competition, index) => (
          <Reveal as="li" key={competition.slug} step={index % 3} className="border-t border-line">
            <div className="grid items-center gap-6 py-8 md:grid-cols-[3rem_1fr_1fr_10rem] md:gap-10">
              <span className="eyebrow hidden md:block">{String(index + 1).padStart(2, '0')}</span>
              <h2 className="text-lead font-serif">{competition.title}</h2>
              <p className="text-small text-ink-soft">
                {competition.location[locale]} · {competition.year}
              </p>
              {competition.cover ? (
                <Media
                  image={competition.cover}
                  alt={competition.cover.alt[locale]}
                  ratio="16 / 10"
                  sizes="(max-width: 768px) 100vw, 10rem"
                />
              ) : (
                <span aria-hidden />
              )}
            </div>
          </Reveal>
        ))}
      </ul>
    </div>
  )
}
