import { defineField, defineType } from 'sanity'
import { orderRankField } from '@sanity/orderable-document-list'

/**
 * CONCURSO
 *
 * Más ligero que un proyecto a propósito: la sección de concursos es un índice, no un
 * segundo portfolio. No tiene memoria ni ficha propia, sólo datos y una o dos imágenes.
 */
export const competition = defineType({
  name: 'competition',
  title: 'Concurso',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nombre',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Identificador',
      type: 'slug',
      options: { source: 'title', maxLength: 60 },
      validation: (rule) => rule.required(),
      description: 'Se genera del nombre. No aparece en ninguna URL pública, pero debe ser único.',
    }),
    defineField({
      name: 'location',
      title: 'Ubicación',
      type: 'localizedString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Año',
      type: 'number',
      validation: (rule) => rule.required().integer().min(1990).max(2100),
    }),
    defineField({
      name: 'collaboration',
      title: 'Colaboración',
      type: 'string',
      initialValue: 'VIA',
      description: 'Opcional. La mayoría son con la plataforma VIA.',
    }),
    defineField({
      name: 'images',
      title: 'Imágenes',
      type: 'array',
      of: [{ type: 'projectImage' }],
      description: 'La primera se muestra en el índice. Con una o dos es suficiente.',
    }),
    orderRankField({ type: 'competition' }),
  ],
  preview: {
    select: { title: 'title', location: 'location.es', year: 'year', media: 'images.0.asset' },
    prepare: ({ title, location, year, media }) => ({
      title,
      subtitle: [location, year].filter(Boolean).join(' · '),
      media,
    }),
  },
})
