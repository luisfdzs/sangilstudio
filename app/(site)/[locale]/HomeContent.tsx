import { ContactSection } from '@/components/sections/ContactSection'
import { Hero } from '@/components/sections/Hero'
import { getHeroImages, getSiteSettings } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { href } from '@/lib/i18n/routes'

/**
 * La portada, entera: **dos bloques y nada más**, el hero y el contacto.
 *
 * Antes había además una rejilla de obra seleccionada y una sección de estudio. Las dos
 * se fueron con el rediseño: la obra tiene su propia página —a la que lleva el propio
 * hero al pulsarlo— y el estudio, la suya. La portada dejó de ser un resumen del sitio
 * para ser una puerta.
 *
 * Vive fuera de `page.tsx` porque la sirven DOS rutas: `/es` y `/es/contact` (ver
 * `[section]/page.tsx`). Contacto tiene dirección propia pero no página propia, así que
 * el HTML tiene que ser el mismo: si esto estuviera dentro de `page.tsx`, la ruta de
 * sección tendría que repetir la composición y las dos se irían separando con el primer
 * cambio.
 *
 * Devuelve un fragmento sin envoltorio: cada sección trae su propio espaciado.
 */
export async function HomeContent({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  const [heroImages, settings] = await Promise.all([getHeroImages(), getSiteSettings()])

  return (
    <>
      <Hero
        images={heroImages}
        locale={locale}
        label={t.home.heroLink}
        workHref={href(locale, 'work')}
      />
      <ContactSection locale={locale} settings={settings} />
    </>
  )
}
