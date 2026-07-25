import { defineProject } from '../schema'

export default defineProject({
  slug: 'housing-10-salobrena',
  title: '10 viviendas en Salobreña',
  location: { es: 'Salobreña, Granada', en: 'Salobreña, Granada' },
  year: 2025,
  status: 'project',
  type: 'multi-family',
  // Texto alternativo de cada imagen, en el orden de scripts/curation.mjs.
  alts: [
    {
      es: 'El conjunto escalonado sobre la ladera, entre vegetación mediterránea',
      en: 'The stepped development on the slope, among Mediterranean planting',
    },
    {
      es: 'El mismo conjunto de noche, con las viviendas iluminadas',
      en: 'The same development at night, with the homes lit',
    },
  ],
  order: 70,
  featured: false,
  summary: {
    es: 'Diez viviendas en ladera, escalonadas para que todas miren al mar.',
    en: 'Ten homes on a slope, stepped so that every one of them faces the sea.',
  },
  body: {
    es: [
      'La pendiente del solar se aprovecha como recurso: el edificio se escalona para que ninguna vivienda tape a otra y todas alcancen vistas al mar.',
      'Blanco, sombra y vegetación: el proyecto se apoya en la tradición constructiva del sur para resolver el clima antes que con máquinas.',
    ],
    en: [
      'The slope becomes an asset: the building steps down so no home blocks another and all of them reach a view of the sea.',
      'White surfaces, shade and planting: the project leans on southern building tradition to handle the climate before resorting to machinery.',
    ],
  },
})
