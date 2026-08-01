import Link from 'next/link'
import Image from 'next/image'
import type { ProjectEntry } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { href } from '@/lib/i18n/routes'

/**
 * Hero a pantalla completa. Es la imagen del LCP de todo el sitio, así que es la
 * ÚNICA con `priority`: se precarga y se sirve antes que cualquier otra cosa.
 * No usa el componente Media porque necesita `100vh` en vez de proporción fija.
 */
export function Hero({ project, locale }: { project: ProjectEntry; locale: Locale }) {
  const t = getDictionary(locale)
  const cover = project.cover
  if (!cover) return null

  return (
    <section
      data-hero
      className="relative -mt-20 h-[100svh] min-h-[34rem] w-full overflow-hidden md:-mt-24"
    >
      <Image
        src={cover.src}
        alt={cover.alt[locale]}
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        quality={82}
        placeholder="blur"
        blurDataURL={cover.blur}
        className="object-cover"
      />
      {/* Velo mínimo: sólo el necesario para que el texto tenga contraste AA. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/45"
      />

      {/* El bloque de texto, centrado en el ancho de la pantalla y no pegado a la
          izquierda. `items-center` además del `text-center` porque el titular y el pie de
          foto llevan ancho máximo: sin él la caja se quedaría a la izquierda y el texto
          saldría centrado dentro de una caja descentrada, que es peor que no centrar. */}
      <div className="page-gutter absolute inset-x-0 bottom-0 flex flex-col items-center gap-6 pb-12 text-center text-paper md:pb-16">
        <p className="eyebrow text-paper/70">{t.home.heroLead}</p>
        <h1 className="text-display max-w-4xl font-serif text-balance">
          {locale === 'es'
            ? 'Arquitectura con una razón detrás de cada decisión.'
            : 'Architecture with a reason behind every decision.'}
        </h1>
        <Link
          href={href(locale, 'work', project.slug)}
          className="link-underline tap text-small text-paper/85"
        >
          {project.title}, {project.location[locale]} · {project.year}
        </Link>

        {/* El hueco de la barra de iconos de móvil, que va fija sobre el contenido: sin
            él, el pie de foto del hero —el único enlace de la primera pantalla— queda
            medio tapado por ella. Desaparece en `md`, donde la barra ya no existe. */}
        <div aria-hidden className="h-(--spacing-nav-mobile) md:hidden" />
      </div>
    </section>
  )
}
