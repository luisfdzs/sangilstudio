import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSiteSettings } from '@/lib/content'
import { isLocale, locales } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'

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
  return { title: getDictionary(locale).contact.title }
}

/**
 * Contacto directo, sin formulario. Un formulario implica backend antispam y
 * política de privacidad; se añadirá cuando el estudio lo decida (ver README).
 */
export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const t = getDictionary(locale)
  const settings = await getSiteSettings()

  return (
    <div className="page-gutter pt-16 pb-(--spacing-section) md:pt-24">
      <header className="max-w-3xl">
        <h1 className="text-display font-serif">{t.contact.title}</h1>
        <p className="mt-6 text-lead text-ink-soft">{t.contact.lead}</p>
      </header>

      <div className="mt-16 grid gap-16 md:mt-24 md:grid-cols-3 md:gap-12">
        <section>
          <h2 className="eyebrow border-b border-line pb-4">{t.contact.email}</h2>
          <a
            className="link-underline tap mt-6 inline-block text-lead font-serif"
            href={`mailto:${settings.email}`}
          >
            {settings.email}
          </a>
        </section>

        <section>
          <h2 className="eyebrow border-b border-line pb-4">{t.contact.phone}</h2>
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
        </section>

        <section>
          <h2 className="eyebrow border-b border-line pb-4">{t.contact.location}</h2>
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
        </section>
      </div>
    </div>
  )
}
