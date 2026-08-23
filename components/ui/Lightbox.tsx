'use client'

import Image from 'next/image'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import { createPortal } from 'react-dom'
import { Chevron } from '@/components/ui/Chevron'
import { StepZone } from '@/components/ui/StepZone'
import { useArrowKeys } from '@/components/ui/useArrowKeys'
import { cn } from '@/lib/cn'
import type { DescribedImage } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'

type Props = {
  images: DescribedImage[]
  locale: Locale
  title: string
  start: number
  dictionary: Dictionary
  onClose: () => void
}

/** Atributo que marca la foto de la página desde la que se abre el visor. */
export const ZOOM_ATTR = 'data-zoom-id'

/** El fundido de una foto a otra: el mismo que el del visor de escritorio. */
const FADE_MS = 700
const FADE_EASE = 'var(--ease-in-out-soft)'

/** Lo que tarda la foto en llegar desde su sitio en la página, y con qué opacidad entra. */
const OPEN_MS = 700
const OPEN_EASE = 'var(--ease-out-soft)'
const OPEN_FROM = 0.45

/**
 * Al cerrar, el visor entero se desvanece y ya está: ni viaje de vuelta, ni la
 * foto quedándose a medias. Son los mismos valores con los que se va el menú a
 * pantalla completa, que es el otro sitio de la web donde algo así desaparece.
 */
const CLOSE_MS = 500
const CLOSE_EASE = 'var(--ease-out-soft)'

/**
 * Visor de fotos del móvil, con el mismo fundido que el de escritorio
 * (`ProjectViewer`).
 *
 * La cabecera se sigue viendo y la foto respeta los márgenes de la página. De
 * una foto a otra se pasa con las flechas de los lados, las mismas del
 * ordenador, y lo único que cambia es la opacidad: las fotos no se mueven ni
 * cambian de tamaño. Abajo, la barra para volver al proyecto.
 *
 * Sólo existe en vertical: con el móvil tumbado la web no se ve (ver
 * `RotateNotice`), así que no hay caso horizontal del que preocuparse.
 */
export function Lightbox({ images, locale, title, start, dictionary, onClose }: Props) {
  const [index, setIndex] = useState(start)
  const [shown, setShown] = useState(false)
  const [going, setGoing] = useState(false)

  const stage = useRef<HTMLDivElement>(null)
  const overflow = useRef('')
  const leaving = useRef(false)
  const pushed = useRef(false)
  const leaveRef = useRef<() => void>(() => {})

  const labelOf = (image: DescribedImage) => image.alt[locale] || title

  const slideImage = (position: number) =>
    stage.current?.querySelector<HTMLImageElement>(`[data-slide="${position}"] img`) ?? null

  const pageImage = (position: number) => {
    const image = images[position]
    if (!image) return null
    return document.querySelector<HTMLImageElement>(`[${ZOOM_ATTR}="${image.id}"] img`)
  }

  /** Entrada: la foto arranca en su sitio de la página y medio fundida. */
  useLayoutEffect(() => {
    const box = stage.current
    if (!box) return

    /**
     * Se parte siempre de cero antes de medir. Este efecto puede correr dos
     * veces —React repite los efectos en desarrollo—, y en la segunda pasada la
     * foto ya estaría movida por la primera: se medirían el origen y el destino
     * en el mismo sitio, saldría un viaje de cero y la foto aparecería de golpe.
     */
    box.style.transition = 'none'
    box.style.transform = 'none'
    box.style.opacity = '1'

    const from = pageImage(start)?.getBoundingClientRect()
    const to = slideImage(start)?.getBoundingClientRect()

    if (from && to && to.width > 0) {
      box.style.opacity = String(OPEN_FROM)
      place(box, from, to)
    }

    const frame = requestAnimationFrame(() => {
      box.style.transition = `transform ${OPEN_MS}ms ${OPEN_EASE}, opacity ${OPEN_MS}ms ${OPEN_EASE}`
      box.style.transform = 'none'
      box.style.opacity = '1'
      setShown(true)
    })

    return () => cancelAnimationFrame(frame)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    overflow.current = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow.current
    }
  }, [])

  /** El cierre: el visor se desvanece entero, dejando ver la página detrás. */
  const leave = useCallback(() => {
    if (leaving.current) return
    leaving.current = true
    setGoing(true)

    /** La página se queda donde estaba: no se mueve nada al cerrar. */
    document.body.style.overflow = overflow.current

    window.setTimeout(onClose, CLOSE_MS)
  }, [onClose])

  /**
   * El visor ocupa una entrada del historial, así que el botón «atrás» del
   * móvil lo cierra en vez de sacarte del proyecto. Sin esto, al volver atrás
   * el visor se quedaba abierto sobre la página anterior y, al entrar otra vez
   * en el proyecto, aparecía abierto en lugar de las fotos en columna.
   */
  useEffect(() => {
    if (!pushed.current) {
      window.history.pushState({ ...window.history.state, visor: true }, '')
      pushed.current = true
    }

    const onPop = () => {
      pushed.current = false
      leaveRef.current()
    }

    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    leaveRef.current = leave
  }, [leave])

  /** Cerrar deshace la entrada del historial; el resto lo hace `popstate`. */
  const close = useCallback(() => {
    if (leaving.current) return
    if (pushed.current) window.history.back()
    else leave()
  }, [leave])

  /** Las flechas dan la vuelta al llegar al final, como en el ordenador. */
  const step = useCallback(
    (delta: number) => setIndex((current) => (current + delta + images.length) % images.length),
    [images.length],
  )

  useArrowKeys(step)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close])

  /** Un toque limpio en el margen de al lado de la foto vuelve al proyecto. */
  function onSlideClick(event: ReactMouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) close()
  }

  const fade = cn('transition-opacity', shown ? 'opacity-100' : 'opacity-0')
  const fadeMs = { transitionDuration: `${OPEN_MS}ms`, transitionTimingFunction: OPEN_EASE }

  return createPortal(
    <div
      role="dialog"
      aria-modal="false"
      aria-label={title}
      className={cn(
        'fixed inset-0 z-30 transition-opacity md:hidden',
        going ? 'opacity-0' : 'opacity-100',
      )}
      style={{ transitionDuration: `${CLOSE_MS}ms`, transitionTimingFunction: CLOSE_EASE }}
    >
      <div aria-hidden="true" className={cn('absolute inset-0 bg-paper', fade)} style={fadeMs} />

      <div className="relative flex h-full flex-col pt-(--spacing-header)">
        <div ref={stage} className="relative min-h-0 flex-1 overflow-hidden py-2 select-none">
          {images.map((image, position) => (
            <div
              key={image.id}
              data-slide={position}
              onClick={onSlideClick}
              aria-hidden={position === index ? undefined : 'true'}
              className="page-gutter absolute inset-x-0 inset-y-2 flex items-center justify-center will-change-[opacity]"
              style={{
                opacity: position === index ? 1 : 0,
                transition: `opacity ${FADE_MS}ms ${FADE_EASE}`,
              }}
            >
              <Image
                src={image.src}
                alt={labelOf(image)}
                width={image.width}
                height={image.height}
                sizes="100vw"
                quality={75}
                loading={Math.abs(position - start) <= 1 ? 'eager' : 'lazy'}
                placeholder="blur"
                blurDataURL={image.blur}
                draggable={false}
                className="h-auto max-h-full w-full max-w-full object-contain"
              />
            </div>
          ))}

          {images.length > 1 && (
            <div className={fade} style={fadeMs}>
              <StepZone
                always
                tone="ink"
                side="left"
                label={dictionary.home.heroPrev}
                onPress={() => step(-1)}
              />
              <StepZone
                always
                tone="ink"
                side="right"
                label={dictionary.home.heroNext}
                onPress={() => step(1)}
              />
            </div>
          )}
        </div>

        <div className={cn('page-gutter flex min-h-16 shrink-0 items-center', fade)} style={fadeMs}>
          <button
            type="button"
            onClick={close}
            title={dictionary.project.backOneLong}
            className="tap group flex shrink-0 items-center gap-2 text-ink transition-colors duration-300 hover:text-ink-soft"
          >
            <Chevron
              direction="left"
              className="h-4 w-2 transition-transform duration-300 ease-(--ease-out-soft) group-hover:-translate-x-1"
            />
            <span className="text-micro uppercase">{dictionary.project.backOne}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

/** Deja el escenario del tamaño y en el sitio de la foto de la página. */
function place(box: HTMLElement, from: DOMRect, to: DOMRect): void {
  const stage = box.getBoundingClientRect()
  const centre = { x: to.left + to.width / 2, y: to.top + to.height / 2 }

  box.style.transformOrigin = `${centre.x - stage.left}px ${centre.y - stage.top}px`
  box.style.transform =
    `translate(${from.left + from.width / 2 - centre.x}px, ` +
    `${from.top + from.height / 2 - centre.y}px) scale(${from.width / to.width})`
}
