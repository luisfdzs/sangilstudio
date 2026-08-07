import type { Locale } from './config'

const es = {
  nav: {
    home: 'Inicio',
    work: 'Proyectos',
    studio: 'Estudio',
    contact: 'Contacto',
    legal: 'Aviso legal',
    menu: 'Abrir menú',
    close: 'Cerrar menú',
    language: 'Idioma',
    skipToContent: 'Saltar al contenido',
  },
  home: {
    heroLink: 'Ver todos los proyectos',
    heroPrev: 'Imagen anterior',
    heroNext: 'Imagen siguiente',
  },
  work: {
    title: 'Proyectos',
    search: 'Buscar proyecto',
    empty: 'Ningún proyecto coincide con la búsqueda.',
    suggestions: 'Títulos de proyecto',
    results: '{n} proyectos',
    resultsOne: '1 proyecto',
    layout: 'Vista de las imágenes',
    squares: 'Cuadrados',
    rows: 'Filas',
  },
  project: {
    architects: 'Arquitectos',
    client: 'Promotor',
    previous: 'Proyecto anterior',
    next: 'Proyecto siguiente',
    back: 'Volver',
    backLong: 'Volver a los proyectos',
  },
  studio: {
    title: 'Estudio',
  },
  contact: {
    title: 'Contacto',
  },
  legal: {
    title: 'Aviso legal y privacidad',
    draft: 'Texto provisional, pendiente de revisión.',
    blocks: [
      {
        heading: 'Titular del sitio',
        body: 'Este sitio web es propiedad de SANGIL STUDIO, estudio de arquitectura con domicilio en [dirección] (Pamplona, Navarra, España) y NIF [NIF]. Para cualquier cuestión relacionada con esta web se puede escribir a sangil@sangilstudio.com.',
      },
      {
        heading: 'Uso del sitio',
        body: 'Los contenidos de esta web —textos, fotografías, planos e imágenes de los proyectos— son propiedad de SANGIL STUDIO o de sus autores, y no pueden reproducirse ni utilizarse sin autorización. Los proyectos publicados se muestran a título informativo.',
      },
      {
        heading: 'Datos personales',
        body: 'Esta web no tiene formularios ni cuentas de usuario: navegar por ella no requiere facilitar ningún dato. Si se escribe al correo de contacto, la dirección y el mensaje se usan únicamente para responder, y no se ceden a terceros.',
      },
      {
        heading: 'Cookies',
        body: 'Esta web no instala cookies de analítica, publicidad ni seguimiento. El idioma se decide a partir de la configuración del navegador y de la dirección visitada. Lo único que se guarda en el dispositivo es la vista de imágenes que elija cada visitante —cuadrados o filas—, para respetarla al pasar de una página a otra.',
      },
    ],
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

type Translated<T> = T extends string ? string : { readonly [K in keyof T]: Translated<T[K]> }

type Dictionary = Translated<typeof es>

const en: Dictionary = {
  nav: {
    home: 'Home',
    work: 'Work',
    studio: 'Studio',
    contact: 'Contact',
    legal: 'Legal notice',
    menu: 'Open menu',
    close: 'Close menu',
    language: 'Language',
    skipToContent: 'Skip to content',
  },
  home: {
    heroLink: 'View all projects',
    heroPrev: 'Previous image',
    heroNext: 'Next image',
  },
  work: {
    title: 'Work',
    search: 'Search projects',
    empty: 'No project matches your search.',
    suggestions: 'Project titles',
    results: '{n} projects',
    resultsOne: '1 project',
    layout: 'Image layout',
    squares: 'Squares',
    rows: 'Rows',
  },
  project: {
    architects: 'Architects',
    client: 'Client',
    previous: 'Previous project',
    next: 'Next project',
    back: 'Back',
    backLong: 'Back to all projects',
  },
  studio: {
    title: 'Studio',
  },
  contact: {
    title: 'Contact',
  },
  legal: {
    title: 'Legal notice and privacy',
    draft: 'Provisional text, pending review.',
    blocks: [
      {
        heading: 'Site owner',
        body: 'This website belongs to SANGIL STUDIO, an architecture practice based at [address] (Pamplona, Navarre, Spain), tax ID [NIF]. For anything concerning this website, write to sangil@sangilstudio.com.',
      },
      {
        heading: 'Using this site',
        body: 'The contents of this website —texts, photographs, drawings and project images— belong to SANGIL STUDIO or to their authors, and may not be reproduced or used without permission. Published projects are shown for information only.',
      },
      {
        heading: 'Personal data',
        body: 'This website has no forms and no user accounts: browsing it requires no personal data. If you write to the contact address, your address and message are used only to reply, and are not passed on to anyone else.',
      },
      {
        heading: 'Cookies',
        body: 'This website sets no analytics, advertising or tracking cookies. The language comes from your browser settings and from the address you visit. The only thing stored on your device is the image layout you choose —squares or rows—, so that it carries over from one page to the next.',
      },
    ],
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
