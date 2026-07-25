export const locales = ['es', 'en'] as const
export const defaultLocale = 'es' satisfies Locale

export type Locale = (typeof locales)[number]

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

/** Etiquetas del selector de idioma. */
export const localeNames: Record<Locale, string> = {
  es: 'ES',
  en: 'EN',
}

/** `hreflang` para los alternates de SEO. */
export const localeHtmlLang: Record<Locale, string> = {
  es: 'es-ES',
  en: 'en',
}

/**
 * Un texto que existe en los dos idiomas. Todo el contenido de `content/` usa
 * esta forma, de modo que añadir un idioma nuevo sea ampliar el tipo y que
 * TypeScript señale exactamente qué falta traducir.
 */
export type Localized<T = string> = Record<Locale, T>

export function pick<T>(value: Localized<T>, locale: Locale): T {
  return value[locale]
}
