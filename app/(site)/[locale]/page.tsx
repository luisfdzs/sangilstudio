import { notFound } from 'next/navigation'
import { isLocale } from '@/lib/i18n/config'
import { HomeContent } from './HomeContent'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  return <HomeContent locale={locale} />
}
