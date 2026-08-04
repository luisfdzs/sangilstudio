import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ScrollToSection } from '@/components/ui/ScrollToSection'
import { isLocale, locales } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { sectionFromSegment, sectionKeys, sections } from '@/lib/i18n/routes'
import { HomeContent } from '../HomeContent'

/**
 * Las secciones de la portada, con URL de ruta. Hoy sólo hay una: `/es/contact`.
 *
 * Devuelve la portada ENTERA y deja la vista en la sección pedida. No es una página
 * distinta con el mismo contenido: es la misma página abierta en otro punto, y de ahí
 * las dos consecuencias que se ven abajo —canonical al inicio y fuera del sitemap—.
 *
 * Sigue siendo un segmento dinámico y no una carpeta `contact/`, aunque ahora quede
 * una sola sección: la lista vive en un único sitio (`lib/i18n/routes.ts`) y añadir o
 * quitar secciones no toca el árbol de ficheros. `work` y `studio` son segmentos
 * estáticos y por tanto tienen prioridad sobre este: `/es/studio` va a su página, que
 * desde el rediseño es una página de verdad. Cualquier otro segmento —`/es/lo-que-sea`—
 * no está en el mapa y devuelve 404, igual que antes.
 */
export function generateStaticParams() {
  return locales.flatMap((locale) => sectionKeys.map((section) => ({ locale, section })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; section: string }>
}): Promise<Metadata> {
  const { locale, section } = await params
  if (!isLocale(locale)) return {}

  const key = sectionFromSegment(section)
  if (!key) return {}

  /**
   * Sólo el título: sirve para la pestaña y para el enlace cuando alguien lo comparte.
   *
   * `alternates` NO se toca a propósito: se hereda del layout de idioma, que apunta el
   * canonical a `/es` y los `hreflang` a `/es` y `/en`. Es lo correcto aquí —estas tres
   * direcciones devuelven el mismo HTML— y es también el motivo de no declararlas: un
   * canonical propio las convertiría en tres páginas duplicadas a ojos de Google.
   */
  return { title: getDictionary(locale).nav[key] }
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ locale: string; section: string }>
}) {
  const { locale, section } = await params
  if (!isLocale(locale)) notFound()

  const key = sectionFromSegment(section)
  if (!key) notFound()

  return (
    <>
      <HomeContent locale={locale} />
      <ScrollToSection id={sections[key]} />
    </>
  )
}
