import type { MetadataRoute } from 'next'
import { site } from '@/content/site'
import { getProjectSlugs } from '@/lib/content'
import { locales } from '@/lib/i18n/config'
import { href, navigation, isSection } from '@/lib/i18n/routes'

/**
 * Sitemap generado del contenido real: no hay lista de URLs que mantener a mano
 * y por tanto no puede quedar desactualizado.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []
  const slugs = await getProjectSlugs()

  for (const locale of locales) {
    entries.push({ url: `${site.url}/${locale}`, changeFrequency: 'monthly', priority: 1 })

    // Del menú sólo entran las páginas: estudio y contacto son anclas de la portada,
    // que ya está listada arriba. Un `#` en el sitemap no es una URL distinta.
    for (const key of navigation.filter((entry) => !isSection(entry))) {
      entries.push({
        url: `${site.url}${href(locale, key)}`,
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    }

    for (const slug of slugs) {
      entries.push({
        url: `${site.url}${href(locale, 'work', slug)}`,
        changeFrequency: 'yearly',
        priority: 0.7,
      })
    }
  }

  return entries
}
