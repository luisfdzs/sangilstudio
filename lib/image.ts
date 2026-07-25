import type { DescribedImage } from '@/lib/content'

/** Relación de aspecto, para reservar el hueco exacto antes de cargar (CLS = 0). */
export function aspectRatio(image: DescribedImage): number {
  return image.width / image.height
}

/** Las verticales se muestran a media anchura; las horizontales, a anchura completa. */
export function isPortrait(image: DescribedImage): boolean {
  return aspectRatio(image) < 0.95
}
