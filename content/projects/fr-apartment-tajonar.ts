import { defineProject } from '../schema'

export default defineProject({
  slug: 'fr-apartment-tajonar',
  title: 'FR Apartment',
  location: { es: 'Tajonar, Navarra', en: 'Tajonar, Navarre' },
  year: 2026,
  status: 'project',
  type: 'refurbishment',
  // Texto alternativo de cada imagen, en el orden de scripts/curation.mjs.
  alts: [
    {
      es: 'Estar y comedor bajo cubierta inclinada, con la cocina abierta al fondo',
      en: 'Living and dining under the pitched roof, with the open kitchen beyond',
    },
    {
      es: 'La misma pieza con las puertas cerradas: los frentes de madera forman un plano continuo',
      en: 'The same room with every door closed: the timber fronts read as one continuous plane',
    },
  ],
  order: 100,
  featured: true,
  summary: {
    es: 'Reforma de un apartamento con puertas que desaparecen en el plano de pared.',
    en: 'Apartment refurbishment with doors that vanish into the wall plane.',
  },
  body: {
    es: [
      'La reforma persigue una casa tranquila: puertas enrasadas que desaparecen, un solo tono en paramentos y almacenaje integrado para que nada sobre a la vista.',
      'Cerradas todas las puertas, la vivienda se lee como una secuencia de superficies continuas; abiertas, aparece una planta prácticamente diáfana.',
    ],
    en: [
      'The refurbishment pursues a quiet home: flush doors that disappear, a single tone across surfaces and integrated storage so nothing is left on show.',
      'With every door closed, the flat reads as a sequence of continuous surfaces; open, it becomes an almost entirely open plan.',
    ],
  },
})
