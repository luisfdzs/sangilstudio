import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ContactSection } from '@/components/sections/ContactSection'
import { Hero } from '@/components/sections/Hero'
import { ProjectCard } from '@/components/sections/ProjectCard'
import { StudioSection } from '@/components/sections/StudioSection'
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

      {/* Obra seleccionada: ritmo alterno ancho/mitad para que no parezca catálogo.
          Antes de esta rejilla iba un manifiesto con los dos primeros párrafos del
          estudio; ahora que el estudio es una sección de esta misma página (abajo),
          repetirlo aquí sería decir dos veces lo mismo a media pantalla de distancia. */}
      <section className="page-gutter pt-(--spacing-section)">
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

      {/* Estudio y contacto ya no son páginas propias: se leen aquí, en el orden del
          menú (obra → estudio → contacto), y el menú lleva a su ancla. Quien entra por
          la portada acaba el recorrido sin haber navegado ni una vez. */}
      <StudioSection locale={locale} settings={settings} />
      <ContactSection locale={locale} settings={settings} />
    </>
  )
}
