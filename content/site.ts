import type { Localized } from '@/lib/i18n/config'

/**
 * Datos del estudio y del sitio. Un solo sitio donde tocar teléfonos, email,
 * dominio o textos de identidad.
 */

export const site = {
  name: 'Sangil Studio',
  /** Dominio canónico de producción. */
  url: 'https://sangilstudio.com',
  /** REVISAR con el estudio antes de publicar: el email del contexto parecía erróneo. */
  email: 'sangil@studio.com',
  city: 'Pamplona',
  region: { es: 'Navarra', en: 'Navarre' } satisfies Localized,
  country: { es: 'España', en: 'Spain' } satisfies Localized,
  instagram: 'https://www.instagram.com/sangilstudio/',
  linkedin: 'https://www.linkedin.com/company/sangil-studio/',
} as const

/**
 * ORDEN FIJO: Yago primero, siempre. Es el socio director del estudio, así que
 * encabeza cualquier listado de personas en la web (footer, estudio, contacto).
 * No reordenar este array.
 */
export const team = [
  {
    name: 'Yago Fernández Sangil',
    // Si Yago quiere un cargo distinto al de Juan Luis (dirección), se cambia aquí.
    role: { es: 'Arquitecto · Socio fundador', en: 'Architect · Founding partner' },
    phone: '+34 664 197 624',
  },
  {
    name: 'Juan Luis Irigaray Huarte',
    role: { es: 'Arquitecto · Socio fundador', en: 'Architect · Founding partner' },
    phone: '+34 609 400 525',
  },
] satisfies readonly {
  name: string
  role: Localized
  phone: string
}[]

export const collaborators = [
  'Vaíllo Architects',
  'O Arquitectura',
  'MUROA',
  'VIA',
  'Fernando Molina',
]

/** Texto de identidad del estudio (página Estudio y bloque intro de la home). */
export const studioStatement: Localized<string[]> = {
  es: [
    'Sangil Studio es un estudio de arquitectura con base en Pamplona. Proyectamos vivienda, rehabilitación y espacios de trabajo en Navarra y, de forma habitual, fuera de ella.',
    'Trabajamos con una idea fija: que cada decisión tenga una razón. La orientación antes que la instalación, la luz antes que el acabado, la medida justa antes que el gesto. De ahí sale una arquitectura sobria, duradera y cómoda de habitar.',
    'Cada encargo se aborda desde su sitio y su presupuesto reales, sin fórmulas previas. Colaboramos con otros equipos cuando el proyecto lo pide, y participamos en concursos como forma de investigar.',
  ],
  en: [
    'Sangil Studio is an architecture practice based in Pamplona. We design housing, refurbishments and workspaces across Navarre and, regularly, beyond it.',
    'We work with one fixed idea: every decision should have a reason. Orientation before servicing, light before finishes, the right measure before the gesture. What comes out of that is architecture that is sober, durable and comfortable to live in.',
    'Each commission starts from its real site and its real budget, with no formula applied in advance. We collaborate with other teams when a project calls for it, and we enter competitions as a way of doing research.',
  ],
}
