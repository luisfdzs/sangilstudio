'use client'

import Image from 'next/image'
import { useCallback, useState } from 'react'
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

const FADE_MS = 900

export function ProjectViewer({ project, locale, prevLabel, nextLabel }: Props) {
  const images = project.images
  const [{ index, reach }, setFrame] = useState({ index: 0, reach: 2 })

  const show = useCallback((position: number) => {
    setFrame((current) => {
      if (position === current.index) return current
      if (position < current.reach) {
        return { index: position, reach: Math.max(current.reach, position + 2) }
      }

      requestAnimationFrame(() =>
        requestAnimationFrame(() =>
          setFrame((frame) => ({ index: position, reach: Math.max(frame.reach, position + 2) })),
        ),
      )
      return { ...current, reach: position + 2 }
    })
  }, [])

  const step = useCallback(
    (delta: number) => show((index + delta + images.length) % images.length),
    [images.length, index, show],
  )

  useArrowKeys(step)

  return (
    <div className="flex h-[calc(100svh-13rem)] flex-col">
      <div className="relative min-h-0 w-full flex-1">
        {images.slice(0, reach).map((image, position) => (
          <Image
            key={image.id}
            src={image.src}
            alt={image.alt[locale] || project.title}
            fill
            sizes="84vw"
            quality={82}
            priority={position === 0}
            fetchPriority={position === 0 ? 'high' : 'auto'}
            loading={position === 0 ? undefined : 'lazy'}
            placeholder="blur"
            blurDataURL={image.blur}
            draggable={false}
            aria-hidden={position !== index}
            className="will-change-[opacity]"
            style={{
              objectFit: 'contain',
              objectPosition: 'top',
              opacity: position === index ? 1 : 0,
              transitionProperty: 'opacity',
              transitionDuration: `${FADE_MS}ms`,
              transitionTimingFunction: 'var(--ease-in-out-soft)',
            }}
          />
        ))}

        {images.length > 1 && (
          <>
            <StepZone tone="ink" side="left" label={prevLabel} onPress={() => step(-1)} />
            <StepZone tone="ink" side="right" label={nextLabel} onPress={() => step(1)} />
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
