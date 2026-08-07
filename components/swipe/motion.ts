import type { CSSProperties } from 'react'
import type { SwipeDrag } from '@/components/ui/useHorizontalSwipe'

/**
 * Cómo se mueve lo que sale y lo que entra mientras el dedo arrastra. Lo comparten
 * el hero de la portada y la ficha de proyecto para que el gesto se sienta igual
 * en toda la web.
 */
export function isGesturing(drag: SwipeDrag): boolean {
  return drag.direction !== 0 && drag.motion !== 'jump'
}

export function transitionStyle(drag: SwipeDrag): CSSProperties {
  return {
    transitionProperty: 'opacity, transform',
    transitionDuration: `${drag.duration}ms`,
    transitionTimingFunction: drag.easing,
    willChange: 'opacity, transform',
  }
}

/** Lo que se está yendo. */
export function outgoingStyle(drag: SwipeDrag): CSSProperties {
  const travel = drag.progress * 100
  const reached = Math.abs(drag.progress)

  switch (drag.motion) {
    case 'fade':
      return { opacity: 1 - reached }
    case 'parallax':
      return { transform: `translateX(${travel * 0.4}%)`, opacity: 1 - reached * 0.35 }
    case 'elastic':
      return { transform: `translateX(${travel}%) scale(${1 - reached * 0.06})`, opacity: 1 }
    default:
      return { transform: `translateX(${travel}%)`, opacity: 1 }
  }
}

/** Lo que asoma por el borde: siempre a la vista, para saber qué va a venir. */
export function enteringStyle(drag: SwipeDrag): CSSProperties {
  if (drag.motion === 'fade') return { opacity: Math.abs(drag.progress) }
  return { transform: `translateX(${(drag.progress + drag.direction) * 100}%)`, opacity: 1 }
}
