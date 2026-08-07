import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Estudio y contacto',
  type: 'document',
  groups: [
    { name: 'portada', title: 'Portada', default: true },
    { name: 'textos', title: 'Textos' },
    { name: 'equipo', title: 'Equipo' },
    { name: 'contacto', title: 'Contacto' },
  ],
  fields: [
    defineField({
      name: 'heroProjects',
      title: 'Proyectos de la portada',
      type: 'array',
      group: 'portada',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
      description:
        'Las imágenes que se van fundiendo a pantalla completa al entrar en la web. Se ' +
        'usa la PRIMERA imagen de cada proyecto elegido, en este orden. Si se deja ' +
        'vacío, la web recurre a los proyectos marcados como destacados.',
    }),

    defineField({
      name: 'statement',
      title: 'Manifiesto del estudio',
      type: 'localizedParagraphs',
      group: 'textos',
      validation: (rule) => rule.required(),
      description:
        'Los párrafos que describen al estudio. Se leen en la página Estudio; el ' +
        'primero va en grande, a modo de entrada.',
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
      description:
        'El orden de esta lista es el que se ve en la web, también al final del bloque ' +
        'de contacto. Arrastra para cambiarlo.',
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
      name: 'street',
      title: 'Calle y número',
      type: 'string',
      group: 'contacto',
      initialValue: 'Castillo de Maya 35, bajo',
      description: 'Primera línea de la dirección. Ejemplo: «Castillo de Maya 35, bajo».',
    }),
    defineField({
      name: 'postalCode',
      title: 'Código postal',
      type: 'string',
      group: 'contacto',
      initialValue: '31004',
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
      description: 'No aparece en el bloque de contacto; se usa en los textos de la web.',
    }),
    defineField({
      name: 'country',
      title: 'País',
      type: 'localizedString',
      group: 'contacto',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'phone',
      title: 'Teléfono del estudio',
      type: 'string',
      group: 'contacto',
      initialValue: '+34 664 197 624',
      description: 'El único que aparece en el bloque de contacto, precedido de una «T».',
    }),
    defineField({
      name: 'email',
      title: 'Email de contacto',
      type: 'string',
      group: 'contacto',
      validation: (rule) => rule.required().email(),
      description: 'Aparece en el bloque de contacto de la portada.',
    }),
    defineField({
      name: 'website',
      title: 'Página web',
      type: 'url',
      group: 'contacto',
      initialValue: 'https://www.sangilstudio.com',
      description: 'Se muestra sin «https://». Ejemplo: «www.sangilstudio.com».',
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram',
      type: 'url',
      group: 'contacto',
      description: 'Dirección completa del perfil. En la web se enseña sólo el nombre de usuario.',
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
