import { defineField, defineType } from 'sanity'

/**
 * IMAGEN DE PROYECTO
 *
 * Se sube arrastrando el archivo, del tamaño que sea: Sanity guarda el original y su
 * CDN entrega a la web la versión ligera que hace falta en cada pantalla (formato,
 * ancho y recorte). Es lo que sustituye al script local de optimización para todo lo
 * que se suba desde aquí.
 *
 * El texto alternativo es obligatorio: es lo que oyen las personas que navegan con
 * lector de pantalla y lo que lee Google. Sin él, una foto es un hueco vacío.
 */
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
      title: 'Descripción para accesibilidad',
      type: 'localizedString',
      validation: (rule) => rule.required(),
      description:
        'Describe lo que se ve, sin repetir el nombre del proyecto. ' +
        'Ejemplo: «Patio central con lámina de agua, entre muros de piedra».',
    }),
  ],
  preview: {
    select: { media: 'asset', title: 'alt.es' },
    prepare: ({ media, title }) => ({ media, title: title || 'Sin descripción' }),
  },
})
