import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProjectSearchGrid } from '@/components/sections/ProjectSearchGrid'
import { getProjects } from '@/lib/content'
import { isLocale, locales } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'

/** Prerrenderiza esta página para cada idioma. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return { title: getDictionary(locale).work.title }
}

/**
 * Todos los proyectos. La página a la que lleva la portada al pulsarla.
 *
 * El listado y el buscador van en un componente de cliente (`ProjectSearchGrid`) porque
 * el filtrado ocurre mientras se escribe; los datos se leen aquí, en el servidor, y se
 * le pasan ya validados. La página sigue siendo estática.
 */
export default async function WorkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const t = getDictionary(locale)
  const projects = await getProjects()

  return (
    <div className="page-gutter pt-16 pb-(--spacing-section) md:pt-24">
      <h1 className="text-display tracking-tight uppercase">{t.work.title}</h1>
      <ProjectSearchGrid projects={projects} locale={locale} dictionary={t} />
    </div>
  )
}
