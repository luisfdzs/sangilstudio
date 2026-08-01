import type { Metadata, Viewport } from 'next'
import { Instrument_Sans, Instrument_Serif } from 'next/font/google'
import { notFound } from 'next/navigation'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { MobileNav } from '@/components/layout/MobileNav'
import { site } from '@/content/site'
import { isLocale, localeHtmlLang, locales, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { isIndexable } from '@/lib/site-env'
import '../../globals.css'

/**
 * Fuentes autoalojadas por Next: se sirven desde nuestro dominio, con `swap` y
 * sin petición a Google. Es la diferencia entre texto que aparece al instante y
 * texto que salta cuando la fuente llega.
 */
const sans = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-instrument-sans',
})

const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-instrument-serif',
})

export const viewport: Viewport = {
  themeColor: '#f4f2ee',
}

/** Las dos versiones de idioma se generan en build; no hay renderizado dinámico. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

/**
 * Sólo existen /es y /en: cualquier otro valor de `[locale]` es un 404. Antes esto se
 * declaraba con `export const dynamicParams = false`, pero **Cache Components no lo
 * admite** (ver `cacheComponents` en next.config.ts). El `notFound()` del layout, más
 * abajo, cumple la misma función: un idioma desconocido devuelve 404 en lugar de
 * intentar renderizarse.
 */

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
    // La imagen la aporta app/opengraph-image.jpg (convención de ficheros de Next),
    // generada por `npm run brand`. Aquí sólo se declara el formato de tarjeta.
    twitter: { card: 'summary_large_image', title, description },
    // Sólo la rama main se indexa; test y previews van con noindex. El criterio
    // y el motivo (test es "production" en su propio proyecto) en lib/site-env.ts.
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
      className={`${sans.variable} ${serif.variable}`}
    >
      <body className="flex min-h-svh flex-col">
        <Header locale={typedLocale} dictionary={dictionary} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer locale={typedLocale} />
        <MobileNav locale={typedLocale} dictionary={dictionary} />
      </body>
    </html>
  )
}
