import Link from 'next/link'
import { defaultLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { href } from '@/lib/i18n/routes'

/**
 * 404 dentro del layout de idioma. No puede leer `params` (Next la renderiza sin
 * ellos), así que usa el idioma por defecto: es la única página del sitio que no
 * está traducida por ruta.
 */
export default function NotFound() {
  const t = getDictionary(defaultLocale)

  return (
    <div className="page-gutter flex min-h-[60svh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-6 max-w-2xl text-display font-serif text-balance">{t.notFound.title}</h1>
      <p className="mt-6 max-w-md text-ink-soft">{t.notFound.lead}</p>
      <Link href={href(defaultLocale, 'home')} className="link-underline tap mt-10 text-small">
        {t.notFound.cta}
      </Link>
    </div>
  )
}
