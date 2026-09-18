import { ContactSection } from '@/components/sections/ContactSection'
import { Hero } from '@/components/sections/Hero'
import { getHeroImages, getMobileHeroImages, getSiteSettings } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { href } from '@/lib/i18n/routes'

export async function HomeContent({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  const [heroImages, mobileHeroImages, settings] = await Promise.all([
    getHeroImages(),
    getMobileHeroImages(),
    getSiteSettings(),
  ])

  const split = mobileHeroImages.length > 0
  const workHref = href(locale, 'work')

  return (
    <>
      <Hero
        images={heroImages}
        locale={locale}
        label={t.home.heroLink}
        prevLabel={t.home.heroPrev}
        nextLabel={t.home.heroNext}
        workHref={workHref}
        sizes={split ? '(max-width: 767px) 1px, 84vw' : '(max-width: 768px) 92vw, 84vw'}
        className={split ? 'hidden md:block' : undefined}
      />

      {split && (
        <Hero
          images={mobileHeroImages}
          locale={locale}
          label={t.home.heroLink}
          prevLabel={t.home.heroPrev}
          nextLabel={t.home.heroNext}
          workHref={workHref}
          sizes="(min-width: 768px) 1px, 92vw"
          className="md:hidden"
        />
      )}

      <ContactSection locale={locale} settings={settings} />
    </>
  )
}
