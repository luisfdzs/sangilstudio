import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Media } from '@/components/ui/Media'
import { Reveal } from '@/components/ui/Reveal'
import { getFeaturedProjects, getSiteSettings } from '@/lib/content'
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
  return { title: getDictionary(locale).studio.title }
}

export default async function StudioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const t = getDictionary(locale)
  const [featured, settings] = await Promise.all([getFeaturedProjects(3), getSiteSettings()])
  const image = featured.at(1)?.cover ?? null

  return (
    <div className="pt-16 pb-(--spacing-section) md:pt-24">
      <div className="page-gutter">
        <header className="max-w-3xl">
          <h1 className="text-display font-serif">{t.studio.title}</h1>
        </header>

        <div className="mt-12 grid max-w-4xl gap-6 md:mt-20">
          {settings.statement[locale].map((paragraph, index) => (
            <Reveal key={paragraph.slice(0, 24)} step={index}>
              <p className={index === 0 ? 'text-lead font-serif text-balance' : 'text-ink-soft'}>
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>
      </div>

      {image && (
        <div className="page-gutter mt-(--spacing-section)">
          <Media image={image} alt="" ratio="21 / 9" sizes="92vw" />
        </div>
      )}

      <div className="page-gutter mt-(--spacing-section) grid gap-16 md:grid-cols-2 md:gap-24">
        <section>
          <h2 className="eyebrow border-b border-line pb-4">{t.studio.team}</h2>
          <ul className="mt-8 space-y-8">
            {settings.team.map((member) => (
              <li key={member.name}>
                <p className="text-lead font-serif">{member.name}</p>
                <p className="mt-1 text-small text-ink-soft">{member.role[locale]}</p>
                <a
                  className="link-underline tap mt-2 inline-block text-small"
                  href={`tel:${member.phone.replaceAll(' ', '')}`}
                >
                  {member.phone}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="eyebrow border-b border-line pb-4">{t.studio.collaborators}</h2>
          <ul className="mt-8 space-y-3">
            {(settings.collaborators ?? []).map((name) => (
              <li key={name} className="text-small text-ink-soft">
                {name}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
