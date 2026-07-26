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
  studio: 'studio',
  contact: 'contact',
} as const

export type RouteKey = keyof typeof routes

/**
 * Construye una URL **absoluta dentro del sitio**: href('en', 'work') → `/en/work`.
 *
 * La barra inicial se añade aparte a propósito. Antes se metía como cadena vacía al
 * principio del array y `filter(Boolean)` se la comía, devolviendo `es/work`
 * (relativa): desde la portada colaba por casualidad, pero desde cualquier página
 * interior el navegador la encadenaba → `/es/work/es/work` → 404.
 */
export function href(locale: Locale, key: RouteKey, ...segments: string[]): string {
  const parts = [locale, routes[key], ...segments].filter(Boolean)
  return `/${parts.join('/')}`
}

/** Entradas del menú. `as const` para que el tipo sea la unión exacta de claves
 *  (sin `home`) y el diccionario pueda indexarse sin comprobaciones extra. */
export const navigation = ['work', 'studio', 'contact'] as const satisfies readonly RouteKey[]

export type NavKey = (typeof navigation)[number]
