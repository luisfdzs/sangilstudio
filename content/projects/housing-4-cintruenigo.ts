import { defineProject } from '../schema'

export default defineProject({
  slug: 'housing-4-cintruenigo',
  title: '4 viviendas en Cintruénigo',
  location: { es: 'Cintruénigo, Navarra', en: 'Cintruénigo, Navarre' },
  year: 2026,
  status: 'project',
  type: 'multi-family',
  // Texto alternativo de cada imagen, en el orden de scripts/curation.mjs.
  alts: [
    {
      es: 'Fachada de hormigón con cuatro huecos verticales sobre un zócalo de madera',
      en: 'Concrete façade with four vertical openings above a timber base',
    },
  ],
  order: 90,
  featured: false,
  summary: {
    es: 'Cuatro viviendas en un solar estrecho del casco urbano.',
    en: 'Four homes on a narrow plot within the town centre.',
  },
  body: {
    es: [
      'Un solar estrecho obliga a ser preciso: el proyecto concentra los núcleos de servicio en el centro de la planta y libera los dos extremos para las estancias principales.',
      'La fachada se resuelve con una composición sobria que dialoga con la escala de las medianeras existentes.',
    ],
    en: [
      'A narrow plot demands precision: the project concentrates service cores at the centre of the plan and frees both ends for the main rooms.',
      'The façade is resolved with a sober composition that answers the scale of the existing party walls.',
    ],
  },
})
