import Link from 'next/link'
import { site } from '@/content/site'
import { getSiteSettings } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { href } from '@/lib/i18n/routes'

export async function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  // Teléfonos, email, ciudad y redes salen del panel: el estudio los cambia sin nosotros.
  const settings = await getSiteSettings()

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
            © {new Date().getFullYear()} {site.name}. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
