import type { MetadataRoute } from 'next'
import { site } from '@/content/site'
import { getProjectSlugs } from '@/lib/content'
import { locales } from '@/lib/i18n/config'
import { href, navigation, isSection } from '@/lib/i18n/routes'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []
  const slugs = await getProjectSlugs()

  for (const locale of locales) {
    entries.push({ url: `${site.url}/${locale}`, changeFrequency: 'monthly', priority: 1 })

    for (const key of navigation.filter((entry) => !isSection(entry))) {
      entries.push({
        url: `${site.url}${href(locale, key)}`,
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    }

    entries.push({
      url: `${site.url}${href(locale, 'legal')}`,
      changeFrequency: 'yearly',
      priority: 0.2,
    })

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
