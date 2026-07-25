import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from './env'

/**
 * Cliente de lectura. `useCdn: true` sirve desde la CDN de Sanity (más rápido y
 * barato); la frescura no depende de esto, sino de la revalidación por etiquetas que
 * dispara el webhook al publicar (ver `app/api/revalidate/route.ts`).
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
})
