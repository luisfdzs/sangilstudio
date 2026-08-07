import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BackToWork } from '@/components/sections/BackToWork'
import { ProjectPager } from '@/components/sections/ProjectPager'
import { Media } from '@/components/ui/Media'
import { Reveal } from '@/components/ui/Reveal'
import { getProject, getProjects, getProjectSlugs } from '@/lib/content'
import { isLocale, locales } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { href } from '@/lib/i18n/routes'

/** Las fichas × 2 idiomas se prerrenderizan: no hay render en petición. */
export async function generateStaticParams() {
  const slugs = await getProjectSlugs()
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const project = await getProject(slug)
  if (!isLocale(locale) || !project) return {}

  return {
    title: project.title,
    description: project.summary[locale],
    alternates: {
      canonical: href(locale, 'work', slug),
      languages: Object.fromEntries(locales.map((l) => [l, href(l, 'work', slug)])),
    },
    openGraph: {
      title: project.title,
      description: project.summary[locale],
      images: project.cover ? [{ url: project.cover.src }] : undefined,
    },
  }
}

/**
 * LA FICHA DE UN PROYECTO. Cinco líneas de datos y las fotos, en este orden y sin nada
 * más. Es literalmente lo que pidió el estudio.
 *
 * Lo que había antes y ya no está: portada a sangre, resumen, memoria de varios
 * párrafos, superficie, estado y sección de planos. Los campos **siguen existiendo en el
 * panel** y se siguen leyendo —el resumen es la descripción de la página para Google y
 * para quien comparte el enlace, ahí arriba—, pero no se pintan: la ficha es la obra, y
 * la obra son las fotos.
 *
 * La navegación anterior/siguiente también se había ido, y vuelve en otra forma: ya no es
 * un par de enlaces con título al pie, sino el mismo gesto de la portada —flechas en los
 * bordes y deslizar con el dedo—, sin ocupar sitio en la página.
 *
 * Las imágenes van a **una sola columna**, cada una a todo el ancho de la caja de texto
 * y con su proporción real, sin recortar. Un proyecto se entiende viendo las fotos
 * grandes y en el orden en que el estudio las ordenó, no en una rejilla que las mezcla.
 */
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const project = await getProject(slug)
  if (!project) notFound()

  const t = getDictionary(locale)

  /**
   * Se pasa de proyecto igual que se pasa de imagen en la portada: flechas en los bordes
   * en ordenador y deslizando el dedo en móvil. El orden es el de la rejilla de proyectos
   * y da la vuelta por los dos extremos, así que nunca hay una flecha que no lleve a
   * ninguna parte. El buscador de la rejilla no entra aquí: la ficha no sabe con qué
   * filtro se llegó, y el recorrido tiene que ser el mismo desde cualquier sitio.
   */
  const projects = await getProjects()
  const position = projects.findIndex((entry) => entry.slug === slug)
  const previous = projects[(position - 1 + projects.length) % projects.length]!
  const next = projects[(position + 1) % projects.length]!

  return (
    <>
      <ProjectPager
        prevHref={href(locale, 'work', previous.slug)}
        nextHref={href(locale, 'work', next.slug)}
        prevLabel={`${t.project.previous}: ${previous.title}`}
        nextLabel={`${t.project.next}: ${next.title}`}
      >
        {/* El hueco de abajo tiene que dejar pasar la barra de volver, que es fija: con el
            `--spacing-section` de siempre, en móvil la última foto quedaba justo debajo. */}
        <article className="page-gutter pt-16 pb-32 md:pt-24 md:pb-(--spacing-section)">
          <header>
            <h1 className="text-display tracking-tight uppercase">{project.title}</h1>

            {/* Las líneas de datos, una debajo de otra y pegadas al margen. Sin filete, sin
            rejilla y sin rótulos salvo donde hace falta decir qué es cada nombre: en
            «Pamplona, Navarra · 2023» y «Vivienda» ya se ve, y en una lista de personas,
            no. */}
            <div className="mt-6 text-body md:mt-8">
              <p>
                {project.location[locale]}, {project.year}
              </p>
              <p>{t.type[project.type]}</p>
              {/* El campo se llama `collaboration` en el panel desde antes de que la ficha
              tuviera esta forma; lo que se enseña es lo que el estudio quiere leer aquí:
              quién firma la obra. */}
              {project.collaboration && (
                <p>
                  {t.project.architects}: {project.collaboration}
                </p>
              )}
              {/* Promotor: sólo cuando lo hay. Muchos concursos no tienen. */}
              {project.client && (
                <p>
                  {t.project.client}: {project.client}
                </p>
              )}
            </div>
          </header>

          <div className="mt-12 flex flex-col gap-8 md:mt-16 md:gap-12">
            {project.images.map((image, index) => (
              <Reveal key={image.id}>
                <Media
                  image={image}
                  // La descripción es opcional en el panel. Sin ella se emite `alt=""` y el
                  // lector de pantalla salta la foto, que es lo correcto para una imagen sin
                  // describir; sólo la primera toma el nombre del proyecto, para que la
                  // galería no se anuncie entera en silencio ni repita el título veinte veces.
                  alt={index === 0 ? image.alt[locale] || project.title : image.alt[locale]}
                  // La primera es la candidata a LCP de esta página; ni una más.
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 76vw"
                />
              </Reveal>
            ))}
          </div>
        </article>
      </ProjectPager>

      {/* Fuera del `ProjectPager` a propósito: la barra no debe formar parte de la
          superficie por la que se desliza para cambiar de proyecto. */}
      <BackToWork href={href(locale, 'work')} label={t.project.back} title={t.project.backLong} />
    </>
  )
}
