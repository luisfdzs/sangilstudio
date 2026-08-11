'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { StepZone } from '@/components/ui/StepZone'
import { useArrowKeys } from '@/components/ui/useArrowKeys'
import type { DescribedImage } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'

type Props = {
  images: DescribedImage[]
  locale: Locale
  label: string
  prevLabel: string
  nextLabel: string
  workHref: string
  sizes?: string
  className?: string
}

const HOLD_MS = 5000
const FADE_MS = 900

export function Hero({
  images,
  locale,
  label,
  prevLabel,
  nextLabel,
  workHref,
  sizes = '(max-width: 768px) 92vw, 84vw',
  className,
}: Props) {
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

  useArrowKeys(step)

  useEffect(() => {
    if (images.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timer = setTimeout(() => step(1), HOLD_MS)
    return () => clearTimeout(timer)
  }, [index, images.length, step])

  if (images.length === 0) return null

  return (
    <div className={className ? `page-gutter ${className}` : 'page-gutter'}>
      <div
        data-hero
        className="relative h-[calc(100svh-9rem)] min-h-[20rem] w-full overflow-hidden select-none md:h-[calc(100svh-11rem)]"
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
            sizes={sizes}
            quality={82}
            placeholder="blur"
            blurDataURL={image.blur}
            draggable={false}
            className="object-cover will-change-[opacity]"
            style={{
              opacity: position === index ? 1 : 0,
              transitionProperty: 'opacity',
              transitionDuration: `${FADE_MS}ms`,
              transitionTimingFunction: 'var(--ease-in-out-soft)',
            }}
          />
        ))}

        <Link href={workHref} aria-label={label} className="absolute inset-0 block" />

        {images.length > 1 && (
          <>
            <StepZone side="left" label={prevLabel} onPress={() => step(-1)} />
            <StepZone side="right" label={nextLabel} onPress={() => step(1)} />
          </>
        )}
      </div>
    </div>
  )
}
