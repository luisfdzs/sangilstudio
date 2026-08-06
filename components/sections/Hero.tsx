'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { DescribedImage } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'

type Props = {
  images: DescribedImage[]
  locale: Locale
  label: string
  workHref: string
}

const HOLD_MS = 5000
const FADE_MS = 1600

export function Hero({ images, locale, label, workHref }: Props) {
  const [{ index, reach }, setFrame] = useState({ index: 0, reach: 2 })

  useEffect(() => {
    if (images.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timer = setInterval(() => {
      setFrame((current) => {
        const next = (current.index + 1) % images.length
        return { index: next, reach: Math.max(current.reach, next + 2) }
      })
    }, HOLD_MS)
    return () => clearInterval(timer)
  }, [images.length])

  if (images.length === 0) return null

  return (
    <div className="page-gutter">
      <Link
        href={workHref}
        aria-label={label}
        data-hero
        className="relative block h-[calc(100svh-9rem)] min-h-[20rem] w-full overflow-hidden md:h-[calc(100svh-11rem)]"
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
            className="object-cover transition-opacity ease-(--ease-in-out-soft)"
            style={{
              opacity: position === index ? 1 : 0,
              transitionDuration: `${FADE_MS}ms`,
            }}
          />
        ))}
      </Link>
    </div>
  )
}
