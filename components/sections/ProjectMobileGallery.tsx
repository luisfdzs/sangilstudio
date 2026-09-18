'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Gallery, ratioOf } from '@/components/ui/Gallery'
import { Lightbox, ZOOM_ATTR } from '@/components/ui/Lightbox'
import { Media } from '@/components/ui/Media'
import { Reveal } from '@/components/ui/Reveal'
import type { DescribedImage } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'

type Props = {
  images: DescribedImage[]
  locale: Locale
  dictionary: Dictionary
  title: string
  reveal?: boolean
}

/** Las imágenes del proyecto en el móvil: al tocar una se abre el visor ampliado. */
export function ProjectMobileGallery({ images, locale, dictionary, title, reveal = true }: Props) {
  const [zoom, setZoom] = useState<number | null>(null)
  const pathname = usePathname()
  const [ruta, setRuta] = useState(pathname)

  /**
   * Al cambiar de página se cierra, sin excepción. Aunque el visor ya devuelve
   * la entrada del historial al cerrarse, desde dentro se sigue viendo la
   * cabecera: si alguien toca la marca o el menú, el visor no puede quedarse
   * encima de la página nueva.
   */
  if (ruta !== pathname) {
    setRuta(pathname)
    setZoom(null)
  }

  const items = images.map((image, position) => {
    const media = (
      <button
        type="button"
        onClick={() => setZoom(position)}
        aria-label={dictionary.project.zoom}
        {...{ [ZOOM_ATTR]: image.id }}
        className="block h-full w-full"
      >
        <Media image={image} alt={image.alt[locale] || title} sizes="100vw" />
      </button>
    )

    return {
      key: image.id,
      ratio: ratioOf(image),
      content: reveal ? (
        <Reveal className="gallery-frame">{media}</Reveal>
      ) : (
        <div className="gallery-frame">{media}</div>
      ),
    }
  })

  return (
    <>
      <Gallery items={items} />

      {zoom !== null && (
        <Lightbox
          images={images}
          locale={locale}
          title={title}
          start={zoom}
          dictionary={dictionary}
          onClose={() => setZoom(null)}
        />
      )}
    </>
  )
}
