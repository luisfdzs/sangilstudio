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
    close: 'Cerrar',
    skipToContent: 'Saltar al contenido',
    /* Los tres de abajo sólo se oyen: nombran la barra de iconos de móvil y su botón de
       idioma para quien navega con lector de pantalla. En la barra no hay rótulos —cinco
       palabras no caben a lo ancho de un móvil—, así que el nombre accesible es lo único
       que distingue un hueco de otro. */
    language: 'Idioma',
    mobile: 'Navegación',
  },
  home: {
    heroLead: 'Arquitectura en Navarra',
    intro:
      'Sangil Studio proyecta vivienda, rehabilitación y espacios de trabajo con una idea fija: que cada decisión —la luz, el material, la medida— tenga una razón.',
    selectedWork: 'Obra seleccionada',
    viewAllWork: 'Ver todos los proyectos',
  },
  work: {
    title: 'Proyectos',
    lead: 'Obra construida, en curso y propuestas presentadas a concurso.',
    all: 'Todos',
    filterYear: 'Año',
    empty: 'No hay proyectos en esta selección.',
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
    close: 'Close',
    skipToContent: 'Skip to content',
    language: 'Language',
    mobile: 'Navigation',
  },
  home: {
    heroLead: 'Architecture in Navarre',
    intro:
      'Sangil Studio designs housing, refurbishments and workspaces with one fixed idea: every decision —light, material, measure— should have a reason behind it.',
    selectedWork: 'Selected work',
    viewAllWork: 'View all projects',
  },
  work: {
    title: 'Work',
    lead: 'Built and ongoing projects, and competition entries.',
    all: 'All',
    filterYear: 'Year',
    empty: 'No projects in this selection.',
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
