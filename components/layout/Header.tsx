'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'
import { localeNames, locales, type Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import { href, navigation } from '@/lib/i18n/routes'
import { GlobeIcon, MinusIcon, PlusIcon } from './NavIcons'
import { Wordmark } from './Wordmark'

type Props = {
  locale: Locale
  dictionary: Dictionary
}

/** El panel del menú. Se nombra una vez: lo usan el `id` y el `aria-controls` del botón. */
const MENU_ID = 'site-menu'

/**
 * La cabecera, y con ella toda la navegación del sitio.
 *
 * **El mismo menú en todas las pantallas (2026-08-04).** Wordmark a la izquierda y un
 * **«+» en la esquina superior derecha** que despliega el menú a pantalla completa, con
 * las entradas centradas; el «+» se convierte en «−» y es lo que lo contrae. Nació en
 * móvil (referencia: Swiftmet) y el estudio pidió que en escritorio fuera igual, así que
 * la fila de enlaces y los dos códigos de idioma que vivían a la derecha de la barra
 * desaparecieron: ahora los idiomas están dentro del panel, con todo lo demás. Un solo
 * menú, una sola manera de navegar y una barra que es sólo marca y botón.
 *
 * Tres detalles del montaje que no son gratuitos:
 *
 * 1. **El panel se dibuja FUERA del `<header>`.** El header lleva `backdrop-blur` al
 *    hacer scroll, y un filtro convierte al elemento en bloque contenedor de sus
 *    descendientes `fixed`: dentro, el panel medía 0 px de alto. Ya pasó una vez con el
 *    menú anterior, y por eso el componente devuelve un fragmento con el header y el
 *    panel como hermanos.
 * 2. **El panel aparece con un fundido**, que también pidió el estudio. Eso obliga a que
 *    esté siempre en el DOM —un `hidden` no se puede transicionar—, así que cerrado se
 *    apaga con `opacity: 0` + `visibility: hidden` y `transition-behavior: allow-discrete`,
 *    que es lo que hace que la visibilidad conmute al principio del fundido de entrada y
 *    al final del de salida. Con sólo la opacidad, el panel seguiría interceptando clics
 *    y siendo visible para un lector de pantalla; de ahí también el `inert`.
 * 3. **El botón queda por encima del panel** (z-50 contra z-40): el «−» que cierra vive en
 *    la barra, y el hueco superior del panel (`pt-20`) deja libre esa altura.
 */
export function Header({ locale, dictionary }: Props) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  /**
   * El menú guarda la ruta en la que se abrió, no un booleano. Así, en cuanto se navega
   * a otra ruta deja de estar abierto por derivación —sin un efecto que llame a
   * setState, que es un antipatrón y que el lint de React ya avisa— y también se cierra
   * al usar atrás/adelante del navegador.
   */
  const [openedAt, setOpenedAt] = useState<string | null>(null)
  const open = openedAt === pathname
  const close = () => setOpenedAt(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpenedAt(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /** Con el menú ocupando la pantalla, lo de detrás no debe poder moverse. */
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  /** La misma página en el otro idioma: se sustituye sólo el primer segmento. */
  const swapLocale = (target: Locale) => {
    const segments = pathname.split('/')
    segments[1] = target
    return segments.join('/') || `/${target}`
  }

  const home = href(locale, 'home')

  /** Estando ya en la portada, Next no navega y el clic no haría nada: quien esté abajo
   *  se quedaría abajo. La marca y el «Inicio» deben llevar siempre al principio. */
  const goHome = (event: React.MouseEvent) => {
    close()
    if (pathname === home) {
      event.preventDefault()
      window.scrollTo({ top: 0 })
    }
  }

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 transition-colors duration-500',
          open ? 'bg-paper' : scrolled ? 'bg-paper/95 backdrop-blur-md' : 'bg-transparent',
        )}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
        >
          {dictionary.nav.skipToContent}
        </a>

        <div className="page-gutter flex h-20 items-center justify-between gap-6 md:h-24">
          {/* `tap`: el wordmark mide 20 px de alto, por debajo del mínimo de 24 px que
              exige WCAG 2.2 para un objetivo pulsable. Lo detectó `npm run check:mobile`
              —nadie lo ve mirando la pantalla, y es el enlace más usado de la cabecera—.
              La utilidad agranda el área con un pseudo-elemento invisible, así que la
              marca sigue midiendo lo que mide. */}
          <Link href={home} aria-label={dictionary.nav.home} className="tap" onClick={goHome}>
            <Wordmark className="h-5 w-auto md:h-7" />
          </Link>

          {/* El «+». Va a la derecha del todo y mide 44 px de lado: es el ÚNICO control de
              navegación que hay en la barra, en móvil y en escritorio, así que se toca sin
              apuntar. */}
          <button
            type="button"
            onClick={() => setOpenedAt(open ? null : pathname)}
            aria-expanded={open}
            aria-controls={MENU_ID}
            aria-label={open ? dictionary.nav.close : dictionary.nav.menu}
            className="-mr-2 flex h-11 w-11 items-center justify-center"
          >
            {open ? <MinusIcon className="h-6 w-6" /> : <PlusIcon className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* EL MENÚ, A PANTALLA COMPLETA Y EN TODAS LAS PANTALLAS.
          Siempre montado: es lo que permite el fundido, y de paso el botón conserva su
          `aria-controls` apuntando a un nodo que existe siempre.

          Cerrado: transparente, invisible e `inert` —sin clics, sin foco y sin voz—. El
          `[transition-behavior:allow-discrete]` es lo que sincroniza la `visibility` con el
          fundido: entrando conmuta al empezar, saliendo al terminar. Se escribe como
          propiedad arbitraria y no con una utilidad porque es exactamente una línea de CSS
          y así queda al lado de la transición a la que pertenece.

          Por debajo del header en el eje Z (z-40 contra z-50) a propósito: el «−» que lo
          cierra vive en la cabecera y tiene que quedar por encima del panel para poder
          pulsarse. De ahí también el hueco superior, que deja libre la altura de la
          barra. */}
      <div
        id={MENU_ID}
        inert={!open}
        className={cn(
          'page-gutter fixed inset-0 z-40 overflow-y-auto bg-paper pt-20 pb-16 md:pt-24',
          'transition-[opacity,visibility] duration-500 ease-(--ease-out-soft)',
          '[transition-behavior:allow-discrete]',
          open ? 'visible opacity-100' : 'invisible opacity-0',
        )}
      >
        {/* El menú va CENTRADO en la pantalla, como en Swiftmet: con cinco entradas y nada
            más, alineadas arriba y a la izquierda dejaban la pantalla medio vacía y el ojo
            no sabía dónde ir. El centrado lo pone este `<nav>` y no el panel de fuera, que
            tiene que quedar libre para el `overflow-y-auto` y la transición.

            `min-h-full` y no `h-full`: llena el panel para poder centrar, y si algún día
            las entradas no caben en una pantalla baja, crece y el `overflow-y-auto` del
            panel las deja alcanzables. El hueco de arriba (`pt-20`) sigue dejando libre la
            altura de la barra, donde vive el «−» que cierra. */}
        <nav
          aria-label={dictionary.nav.menu}
          className="flex min-h-full flex-col items-center justify-center gap-6 text-center"
        >
          <Link href={home} onClick={goHome} className="text-title tracking-tight">
            {dictionary.nav.home}
          </Link>
          {navigation.map((key) => (
            <Link
              key={key}
              href={href(locale, key)}
              onClick={close}
              aria-current={isCurrent(pathname, href(locale, key)) ? 'page' : undefined}
              className={cn(
                'text-title tracking-tight',
                isCurrent(pathname, href(locale, key)) ? 'font-semibold' : undefined,
              )}
            >
              {dictionary.nav[key]}
            </Link>
          ))}

          {/* Los idiomas, separados por un filete: no son un destino más. Ya no van
              anclados al fondo con `mt-auto` —eso los dejaba lejos del grupo centrado y
              rompía el eje—, sino justo debajo y centrados con él. */}
          <div className="mt-6 flex items-center justify-center gap-6 border-t border-line pt-6">
            <GlobeIcon className="h-4 w-4 shrink-0 text-ink-faint" />
            {locales.map((option) => (
              <Link
                key={option}
                href={swapLocale(option)}
                hrefLang={option}
                onClick={close}
                aria-current={option === locale ? 'true' : undefined}
                className={cn(
                  'tap text-small uppercase',
                  option === locale ? 'text-ink' : 'text-ink-soft',
                )}
              >
                {localeNames[option]}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </>
  )
}

/**
 * ¿Estamos en este destino? `/es/contact` es la misma página que `/es` —la sección
 * tiene ruta pero no página propia—, así que la comparación es exacta salvo para las
 * páginas con hijos, donde una ficha de proyecto marca también «Proyectos».
 */
function isCurrent(pathname: string, target: string): boolean {
  return pathname === target || pathname.startsWith(`${target}/`)
}
