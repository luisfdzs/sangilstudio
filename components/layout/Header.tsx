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

/**
 * La cabecera, y con ella toda la navegación del sitio.
 *
 * En escritorio: wordmark a la izquierda, menú y los dos idiomas a la derecha.
 *
 * En móvil: wordmark a la izquierda y un **«+» en la esquina superior derecha** que
 * despliega el menú **a pantalla completa**; el «+» se convierte en «−» y es lo que lo
 * contrae. Antes esto era una barra fija de iconos abajo, y se quitó por decisión del
 * estudio: la barra comía cuatro centímetros de foto en todas las pantallas del sitio,
 * que en una web que es fotografía a sangre es justo lo que no sobra.
 *
 * Dos detalles del montaje que no son gratuitos:
 *
 * 1. **El panel se dibuja FUERA del `<header>`.** El header lleva `backdrop-blur` al
 *    hacer scroll, y un filtro convierte al elemento en bloque contenedor de sus
 *    descendientes `fixed`: dentro, el panel medía 0 px de alto. Ya pasó una vez con el
 *    menú anterior, y por eso el componente devuelve un fragmento con el header y el
 *    panel como hermanos.
 * 2. **Con el menú abierto, `data-top` pasa a `false`.** Ese atributo es lo que en
 *    `globals.css` pinta el texto de la barra en color papel cuando hay un hero debajo.
 *    Con el panel blanco de fondo, ese blanco sobre blanco dejaba el «−» invisible.
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
        data-top={!scrolled && !open}
        className={cn(
          'sticky top-0 z-50 transition-colors duration-500',
          open ? 'bg-paper' : scrolled ? 'bg-paper/95 text-ink backdrop-blur-md' : 'bg-transparent',
        )}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
        >
          {dictionary.nav.skipToContent}
        </a>

        <div className="header-bar page-gutter flex h-20 items-center justify-between gap-6 md:h-24">
          {/* `tap`: el wordmark mide 20 px de alto, por debajo del mínimo de 24 px que
              exige WCAG 2.2 para un objetivo pulsable. Lo detectó `npm run check:mobile`
              —nadie lo ve mirando la pantalla, y es el enlace más usado de la cabecera—.
              La utilidad agranda el área con un pseudo-elemento invisible, así que la
              marca sigue midiendo lo que mide. */}
          <Link href={home} aria-label={dictionary.nav.home} className="tap" onClick={goHome}>
            <Wordmark className="h-5 w-auto md:h-7" />
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
            {navigation.map((key) => (
              <Link
                key={key}
                href={href(locale, key)}
                aria-current={isCurrent(pathname, href(locale, key)) ? 'page' : undefined}
                // El color lo hereda del header (ver globals.css): sobre el hero es
                // papel, sobre fondo blanco es tinta. La jerarquía la marca la opacidad.
                className={cn(
                  'link-underline tap text-small tracking-wide transition-opacity',
                  isCurrent(pathname, href(locale, key))
                    ? 'opacity-100'
                    : 'opacity-65 hover:opacity-100',
                )}
              >
                {dictionary.nav[key]}
              </Link>
            ))}

            <span aria-hidden className="h-3 w-px bg-current opacity-30" />

            {/* El globo delante de los dos códigos de idioma. Sin él, «ES EN» seguido
                del menú se lee como dos entradas más de navegación; con él, el grupo se
                identifica de un vistazo y sin necesidad de traducir la palabra «idioma»
                —ni de poner banderas, que representan países y no lenguas—. */}
            <div className="flex items-center gap-2">
              <GlobeIcon className="mr-1 h-3.5 w-3.5 shrink-0 opacity-50" />
              {locales.map((option) => (
                <Link
                  key={option}
                  href={swapLocale(option)}
                  hrefLang={option}
                  aria-current={option === locale ? 'true' : undefined}
                  className={cn(
                    'text-micro tap uppercase transition-opacity',
                    option === locale ? 'opacity-100' : 'opacity-50 hover:opacity-100',
                  )}
                >
                  {localeNames[option]}
                </Link>
              ))}
            </div>
          </nav>

          {/* El «+». Va a la derecha del todo y mide 44 px de lado: es el único control
              de navegación que hay en un móvil, así que se toca sin apuntar. */}
          <button
            type="button"
            onClick={() => setOpenedAt(open ? null : pathname)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? dictionary.nav.close : dictionary.nav.menu}
            className="-mr-2 flex h-11 w-11 items-center justify-center md:hidden"
          >
            {open ? <MinusIcon className="h-6 w-6" /> : <PlusIcon className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* EL MENÚ, A PANTALLA COMPLETA. `hidden` en vez de un return condicional: así el
          botón conserva su `aria-controls` apuntando a un nodo que siempre existe.

          Por debajo del header en el eje Z (z-40 contra z-50) a propósito: el «−» que lo
          cierra vive en la cabecera y tiene que quedar por encima del panel para poder
          pulsarse. De ahí también el hueco superior, que deja libre la altura de la
          barra. */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="page-gutter fixed inset-0 z-40 flex flex-col overflow-y-auto bg-paper pt-20 pb-16 md:hidden"
      >
        <nav aria-label={dictionary.nav.menu} className="flex flex-col gap-6 pt-10">
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
        </nav>

        {/* Los idiomas, al final y separados por un filete: no son un destino más. */}
        <div className="mt-auto flex items-center gap-6 border-t border-line pt-8">
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
