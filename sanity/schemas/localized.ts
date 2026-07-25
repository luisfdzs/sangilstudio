import { defineField, defineType } from 'sanity'

/**
 * BLOQUES BILINGÜES
 *
 * En lugar de un sistema de traducción con documentos paralelos, cada campo de texto
 * es un objeto con "Español" e "Inglés" al lado. Para dos idiomas es lo más claro
 * posible para quien edita: se ve de un golpe qué falta traducir, sin cambiar de
 * documento ni de pestaña. Coincide además con la forma que ya tenía el contenido en
 * ficheros, así que la migración es directa.
 */

export const localizedString = defineType({
  name: 'localizedString',
  title: 'Texto',
  type: 'object',
  options: { columns: 2 },
  fields: [
    defineField({ name: 'es', title: 'Español', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'en', title: 'Inglés', type: 'string', validation: (r) => r.required() }),
  ],
})

export const localizedText = defineType({
  name: 'localizedText',
  title: 'Texto largo',
  type: 'object',
  fields: [
    defineField({
      name: 'es',
      title: 'Español',
      type: 'text',
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'en',
      title: 'Inglés',
      type: 'text',
      rows: 3,
      validation: (r) => r.required(),
    }),
  ],
})

/**
 * Memoria del proyecto: varios párrafos. Se guarda como lista de párrafos (no como
 * texto rico) porque el diseño de la web sólo admite párrafos: así nadie puede meter
 * un titular gigante o un color que rompa la estética.
 */
export const localizedParagraphs = defineType({
  name: 'localizedParagraphs',
  title: 'Párrafos',
  type: 'object',
  fields: [
    defineField({
      name: 'es',
      title: 'Español',
      type: 'array',
      of: [{ type: 'text', rows: 4 }],
      validation: (r) => r.required().min(1),
      description: 'Un elemento por párrafo. Se muestran en este orden.',
    }),
    defineField({
      name: 'en',
      title: 'Inglés',
      type: 'array',
      of: [{ type: 'text', rows: 4 }],
      validation: (r) => r.required().min(1),
      description: 'Un elemento por párrafo, en el mismo orden que el español.',
    }),
  ],
})
