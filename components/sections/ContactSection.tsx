import type { SiteSettings } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { sections } from '@/lib/i18n/routes'

/**
 * Contacto como SECCIÓN de la portada, cerrando la página. Con dirección propia
 * —`/es/contact`— pero sin página propia: ver `StudioSection` y `[section]/page.tsx`.
 *
 * Directo, sin formulario: un formulario implica backend antispam y política de
 * privacidad; se añadirá cuando el estudio lo decida (ver README).
 *
 * El hueco de separación va en el envoltorio, no en el relleno de la sección, por el
 * mismo motivo que en `StudioSection`: que el desplazamiento caiga en el encabezado.
 */
export function ContactSection({ locale, settings }: { locale: Locale; settings: SiteSettings }) {
  const t = getDictionary(locale)

  return (
    <div className="pt-(--spacing-section)">
      {/* Ver `StudioSection`: el `scroll-mt` despega el encabezado de la barra. */}
      <section id={sections.contact} className="page-gutter scroll-mt-8">
        <h2 className="eyebrow border-b border-line pb-4">{t.contact.title}</h2>
        <p className="mt-10 max-w-3xl text-lead font-serif text-balance md:mt-16">
          {t.contact.lead}
        </p>

        <div className="mt-16 grid gap-16 md:mt-24 md:grid-cols-3 md:gap-12">
          <div>
            <h3 className="eyebrow border-b border-line pb-4">{t.contact.email}</h3>
            <a
              className="link-underline tap mt-6 inline-block text-lead font-serif"
              href={`mailto:${settings.email}`}
            >
              {settings.email}
            </a>
          </div>

          <div>
            <h3 className="eyebrow border-b border-line pb-4">{t.contact.phone}</h3>
            <ul className="mt-6 space-y-4">
              {settings.team.map((member) => (
                <li key={member.name}>
                  <p className="text-small text-ink-soft">{member.name}</p>
                  <a
                    className="link-underline tap text-lead font-serif"
                    href={`tel:${member.phone.replaceAll(' ', '')}`}
                  >
                    {member.phone}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="eyebrow border-b border-line pb-4">{t.contact.location}</h3>
            <p className="mt-6 text-lead font-serif">
              {settings.city}
              <br />
              {settings.region[locale]}, {settings.country[locale]}
            </p>
            {/* Las redes son opcionales en el panel: si no hay enlace, no se muestra. */}
            <div className="mt-6 flex gap-4 text-small">
              {[
                { label: 'Instagram', url: settings.instagram },
                { label: 'LinkedIn', url: settings.linkedin },
              ]
                .filter((social): social is { label: string; url: string } => Boolean(social.url))
                .map((social) => (
                  <a
                    key={social.label}
                    className="link-underline tap"
                    href={social.url}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {social.label}
                  </a>
                ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
