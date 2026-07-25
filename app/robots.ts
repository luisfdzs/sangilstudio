import type { MetadataRoute } from 'next'
import { site } from '@/content/site'
import { isIndexable } from '@/lib/site-env'

/**
 * Sólo la rama `main` se indexa. El entorno de test (sangilstudiotest.vercel.app)
 * devuelve `disallow: /` para no competir en Google con sangilstudio.com.
 * El criterio vive en `lib/site-env.ts`, con el porqué explicado.
 */
export default function robots(): MetadataRoute.Robots {
  const indexable = isIndexable()

  return {
    rules: indexable ? { userAgent: '*', allow: '/' } : { userAgent: '*', disallow: '/' },
    sitemap: indexable ? `${site.url}/sitemap.xml` : undefined,
  }
}
