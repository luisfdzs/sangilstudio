import { defineProject } from '../schema'

export default defineProject({
  slug: 've-house-ibiricu',
  title: 'VE House',
  location: { es: 'Ibiricu, Navarra', en: 'Ibiricu, Navarre' },
  year: 2023,
  status: 'built',
  type: 'housing',
  // Texto alternativo de cada imagen, en el orden de scripts/curation.mjs.
  alts: [
    {
      es: 'La casa en L en torno a la piscina, con cubiertas a dos aguas',
      en: 'The L-shaped house around the pool, with pitched roofs',
    },
    {
      es: 'Salón bajo cubierta inclinada, abierto al porche por ventanales correderos',
      en: 'Living room under the pitched roof, opening to the porch through sliding glazing',
    },
    {
      es: 'Dormitorio bajo cubierta inclinada, con cabecero y armarios de madera',
      en: 'Bedroom under the pitched roof, with timber headboard and wardrobes',
    },
  ],
  order: 40,
  featured: false,
  summary: {
    es: 'Vivienda unifamiliar de volumen contenido y materialidad sobria.',
    en: 'A single-family house of contained volume and sober materiality.',
  },
  body: {
    es: [
      'Una casa de planta compacta que ordena la vida doméstica alrededor de un estar de doble orientación. El volumen se mantiene deliberadamente simple para que el paisaje sea el protagonista.',
      'El interior trabaja con pocos materiales y mucha luz: superficies claras, madera en los elementos que se tocan y huecos dimensionados según la vista que enmarcan.',
    ],
    en: [
      'A compact house organising domestic life around a dual-aspect living room. The volume stays deliberately simple so the landscape takes the lead.',
      'The interior works with few materials and plenty of light: pale surfaces, timber wherever the hand lands, and openings sized according to the view they frame.',
    ],
  },
})
