import { defineField, defineType } from 'sanity'

export const projectImage = defineType({
  name: 'projectImage',
  title: 'Imagen',
  type: 'object',
  fields: [
    defineField({
      name: 'asset',
      title: 'Archivo',
      type: 'image',
      options: {
        hotspot: true, // permite elegir el punto que nunca se recorta
      },
      validation: (rule) => rule.required(),
      description:
        'Arrastra la imagen. Puede pesar lo que sea: se optimiza automáticamente. ' +
        'El punto de interés (hotspot) marca qué parte no debe recortarse nunca.',
    }),
    defineField({
      name: 'alt',
      title: 'Descripción para accesibilidad (opcional)',
      type: 'localizedStringOptional',
      description:
        'Opcional: se puede publicar sin escribir nada. Si la rellenas, describe lo que ' +
        'se ve, sin repetir el nombre del proyecto. Ejemplo: «Patio central con lámina ' +
        'de agua, entre muros de piedra».',
    }),
  ],
  preview: {
    select: { media: 'asset', title: 'alt.es' },
    prepare: ({ media, title }) => ({ media, title: title || 'Sin descripción' }),
  },
})
