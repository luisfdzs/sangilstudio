import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
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
    title: t.legal.title,
    alternates: {
      canonical: href(locale, 'legal'),
      languages: Object.fromEntries(locales.map((l) => [l, href(l, 'legal')])),
    },
  }
}

export default async function LegalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const t = getDictionary(locale)

  return (
    <div className="page-gutter pt-16 pb-(--spacing-section) md:pt-24">
      <h1 className="text-display tracking-tight uppercase">{t.legal.title}</h1>
      <p className="eyebrow mt-6">{t.legal.draft}</p>

      <div className="mt-10 grid max-w-2xl gap-10 md:mt-14">
        {t.legal.blocks.map((block) => (
          <section key={block.heading}>
            <h2 className="text-body">{block.heading}</h2>
            <p className="mt-3 text-body text-ink-soft">{block.body}</p>
          </section>
        ))}
      </div>
    </div>
  )
}
