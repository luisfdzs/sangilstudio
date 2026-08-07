import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, locales } from '@/lib/i18n/config'
import { href } from '@/lib/i18n/routes'
import { TypePanel } from './TypePanel'

export const metadata: Metadata = {
  title: 'Lab · tipografía',
  robots: { index: false, follow: false },
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function TypeLabPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  return (
    <div className="page-gutter pt-16 pb-(--spacing-section) md:pt-24">
      <header className="max-w-2xl">
        <p className="eyebrow">Laboratorio interno · no indexado</p>
        <h1 className="mt-4 text-display tracking-tight uppercase">Tipografía</h1>
        <p className="mt-6 text-body text-ink-soft">
          Los dieciséis textos de la web, cada uno por separado: tipografía, tamaño en móvil y en
          escritorio, grosor, altura de línea, espaciado entre letras y palabras, caja, cursiva,
          color y opacidad. Los valores de partida son los que tiene la web hoy. Lo que elijas se
          guarda en este navegador, se puede ver aplicado sobre la web real y sale como CSS al
          final.
        </p>
      </header>

      <div className="mt-16">
        <TypePanel homeHref={href(locale, 'home')} />
      </div>
    </div>
  )
}
