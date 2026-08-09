import { ProjectHeading } from '@/components/sections/ProjectHeading'
import { Gallery, ratioOf } from '@/components/ui/Gallery'
import { Media } from '@/components/ui/Media'
import { Reveal } from '@/components/ui/Reveal'
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
  const items = project.images.map((image) => {
    const media = <Media image={image} alt={image.alt[locale]} sizes="100vw" />

    return {
      key: image.id,
      ratio: ratioOf(image),
      content: reveal ? (
        <Reveal className="gallery-frame">{media}</Reveal>
      ) : (
        <div className="gallery-frame">{media}</div>
      ),
    }
  })

  return (
    <>
      <ProjectHeading project={project} locale={locale} dictionary={dictionary} heading={heading} />

      <div className="mt-12">
        <Gallery items={items} />
      </div>
    </>
  )
}
