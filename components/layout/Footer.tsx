import Link from 'next/link'
import { site, team } from '@/content/site'
import type { Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { href } from '@/lib/i18n/routes'

export function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)

  return (
    <footer className="mt-(--spacing-section) border-t border-line bg-paper">
      <div className="page-gutter py-16 md:py-20">
        {/* Rejilla de cuatro columnas: identidad · CONTACTO (una sola sección, ocupa
            dos columnas con los dos socios uno al lado del otro) · navegación. Todo
            centrado dentro de su columna. En móvil se apila. */}
        <div className="grid gap-10 text-center md:grid-cols-4 md:gap-8">
          <div>
            <p className="mx-auto max-w-xs text-lead font-serif">
              {locale === 'es'
                ? 'Arquitectura en Pamplona, Navarra.'
                : 'Architecture in Pamplona, Navarre.'}
            </p>
            <p className="mt-4 text-small text-ink-soft">
              {site.city}, {site.region[locale]} · {site.country[locale]}
            </p>
            <a
              className="link-underline tap mt-2 inline-block text-small text-ink-soft hover:text-ink"
              href={`mailto:${site.email}`}
            >
              {site.email}
            </a>
          </div>

          {/* ORDEN FIJO: Yago primero (ver content/site.ts). Sin etiqueta de sección:
              un teléfono junto a un nombre ya se lee como contacto. */}
          <div className="md:col-span-2">
            <div className="grid gap-6 sm:grid-cols-2">
              {team.map((member) => (
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
          </div>
        </div>

        {/* Fila propia, abajo de todo y centrada: el aviso legal no compite con la
            información del estudio. */}
        <p className="mt-16 border-t border-line pt-8 text-center text-micro text-ink-faint md:mt-20">
          © {new Date().getFullYear()} {site.name}. {t.footer.rights}
        </p>
      </div>
    </footer>
  )
}
