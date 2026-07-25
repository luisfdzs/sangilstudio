import { defineProject } from '../schema'

export default defineProject({
  slug: 'is-house-pamplona',
  title: 'IS House',
  location: { es: 'Pamplona, Navarra', en: 'Pamplona, Navarre' },
  year: 2026,
  status: 'project',
  type: 'refurbishment',
  // Texto alternativo de cada imagen, en el orden de scripts/curation.mjs.
  alts: [
    {
      es: 'Estar con vigas de hormigón a la vista y butacas junto a los balcones',
      en: 'Living room with exposed concrete beams and armchairs by the balconies',
    },
    {
      es: 'Cocina con isla y frentes claros, prolongada hacia el fondo de la planta',
      en: 'Kitchen with island and pale fronts, extending to the back of the plan',
    },
    {
      es: 'Comedor con lámpara sobre mesa redonda y armarios enrasados',
      en: 'Dining area with a pendant over a round table and flush cabinetry',
    },
    {
      es: 'Puertas y armarios enrasados en un mismo tono, con el comedor al fondo',
      en: 'Flush doors and cabinets in a single tone, with the dining area beyond',
    },
  ],
  order: 20,
  featured: true,
  summary: {
    es: 'Reforma de una vivienda en el centro de Pamplona buscando luz y continuidad.',
    en: 'Refurbishment of a flat in central Pamplona in search of light and continuity.',
  },
  body: {
    es: [
      'El encargo pedía más luz y menos pasillo. La propuesta reorganiza la planta liberando la fachada principal y concentrando los servicios en una banda técnica, de modo que las estancias de día queden encadenadas sin puertas intermedias.',
      'La paleta es cálida y muy corta: piedra clara, madera natural y un tono único en carpinterías, para que la casa se lea como una sola pieza.',
    ],
    en: [
      'The brief asked for more light and less corridor. The proposal reorganises the plan, freeing the main façade and concentrating services into a technical band so that the daytime rooms flow into one another without intermediate doors.',
      'The palette is warm and very short: pale stone, natural timber and a single tone for all joinery, so the home reads as one continuous piece.',
    ],
  },
})
