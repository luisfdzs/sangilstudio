'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'
import { localeNames, locales, type Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import { href, navigation } from '@/lib/i18n/routes'
import { GlobeIcon } from './NavIcons'
import { Wordmark } from './Wordmark'

type Props = {
  locale: Locale
  dictionary: Dictionary
}

/**
 * La cabecera. Necesita JS por dos cosas y ninguna más: el estado de scroll —para pasar
 * de transparente sobre el hero a fondo papel— y saber en qué ruta estamos, para marcar
 * la entrada activa y para el cambio de idioma.
 *
 * **El menú de móvil ya no vive aquí.** Está en `MobileNav`, una barra fija abajo con
 * iconos: en un teléfono en la mano, el borde inferior se alcanza con el pulgar y la
 * esquina superior derecha no. Por debajo de `md` aquí arriba queda sólo el wordmark
 * —que es identidad, no navegación—, y por eso va CENTRADO en vez de pegado a la
 * izquierda con media barra vacía al lado. En escritorio vuelve a la izquierda, porque
 * entonces sí tiene enfrente el menú que equilibra la barra.
 */
export function Header({ locale, dictionary }: Props) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /** La misma página en el otro idioma: se sustituye sólo el primer segmento. */
  const swapLocale = (target: Locale) => {
    const segments = pathname.split('/')
    segments[1] = target
    return segments.join('/') || `/${target}`
  }

  const home = href(locale, 'home')

  return (
    <header
      data-top={!scrolled}
      className={cn(
        'sticky top-0 z-50 transition-colors duration-500',
        scrolled ? 'bg-paper/95 text-ink backdrop-blur-md' : 'bg-transparent',
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
      >
        {dictionary.nav.skipToContent}
      </a>

      <div className="header-bar page-gutter flex h-20 items-center justify-center gap-6 md:h-24 md:justify-between">
        {/* `tap`: el wordmark mide 20 px de alto, por debajo del mínimo de 24 px que exige
            WCAG 2.2 para un objetivo pulsable. Lo detectó `npm run check:mobile` —nadie lo
            ve mirando la pantalla, y es el enlace más usado de la cabecera—. La utilidad
            agranda el área con un pseudo-elemento invisible, así que la marca sigue
            midiendo lo que mide. */}
        <Link
          href={home}
          aria-label={dictionary.nav.home}
          className="tap"
          // Estando ya en la portada, Next no navega y el clic no haría nada: quien esté
          // leyendo el pie se quedaría en el pie. La marca debe llevar siempre al
          // principio, así que ahí se sube a mano. Sin `behavior` a propósito: hereda el
          // scroll suave del CSS, y el salto seco cuando el sistema pide menos movimiento.
          onClick={(event) => {
            if (pathname === home) {
              event.preventDefault()
              window.scrollTo({ top: 0 })
            }
          }}
        >
          <Wordmark className="h-5 w-auto md:h-7" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {navigation.map((key) => {
            const target = href(locale, key)
            // Ahora que estudio y contacto tienen ruta propia (`/es/studio`) en vez
            // de ancla, la dirección basta para saber qué se está mirando y se marcan
            // como cualquier otra entrada. Antes no se podían marcar: siendo anclas de
            // la portada, `aria-current` señalaba las dos a la vez estando en el
            // inicio. En `/es` sigue sin marcarse ninguna, que es lo correcto —ahí no
            // se ha pedido ninguna sección—; saber cuál queda a la vista al bajar con
            // el ratón pediría un observador de scroll, y esta barra ya carga con todo
            // el JS que se le permite.
            const active = pathname === target || pathname.startsWith(`${target}/`)
            return (
              <Link
                key={key}
                href={target}
                aria-current={active ? 'page' : undefined}
                // El color lo hereda del header (ver globals.css): sobre el hero es
                // papel, sobre fondo claro es tinta. La jerarquía se marca con opacidad.
                className={cn(
                  'link-underline tap text-small tracking-wide transition-opacity',
                  active ? 'opacity-100' : 'opacity-65 hover:opacity-100',
                )}
              >
                {dictionary.nav[key]}
              </Link>
            )
          })}

          <span aria-hidden className="h-3 w-px bg-current opacity-30" />

          {/* El globo delante de los dos códigos de idioma. Sin él, «ES EN» seguido del
                menú se lee como dos entradas más de navegación; con él, el grupo se
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
      </div>
    </header>
  )
}
