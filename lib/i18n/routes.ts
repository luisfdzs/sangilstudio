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
 * Secciones de la portada. **No son páginas**: estudio y contacto se leen sin salir
 * del inicio, así que su destino es un ancla (`/es#studio`). Se declaran aquí, junto
 * a las rutas, porque desde fuera se enlazan igual —con `href()`— y así el día que
 * una sección vuelva a ser página basta con moverla de mapa.
 *
 * El identificador es también el `id` del `<section>` correspondiente.
 */
export const sections = {
  studio: 'studio',
  contact: 'contact',
} as const

export type RouteKey = keyof typeof routes
export type SectionKey = keyof typeof sections
export type LinkKey = RouteKey | SectionKey

/** Distingue las anclas de la portada de las páginas de verdad. */
export function isSection(key: LinkKey): key is SectionKey {
  return key in sections
}

/**
 * Construye una URL **absoluta dentro del sitio**: href('en', 'work') → `/en/work`,
 * href('en', 'studio') → `/en#studio`.
 *
 * La barra inicial se añade aparte a propósito. Antes se metía como cadena vacía al
 * principio del array y `filter(Boolean)` se la comía, devolviendo `es/work`
 * (relativa): desde la portada colaba por casualidad, pero desde cualquier página
 * interior el navegador la encadenaba → `/es/work/es/work` → 404.
 */
export function href(locale: Locale, key: LinkKey, ...segments: string[]): string {
  if (isSection(key)) return `/${locale}#${sections[key]}`
  const parts = [locale, routes[key], ...segments].filter(Boolean)
  return `/${parts.join('/')}`
}

/** Entradas del menú. `as const` para que el tipo sea la unión exacta de claves
 *  (sin `home`) y el diccionario pueda indexarse sin comprobaciones extra. */
export const navigation = ['work', 'studio', 'contact'] as const satisfies readonly LinkKey[]

export type NavKey = (typeof navigation)[number]
