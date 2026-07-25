import { defineProject } from '../schema'

export default defineProject({
  slug: 'z1-house-zizur',
  title: 'Z1 House',
  location: { es: 'Zizur, Navarra', en: 'Zizur, Navarre' },
  year: 2023,
  status: 'built',
  type: 'refurbishment',
  collaboration: 'O Arquitectura',
  // Texto alternativo de cada imagen, en el orden de scripts/curation.mjs.
  alts: [
    {
      es: 'El jardín de césped junto a la fachada acristalada del estar',
      en: 'The lawn alongside the fully glazed living-room façade',
    },
    {
      es: 'Estar y comedor en una sola pieza, con carpintería y frentes de madera',
      en: 'Living and dining as a single space, with timber joinery and fronts',
    },
    {
      es: 'Escalera de madera y doble altura junto al vestíbulo',
      en: 'Timber stair and double-height void beside the entrance hall',
    },
    {
      es: 'Estar con librería y un paño de madera que separa el comedor',
      en: 'Living room with bookshelves and a timber plane screening the dining area',
    },
  ],
  order: 30,
  featured: true,
  summary: {
    es: 'Rehabilitación integral de una vivienda unifamiliar abierta al jardín.',
    en: 'Full refurbishment of a single-family house opened up to its garden.',
  },
  body: {
    es: [
      'La intervención parte de una vivienda compartimentada y con poca relación con el exterior. Vaciamos la planta baja para que estar, cocina y comedor funcionen como una sola pieza continua, orientada al jardín.',
      'Los materiales se reducen a los mínimos: un pavimento continuo, carpinterías de suelo a techo y madera cálida en los frentes. La luz natural hace el resto del trabajo.',
    ],
    en: [
      'The house was compartmentalised and barely connected to the outside. We emptied the ground floor so living room, kitchen and dining area work as a single continuous space facing the garden.',
      'Materials are kept to a minimum: a continuous floor, floor-to-ceiling openings and warm timber fronts. Daylight does the rest of the work.',
    ],
  },
})
