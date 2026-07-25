import type { Locale } from './config'

/**
 * Textos de interfaz (no de contenido). El diccionario `es` es la fuente de
 * verdad de la forma: `en` debe encajar en el mismo tipo, así que si añades una
 * clave y no la traduces, falla el typecheck en lugar de aparecer vacía en la web.
 */
const es = {
  nav: {
    work: 'Proyectos',
    competitions: 'Concursos',
    studio: 'Estudio',
    contact: 'Contacto',
    menu: 'Menú',
    close: 'Cerrar',
    skipToContent: 'Saltar al contenido',
  },
  home: {
    heroLead: 'Arquitectura en Navarra',
    intro:
      'Sangil Studio proyecta vivienda, rehabilitación y espacios de trabajo con una idea fija: que cada decisión —la luz, el material, la medida— tenga una razón.',
    selectedWork: 'Obra seleccionada',
    viewAllWork: 'Ver todos los proyectos',
    competitionsTeaser: 'Concursos',
    viewAllCompetitions: 'Ver todos los concursos',
  },
  work: {
    title: 'Proyectos',
    lead: 'Obra construida y en curso.',
    all: 'Todos',
    filterYear: 'Año',
    empty: 'No hay proyectos en esta selección.',
  },
  competitions: {
    title: 'Concursos',
    lead: 'Propuestas presentadas a concurso, la mayoría junto a la plataforma VIA.',
  },
  project: {
    year: 'Año',
    location: 'Ubicación',
    status: 'Estado',
    type: 'Tipo',
    area: 'Superficie',
    collaboration: 'Colaboración',
    client: 'Promotor',
    next: 'Siguiente proyecto',
    previous: 'Proyecto anterior',
    backToWork: 'Volver a proyectos',
    gallery: 'Imágenes',
    plans: 'Planos',
  },
  studio: {
    title: 'Estudio',
    team: 'Equipo',
    collaborators: 'Colaboradores',
  },
  contact: {
    title: 'Contacto',
    lead: 'Cuéntanos qué tienes en mente.',
    phone: 'Teléfono',
    email: 'Email',
    location: 'Dónde estamos',
  },
  footer: {
    rights: 'Todos los derechos reservados.',
    legal: 'Aviso legal',
    privacy: 'Privacidad',
    backToTop: 'Volver arriba',
  },
  status: {
    built: 'Construido',
    'in-progress': 'En obra',
    project: 'En proyecto',
    competition: 'Concurso',
  },
  type: {
    housing: 'Vivienda',
    refurbishment: 'Rehabilitación',
    offices: 'Oficinas',
    cultural: 'Cultural',
    'multi-family': 'Vivienda colectiva',
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
    work: 'Work',
    competitions: 'Competitions',
    studio: 'Studio',
    contact: 'Contact',
    menu: 'Menu',
    close: 'Close',
    skipToContent: 'Skip to content',
  },
  home: {
    heroLead: 'Architecture in Navarre',
    intro:
      'Sangil Studio designs housing, refurbishments and workspaces with one fixed idea: every decision —light, material, measure— should have a reason behind it.',
    selectedWork: 'Selected work',
    viewAllWork: 'View all projects',
    competitionsTeaser: 'Competitions',
    viewAllCompetitions: 'View all competitions',
  },
  work: {
    title: 'Work',
    lead: 'Built and ongoing projects.',
    all: 'All',
    filterYear: 'Year',
    empty: 'No projects in this selection.',
  },
  competitions: {
    title: 'Competitions',
    lead: 'Competition entries, most of them alongside the VIA platform.',
  },
  project: {
    year: 'Year',
    location: 'Location',
    status: 'Status',
    type: 'Type',
    area: 'Area',
    collaboration: 'Collaboration',
    client: 'Client',
    next: 'Next project',
    previous: 'Previous project',
    backToWork: 'Back to work',
    gallery: 'Images',
    plans: 'Drawings',
  },
  studio: {
    title: 'Studio',
    team: 'Team',
    collaborators: 'Collaborators',
  },
  contact: {
    title: 'Contact',
    lead: 'Tell us what you have in mind.',
    phone: 'Phone',
    email: 'Email',
    location: 'Where we are',
  },
  footer: {
    rights: 'All rights reserved.',
    legal: 'Legal notice',
    privacy: 'Privacy',
    backToTop: 'Back to top',
  },
  status: {
    built: 'Built',
    'in-progress': 'Under construction',
    project: 'In design',
    competition: 'Competition',
  },
  type: {
    housing: 'Housing',
    refurbishment: 'Refurbishment',
    offices: 'Offices',
    cultural: 'Cultural',
    'multi-family': 'Multi-family housing',
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
