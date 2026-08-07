import type { Locale } from './config'

export const routes = {
  home: '',
  work: 'work',
  studio: 'studio',
  legal: 'legal',
} as const

export const sections = {
  contact: 'contact',
} as const

export type RouteKey = keyof typeof routes
export type SectionKey = keyof typeof sections
export type LinkKey = RouteKey | SectionKey

export function isSection(key: LinkKey): key is SectionKey {
  return key in sections
}

export const sectionKeys = Object.keys(sections) as SectionKey[]

export function sectionFromSegment(segment: string): SectionKey | null {
  return sectionKeys.find((key) => sections[key] === segment) ?? null
}

export function href(locale: Locale, key: LinkKey, ...segments: string[]): string {
  const base = isSection(key) ? sections[key] : routes[key]
  const parts = [locale, base, ...segments].filter(Boolean)
  return `/${parts.join('/')}`
}

export const navigation = ['work', 'studio', 'contact'] as const satisfies readonly LinkKey[]

export type NavKey = (typeof navigation)[number]
