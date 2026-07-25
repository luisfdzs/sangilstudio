import { defineProject } from '../schema'

export default defineProject({
  slug: 'holy-land-visitor-center',
  title: 'Holy Land Visitor Center',
  location: { es: 'Abu Gosh, Israel', en: 'Abu Gosh, Israel' },
  year: 2017,
  status: 'built',
  type: 'cultural',
  collaboration: 'Vaíllo Architects',
  // Texto alternativo de cada imagen, en el orden de scripts/curation.mjs.
  alts: [
    {
      es: 'Sala expositiva oscura con una cronología perforada en el paramento',
      en: 'Darkened exhibition hall with a timeline perforated into the wall',
    },
    {
      es: 'Patio central con lámina de agua, abierto al cielo entre muros de piedra',
      en: 'Central courtyard with a water basin, open to the sky between stone walls',
    },
    {
      es: 'Vestíbulo con vitrinas iluminadas y una visitante ante un panel',
      en: 'Foyer with lit display cases and a visitor at an interpretation panel',
    },
    {
      es: 'Sala de actos con techo facetado y luminarias puntuales',
      en: 'Auditorium with a faceted ceiling and pinpoint lighting',
    },
  ],
  order: 12,
  featured: true,
  summary: {
    es: 'Centro de visitantes excavado en la topografía, entre la piedra y la luz.',
    en: 'A visitor centre carved into the topography, between stone and light.',
  },
  body: {
    es: [
      'El edificio se entierra parcialmente para no competir con el paisaje: aparece como una plataforma pétrea desde la que se domina el valle.',
      'Dentro, las salas se ordenan alrededor de un patio que introduce luz filtrada y marca el ritmo del recorrido expositivo.',
    ],
    en: [
      'The building is partly buried so as not to compete with the landscape: it appears as a stone platform commanding the valley.',
      'Inside, the halls are arranged around a courtyard that brings in filtered light and sets the rhythm of the exhibition route.',
    ],
  },
})
