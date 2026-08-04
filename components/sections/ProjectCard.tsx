import Link from 'next/link'
import { Media } from '@/components/ui/Media'
import type { ProjectEntry } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'
import { href } from '@/lib/i18n/routes'

type Props = {
  project: ProjectEntry
  locale: Locale
  /** Las primeras tarjetas de la página cargan con prioridad (candidatas a LCP). */
  priority?: boolean
}

/**
 * Una obra en la rejilla de proyectos.
 *
 * **Cuadrada, siempre.** Antes cada tarjeta tomaba una proporción distinta según su
 * sitio en la rejilla (16/9 a lo ancho, 4/3 a media columna) y las fotos verticales
 * salían con formato de móvil. Ahora todas se recortan a 1:1: la rejilla se lee como
 * una rejilla, y el hotspot que se marca en el panel decide qué parte no se recorta.
 *
 * **Respira al pasar el ratón.** La imagen crece un 4 % dentro de su cuadro, que no se
 * mueve: el recorte lo hace el `overflow-hidden` que ya trae `Media`, así que la
 * retícula se queda quieta y lo único que pasa es que la foto se acerca. El zoom se
 * aplica al `<img>` con una variante de descendiente y no a la caja, porque escalar la
 * caja movería también el pie de la tarjeta.
 */
export function ProjectCard({ project, locale, priority = false }: Props) {
  const cover = project.cover

  return (
    <article className="group">
      <Link href={href(locale, 'work', project.slug)} className="block">
        {cover && (
          <Media
            image={cover}
            alt={cover.alt[locale]}
            ratio="1 / 1"
            sizes="(max-width: 768px) 100vw, 30vw"
            priority={priority}
            className="[&_img]:transition-transform [&_img]:duration-[900ms] [&_img]:ease-(--ease-out-soft) group-hover:[&_img]:scale-[1.04]"
          />
        )}

        <div className="mt-4">
          <h3 className="text-small font-medium tracking-wide uppercase">{project.title}</h3>
          <p className="mt-1 text-small text-ink-soft">
            {project.location[locale]} · {project.year}
          </p>
        </div>
      </Link>
    </article>
  )
}
