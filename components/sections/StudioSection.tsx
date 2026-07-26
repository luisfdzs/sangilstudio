import { Reveal } from '@/components/ui/Reveal'
import type { SiteSettings } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { sections } from '@/lib/i18n/routes'

/**
 * El estudio, como SECCIÓN de la portada (`/es#studio`), no como página aparte.
 * El texto es el mismo que el estudio edita en el panel (`statement`), y aquí
 * hace además de manifiesto: es el respiro entre la obra y el contacto.
 *
 * Sin imagen a propósito: la portada llega hasta aquí con el hero y la rejilla de
 * proyectos, y una foto más —que además sería una de las que ya se ven arriba—
 * quitaría a este bloque justo lo que aporta, que es aire.
 *
 * El hueco de separación va en un envoltorio y no en el relleno de la sección: si
 * lo llevara dentro, al entrar por `/es#studio` el navegador dejaría ese hueco
 * arriba y con él la última línea de la sección anterior, asomando bajo la barra.
 */
export function StudioSection({ locale, settings }: { locale: Locale; settings: SiteSettings }) {
  const t = getDictionary(locale)

  return (
    <div className="pt-(--spacing-section)">
      {/* `scroll-mt` suma al `scroll-padding-top` global: al llegar por el ancla, el
          encabezado no queda pegado al borde inferior de la barra. */}
      <section id={sections.studio} className="page-gutter scroll-mt-8">
        <h2 className="eyebrow border-b border-line pb-4">{t.studio.title}</h2>

        <div className="mt-10 grid max-w-4xl gap-6 md:mt-16">
          {settings.statement[locale].map((paragraph, index) => (
            <Reveal key={paragraph.slice(0, 24)} step={index}>
              <p className={index === 0 ? 'text-lead font-serif text-balance' : 'text-ink-soft'}>
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>

        <div className="mt-(--spacing-section) grid gap-16 md:grid-cols-2 md:gap-24">
          <div>
            <h3 className="eyebrow border-b border-line pb-4">{t.studio.team}</h3>
            <ul className="mt-8 space-y-8">
              {settings.team.map((member) => (
                <li key={member.name}>
                  <p className="text-lead font-serif">{member.name}</p>
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
          </div>

          <div>
            <h3 className="eyebrow border-b border-line pb-4">{t.studio.collaborators}</h3>
            <ul className="mt-8 space-y-3">
              {(settings.collaborators ?? []).map((name) => (
                <li key={name} className="text-small text-ink-soft">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
