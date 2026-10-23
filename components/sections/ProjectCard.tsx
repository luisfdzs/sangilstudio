import Link from 'next/link'
import { Media } from '@/components/ui/Media'
import type { ProjectEntry } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'
import { href } from '@/lib/i18n/routes'

type Props = {
  project: ProjectEntry
  locale: Locale
  priority?: boolean
}

export function ProjectCard({ project, locale, priority = false }: Props) {
  const cover = project.cover

  return (
    <article className="group">
      <Link
        href={href(locale, 'work', project.slug)}
        className="block"
      >
        <div className="gallery-frame transition-opacity duration-500 ease-(--ease-out-soft) group-hover:opacity-80">
          <Media
            image={cover}
            alt={cover.alt[locale]}
            sizes="(max-width: 768px) 100vw, 40vw"
            priority={priority}
            entrance="settle"
          />
        </div>

        <div className="mt-4">
          <h3 data-t="cardTitle" className="text-small font-medium tracking-wide uppercase">
            {project.title}
          </h3>
          <p data-t="cardLocation" className="mt-1 text-small text-ink-soft">
            {project.location[locale]}
          </p>
        </div>
      </Link>
    </article>
  )
}
