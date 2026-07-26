import type { StructureResolver } from 'sanity/structure'
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'

/**
 * MENÚ DEL PANEL
 *
 * Se define a mano en vez de dejar el listado automático de Sanity por dos razones:
 *
 * 1. **Ordenar arrastrando.** `orderableDocumentListDeskItem` da un listado donde el
 *    orden de la web se cambia arrastrando las fichas, sin números de por medio.
 * 2. **Ajustes como documento único.** "Estudio y contacto" se abre directamente en su
 *    formulario, sin un listado con un solo elemento ni la opción de crear un segundo.
 *
 * Una sola lista de contenido: los concursos están dentro de «Proyectos», con el estado
 * «Concurso». El orden de esa lista es el orden de la web, así que la obra construida se
 * arrastra arriba y los concursos abajo — sin necesidad de dos listas que mantener.
 */
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
