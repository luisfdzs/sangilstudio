import type { MetadataRoute } from 'next'
import { site } from '@/content/site'

/**
 * Sólo producción se indexa. El entorno de test (sangilstudiotest.vercel.app)
 * devuelve `disallow: /` para no competir en Google con sangilstudio.com.
 */
export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === 'production'

  return {
    rules: isProduction ? { userAgent: '*', allow: '/' } : { userAgent: '*', disallow: '/' },
    sitemap: isProduction ? `${site.url}/sitemap.xml` : undefined,
  }
}
