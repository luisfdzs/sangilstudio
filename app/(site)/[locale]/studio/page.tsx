import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Reveal } from '@/components/ui/Reveal'
import { getSiteSettings } from '@/lib/content'
import { isLocale, locales } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { href } from '@/lib/i18n/routes'

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

  const t = getDictionary(locale)
  return {
    title: t.studio.title,
    alternates: {
      canonical: href(locale, 'studio'),
      languages: Object.fromEntries(locales.map((l) => [l, href(l, 'studio')])),
    },
  }
}

/**
 * EL ESTUDIO, EN SU PROPIA PANTALLA.
 *
 * Antes era una sección de la portada con dirección propia (`/es/studio` devolvía el
 * inicio). Ahora es una página de verdad: la portada se quedó en el hero y el contacto,
 * y los datos del estudio necesitaban un sitio donde leerse enteros. Al ser página, y no
 * una vista de otra, entra en el sitemap y tiene su propio canonical.
 *
 * Es una carpeta estática (`studio/`) y no un segmento del `[section]` dinámico que hay
 * al lado: en Next lo estático gana al dinámico, así que esta página se sirve aquí y
 * `[section]` sigue ocupándose de `contact` sin que ninguna de las dos sepa de la otra.
 *
 * Alineada a la izquierda, como el bloque de contacto: son los dos sitios de la web
 * donde se lee texto seguido, y leerlos con criterios distintos se notaría.
 */
export default async function StudioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const t = getDictionary(locale)
  const settings = await getSiteSettings()

  return (
    <div className="page-gutter pt-16 pb-(--spacing-section) md:pt-24">
      <h1 className="text-display tracking-tight uppercase">{t.studio.title}</h1>

      {/* El manifiesto en columna estrecha: una medida larga no se lee. El primer
          párrafo entra más grande y hace de entrada. */}
      <div className="mt-10 grid max-w-2xl gap-6 md:mt-14">
        {settings.statement[locale].map((paragraph, index) => (
          <Reveal key={paragraph.slice(0, 24)} step={index}>
            <p className={index === 0 ? 'text-lead' : 'text-ink-soft'}>{paragraph}</p>
          </Reveal>
        ))}
      </div>

      <div className="mt-(--spacing-section) grid gap-14 md:grid-cols-2 md:gap-20">
        <section>
          <h2 className="eyebrow border-b border-line pb-4">{t.studio.team}</h2>
          <ul className="mt-8 space-y-6">
            {settings.team.map((member) => (
              <li key={member.name}>
                <p className="text-lead">{member.name}</p>
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

        {(settings.collaborators ?? []).length > 0 && (
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
        )}
      </div>
    </div>
  )
}
