import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Hero } from '@/components/sections/Hero'
import { ProjectCard } from '@/components/sections/ProjectCard'
import { Reveal } from '@/components/ui/Reveal'
import { getFeaturedProjects, getSiteSettings } from '@/lib/content'
import { isLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { href } from '@/lib/i18n/routes'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const t = getDictionary(locale)
  const [featured, settings] = await Promise.all([getFeaturedProjects(8), getSiteSettings()])
  const [hero, ...pool] = featured
  if (!hero) notFound()

  // El grid va en ciclos de tres piezas: una a ancho completo + dos a mitad. Sólo
  // queda hueco cuando sobra UNA pieza a mitad (resto 2), y entonces se recorta: un
  // hueco vacío al lado del último proyecto se ve peor que un proyecto menos. Si el
  // resto es 1, esa pieza es ancha y cierra la fila entera, así que se queda.
  const rest = pool.length % 3 === 2 ? pool.slice(0, -1) : pool

  return (
    <>
      <Hero project={hero} locale={locale} />

      {/* Manifiesto: una sola idea, mucho aire alrededor. Bloque centrado en todos los
          tamaños — alineado a la izquierda dejaba media pantalla vacía en escritorio. */}
      <section className="page-gutter py-(--spacing-section)">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">{t.home.heroLead}</p>
          <p className="mt-8 text-title font-serif text-balance">{settings.statement[locale][0]}</p>
          <p className="mt-6 max-w-2xl text-ink-soft md:mx-auto">{settings.statement[locale][1]}</p>
          <Link
            href={href(locale, 'studio')}
            className="link-underline tap mt-10 inline-block text-small"
          >
            {t.nav.studio}
          </Link>
        </Reveal>
      </section>

      {/* Obra seleccionada: ritmo alterno ancho/mitad para que no parezca catálogo. */}
      <section className="page-gutter">
        <div className="flex items-baseline justify-between border-b border-line pb-4">
          <h2 className="eyebrow">{t.home.selectedWork}</h2>
          <Link href={href(locale, 'work')} className="link-underline tap text-small">
            {t.home.viewAllWork}
          </Link>
        </div>

        <div className="mt-10 grid gap-x-8 gap-y-16 md:mt-16 md:grid-cols-2 md:gap-y-24">
          {rest.map((project, index) => {
            // Cada tercera pieza ocupa el ancho completo: rompe el ritmo del grid
            // para que no se lea como un catálogo. El col-span va en el hijo
            // directo del grid (Reveal), no en la tarjeta.
            const wide = index % 3 === 0
            return (
              <Reveal
                key={project.slug}
                step={index % 2}
                className={wide ? 'md:col-span-2' : undefined}
              >
                <ProjectCard project={project} locale={locale} span={wide ? 'wide' : 'half'} />
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* Cierre: mismo criterio que el manifiesto — bloque centrado en todos los
          tamaños. El aire de la sección se reparte a partes iguales (filete → texto →
          enlace → final), en vez de dejar el enlace pegado al párrafo y todo el hueco
          abajo. Un solo valor derivado de --spacing-section para los tres huecos, así
          escala igual en móvil y en escritorio. */}
      <section className="page-gutter pt-(--spacing-section)">
        <Reveal className="border-t border-line">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-[calc(var(--spacing-section)*0.6)] pt-[calc(var(--spacing-section)*0.6)] text-center">
            <p className="text-lead font-serif text-balance">{settings.statement[locale][2]}</p>
            {/* Cerraba enviando a la sección de concursos, que ya no existe: los
                concursos están en /work con el resto de la obra, y ese listado ya tiene
                su enlace arriba. El cierre natural de la portada es el contacto. */}
            <Link href={href(locale, 'contact')} className="link-underline tap text-small">
              {t.nav.contact}
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}
