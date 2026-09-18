import { defineField, defineType } from 'sanity'

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

export const localizedStringOptional = defineType({
  name: 'localizedStringOptional',
  title: 'Texto (opcional)',
  type: 'object',
  options: { columns: 2 },
  fields: [
    defineField({ name: 'es', title: 'Español', type: 'string' }),
    defineField({ name: 'en', title: 'Inglés', type: 'string' }),
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
