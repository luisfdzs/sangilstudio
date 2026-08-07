import { ContactSection } from '@/components/sections/ContactSection'
import { Hero } from '@/components/sections/Hero'
import { getHeroImages, getSiteSettings } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { href } from '@/lib/i18n/routes'

export async function HomeContent({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  const [heroImages, settings] = await Promise.all([getHeroImages(), getSiteSettings()])

  return (
    <>
      <Hero
        images={heroImages}
        locale={locale}
        label={t.home.heroLink}
        prevLabel={t.home.heroPrev}
        nextLabel={t.home.heroNext}
        workHref={href(locale, 'work')}
      />
      <ContactSection locale={locale} settings={settings} />
    </>
  )
}
