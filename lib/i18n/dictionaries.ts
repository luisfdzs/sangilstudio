import type { Locale } from './config'

/**
 * Textos de interfaz (no de contenido). El diccionario `es` es la fuente de
 * verdad de la forma: `en` debe encajar en el mismo tipo, así que si añades una
 * clave y no la traduces, falla el typecheck en lugar de aparecer vacía en la web.
 */
const es = {
  nav: {
    home: 'Inicio',
    work: 'Proyectos',
    studio: 'Estudio',
    contact: 'Contacto',
    /* Los cuatro de abajo casi no se leen: nombran el botón del menú de móvil —que es un
       «+» sin rótulo—, el selector de idioma y el enlace de salto. Son lo único que
       distingue esos controles para quien navega con lector de pantalla. */
    menu: 'Abrir menú',
    close: 'Cerrar menú',
    language: 'Idioma',
    skipToContent: 'Saltar al contenido',
  },
  home: {
    /* La portada no tiene texto: son imágenes a pantalla completa que llevan a los
       proyectos. Esto es el nombre accesible de ese enlace, que ocupa la pantalla
       entera y sin él se anunciaría vacío. */
    heroLink: 'Ver todos los proyectos',
  },
  work: {
    title: 'Proyectos',
    search: 'Buscar proyecto',
    empty: 'Ningún proyecto coincide con la búsqueda.',
    /* Nombre accesible del desplegable de títulos que cuelga del buscador. */
    suggestions: 'Títulos de proyecto',
    /* Se anuncia por voz al filtrar, no se ve. `{n}` se sustituye por el número. */
    results: '{n} proyectos',
    resultsOne: '1 proyecto',
  },
  project: {
    architects: 'Arquitectos',
    client: 'Promotor',
  },
  studio: {
    title: 'Estudio',
    team: 'Equipo',
    collaborators: 'Colaboradores',
  },
  contact: {
    title: 'Contacto',
  },
  type: {
    housing: 'Vivienda',
    refurbishment: 'Rehabilitación',
    offices: 'Oficinas',
    cultural: 'Cultural',
    'multi-family': 'Vivienda colectiva',
    education: 'Docente',
    sports: 'Deportivo',
    health: 'Sanitario',
    commercial: 'Comercial',
  },
  notFound: {
    title: 'Esta página no existe',
    lead: 'Puede que la hayamos movido o que el enlace esté mal.',
    cta: 'Ir al inicio',
  },
} as const

type Dictionary = {
  -readonly [K in keyof typeof es]: { -readonly [P in keyof (typeof es)[K]]: string }
}

const en: Dictionary = {
  nav: {
    home: 'Home',
    work: 'Work',
    studio: 'Studio',
    contact: 'Contact',
    menu: 'Open menu',
    close: 'Close menu',
    language: 'Language',
    skipToContent: 'Skip to content',
  },
  home: {
    heroLink: 'View all projects',
  },
  work: {
    title: 'Work',
    search: 'Search projects',
    empty: 'No project matches your search.',
    suggestions: 'Project titles',
    results: '{n} projects',
    resultsOne: '1 project',
  },
  project: {
    architects: 'Architects',
    client: 'Client',
  },
  studio: {
    title: 'Studio',
    team: 'Team',
    collaborators: 'Collaborators',
  },
  contact: {
    title: 'Contact',
  },
  type: {
    housing: 'Housing',
    refurbishment: 'Refurbishment',
    offices: 'Offices',
    cultural: 'Cultural',
    'multi-family': 'Multi-family housing',
    education: 'Educational',
    sports: 'Sports',
    health: 'Healthcare',
    commercial: 'Retail',
  },
  notFound: {
    title: 'This page does not exist',
    lead: 'We may have moved it, or the link may be broken.',
    cta: 'Go to homepage',
  },
}

const dictionaries: Record<Locale, Dictionary> = { es, en }

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}

export type { Dictionary }
