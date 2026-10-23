'use client'

import Image from 'next/image'
import { markIfLoaded } from '@/components/ui/mediaLoad'
import type { DescribedImage } from '@/lib/content'
import { cn } from '@/lib/cn'

type Props = {
  image: DescribedImage
  alt: string
  sizes: string
  priority?: boolean
  className?: string
}

export function Media({ image, alt, sizes, priority = false, className }: Props) {
  return (
    <Image
      ref={markIfLoaded}
      suppressHydrationWarning
      src={image.src}
      alt={alt}
      width={image.width}
      height={image.height}
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : 'lazy'}
      quality={75}
      className={cn('media-fade', className)}
    />
  )
}
