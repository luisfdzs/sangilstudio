import { defineProject } from '../schema'

export default defineProject({
  slug: 'lantegi-cultural-centre',
  title: 'Lantegi Cultural Centre',
  location: { es: 'Pamplona, Navarra', en: 'Pamplona, Navarre' },
  year: 2023,
  status: 'built',
  type: 'cultural',
  collaboration: 'Vaíllo Architects · Fernando Molina',
  // Texto alternativo de cada imagen, en el orden de scripts/curation.mjs.
  alts: [
    {
      es: 'Pasillo de madera y hormigón; un niño toca la guitarra sentado en el suelo',
      en: 'Timber and concrete corridor; a child sits on the floor playing guitar',
    },
  ],
  order: 18,
  featured: true,
  summary: {
    es: 'Equipamiento cultural que reutiliza la memoria industrial del lugar.',
    en: 'A cultural venue that reuses the industrial memory of its site.',
  },
  body: {
    es: [
      'La propuesta conserva la estructura y el carácter industrial existentes y añade lo mínimo imprescindible para que el edificio funcione como equipamiento público.',
      'Los recorridos se resuelven con piezas nuevas claramente distinguibles de lo antiguo: nada disfrazado, todo legible.',
    ],
    en: [
      'The proposal keeps the existing structure and industrial character, adding only what is strictly needed for the building to work as a public venue.',
      'Circulation is resolved with new pieces clearly distinguishable from the old fabric: nothing disguised, everything legible.',
    ],
  },
})
