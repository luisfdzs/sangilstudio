import type { ProjectEntry } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'

type Props = {
  project: ProjectEntry
  locale: Locale
  dictionary: Dictionary
  heading?: boolean
  full?: boolean
}

export function ProjectHeading({
  project,
  locale,
  dictionary,
  heading = true,
  full = true,
}: Props) {
  const Title = heading ? 'h1' : 'h2'

  return (
    <header>
      <Title data-t="projectTitle" className="text-display tracking-tight uppercase">
        {project.title}
      </Title>

      <div data-t="projectMeta" className="mt-6 text-body">
        <p>
          {project.location[locale]}, {project.year}
        </p>
        <p>{dictionary.type[project.type]}</p>
        {full && project.collaboration && (
          <p>
            {dictionary.project.architects}: {project.collaboration}
          </p>
        )}
        {full && project.client && (
          <p>
            {dictionary.project.client}: {project.client}
          </p>
        )}
      </div>
    </header>
  )
}
