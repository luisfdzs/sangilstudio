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

const MENU_ID = 'site-menu'

export function Header({ locale, dictionary }: Props) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

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

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  const swapLocale = (target: Locale) => {
    const segments = pathname.split('/')
    segments[1] = target
    return segments.join('/') || `/${target}`
  }

  const home = href(locale, 'home')

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
          <Link href={home} aria-label={dictionary.nav.home} className="tap" onClick={goHome}>
            <Wordmark className="h-5 w-auto md:h-7" />
          </Link>

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
        <nav
          aria-label={dictionary.nav.menu}
          className="flex min-h-full flex-col items-center justify-center gap-6 text-center"
        >
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

          <Link
            href={href(locale, 'legal')}
            onClick={close}
            aria-current={isCurrent(pathname, href(locale, 'legal')) ? 'page' : undefined}
            className="tap eyebrow mt-2 hover:text-ink-soft"
          >
            {dictionary.nav.legal}
          </Link>
        </nav>
      </div>
    </>
  )
}

function isCurrent(pathname: string, target: string): boolean {
  return pathname === target || pathname.startsWith(`${target}/`)
}
