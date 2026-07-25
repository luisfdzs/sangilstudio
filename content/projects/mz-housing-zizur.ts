import { defineProject } from '../schema'

export default defineProject({
  slug: 'mz-housing-zizur',
  title: 'MZ1-6 Housing',
  location: { es: 'Zizur Mayor, Navarra', en: 'Zizur Mayor, Navarre' },
  year: 2025,
  status: 'in-progress',
  type: 'multi-family',
  client: 'MUROA',
  // Texto alternativo de cada imagen, en el orden de scripts/curation.mjs.
  alts: [
    {
      es: 'Fachada trasera con jardín privado y tumbonas sobre el césped',
      en: 'Rear façade with private garden and loungers on the lawn',
    },
    {
      es: 'Volumen escalonado con terrazas corridas, desde el acceso',
      en: 'Stepped volume with continuous terraces, seen from the entrance',
    },
    {
      es: 'Salón con salida a la terraza cubierta y cocina abierta al fondo',
      en: 'Living room opening onto the covered terrace, with the kitchen beyond',
    },
    {
      es: 'Salón del ático, con ventanales de suelo a techo hacia la terraza',
      en: 'Penthouse living room, with floor-to-ceiling glazing onto the terrace',
    },
  ],
  order: 25,
  featured: true,
  summary: {
    es: 'Promoción de vivienda colectiva con áticos en terraza y fachada de ritmo continuo.',
    en: 'Collective housing development with roof terraces and a steady façade rhythm.',
  },
  body: {
    es: [
      'El conjunto se organiza con una fachada de ritmo constante que unifica seis portales, y remata en áticos retranqueados con terrazas que miran al valle.',
      'Cada vivienda busca la doble orientación y un estar amplio en continuidad con la terraza, entendida como una habitación más de la casa.',
    ],
    en: [
      'The development is organised around a steady façade rhythm that unifies six entrances, topped by set-back penthouses with terraces looking out over the valley.',
      'Each home seeks dual orientation and a generous living room continuous with the terrace, understood as one more room of the house.',
    ],
  },
})
