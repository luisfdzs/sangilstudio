import { ProjectHeading } from '@/components/sections/ProjectHeading'
import { ProjectMobileGallery } from '@/components/sections/ProjectMobileGallery'
import type { ProjectEntry } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'

type Props = {
  project: ProjectEntry
  locale: Locale
  dictionary: Dictionary
  heading?: boolean
  reveal?: boolean
}

export function ProjectMobile({
  project,
  locale,
  dictionary,
  heading = true,
  reveal = true,
}: Props) {
  return (
    <>
      <ProjectHeading project={project} locale={locale} dictionary={dictionary} heading={heading} />

      <div className="mt-12">
        <ProjectMobileGallery
          images={project.images}
          locale={locale}
          dictionary={dictionary}
          title={project.title}
          reveal={reveal}
        />
      </div>
    </>
  )
}
