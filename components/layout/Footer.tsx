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
      <div className="page-gutter grid gap-12 py-16 md:grid-cols-[1.2fr_1fr_1fr] md:py-20">
        <div>
          <p className="text-lead max-w-xs font-serif">
            {locale === 'es'
              ? 'Arquitectura en Pamplona, Navarra.'
              : 'Architecture in Pamplona, Navarre.'}
          </p>
          <p className="mt-4 text-small text-ink-soft">
            {settings.city}, {settings.region[locale]} · {settings.country[locale]}
          </p>
        </div>

        <div>
          <p className="eyebrow">{t.contact.title}</p>
          <ul className="mt-4 space-y-2 text-small">
            {settings.team.map((member) => (
              <li key={member.name} className="text-ink-soft">
                <span className="text-ink">{member.name}</span>
                <br />
                <a className="link-underline tap" href={`tel:${member.phone.replaceAll(' ', '')}`}>
                  {member.phone}
                </a>
              </li>
            ))}
            <li>
              <a className="link-underline tap" href={`mailto:${settings.email}`}>
                {settings.email}
              </a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col justify-between gap-8">
          <ul className="space-y-2 text-small">
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
                href={href(locale, 'competitions')}
              >
                {t.nav.competitions}
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

          <p className="text-micro text-ink-faint">
            © {year} {site.name}. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
