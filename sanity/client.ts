import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from './env'

/**
 * Cliente de lectura.
 *
 * **`useCdn: false` a propósito.** La CDN de Sanity puede devolver datos de hace unos
 * segundos, y eso rompe la regeneración: al publicar, el webhook invalida la caché, la
 * página se regenera al instante y —si lee de la CDN— puede volver a guardar el dato
 * viejo *como si fuera fresco*, quedándose así indefinidamente. Pasó exactamente eso, y
 * costó un rato de diagnóstico.
 *
 * El coste es nulo para quien visita la web: estas consultas sólo ocurren al construir o
 * al regenerar una página, nunca en la petición del visitante, que recibe HTML estático
 * desde el CDN de Vercel.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'published',
})
