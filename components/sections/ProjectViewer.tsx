'use client'

import Image from 'next/image'
import { useState } from 'react'
import { EdgeArrow } from '@/components/ui/EdgeArrows'
import type { ProjectEntry } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'

type Props = {
  project: ProjectEntry
  locale: Locale
  prevLabel: string
  nextLabel: string
}

const FADE_MS = 700

export function ProjectViewer({ project, locale, prevLabel, nextLabel }: Props) {
  const images = project.images
  const [index, setIndex] = useState(0)
  const [seen, setSeen] = useState([0])
  const current = images[index] ?? images[0]!

  const show = (position: number) => {
    setIndex(position)
    setSeen((loaded) => (loaded.includes(position) ? loaded : [...loaded, position]))
  }

  const step = (delta: number) => show((index + delta + images.length) % images.length)

  return (
    <div className="flex h-[calc(100svh-13rem)] items-start justify-center gap-2">
      <EdgeArrow side="left" anchor="flow" tone="ink" label={prevLabel} onPress={() => step(-1)} />

      <div
        className="relative h-full max-w-full min-w-0"
        style={{
          aspectRatio: `${current.width} / ${current.height}`,
          transitionProperty: 'aspect-ratio',
          transitionDuration: `${FADE_MS}ms`,
          transitionTimingFunction: 'var(--ease-in-out-soft)',
        }}
      >
        {images.map((image, position) =>
          seen.includes(position) ? (
            <Image
              key={image.id}
              src={image.src}
              alt={image.alt[locale] || project.title}
              fill
              sizes="80vw"
              quality={82}
              priority={position === 0}
              placeholder="blur"
              blurDataURL={image.blur}
              draggable={false}
              aria-hidden={position !== index}
              className="object-contain object-top transition-opacity ease-(--ease-in-out-soft)"
              style={{
                opacity: position === index ? 1 : 0,
                zIndex: position === index ? 0 : 1,
                transitionDuration: `${FADE_MS}ms`,
              }}
            />
          ) : null,
        )}
      </div>

      {images.length > 1 && (
        <ul className="scrollbar-hairline flex h-full w-20 shrink-0 flex-col gap-2 overflow-x-hidden overflow-y-auto lg:w-24">
          {images.map((image, position) =>
            position === index ? null : (
              <li key={image.id}>
                <button
                  type="button"
                  onClick={() => show(position)}
                  title={image.alt[locale] || project.title}
                  className="tap block w-full opacity-70 transition-opacity duration-300 ease-(--ease-out-soft) hover:opacity-100 focus-visible:opacity-100"
                >
                  <Image
                    src={image.src}
                    alt={image.alt[locale] || project.title}
                    width={image.width}
                    height={image.height}
                    sizes="6rem"
                    quality={70}
                    placeholder="blur"
                    blurDataURL={image.blur}
                    draggable={false}
                    className="h-auto w-full"
                  />
                </button>
              </li>
            ),
          )}
        </ul>
      )}

      <EdgeArrow side="right" anchor="flow" tone="ink" label={nextLabel} onPress={() => step(1)} />
    </div>
  )
}
