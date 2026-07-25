import { defineProject } from '../schema'

export default defineProject({
  slug: 'ancin-offices',
  title: 'Ancín Offices',
  location: { es: 'Pamplona, Navarra', en: 'Pamplona, Navarre' },
  year: 2026,
  status: 'project',
  type: 'offices',
  // Texto alternativo de cada imagen, en el orden de scripts/curation.mjs.
  alts: [
    {
      es: 'Recepción con mostrador de madera y un paño de listones al fondo',
      en: 'Reception with a timber counter and a slatted plane behind',
    },
    {
      es: 'Zona de trabajo con techo de listones de madera y puestos individuales',
      en: 'Work area with a timber-slatted ceiling and individual desks',
    },
  ],
  order: 80,
  featured: true,
  summary: {
    es: 'Oficinas donde el mobiliario fijo construye el espacio.',
    en: 'An office where built-in furniture builds the space.',
  },
  body: {
    es: [
      'En lugar de tabiques, el proyecto usa piezas de mobiliario a media altura para separar usos sin renunciar a la visión completa de la planta ni a la luz de fachada.',
      'Los acabados son cálidos y mates, pensados para una jornada larga: madera, textiles de tono neutro e iluminación indirecta.',
    ],
    en: [
      'Instead of partitions, the project uses half-height furniture pieces to separate uses without giving up a full reading of the floor or the daylight from the façade.',
      'Finishes are warm and matte, made for a long working day: timber, neutral textiles and indirect lighting.',
    ],
  },
})
