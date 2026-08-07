import Image from 'next/image'
import type { ProjectEntry } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'

type Props = {
  project: ProjectEntry
  locale: Locale
  dictionary: Dictionary
}

/**
 * Lo que asoma por el borde al arrastrar en la ficha: la cabecera del proyecto
 * vecino, igual que la verá al soltar. Su portada **es** la primera imagen de la
 * ficha (`cover === images[0]`), así que la llegada no da ningún salto.
 */
export function ProjectPeek({ project, locale, dictionary }: Props) {
  return (
    <div className="page-gutter flex h-full flex-col bg-paper pt-16 md:pt-24">
      <h2 className="text-display tracking-tight uppercase">{project.title}</h2>

      <div className="mt-6 text-body md:mt-8">
        <p>
          {project.location[locale]}, {project.year}
        </p>
        <p>{dictionary.type[project.type]}</p>
      </div>

      <div className="relative mt-12 min-h-0 flex-1 md:mt-16">
        <Image
          src={project.cover.src}
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          quality={70}
          placeholder="blur"
          blurDataURL={project.cover.blur}
          draggable={false}
          className="object-contain object-top"
        />
      </div>
    </div>
  )
}
