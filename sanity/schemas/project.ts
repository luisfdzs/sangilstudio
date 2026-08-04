import { defineField, defineType } from 'sanity'
import { orderRankField } from '@sanity/orderable-document-list'

/**
 * PROYECTO (obra construida, en curso, en proyecto o presentada a concurso)
 *
 * Es el único tipo de documento de contenido: **un concurso es un proyecto con el estado
 * «Concurso»**, no una categoría aparte. Antes había un segundo tipo `competition` con su
 * propia sección, y eso dejaba dos formas distintas de decir lo mismo (este mismo campo
 * `status` ya tenía el valor `competition`, y había un proyecto usándolo). Al unificar,
 * los concursos ganan ficha, memoria y planos como cualquier otra obra, y quien edita
 * tiene una sola lista y un solo formulario.
 *
 * Decisiones pensadas para quien edita:
 *
 * - Los estados y tipos son listas cerradas: la web tiene una traducción preparada
 *   para cada valor en los dos idiomas, así que no se pueden inventar.
 * - El orden en la web se cambia **arrastrando** en el listado (Proyectos › Ordenar),
 *   no escribiendo números.
 * - La primera imagen de la galería es siempre la portada: se dice en la ayuda del
 *   campo y así no hay un ajuste más que recordar.
 */
export const project = defineType({
  name: 'project',
  title: 'Proyecto',
  type: 'document',
  groups: [
    { name: 'ficha', title: 'Ficha', default: true },
    { name: 'textos', title: 'Textos' },
    { name: 'imagenes', title: 'Imágenes' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Nombre del proyecto',
      type: 'string',
      group: 'ficha',
      validation: (rule) => rule.required(),
      description: 'No se traduce: es el nombre propio de la obra.',
    }),
    defineField({
      name: 'slug',
      title: 'Dirección en la web',
      type: 'slug',
      group: 'ficha',
      options: { source: 'title', maxLength: 60 },
      validation: (rule) => rule.required(),
      description:
        'Se genera del nombre al pulsar «Generate». Aparece en la URL ' +
        '(sangilstudio.com/es/work/…). Cambiarlo rompe los enlaces antiguos.',
    }),
    defineField({
      name: 'location',
      title: 'Ubicación',
      type: 'localizedString',
      group: 'ficha',
      validation: (rule) => rule.required(),
      description: 'Ejemplo: «Zizur, Navarra» / «Zizur, Navarre».',
    }),
    defineField({
      name: 'year',
      title: 'Año',
      type: 'number',
      group: 'ficha',
      validation: (rule) => rule.required().integer().min(1990).max(2100),
    }),
    defineField({
      name: 'status',
      title: 'Estado',
      type: 'string',
      group: 'ficha',
      options: {
        list: [
          { title: 'Construido', value: 'built' },
          { title: 'En obra', value: 'in-progress' },
          { title: 'En proyecto', value: 'project' },
          { title: 'Concurso', value: 'competition' },
        ],
        layout: 'radio',
      },
      initialValue: 'project',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Tipo',
      type: 'string',
      group: 'ficha',
      // Los cuatro últimos entraron con los concursos: museos y archivos caben en
      // «Cultural», pero un estadio, una facultad, un mercado o un centro de salud no,
      // y forzarlos ahí habría sido etiquetarlos mal para ahorrar cuatro líneas.
      options: {
        list: [
          { title: 'Vivienda', value: 'housing' },
          { title: 'Vivienda colectiva', value: 'multi-family' },
          { title: 'Rehabilitación', value: 'refurbishment' },
          { title: 'Oficinas', value: 'offices' },
          { title: 'Cultural', value: 'cultural' },
          { title: 'Docente', value: 'education' },
          { title: 'Deportivo', value: 'sports' },
          { title: 'Sanitario', value: 'health' },
          { title: 'Comercial', value: 'commercial' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'area',
      title: 'Superficie',
      type: 'string',
      group: 'ficha',
      description: 'Opcional, ya formateada. Ejemplo: «1.240 m²».',
    }),
    defineField({
      name: 'client',
      title: 'Promotor',
      type: 'string',
      group: 'ficha',
      description: 'Opcional. Ejemplo: «MUROA».',
    }),
    /**
     * Es el mismo campo que antes se llamaba «Colaboración»: se renombró al rediseñar
     * la ficha, que ahora enseña una línea de «Arquitectos». Se conserva el nombre
     * interno (`collaboration`) a propósito: cambiarlo obligaría a migrar los treinta y
     * un documentos publicados para no perder lo que ya está escrito, y lo que hay
     * escrito son precisamente los estudios que firman cada obra con nosotros.
     */
    defineField({
      name: 'collaboration',
      title: 'Arquitectos',
      type: 'string',
      group: 'ficha',
      description:
        'Quién firma la obra, separados por comas. Se enseña en la ficha del proyecto. ' +
        'Ejemplo: «Yago Fernández Sangil, Vaíllo Architects».',
    }),
    defineField({
      name: 'featured',
      title: 'Destacado',
      type: 'boolean',
      group: 'ficha',
      initialValue: false,
      description:
        'Reserva: si en «Estudio y contacto» no se elige ningún proyecto para la ' +
        'portada, se usan las imágenes de los destacados.',
    }),

    defineField({
      name: 'summary',
      title: 'Resumen',
      type: 'localizedString',
      group: 'textos',
      validation: (rule) => rule.required(),
      description: 'Una frase. Acompaña a la portada en el listado de obra.',
    }),
    defineField({
      name: 'body',
      title: 'Memoria',
      type: 'localizedParagraphs',
      group: 'textos',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'images',
      title: 'Galería',
      type: 'array',
      of: [{ type: 'projectImage' }],
      group: 'imagenes',
      validation: (rule) => rule.required().min(1),
      description:
        'La PRIMERA imagen es la portada del proyecto: es la que sale en la rejilla ' +
        '—recortada en cuadrado— y la que se usa si el proyecto está en la portada de ' +
        'la web. En la ficha se ven todas, una debajo de otra y sin recortar. Arrastra ' +
        'para reordenar.',
    }),
    defineField({
      name: 'plans',
      title: 'Planos',
      type: 'array',
      of: [{ type: 'projectImage' }],
      group: 'imagenes',
      description:
        'Opcional. Se muestran aparte, sobre fondo claro y sin recortar, porque son ' +
        'documentos técnicos.',
    }),

    // Campo oculto que sostiene el orden por arrastre del listado.
    orderRankField({ type: 'project' }),
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
