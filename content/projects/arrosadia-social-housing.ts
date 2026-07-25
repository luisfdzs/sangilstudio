import { defineProject } from '../schema'

export default defineProject({
  slug: 'arrosadia-social-housing',
  title: 'Arrosadía Social Housing',
  location: { es: 'Pamplona, Navarra', en: 'Pamplona, Navarre' },
  year: 2023,
  status: 'built',
  type: 'multi-family',
  collaboration: 'Vaíllo Architects',
  // Texto alternativo de cada imagen, en el orden de scripts/curation.mjs.
  alts: [
    {
      es: 'Porche corrido en planta baja, con pilares de hormigón y cerramiento de chapa perfilada',
      en: 'Ground-floor arcade with concrete columns and profiled metal cladding',
    },
    {
      es: 'Terrazas voladas en esquina, con antepechos de lamas verticales',
      en: 'Cantilevered corner balconies with vertical slatted railings',
    },
    {
      es: 'Encuentro de dos fachadas: chapa vertical y ventanas retranqueadas',
      en: 'Two façades meeting: vertical cladding and recessed windows',
    },
    {
      es: 'El edificio visto desde el parque, entre los árboles',
      en: 'The building seen from the park, through the trees',
    },
  ],
  order: 10,
  featured: true,
  summary: {
    es: 'Vivienda protegida que demuestra que el presupuesto ajustado no está peleado con la calidad.',
    en: 'Social housing proving that a tight budget is not at odds with quality.',
  },
  body: {
    es: [
      'Un edificio de vivienda protegida donde las decisiones importantes son las de siempre: orientación, ventilación cruzada, espacios comunes que se usan y un envolvente bien resuelto.',
      'La fachada ordena el conjunto con una geometría clara y repetida; dentro, cada vivienda gana metros útiles reduciendo circulaciones al mínimo.',
    ],
    en: [
      'A social housing block where the decisions that matter are the classic ones: orientation, cross ventilation, communal spaces that actually get used, and a well-resolved envelope.',
      'The façade organises the whole with a clear, repeated geometry; inside, each home gains usable square metres by cutting circulation to a minimum.',
    ],
  },
})
