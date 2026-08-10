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

const FADE_MS = 900

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
    <div className="flex h-[calc(100svh-13rem)] flex-col">
      <div className="flex min-h-0 flex-1 items-start justify-center gap-2">
        <EdgeArrow
          side="left"
          anchor="flow"
          tone="ink"
          label={prevLabel}
          onPress={() => step(-1)}
        />

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
                  transitionDuration: `${FADE_MS}ms`,
                }}
              />
            ) : null,
          )}
        </div>

        <EdgeArrow
          side="right"
          anchor="flow"
          tone="ink"
          label={nextLabel}
          onPress={() => step(1)}
        />
      </div>

      {images.length > 1 && (
        <ul className="scrollbar-hairline mx-auto mt-6 flex h-14 w-fit max-w-full shrink-0 gap-2 overflow-x-auto overflow-y-hidden">
          {images.map((image, position) => (
            <li key={image.id} className="h-full">
              <button
                type="button"
                onClick={() => show(position)}
                title={image.alt[locale] || project.title}
                aria-current={position === index ? 'true' : undefined}
                className={`block h-full border-b pb-1 transition-[opacity,border-color] duration-300 ease-(--ease-out-soft) hover:opacity-100 focus-visible:opacity-100 ${
                  position === index ? 'border-ink opacity-100' : 'border-transparent opacity-40'
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.alt[locale] || project.title}
                  width={image.width}
                  height={image.height}
                  sizes="8rem"
                  quality={70}
                  placeholder="blur"
                  blurDataURL={image.blur}
                  draggable={false}
                  className="h-full w-auto"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
