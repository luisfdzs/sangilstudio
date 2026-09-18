import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ScrollToSection } from '@/components/ui/ScrollToSection'
import { isLocale, locales } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { sectionFromSegment, sectionKeys, sections } from '@/lib/i18n/routes'
import { HomeContent } from '../HomeContent'

export function generateStaticParams() {
  return locales.flatMap((locale) => sectionKeys.map((section) => ({ locale, section })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; section: string }>
}): Promise<Metadata> {
  const { locale, section } = await params
  if (!isLocale(locale)) return {}

  const key = sectionFromSegment(section)
  if (!key) return {}

  return { title: getDictionary(locale).nav[key] }
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ locale: string; section: string }>
}) {
  const { locale, section } = await params
  if (!isLocale(locale)) notFound()

  const key = sectionFromSegment(section)
  if (!key) notFound()

  return (
    <>
      <HomeContent locale={locale} />
      <ScrollToSection id={sections[key]} />
    </>
  )
}
