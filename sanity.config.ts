'use client'

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { apiVersion, dataset, projectId } from './sanity/env'
import { schemaTypes } from './sanity/schemas'
import { structure } from './sanity/structure'

/**
 * PANEL DE ADMINISTRACIÓN — se sirve dentro de la propia web, en /admin.
 *
 * Quien edita entra con su cuenta (invitada por email desde sanity.io/manage): no hay
 * contraseñas compartidas y se puede quitar el acceso a una persona sin afectar al
 * resto. Cada cambio queda con autor y fecha, y hay historial para deshacer.
 */
export default defineConfig({
  name: 'sangil-studio',
  title: 'Sangil Studio',
  basePath: '/admin',
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    // Vision permite lanzar consultas a mano: útil para nosotros, invisible para quien
    // sólo edita contenido.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  document: {
    // "Estudio y contacto" es único: no se ofrece crear otro.
    newDocumentOptions: (prev) => prev.filter((template) => template.templateId !== 'siteSettings'),
  },
})
