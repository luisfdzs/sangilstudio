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
  /** Cómo aparece al cargar: un fundido, o un fundido que además se asienta. */
  entrance?: 'fade' | 'settle'
  className?: string
}

export function Media({
  image,
  alt,
  sizes,
  priority = false,
  entrance = 'fade',
  className,
}: Props) {
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
      className={cn(entrance === 'settle' ? 'media-settle' : 'media-fade', className)}
    />
  )
}
