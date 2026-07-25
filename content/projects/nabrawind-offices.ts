import { defineProject } from '../schema'

export default defineProject({
  slug: 'nabrawind-offices',
  title: 'Nabrawind Offices',
  location: { es: 'Pamplona, Navarra', en: 'Pamplona, Navarre' },
  year: 2025,
  status: 'competition',
  type: 'offices',
  // Texto alternativo de cada imagen, en el orden de scripts/curation.mjs.
  alts: [
    {
      es: 'Zona de trabajo diáfana con mesas corridas y luz de fachada',
      en: 'Open-plan work area with long desks and daylight from the façade',
    },
    {
      es: 'Pasillo acristalado junto a una estantería de madera con plantas',
      en: 'Glazed corridor beside a timber shelving unit with plants',
    },
    {
      es: 'Sala de formación con sillas en semicírculo y una maqueta de aerogenerador',
      en: 'Training room with chairs in a semicircle and a wind-turbine model',
    },
  ],
  order: 60,
  featured: false,
  summary: {
    es: 'Propuesta de oficinas para una empresa de tecnología eólica.',
    en: 'Office proposal for a wind-technology company.',
  },
  body: {
    es: [
      'Una planta diáfana organizada por bandas: trabajo concentrado junto a fachada, reuniones y formación en el núcleo, y circulaciones que se ensanchan para convertirse en lugares de encuentro.',
      'El proyecto apuesta por materiales industriales bien resueltos y por la luz natural como sistema de orientación dentro del edificio.',
    ],
    en: [
      'An open floor plan organised in bands: focused work along the façade, meeting and training rooms at the core, and circulation that widens into places to meet.',
      'The proposal relies on well-detailed industrial materials and on daylight as the building’s wayfinding system.',
    ],
  },
})
