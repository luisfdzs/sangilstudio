import Image from 'next/image'
import type { DescribedImage } from '@/lib/content'
import { cn } from '@/lib/cn'

type Props = {
  image: DescribedImage
  alt: string
  sizes: string
  priority?: boolean
  ratio?: string
  className?: string
}

export function Media({ image, alt, sizes, priority = false, ratio, className }: Props) {
  return (
    <div
      className={cn('relative w-full overflow-hidden bg-paper-deep', className)}
      style={ratio ? { aspectRatio: ratio } : { aspectRatio: `${image.width} / ${image.height}` }}
    >
      <Image
        src={image.src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        placeholder="blur"
        blurDataURL={image.blur}
        quality={75}
        className="object-cover"
      />
    </div>
  )
}
