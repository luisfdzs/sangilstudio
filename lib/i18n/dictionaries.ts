import type { Locale } from './config'

/**
 * Textos de interfaz (no de contenido). El diccionario `es` es la fuente de
 * verdad de la forma: `en` debe encajar en el mismo tipo, así que si añades una
 * clave y no la traduces, falla el typecheck en lugar de aparecer vacía en la web.
 */
const es = {
  nav: {
    /* `home` ya NO es una entrada del menú (se quitó a petición del estudio): se queda
       como nombre accesible del wordmark de la barra, que es lo que lleva al inicio. */
    home: 'Inicio',
    work: 'Proyectos',
    studio: 'Estudio',
    contact: 'Contacto',
    /* La línea pequeña al final del panel del menú. */
    legal: 'Aviso legal',
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
    /* Nombre accesible de las flechas del hero: no llevan rótulo, sólo un chevron. */
    heroPrev: 'Imagen anterior',
    heroNext: 'Imagen siguiente',
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
    /* Flechas de la ficha: no llevan rótulo, y el nombre accesible se completa con el
       título del proyecto al que llevan. */
    previous: 'Proyecto anterior',
    next: 'Proyecto siguiente',
    /* Rótulo de la barra de volver, fija abajo en la ficha. Se pinta en versalitas. */
    back: 'Volver',
    backLong: 'Volver a los proyectos',
  },
  studio: {
    title: 'Estudio',
  },
  contact: {
    title: 'Contacto',
  },
  /* ⚠️ TEXTO PROVISIONAL. Lo pidió el estudio así, para tener la página y el enlace en su
     sitio; el contenido definitivo lo dará el estudio (razón social, NIF y domicilio) y hay
     que revisarlo antes de publicar en producción. No se inventa ningún dato: lo que falta
     va entre corchetes, a la vista. */
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
        body: 'Esta web no instala cookies de analítica, publicidad ni seguimiento. El idioma se decide a partir de la configuración del navegador y de la dirección visitada, sin guardar nada en el dispositivo.',
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

/**
 * `en` tiene que tener EXACTAMENTE la forma de `es`, con cadenas donde `es` tiene cadenas.
 * Recursivo desde que el aviso legal metió una lista de bloques: al mapear una tupla, TS
 * conserva su longitud, así que si `es` declara cuatro bloques, `en` no puede traer tres.
 */
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
        body: 'This website sets no analytics, advertising or tracking cookies. The language comes from your browser settings and from the address you visit, with nothing stored on your device.',
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
