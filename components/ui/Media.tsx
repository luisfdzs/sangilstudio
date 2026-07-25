import Image from 'next/image'
import type { MediaImage } from '@/lib/media'
import { cn } from '@/lib/cn'

type Props = {
  image: MediaImage
  alt: string
  /** Anchos que la imagen ocupará según viewport. Obligatorio: sin esto el
   *  navegador descarga siempre la variante más grande. */
  sizes: string
  /** Sólo para la imagen que hace de LCP (una por página, ni una más). */
  priority?: boolean
  /** Recorte a una proporción fija (grid). Si se omite, respeta la del original. */
  ratio?: string
  className?: string
}

/**
 * Única forma de poner una imagen en esta web.
 *
 * Centralizarlo garantiza tres cosas que a mano se olvidan siempre: dimensiones
 * reales del manifiesto (CLS = 0), placeholder difuminado y un `sizes` explícito.
 */
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
