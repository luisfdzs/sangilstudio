import { defineQuery } from 'next-sanity'

/**
 * CONSULTAS (GROQ)
 *
 * Todas piden ya resuelto lo que la web necesita para pintar una imagen sin pensar:
 * URL del original, dimensiones reales y `lqip` (la miniatura difuminada que Sanity
 * calcula al subir el archivo). Con eso se conserva lo que teníamos con el pipeline
 * local — cero salto de layout y placeholder suave — pero para imágenes que sube
 * cualquiera desde el navegador.
 */

const IMAGE = /* groq */ `{
  "id": asset.asset->_id,
  "src": asset.asset->url,
  "width": asset.asset->metadata.dimensions.width,
  "height": asset.asset->metadata.dimensions.height,
  "blur": asset.asset->metadata.lqip,
  alt
}`

const PROJECT_FIELDS = /* groq */ `
  "slug": slug.current,
  title,
  location,
  year,
  status,
  type,
  area,
  client,
  collaboration,
  featured,
  summary,
  body,
  "images": images[] ${IMAGE},
  "plans": plans[] ${IMAGE}
`

/** El orden es el que se fija arrastrando en el panel (orderRank). */
export const PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current)] | order(orderRank) {
    ${PROJECT_FIELDS}
  }
`)

export const PROJECT_SLUGS_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current)] | order(orderRank) { "slug": slug.current }
`)

/**
 * `hero` sale de las referencias de `heroProjects`: de cada proyecto elegido en el
 * panel se toma la primera imagen de su galería, que es su portada.
 *
 * Se devuelve envuelto en `{ "image": … }` en vez de aplanado a propósito. Un proyecto
 * referenciado puede haberse quedado sin galería —o haberse borrado—, y con la forma
 * plana ese hueco llegaría como `null` mezclado entre imágenes buenas. Así el filtrado
 * se hace en un sitio explícito (`lib/content.ts`) y no depende de cómo GROQ decida
 * colapsar los nulos de una travesía.
 */
export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0] {
    "hero": heroProjects[]-> { "image": images[0] ${IMAGE} },
    statement,
    "team": team[] { name, role, phone },
    collaborators,
    street,
    postalCode,
    city,
    region,
    country,
    phone,
    email,
    website,
    instagram,
    linkedin
  }
`)
