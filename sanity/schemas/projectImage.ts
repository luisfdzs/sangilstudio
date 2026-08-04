import { defineField, defineType } from 'sanity'

/**
 * IMAGEN DE PROYECTO
 *
 * Se sube arrastrando el archivo, del tamaño que sea: Sanity guarda el original y su
 * CDN entrega a la web la versión ligera que hace falta en cada pantalla (formato,
 * ancho y recorte). Es lo que sustituye al script local de optimización para todo lo
 * que se suba desde aquí.
 *
 * **Sólo la imagen es obligatoria: la descripción NO.** Antes lo era, y con una galería
 * de veinte fotos el panel se convertía en veinte textos por escribir y por traducir; si
 * faltaba uno, el botón «Publicar» se bloqueaba y el proyecto entero se quedaba sin
 * subir. El estudio pidió poder arrastrar las fotos y publicar, y así es.
 *
 * Lo que se pierde al dejarla vacía: quien navega con lector de pantalla no oye qué hay
 * en la foto, y Google no la lee. La web lo amortigua —una imagen sin descripción sale
 * con `alt=""`, que un lector de pantalla salta en silencio en lugar de leer el nombre
 * del fichero, y en la ficha la primera foto toma el nombre del proyecto—, y en la
 * rejilla y en la portada la propia tarjeta o el enlace ya llevan el título. Aun así,
 * rellenarla sigue siendo lo recomendable, y de ahí que el campo lo diga.
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
