'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'
import { localeNames, locales, type Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import { href } from '@/lib/i18n/routes'
import { CloseIcon, ContactIcon, GlobeIcon, HomeIcon, StudioIcon, WorkIcon } from './NavIcons'

/**
 * LA NAVEGACIÓN DE MÓVIL: una barra fija abajo, siempre a la vista, en cualquier página y
 * a cualquier altura del scroll.
 *
 * Sustituye al botón «Menú» que había en la esquina de la cabecera. El motivo es el
 * pulgar: en un teléfono en la mano, el borde inferior se alcanza sin recolocar el aparato
 * y la esquina superior derecha no. Arriba se queda sólo el wordmark, centrado.
 *
 * **El quinto hueco es el idioma, no un menú.** En el proyecto de referencia ese hueco
 * abre el índice del sitio porque allí hay páginas —calidad, empresa— que no caben en la
 * barra. Aquí no: el sitio entero son estos cuatro destinos, así que un menú desplegable
 * enseñaría exactamente las mismas cuatro entradas que ya se están tocando. Lo único que
 * queda sin sitio en un móvil es el cambio de idioma, y eso es lo que guarda.
 *
 * Sólo iconos, sin rótulo: cinco palabras en versalitas a lo ancho de un móvil de 390 px
 * o se cortan o se aprietan hasta ser ilegibles. El nombre accesible va en el `aria-label`
 * de cada hueco, traducido.
 */
export function MobileNav({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const pathname = usePathname()

  /**
   * El selector guarda la ruta en la que se abrió, no un booleano. Así, en cuanto se
   * navega a otra ruta deja de estar abierto por derivación —sin un efecto que llame a
   * setState, que es un antipatrón y que el lint de React ya avisa— y también se cierra
   * al usar atrás/adelante del navegador.
   */
  const [openedAt, setOpenedAt] = useState<string | null>(null)
  const open = openedAt === pathname
  const close = () => setOpenedAt(null)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpenedAt(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const home = href(locale, 'home')

  /**
   * ¿Estamos en este destino? Para la portada se compara exacto: `/es/studio` es la misma
   * página que `/es` —la sección tiene ruta pero no página propia— y con `startsWith`
   * inicio quedaría marcado a la vez que estudio, que es peor que no marcar ninguno.
   */
  const onRoute = (target: string) =>
    target === home ? pathname === home : pathname === target || pathname.startsWith(`${target}/`)

  return (
    <>
      {/* El selector de idioma, en una bandeja justo encima de la barra. No ocupa la
          pantalla entera como haría un menú: son dos entradas, y taparlo todo para
          enseñar «ES / EN» sería desproporcionado.

          `hidden` y no un `return` condicional: así el botón conserva `aria-controls`
          apuntando a un nodo que siempre existe. */}
      <div
        id="mobile-locales"
        hidden={!open}
        className="page-gutter fixed inset-x-0 bottom-(--spacing-nav-mobile) z-50 border-t border-line bg-paper/95 py-6 backdrop-blur-md md:hidden"
      >
        <div className="flex items-center justify-center gap-8">
          {locales.map((option) => (
            <Link
              key={option}
              href={swapLocale(pathname, option)}
              hrefLang={option}
              aria-current={option === locale ? 'true' : undefined}
              onClick={close}
              className={cn(
                'tap text-lead font-serif',
                option === locale ? 'text-ink' : 'text-ink-soft',
              )}
            >
              {localeNames[option]}
            </Link>
          ))}
        </div>
      </div>

      <nav
        aria-label={dictionary.nav.mobile}
        className="fixed inset-x-0 bottom-0 z-50 flex h-(--spacing-nav-mobile) items-stretch border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
      >
        <NavSlot
          href={home}
          label={dictionary.nav.home}
          active={onRoute(home)}
          // Estando ya en la portada, Next no navega y el toque no haría nada: quien esté
          // leyendo el pie se quedaría en el pie. La casa lleva siempre al principio.
          onClick={(event) => {
            close()
            if (pathname === home) {
              event.preventDefault()
              window.scrollTo({ top: 0 })
            }
          }}
        >
          <HomeIcon className="h-6 w-6" />
        </NavSlot>

        <NavSlot
          href={href(locale, 'work')}
          label={dictionary.nav.work}
          active={onRoute(href(locale, 'work'))}
          onClick={close}
        >
          <WorkIcon className="h-6 w-6" />
        </NavSlot>

        <NavSlot
          href={href(locale, 'studio')}
          label={dictionary.nav.studio}
          active={onRoute(href(locale, 'studio'))}
          onClick={close}
        >
          <StudioIcon className="h-6 w-6" />
        </NavSlot>

        <NavSlot
          href={href(locale, 'contact')}
          label={dictionary.nav.contact}
          active={onRoute(href(locale, 'contact'))}
          onClick={close}
        >
          <ContactIcon className="h-6 w-6" />
        </NavSlot>

        <button
          type="button"
          onClick={() => setOpenedAt(open ? null : pathname)}
          aria-expanded={open}
          aria-controls="mobile-locales"
          aria-label={open ? dictionary.nav.close : dictionary.nav.language}
          className={cn(slotClass, slotState(open))}
        >
          {open ? <CloseIcon className="h-6 w-6" /> : <GlobeIcon className="h-6 w-6" />}
        </button>
      </nav>
    </>
  )
}

/** La misma página en el otro idioma: se sustituye sólo el primer segmento. */
function swapLocale(pathname: string, target: Locale) {
  const segments = pathname.split('/')
  segments[1] = target
  return segments.join('/') || `/${target}`
}

/**
 * El hueco de cada icono. Reparte el ancho a partes iguales y estira a todo el alto de la
 * barra —gracias al `items-stretch` del `<nav>`—, así que el propio hueco ya mide la celda
 * entera: no hace falta una pastilla aparte de tamaño fijo, y de paso el área pulsable
 * pasa de sobra los 24 px que exige WCAG 2.2.
 *
 * El activo no se dice sólo con el color: la paleta de esta web es papel, tinta y grises
 * —no hay color de acento—, y a 24 px con trazo de 1,25 px un gris contra otro gris hay
 * que buscarlo. Así que el estado se dice también con el fondo, un `paper-deep` que ocupa
 * la celda entera —cuadrado y no redondo a propósito, para que se lea como un hueco de la
 * barra y no como un botón suelto— y con el filete superior en tinta.
 */
const slotClass =
  'relative flex flex-1 items-center justify-center transition-colors duration-500 before:absolute before:inset-x-0 before:top-0 before:h-px before:transition-colors before:duration-500'

const slotState = (active: boolean) =>
  active
    ? 'bg-paper-deep text-ink before:bg-ink'
    : 'text-ink-soft before:bg-transparent hover:text-ink'

function NavSlot({
  href: target,
  label,
  active,
  onClick,
  children,
}: {
  href: string
  label: string
  active: boolean
  onClick: (event: React.MouseEvent<HTMLAnchorElement>) => void
  children: React.ReactNode
}) {
  return (
    <Link
      href={target}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
      className={cn(slotClass, slotState(active))}
    >
      {children}
    </Link>
  )
}
