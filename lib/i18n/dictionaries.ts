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
    title: 'Aviso legal',
    blocks: [
      {
        heading: 'Titular',
        body: 'En cumplimiento con lo dispuesto en la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE), se informa que este sitio web es titularidad de:\nResponsable: SANGIL STUDIO S.L.P.\nCIF: B71549737\nTeléfono de contacto: 664197624\nCorreo electrónico: sangil@sangilstudio.com',
      },
      {
        heading: 'Propiedad intelectual',
        body: 'Todos los contenidos del sitio web, incluyendo textos, imágenes, logotipos, diseños, código fuente, y cualquier otro elemento, son propiedad de SANGIL STUDIO y/o de sus autores, y no pueden reproducirse ni utilizarse sin autorización. Los proyectos publicados se muestran a título informativo.',
      },
      {
        heading: 'Datos personales',
        body: 'Esta web no tiene formularios ni cuentas de usuario: navegar por ella no requiere facilitar ningún dato. Si se escribe al correo de contacto, la dirección y el mensaje se usan únicamente para responder, y no se ceden a terceros.',
      },
      {
        heading: 'Cookies',
        body: 'Esta web no instala cookies de analítica, publicidad ni seguimiento. El idioma se decide a partir de la configuración del navegador y de la dirección visitada.',
      },
      {
        heading: 'Legislación aplicable',
        body: 'El presente aviso legal se rige por la legislación española. Para cualquier controversia que pudiera derivarse del acceso o uso del sitio web, las partes se someten a los juzgados y tribunales de la ciudad de Pamplona, con renuncia expresa a cualquier otro fuero que pudiera corresponderles.',
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
    title: 'Legal notice',
    blocks: [
      {
        heading: 'Site owner',
        body: 'In accordance with Spanish Law 34/2002, of 11 July, on Information Society Services and Electronic Commerce (LSSI-CE), this website is owned by:\nOwner: SANGIL STUDIO S.L.P.\nTax ID (CIF): B71549737\nPhone: +34 664 197 624\nEmail: sangil@sangilstudio.com',
      },
      {
        heading: 'Intellectual property',
        body: 'All contents of this website, including texts, images, logos, designs, source code and any other element, belong to SANGIL STUDIO and/or to their authors, and may not be reproduced or used without permission. Published projects are shown for information only.',
      },
      {
        heading: 'Personal data',
        body: 'This website has no forms and no user accounts: browsing it requires no personal data. If you write to the contact address, your address and message are used only to reply, and are not passed on to anyone else.',
      },
      {
        heading: 'Cookies',
        body: 'This website sets no analytics, advertising or tracking cookies. The language comes from your browser settings and from the address you visit.',
      },
      {
        heading: 'Applicable law',
        body: 'This legal notice is governed by Spanish law. For any dispute arising from access to or use of this website, the parties submit to the courts of the city of Pamplona, expressly waiving any other jurisdiction that may correspond to them.',
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
