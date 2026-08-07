'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { EdgeArrows } from '@/components/ui/EdgeArrows'
import { useHorizontalSwipe } from '@/components/ui/useHorizontalSwipe'
import type { DescribedImage } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'

type Props = {
  images: DescribedImage[]
  locale: Locale
  label: string
  prevLabel: string
  nextLabel: string
  workHref: string
}

const HOLD_MS = 5000
const FADE_MS = 1600

export function Hero({ images, locale, label, prevLabel, nextLabel, workHref }: Props) {
  const [{ index, reach }, setFrame] = useState({ index: 0, reach: 2 })

  const step = useCallback(
    (delta: number) => {
      setFrame((current) => {
        const total = images.length
        const next = (current.index + delta + total) % total
        return { index: next, reach: Math.max(current.reach, next + 2) }
      })
    },
    [images.length],
  )

  const { swipedRef, handlers } = useHorizontalSwipe(step)

  useEffect(() => {
    if (images.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timer = setTimeout(() => step(1), HOLD_MS)
    return () => clearTimeout(timer)
  }, [index, images.length, step])

  if (images.length === 0) return null

  const onLinkClick = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (!swipedRef.current) return
    event.preventDefault()
    swipedRef.current = false
  }

  return (
    <div className="page-gutter">
      <div
        data-hero
        {...handlers}
        className="relative h-[calc(100svh-9rem)] min-h-[20rem] w-full touch-pan-y overflow-hidden select-none md:h-[calc(100svh-11rem)]"
      >
        {images.slice(0, reach).map((image, position) => (
          <Image
            key={image.id}
            src={image.src}
            alt={position === 0 ? image.alt[locale] : ''}
            aria-hidden={position !== 0}
            fill
            priority={position === 0}
            fetchPriority={position === 0 ? 'high' : 'auto'}
            loading={position === 0 ? undefined : 'lazy'}
            sizes="(max-width: 768px) 92vw, 84vw"
            quality={82}
            placeholder="blur"
            blurDataURL={image.blur}
            draggable={false}
            className="object-cover transition-opacity ease-(--ease-in-out-soft)"
            style={{
              opacity: position === index ? 1 : 0,
              transitionDuration: `${FADE_MS}ms`,
            }}
          />
        ))}

        <Link
          href={workHref}
          aria-label={label}
          onClick={onLinkClick}
          className="absolute inset-0 block"
        />

        {images.length > 1 && (
          <EdgeArrows
            prevLabel={prevLabel}
            nextLabel={nextLabel}
            onPrev={() => step(-1)}
            onNext={() => step(1)}
          />
        )}
      </div>
    </div>
  )
}
