import type { Locale } from './config'

/**
 * Rutas del sitio en un único sitio. Los segmentos son neutros (`/work`,
 * `/studio`) para que ambos idiomas compartan estructura de ficheros; si algún
 * día queremos slugs localizados (`/es/proyectos`), se hace con un mapa de
 * rewrites aquí sin tocar ninguna página.
 *
 * **El estudio es una página de verdad**, no una sección de la portada. Cambió con el
 * rediseño: la portada se quedó en dos bloques —el hero y el contacto— y los datos del
 * estudio se leen en su propia pantalla.
 */
export const routes = {
  home: '',
  work: 'work',
  studio: 'studio',
} as const

/**
 * Secciones de la portada. Contacto se lee sin salir del inicio, pero **tiene URL de
 * ruta**: `/es/contact`, no `/es#contact`. Una dirección con almohadilla se lee como
 * «un trozo de otra página»; con barra se lee como un sitio al que se puede ir, que es
 * lo que es. La ruta la sirve `[section]/page.tsx`, que renderiza la portada entera y
 * deja la vista en la sección (ver `ScrollToSection`).
 *
 * Se declara aparte de `routes` porque no es una página distinta: el HTML es el de la
 * portada, así que no entra en el sitemap y su canonical apunta a `/es`. Eso es lo que
 * distingue `isSection()`, no la forma del enlace.
 *
 * El identificador es a la vez el segmento de la URL y el `id` del `<section>`.
 */
export const sections = {
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
 * `[section]` para aceptar sólo `contact` y devolver 404 en lo demás: este mapa es la
 * única lista de secciones válidas que existe.
 */
export function sectionFromSegment(segment: string): SectionKey | null {
  return sectionKeys.find((key) => sections[key] === segment) ?? null
}

/**
 * Construye una URL **absoluta dentro del sitio**: href('en', 'work') → `/en/work`,
 * href('en', 'contact') → `/en/contact`.
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
