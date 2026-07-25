import Link from 'next/link'
import { Media } from '@/components/ui/Media'
import type { ProjectEntry } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { href } from '@/lib/i18n/routes'
import { cn } from '@/lib/cn'

type Props = {
  project: ProjectEntry
  locale: Locale
  /** La primera tarjeta de la página carga con prioridad (candidata a LCP). */
  priority?: boolean
  /** `wide` ocupa las dos columnas; se usa para romper el ritmo del grid. */
  span?: 'half' | 'wide'
}

export function ProjectCard({ project, locale, priority = false, span = 'half' }: Props) {
  const t = getDictionary(locale)
  const cover = project.cover

  return (
    <article className={cn('group', span === 'wide' && 'md:col-span-2')}>
      <Link href={href(locale, 'work', project.slug)} className="block">
        {cover && (
          <Media
            image={cover}
            alt={cover.alt[locale]}
            ratio={span === 'wide' ? '16 / 9' : '4 / 3'}
            sizes={
              span === 'wide' ? '(max-width: 768px) 100vw, 92vw' : '(max-width: 768px) 100vw, 46vw'
            }
            priority={priority}
            className="transition-[transform,opacity] duration-[900ms] ease-(--ease-out-soft) group-hover:opacity-92"
          />
        )}

        <div className="mt-4 flex items-baseline justify-between gap-6">
          <h3 className="text-lead font-serif leading-tight">{project.title}</h3>
          <span className="eyebrow shrink-0">{project.year}</span>
        </div>
        <p className="mt-1 text-small text-ink-soft">
          {project.location[locale]} · {t.status[project.status]}
        </p>
      </Link>
    </article>
  )
}
