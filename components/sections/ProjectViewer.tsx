'use client'

import Image from 'next/image'
import { useState } from 'react'
import { StepZone } from '@/components/ui/StepZone'
import { useArrowKeys } from '@/components/ui/useArrowKeys'
import type { ProjectEntry } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'

type Props = {
  project: ProjectEntry
  locale: Locale
  prevLabel: string
  nextLabel: string
}

const FADE_MS = 1600

export function ProjectViewer({ project, locale, prevLabel, nextLabel }: Props) {
  const images = project.images
  const [index, setIndex] = useState(0)
  const [seen, setSeen] = useState([0])

  const show = (position: number) => {
    setIndex(position)
    setSeen((loaded) => (loaded.includes(position) ? loaded : [...loaded, position]))
  }

  const step = (delta: number) => show((index + delta + images.length) % images.length)

  useArrowKeys(step)

  return (
    <div className="flex h-[calc(100svh-13rem)] flex-col">
      <div className="relative min-h-0 w-full flex-1">
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
              style={{
                objectFit: 'contain',
                objectPosition: 'top',
                opacity: position === index ? 1 : 0,
                transitionProperty: 'opacity',
                transitionDuration: `${FADE_MS}ms`,
                transitionTimingFunction: 'var(--ease-in-out-soft)',
              }}
            />
          ) : null,
        )}

        {images.length > 1 && (
          <>
            <StepZone half side="left" label={prevLabel} onPress={() => step(-1)} />
            <StepZone half side="right" label={nextLabel} onPress={() => step(1)} />
          </>
        )}
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
