import { notFound } from 'next/navigation'
import { isLocale } from '@/lib/i18n/config'
import { HomeContent } from './HomeContent'

/**
 * La portada. El contenido vive en `HomeContent` porque también lo sirven las rutas
 * de sección (`/es/studio`, `/es/contact`): ver `[section]/page.tsx`.
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  return <HomeContent locale={locale} />
}
