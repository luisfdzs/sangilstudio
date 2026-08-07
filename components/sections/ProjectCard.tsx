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
          <p className="mt-1 text-small text-ink-soft">{project.location[locale]}</p>
        </div>
      </Link>
    </article>
  )
}
