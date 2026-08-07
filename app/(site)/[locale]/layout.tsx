import type { Metadata, Viewport } from 'next'
import { Montserrat } from 'next/font/google'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { site } from '@/content/site'
import { isLocale, localeHtmlLang, locales, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { isIndexable } from '@/lib/site-env'
import '../../globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-montserrat',
})

export const viewport: Viewport = {
  themeColor: '#ffffff',
}

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

  const isSpanish = locale === 'es'
  const title = `${site.name} · ${isSpanish ? 'Estudio de arquitectura en Pamplona' : 'Architecture studio in Pamplona'}`
  const description = isSpanish
    ? 'Estudio de arquitectura en Pamplona. Vivienda, rehabilitación, oficinas y concursos en Navarra y fuera de ella.'
    : 'Architecture studio based in Pamplona. Housing, refurbishment, offices and competitions in Navarre and beyond.'

  return {
    metadataBase: new URL(site.url),
    title: { default: title, template: `%s · ${site.name}` },
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [localeHtmlLang[l], `/${l}`])),
    },
    openGraph: {
      type: 'website',
      siteName: site.name,
      locale: localeHtmlLang[locale],
      title,
      description,
      url: `/${locale}`,
    },
    twitter: { card: 'summary_large_image', title, description },
    robots: isIndexable() ? { index: true, follow: true } : { index: false, follow: false },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const typedLocale: Locale = locale
  const dictionary = getDictionary(typedLocale)

  return (
    <html
      lang={localeHtmlLang[typedLocale]}
      data-scroll-behavior="smooth"
      className={montserrat.variable}
    >
      <body className="flex min-h-svh flex-col">
        <Header locale={typedLocale} dictionary={dictionary} />
        <main id="main" className="flex-1">
          {children}
        </main>
      </body>
    </html>
  )
}
