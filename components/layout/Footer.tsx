import Link from 'next/link'
import { site, team } from '@/content/site'
import type { Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { href } from '@/lib/i18n/routes'

export function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)

  return (
    <footer className="mt-(--spacing-section) border-t border-line bg-paper">
      <div className="page-gutter grid gap-12 py-16 md:grid-cols-[1.2fr_1fr_1fr] md:py-20">
        <div>
          <p className="text-lead font-serif max-w-xs">
            {locale === 'es'
              ? 'Arquitectura en Pamplona, Navarra.'
              : 'Architecture in Pamplona, Navarre.'}
          </p>
          <p className="mt-4 text-small text-ink-soft">
            {site.city}, {site.region[locale]} · {site.country[locale]}
          </p>
        </div>

        <div>
          <p className="eyebrow">{t.contact.title}</p>
          <ul className="mt-4 space-y-2 text-small">
            {team.map((member) => (
              <li key={member.name} className="text-ink-soft">
                <span className="text-ink">{member.name}</span>
                <br />
                <a className="link-underline tap" href={`tel:${member.phone.replaceAll(' ', '')}`}>
                  {member.phone}
                </a>
              </li>
            ))}
            <li>
              <a className="link-underline tap" href={`mailto:${site.email}`}>
                {site.email}
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
            <li>
              <a
                className="link-underline tap text-ink-soft hover:text-ink"
                href={site.instagram}
                target="_blank"
                rel="noreferrer noopener"
              >
                Instagram
              </a>
            </li>
          </ul>

          <p className="text-micro text-ink-faint">
            © {new Date().getFullYear()} {site.name}. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
