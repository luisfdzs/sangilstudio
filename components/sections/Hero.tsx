'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { DescribedImage } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'

type Props = {
  /** Portadas de los proyectos que el estudio elige en el panel, en su orden. */
  images: DescribedImage[]
  locale: Locale
  /** Nombre accesible del enlace: la pantalla entera lleva a los proyectos. */
  label: string
  /** Destino del clic: la página de proyectos. */
  workHref: string
}

/** Lo que tarda cada imagen en dar paso a la siguiente, y lo que dura el fundido. */
const HOLD_MS = 5000
const FADE_MS = 1600

/**
 * LA PORTADA: imágenes de proyectos que se van sustituyendo unas a otras jugando con la
 * opacidad. Sin texto encima —ni titular, ni pie, ni flecha—: es lo que pidió el estudio,
 * y es también lo que hace que la fotografía se lea como fotografía y no como el fondo de
 * un cartel.
 *
 * **Con los márgenes de la web, no a sangre (2026-08-04).** Antes ocupaba el ancho
 * completo y se metía por debajo de la cabecera (`-mt-20`), que quedaba flotando sobre la
 * foto con el texto en blanco y una sombra. El estudio pidió lo contrario: que los
 * márgenes —superior y laterales— sean de toda la web y no sólo de la ficha de proyecto,
 * y que el logo y el menú tengan siempre su propio espacio en blanco sin necesidad de
 * resaltarse encima de una imagen. Así que la imagen respeta el `page-gutter` de siempre y
 * arranca por debajo de la cabecera.
 *
 * De ahí que el alto sea un `calc`: la altura de la ventana menos la barra —5rem en móvil,
 * 6rem a partir de `md`— menos un hueco equivalente por debajo, para que la portada se lea
 * como una pantalla y aun así se vea que hay algo más abajo.
 *
 * Toda la pantalla es un enlace a la página de proyectos. Al no haber texto, ese enlace
 * necesita nombre accesible o se anunciaría vacío: de ahí el `aria-label`.
 *
 * Las imágenes se apilan todas y sólo cambia la opacidad. Se hace así, y no montando y
 * desmontando una a una, porque el fundido necesita que la que entra ya esté descargada:
 * al desmontar, el navegador vuelve a pedirla y el cruce se ve como un parpadeo.
 *
 * La primera es la imagen del LCP de todo el sitio, así que es la ÚNICA con `priority`.
 * Las demás se cargan perezosamente; con cinco segundos por delante llegan de sobra.
 */
export function Hero({ images, locale, label, workHref }: Props) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (images.length < 2) return
    // Quien pide menos movimiento se queda con la primera imagen, fija. Un carrusel es
    // movimiento aunque sea lento, y aquí ocupa la pantalla entera.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % images.length)
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
        {images.map((image, position) => (
          <Image
            key={image.id}
            src={image.src}
            alt={position === 0 ? image.alt[locale] : ''}
            // Sólo la primera se nombra. Las demás son la MISMA ilustración cambiando: si
            // cada una llevara su texto alternativo, un lector de pantalla leería seis
            // descripciones seguidas de una sola cosa. (Y la descripción es opcional en el
            // panel: si está vacía, el nombre del enlace lo pone el `aria-label`.)
            aria-hidden={position !== 0}
            fill
            priority={position === 0}
            fetchPriority={position === 0 ? 'high' : 'auto'}
            loading={position === 0 ? undefined : 'lazy'}
            // Ya no ocupa el ancho de la ventana: le quitan los márgenes laterales.
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

        {/* Aquí había un velo negro degradado en el borde superior, para que el wordmark y
            el «+» no se perdieran sobre un cielo claro. Ya no hace falta: la cabecera tiene
            su propio espacio en blanco por encima de la imagen. */}
      </Link>
    </div>
  )
}
