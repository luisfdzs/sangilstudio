import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProjectSearchGrid } from '@/components/sections/ProjectSearchGrid'
import { getProjects } from '@/lib/content'
import { isLocale, locales } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'

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

export default async function WorkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const t = getDictionary(locale)
  const projects = await getProjects()

  return (
    <div className="page-gutter pt-16 pb-(--spacing-section) md:pt-24">
      <h1 className="sr-only">{t.work.title}</h1>
      <ProjectSearchGrid projects={projects} locale={locale} dictionary={t} />
    </div>
  )
}
