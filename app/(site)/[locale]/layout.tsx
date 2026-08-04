import type { Metadata, Viewport } from 'next'
import { Montserrat } from 'next/font/google'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { site } from '@/content/site'
import { isLocale, localeHtmlLang, locales, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { isIndexable } from '@/lib/site-env'
import '../../globals.css'

/**
 * MONTSERRAT, y sólo Montserrat, en toda la web (decisión del estudio).
 *
 * Autoalojada por Next: se sirve desde nuestro dominio, con `swap` y sin petición a
 * Google. Es la diferencia entre texto que aparece al instante y texto que salta cuando
 * la fuente llega. Se piden los tres pesos que usa el diseño y ni uno más —cada peso es
 * un fichero que descargar—: 400 para el cuerpo, 500 para los rótulos y 700 para el
 * hover en negrita del bloque de contacto.
 */
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-montserrat',
})

export const viewport: Viewport = {
  themeColor: '#ffffff',
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

/**
 * Sin pie de página. Lo tenía, con la dirección, los teléfonos y cuatro enlaces, y se
 * quitó de toda la web con el rediseño: el bloque de contacto de la portada dice ya
 * exactamente eso, y repetirlo debajo era decirlo dos veces con media pantalla de por
 * medio. La navegación vive entera en la cabecera, que está siempre a la vista.
 */
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
