/**
 * Cómo responde la web al deslizar con el dedo: en la portada (el pase del hero)
 * y en la ficha de proyecto (ir al anterior o al siguiente).
 *
 * Los valores de aquí son los que ve el visitante. El panel de `/?swipe` sólo
 * sirve para probar alternativas en el móvil y quedarse con una.
 */
export type SwipeMotion = 'jump' | 'slide' | 'fade' | 'parallax' | 'elastic'

export type SwipeSettings = {
  motion: SwipeMotion
  /** Fracción del ancho que hay que recorrer para que el gesto cuente. */
  distance: number
  /** 0 = la imagen sigue al dedo; cuanto más alto, más se resiste. */
  resistance: number
  /** Milisegundos que tarda en encajar al soltar. */
  settle: number
  /** Dejar pasar también los gestos rápidos aunque falte recorrido. */
  flick: boolean
}

export type SwipePreset = {
  id: SwipeMotion
  label: string
  hint: string
  settings: SwipeSettings
}

export const PRESETS: SwipePreset[] = [
  {
    id: 'slide',
    label: 'Arrastre y encaje',
    hint: 'La imagen sigue al dedo y la siguiente entra desde el borde. Al soltar, encaja.',
    settings: { motion: 'slide', distance: 0.22, resistance: 0.15, settle: 420, flick: true },
  },
  {
    id: 'fade',
    label: 'Fundido al arrastrar',
    hint: 'Nada se mueve: el recorrido del dedo funde una imagen sobre la otra.',
    settings: { motion: 'fade', distance: 0.25, resistance: 0.35, settle: 560, flick: true },
  },
  {
    id: 'parallax',
    label: 'Paralaje',
    hint: 'La imagen que sale se retrasa respecto al dedo y la que entra llega a su ritmo.',
    settings: { motion: 'parallax', distance: 0.22, resistance: 0.2, settle: 500, flick: true },
  },
  {
    id: 'elastic',
    label: 'Elástico',
    hint: 'El arrastre pesa y se frena al final; al soltar vuelve con rebote suave.',
    settings: { motion: 'elastic', distance: 0.28, resistance: 0.55, settle: 620, flick: true },
  },
  {
    id: 'jump',
    label: 'Salto seco (el de ahora)',
    hint: 'Sin arrastre: nada se mueve hasta soltar, y entonces cambia de golpe.',
    settings: { motion: 'jump', distance: 0.12, resistance: 0, settle: 0, flick: false },
  },
]

export const PRESET_BY_ID: Record<SwipeMotion, SwipePreset> = Object.fromEntries(
  PRESETS.map((preset) => [preset.id, preset]),
) as Record<SwipeMotion, SwipePreset>

/** Lo que se sirve hoy en la web. */
export const DEFAULT_SETTINGS: SwipeSettings = PRESET_BY_ID.slide.settings

/** Curvas de encaje: la de rebote sólo se usa en el preset elástico. */
export const EASING: Record<SwipeMotion, string> = {
  jump: 'linear',
  slide: 'cubic-bezier(0.22, 1, 0.36, 1)',
  fade: 'cubic-bezier(0.65, 0, 0.35, 1)',
  parallax: 'cubic-bezier(0.22, 1, 0.36, 1)',
  elastic: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
}
