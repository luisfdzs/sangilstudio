import { defineField, defineType } from 'sanity'

/**
 * AJUSTES DEL ESTUDIO (documento único)
 *
 * Todo lo que no es un proyecto: el manifiesto que abre la web y la página Estudio, el
 * equipo, los colaboradores y los datos de contacto. Es un documento único (singleton):
 * no se puede crear un segundo, para que no haya dudas de cuál manda.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Estudio y contacto',
  type: 'document',
  groups: [
    { name: 'textos', title: 'Textos', default: true },
    { name: 'equipo', title: 'Equipo' },
    { name: 'contacto', title: 'Contacto' },
  ],
  fields: [
    defineField({
      name: 'statement',
      title: 'Manifiesto del estudio',
      type: 'localizedParagraphs',
      group: 'textos',
      validation: (rule) => rule.required(),
      description:
        'Los párrafos que describen al estudio. El PRIMERO se usa también en la ' +
        'portada, en grande; el segundo, debajo. La página Estudio muestra todos.',
    }),
    defineField({
      name: 'team',
      title: 'Equipo',
      type: 'array',
      group: 'equipo',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Nombre',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'role',
              title: 'Cargo',
              type: 'localizedString',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'phone',
              title: 'Teléfono',
              type: 'string',
              validation: (rule) => rule.required(),
              description: 'Con prefijo. Ejemplo: «+34 664 197 624».',
            }),
          ],
          preview: { select: { title: 'name', subtitle: 'role.es' } },
        },
      ],
      validation: (rule) => rule.required().min(1),
      description: 'El orden de esta lista es el que se ve en la web. Arrastra para cambiarlo.',
    }),
    defineField({
      name: 'collaborators',
      title: 'Colaboradores',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'equipo',
      description: 'Estudios y empresas con los que se colabora. Uno por línea.',
    }),
    defineField({
      name: 'email',
      title: 'Email de contacto',
      type: 'string',
      group: 'contacto',
      validation: (rule) => rule.required().email(),
      description: 'Aparece en el pie de página y en Contacto, en todas las páginas.',
    }),
    defineField({
      name: 'city',
      title: 'Ciudad',
      type: 'string',
      group: 'contacto',
      initialValue: 'Pamplona',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'region',
      title: 'Provincia / región',
      type: 'localizedString',
      group: 'contacto',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'country',
      title: 'País',
      type: 'localizedString',
      group: 'contacto',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram',
      type: 'url',
      group: 'contacto',
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn',
      type: 'url',
      group: 'contacto',
    }),
  ],
  preview: { prepare: () => ({ title: 'Estudio y contacto' }) },
})
