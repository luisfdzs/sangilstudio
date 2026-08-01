import type { Locale } from './config'

/**
 * Rutas del sitio en un único sitio. Los segmentos son neutros (`/work`,
 * `/studio`) para que ambos idiomas compartan estructura de ficheros; si algún
 * día queremos slugs localizados (`/es/proyectos`), se hace con un mapa de
 * rewrites aquí sin tocar ninguna página.
 */
export const routes = {
  home: '',
  work: 'work',
} as const

/**
 * Secciones de la portada. Estudio y contacto se leen sin salir del inicio, pero
 * **tienen URL de ruta**: `/es/studio`, no `/es#studio`. Una dirección con almohadilla
 * se lee como «un trozo de otra página»; con barra se lee como un sitio al que se
 * puede ir, que es lo que son. La ruta la sirve `[section]/page.tsx`, que renderiza
 * la portada entera y deja la vista en la sección (ver `ScrollToSection`).
 *
 * Se declaran aparte de `routes` porque no son páginas distintas: el HTML es el de la
 * portada, así que no entran en el sitemap y su canonical apunta a `/es`. Eso es lo
 * que distingue `isSection()`, no la forma del enlace.
 *
 * El identificador es a la vez el segmento de la URL y el `id` del `<section>`.
 */
export const sections = {
  studio: 'studio',
  contact: 'contact',
} as const

export type RouteKey = keyof typeof routes
export type SectionKey = keyof typeof sections
export type LinkKey = RouteKey | SectionKey

/**
 * Distingue las secciones de la portada de las páginas de verdad. No cambia cómo se
 * enlazan (las dos son rutas), sino qué son para un buscador: contenido propio o una
 * vista de la portada.
 */
export function isSection(key: LinkKey): key is SectionKey {
  return key in sections
}

export const sectionKeys = Object.keys(sections) as SectionKey[]

/**
 * Traduce un segmento de URL a su sección, o `null` si no lo es. Lo usa la ruta
 * `[section]` para aceptar sólo `studio` y `contact` y devolver 404 en lo demás:
 * este mapa es la única lista de secciones válidas que existe.
 */
export function sectionFromSegment(segment: string): SectionKey | null {
  return sectionKeys.find((key) => sections[key] === segment) ?? null
}

/**
 * Construye una URL **absoluta dentro del sitio**: href('en', 'work') → `/en/work`,
 * href('en', 'studio') → `/en/studio`.
 *
 * La barra inicial se añade aparte a propósito. Antes se metía como cadena vacía al
 * principio del array y `filter(Boolean)` se la comía, devolviendo `es/work`
 * (relativa): desde la portada colaba por casualidad, pero desde cualquier página
 * interior el navegador la encadenaba → `/es/work/es/work` → 404.
 */
export function href(locale: Locale, key: LinkKey, ...segments: string[]): string {
  const base = isSection(key) ? sections[key] : routes[key]
  const parts = [locale, base, ...segments].filter(Boolean)
  return `/${parts.join('/')}`
}

/** Entradas del menú. `as const` para que el tipo sea la unión exacta de claves
 *  (sin `home`) y el diccionario pueda indexarse sin comprobaciones extra. */
export const navigation = ['work', 'studio', 'contact'] as const satisfies readonly LinkKey[]

export type NavKey = (typeof navigation)[number]
