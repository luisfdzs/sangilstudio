import Image from 'next/image'
import type { ProjectEntry } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'

type Props = {
  project: ProjectEntry
  locale: Locale
  priority?: boolean
}

export function ProjectLead({ project, locale, priority = false }: Props) {
  const image = project.cover

  return (
    <div className="relative h-[calc(100svh-11rem)] md:h-[calc(100svh-13rem)]">
      <Image
        src={image.src}
        alt={image.alt[locale] || project.title}
        fill
        sizes="100vw"
        quality={82}
        priority={priority}
        placeholder="blur"
        blurDataURL={image.blur}
        draggable={false}
        className="object-contain object-top"
      />
    </div>
  )
}
