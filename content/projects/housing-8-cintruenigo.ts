import { defineProject } from '../schema'

export default defineProject({
  slug: 'housing-8-cintruenigo',
  title: '8 viviendas en Cintruénigo',
  location: { es: 'Cintruénigo, Navarra', en: 'Cintruénigo, Navarre' },
  year: 2025,
  status: 'in-progress',
  type: 'multi-family',
  // Texto alternativo de cada imagen, en el orden de scripts/curation.mjs.
  alts: [
    {
      es: 'Fachada de madera con balcones corridos, al atardecer',
      en: 'Timber façade with continuous balconies at dusk',
    },
    {
      es: 'Salón comedor alargado con salida al balcón',
      en: 'Elongated living-dining room opening onto the balcony',
    },
    {
      es: 'Dormitorio con armario de madera y luz indirecta',
      en: 'Bedroom with timber wardrobe and indirect lighting',
    },
  ],
  order: 50,
  featured: false,
  summary: {
    es: 'Ocho viviendas que ordenan la esquina con un volumen sencillo y rotundo.',
    en: 'Eight homes resolving a corner plot with a simple, emphatic volume.',
  },
  body: {
    es: [
      'El edificio resuelve la esquina con un único gesto: un volumen macizo perforado por huecos verticales de proporción constante, que dan a las viviendas fachada a las dos calles.',
      'En el interior, las viviendas se organizan para que el estar reciba luz de dos orientaciones y la cocina forme parte del espacio común.',
    ],
    en: [
      'The building resolves the corner with a single gesture: a solid volume punctured by vertical openings of constant proportion, giving every home a frontage onto both streets.',
      'Inside, the homes are laid out so the living room receives light from two orientations and the kitchen belongs to the shared space.',
    ],
  },
})
