import type { SchemaTypeDefinition } from 'sanity'
import {
  localizedParagraphs,
  localizedString,
  localizedStringOptional,
  localizedText,
} from './localized'
import { project } from './project'
import { projectImage } from './projectImage'
import { siteSettings } from './siteSettings'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documentos
  project,
  siteSettings,
  // Piezas reutilizables
  projectImage,
  localizedString,
  localizedStringOptional,
  localizedText,
  localizedParagraphs,
]
