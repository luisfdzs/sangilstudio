'use client'

import Image from 'next/image'
import { useLoaded } from '@/components/ui/useLoaded'
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
  const { loaded, track } = useLoaded()

  return (
    <Image
      {...track(image.id)}
      src={image.src}
      alt={alt}
      width={image.width}
      height={image.height}
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : 'lazy'}
      quality={75}
      data-loaded={loaded.has(image.id) || undefined}
      className={cn(entrance === 'settle' ? 'media-settle' : 'media-fade', className)}
    />
  )
}
