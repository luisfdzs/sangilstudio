import type { SchemaTypeDefinition } from 'sanity'
import { competition } from './competition'
import { localizedParagraphs, localizedString, localizedText } from './localized'
import { project } from './project'
import { projectImage } from './projectImage'
import { siteSettings } from './siteSettings'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documentos
  project,
  competition,
  siteSettings,
  // Piezas reutilizables
  projectImage,
  localizedString,
  localizedText,
  localizedParagraphs,
]
