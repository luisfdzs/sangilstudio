'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'
import { localeNames, locales, type Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import { href, isSection, navigation } from '@/lib/i18n/routes'
import { Wordmark } from './Wordmark'

type Props = {
  locale: Locale
  dictionary: Dictionary
}

/**
 * Uno de los dos únicos componentes de cliente del sitio (el otro es la galería).
 * Necesita JS por tres cosas y ninguna más: menú móvil, estado de scroll y saber
 * en qué ruta estamos para el cambio de idioma.
 */
export function Header({ locale, dictionary }: Props) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  /**
   * El menú guarda la ruta en la que se abrió, no un booleano. Así, en cuanto se
   * navega a otra ruta deja de estar abierto por derivación —sin un efecto que
   * llame a setState, que es un antipatrón (y que React ya avisa en el lint)—
   * y también se cierra al usar atrás/adelante del navegador.
   */
  const [openedAt, setOpenedAt] = useState<string | null>(null)
  const open = openedAt === pathname
  const setOpen = (value: boolean) => setOpenedAt(value ? pathname : null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Bloquear el scroll de la página mientras el menú está abierto.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpenedAt(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /** La misma página en el otro idioma: se sustituye sólo el primer segmento. */
  const swapLocale = (target: Locale) => {
    const segments = pathname.split('/')
    segments[1] = target
    return segments.join('/') || `/${target}`
  }

  return (
    <>
      <header
        // Con el menú abierto la barra deja de estar "sobre el hero": pasa a fondo
        // papel y tinta, para que se lea junto al panel desplegado.
        data-top={!scrolled && !open}
        className={cn(
          'sticky top-0 z-50 transition-colors duration-500',
          scrolled || open ? 'bg-paper/95 text-ink backdrop-blur-md' : 'bg-transparent',
        )}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
        >
          {dictionary.nav.skipToContent}
        </a>

        <div className="header-bar page-gutter flex h-20 items-center justify-between gap-6 md:h-24">
          <Link href={href(locale, 'home')} aria-label={dictionary.nav.home}>
            <Wordmark className="h-[6.3rem] w-auto md:h-[8.1rem]" />
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
            {navigation.map((key) => {
              const target = href(locale, key)
              // Estudio y contacto son anclas de la portada, no páginas: `aria-current`
              // marcaría las dos a la vez estando en el inicio, que es peor que no
              // marcar ninguna. Saber cuál se está viendo pediría un observador de
              // scroll, y esta barra ya carga con todo el JS que se le permite.
              const active =
                !isSection(key) && (pathname === target || pathname.startsWith(`${target}/`))
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

            <div className="flex items-center gap-2">
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

          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="eyebrow tap text-current md:hidden"
          >
            {open ? dictionary.nav.close : dictionary.nav.menu}
          </button>
        </div>
      </header>

      {/* Menú móvil: pantalla completa, tipografía grande, sin adornos.
          Va FUERA del <header> a propósito: la barra usa `backdrop-blur`, y un
          filtro convierte al elemento en bloque contenedor de sus descendientes
          `fixed`. Dentro del header, este panel calculaba su alto contra una barra
          de 80 px y se quedaba en 0 px de alto — el menú se abría vacío. */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="fixed inset-0 top-20 z-40 bg-paper page-gutter md:hidden"
      >
        <nav className="flex flex-col gap-6 pt-10" aria-label="Principal">
          {navigation.map((key) => (
            <Link
              key={key}
              href={href(locale, key)}
              className="text-title font-serif"
              onClick={() => setOpen(false)}
            >
              {dictionary.nav[key]}
            </Link>
          ))}
          <div className="mt-6 flex items-center gap-4 border-t border-line pt-6">
            {locales.map((option) => (
              <Link
                key={option}
                href={swapLocale(option)}
                hrefLang={option}
                className={cn('eyebrow tap', option === locale && 'text-ink')}
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
