import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Reveal } from '@/components/ui/Reveal'
import { getSiteSettings } from '@/lib/content'
import { isLocale, locales } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { href } from '@/lib/i18n/routes'

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

  const t = getDictionary(locale)
  return {
    title: t.studio.title,
    alternates: {
      canonical: href(locale, 'studio'),
      languages: Object.fromEntries(locales.map((l) => [l, href(l, 'studio')])),
    },
  }
}

export default async function StudioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const t = getDictionary(locale)
  const settings = await getSiteSettings()

  return (
    <div className="page-gutter pt-16 pb-(--spacing-section) md:pt-24">
      <h1 className="text-display tracking-tight uppercase">{t.studio.title}</h1>

      <div className="mt-10 grid max-w-2xl gap-6 md:mt-14">
        {settings.statement[locale].map((paragraph, index) => (
          <Reveal key={paragraph.slice(0, 24)} step={index}>
            <p className={index === 0 ? 'text-lead' : 'text-ink-soft'}>{paragraph}</p>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
