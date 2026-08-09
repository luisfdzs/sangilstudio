import { ProjectBar } from '@/components/sections/ProjectBar'
import { ProjectLead } from '@/components/sections/ProjectLead'
import { ProjectMobile } from '@/components/sections/ProjectMobile'
import type { ProjectEntry } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'

type Props = {
  project: ProjectEntry
  locale: Locale
  dictionary: Dictionary
  backHref: string
  backLabel: string
  backTitle: string
}

export function ProjectPeek({
  project,
  locale,
  dictionary,
  backHref,
  backLabel,
  backTitle,
}: Props) {
  return (
    <div className="relative h-full overflow-hidden bg-paper">
      <div className="page-gutter pt-16 md:hidden">
        <ProjectMobile
          project={project}
          locale={locale}
          dictionary={dictionary}
          heading={false}
          reveal={false}
        />
      </div>

      <div className="page-gutter hidden pt-6 md:block">
        <ProjectLead project={project} locale={locale} />
      </div>

      <ProjectBar
        anchor="absolute"
        href={backHref}
        label={backLabel}
        title={backTitle}
        project={project.title}
        architects={project.collaboration}
      />
    </div>
  )
}
