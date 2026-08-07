import type { StructureResolver } from 'sanity/structure'
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Contenido')
    .items([
      orderableDocumentListDeskItem({
        type: 'project',
        title: 'Proyectos',
        S,
        context,
      }),
      S.divider(),
      S.listItem()
        .title('Estudio y contacto')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
    ])
