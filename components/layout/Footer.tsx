import { cacheLife } from 'next/cache'
import Link from 'next/link'
import { site } from '@/content/site'
import { getSiteSettings } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { href } from '@/lib/i18n/routes'

/**
 * El año del copyright, en una función cacheada por días.
 *
 * Con Cache Components, leer la hora actual en un componente de servidor está prohibido
 * (rompería el prerenderizado: ¿de qué momento sería el HTML?). Encerrarlo aquí lo
 * resuelve sin congelarlo para siempre: la caché caduca a diario, así que el 1 de enero
 * el pie se actualiza solo.
 */
async function currentYear(): Promise<number> {
  'use cache'
  cacheLife('days')
  return new Date().getFullYear()
}

export async function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  // Teléfonos, email, ciudad y redes salen del panel: el estudio los cambia sin nosotros.
  const [settings, year] = await Promise.all([getSiteSettings(), currentYear()])

  return (
    <footer className="mt-(--spacing-section) border-t border-line bg-paper">
      <div className="page-gutter py-16 md:py-20">
        {/* Rejilla de cuatro columnas: identidad · contacto (una sola sección, ocupa
            dos columnas con los socios uno al lado del otro) · navegación. Todo
            centrado dentro de su columna, sin etiquetas de sección. En móvil se apila. */}
        <div className="grid gap-10 text-center md:grid-cols-4 md:gap-8">
          <div>
            <p className="text-lead mx-auto max-w-xs font-serif">
              {locale === 'es'
                ? 'Arquitectura en Pamplona, Navarra.'
                : 'Architecture in Pamplona, Navarre.'}
            </p>
            <p className="mt-4 text-small text-ink-soft">
              {settings.city}, {settings.region[locale]} · {settings.country[locale]}
            </p>
            <a
              className="link-underline tap mt-2 inline-block text-small text-ink-soft hover:text-ink"
              href={`mailto:${settings.email}`}
            >
              {settings.email}
            </a>
          </div>

          {/* Un socio por columna: son datos paralelos, no una lista apilada. El orden
              lo fija el panel (Yago primero). Sin etiqueta de sección: un nombre con su
              teléfono ya se lee como contacto. */}
          <div className="md:col-span-2">
            <div className="grid gap-6 sm:grid-cols-2">
              {settings.team.map((member) => (
                <div key={member.name}>
                  <p className="text-small">{member.name}</p>
                  <a
                    className="link-underline tap mt-1 inline-block text-small text-ink-soft hover:text-ink"
                    href={`tel:${member.phone.replaceAll(' ', '')}`}
                  >
                    {member.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div>
            {/* Las tres opciones se reparten en horizontal, no en vertical. */}
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-small">
              <li>
                <Link
                  className="link-underline tap text-ink-soft hover:text-ink"
                  href={href(locale, 'work')}
                >
                  {t.nav.work}
                </Link>
              </li>
              <li>
                <Link
                  className="link-underline tap text-ink-soft hover:text-ink"
                  href={href(locale, 'studio')}
                >
                  {t.nav.studio}
                </Link>
              </li>
              {settings.instagram && (
                <li>
                  <a
                    className="link-underline tap text-ink-soft hover:text-ink"
                    href={settings.instagram}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Instagram
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Fila propia, abajo de todo y centrada: el aviso legal no compite con la
            información del estudio. */}
        <p className="mt-16 border-t border-line pt-8 text-center text-micro text-ink-faint md:mt-20">
          © {year} {site.name}. {t.footer.rights}
        </p>
      </div>
    </footer>
  )
}
