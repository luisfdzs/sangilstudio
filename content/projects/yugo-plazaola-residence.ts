import { defineProject } from '../schema'

export default defineProject({
  slug: 'yugo-plazaola-residence',
  title: 'Yugo Plazaola Residence',
  location: { es: 'Pamplona, Navarra', en: 'Pamplona, Navarre' },
  year: 2024,
  status: 'built',
  type: 'multi-family',
  collaboration: 'Vaíllo Architects',
  // Texto alternativo de cada imagen, en el orden de scripts/curation.mjs.
  alts: [
    {
      es: 'El volumen de la residencia desde la calle, entre arbolado de otoño',
      en: 'The residence seen from the street, among autumn trees',
    },
    {
      es: 'La torre, con fachada de paños claros y bandas verticales',
      en: 'The tower, with pale panels and vertical bands',
    },
    {
      es: 'Comedor con mesas corridas y barra curva bajo un techo circular',
      en: 'Dining hall with long tables and a curved counter under a circular ceiling',
    },
    {
      es: 'Sala común con ventanales al exterior y techo de listones de madera',
      en: 'Common room with full-height glazing and a timber-slatted ceiling',
    },
  ],
  order: 15,
  featured: true,
  summary: {
    es: 'Residencia universitaria donde los espacios comunes son el verdadero edificio.',
    en: 'A student residence where the shared spaces are the real building.',
  },
  body: {
    es: [
      'El proyecto entiende una residencia de estudiantes como una casa grande: las habitaciones son piezas eficientes y el esfuerzo se concentra en los lugares donde se vive en común.',
      'Comedor, gradas y accesos se encadenan como un recorrido continuo, con materiales resistentes al uso intensivo y una escala pensada para el encuentro.',
    ],
    en: [
      'The project treats a student residence as one large house: the rooms are efficient pieces, and the effort goes into the places where life is shared.',
      'Dining hall, tiered seating and entrances link up into a continuous route, with materials that stand up to heavy use and a scale made for meeting people.',
    ],
  },
})
