'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { EASING, type SwipeMotion } from '@/components/swipe/presets'
import { useSwipeSettings } from '@/components/swipe/store'

/** Recorrido mínimo antes de decidir si el gesto es horizontal o vertical. */
const INTENT_PX = 8
/** Un gesto rápido (px por milisegundo) pasa de imagen aunque haya recorrido poco. */
const FLICK_SPEED = 0.45
const FLICK_MIN_PX = 16

export type SwipeDrag = {
  motion: SwipeMotion
  /** Recorrido en tanto por uno del ancho, ya amortiguado. Negativo = hacia el siguiente. */
  progress: number
  /** Hacia dónde va el gesto: 1 siguiente, −1 anterior, 0 en reposo. */
  direction: -1 | 0 | 1
  /** Milisegundos de transición que debe aplicar quien pinta. */
  duration: number
  easing: string
  /** El dedo está encima y arrastrando. */
  active: boolean
}

type Phase = 'idle' | 'dragging' | 'settling'
type Axis = 'none' | 'x' | 'y'

const REST = { phase: 'idle' as Phase, progress: 0, duration: 0, direction: 0 as -1 | 0 | 1 }

/**
 * Deslizamiento horizontal para pantallas táctiles: sigue al dedo, decide por
 * recorrido o por velocidad, y al pasar termina de salir antes de cambiar.
 * El ratón no entra aquí: en escritorio se navega con las flechas laterales.
 */
export function useHorizontalSwipe(onSwipe: (delta: number) => void) {
  const settings = useSwipeSettings()
  const reduced = useReducedMotion()
  const motion: SwipeMotion = reduced ? 'jump' : settings.motion

  const [state, setState] = useState(REST)
  const origin = useRef<{ x: number; y: number; time: number; width: number } | null>(null)
  const axis = useRef<Axis>('none')
  const swipedRef = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  function schedule(run: () => void, delay: number): void {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      timer.current = null
      run()
    }, delay)
  }

  function settleBack(): void {
    if (motion === 'jump' || settings.settle <= 0) {
      setState(REST)
      return
    }
    setState((current) => ({
      ...current,
      phase: 'settling',
      progress: 0,
      duration: settings.settle,
    }))
    schedule(() => setState(REST), settings.settle)
  }

  const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse') return
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }
    const width = event.currentTarget.getBoundingClientRect().width || 1
    origin.current = { x: event.clientX, y: event.clientY, time: event.timeStamp, width }
    axis.current = 'none'
    swipedRef.current = false
    setState(REST)
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const start = origin.current
    if (!start) return

    const dx = event.clientX - start.x
    const dy = event.clientY - start.y

    if (axis.current === 'none') {
      if (Math.abs(dx) < INTENT_PX && Math.abs(dy) < INTENT_PX) return
      axis.current = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
      if (axis.current === 'x') {
        try {
          event.currentTarget.setPointerCapture(event.pointerId)
        } catch {
          // El puntero ya se ha soltado: el gesto sigue valiendo sin captura.
        }
      }
    }

    if (axis.current !== 'x' || motion === 'jump') return

    const progress = damp(dx, start.width, settings.resistance) / start.width
    setState({
      phase: 'dragging',
      progress,
      duration: 0,
      direction: progress === 0 ? 0 : progress < 0 ? 1 : -1,
    })
  }

  const onPointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    const start = origin.current
    origin.current = null
    if (!start) return

    if (axis.current !== 'x') {
      settleBack()
      return
    }

    const dx = event.clientX - start.x
    const elapsed = Math.max(1, event.timeStamp - start.time)
    const travelled = Math.abs(dx) / start.width
    const speed = Math.abs(dx) / elapsed
    const flicked = settings.flick && speed >= FLICK_SPEED && Math.abs(dx) >= FLICK_MIN_PX

    if (!(travelled >= settings.distance || flicked) || dx === 0) {
      settleBack()
      return
    }

    const direction: -1 | 1 = dx < 0 ? 1 : -1
    swipedRef.current = true

    if (motion === 'jump' || settings.settle <= 0) {
      setState(REST)
      onSwipe(direction)
      return
    }

    // Termina de salir y sólo entonces cambia, para que no vuelva hacia atrás.
    setState({ phase: 'settling', progress: -direction, duration: settings.settle, direction })
    schedule(() => {
      onSwipe(direction)
      setState(REST)
    }, settings.settle)
  }

  const onPointerCancel = () => {
    origin.current = null
    settleBack()
  }

  const drag: SwipeDrag = {
    motion,
    progress: state.progress,
    direction: state.direction,
    duration: state.duration,
    easing: EASING[motion],
    active: state.phase === 'dragging',
  }

  return {
    swipedRef,
    drag,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel },
  }
}

/** Amortigua el recorrido: cuanta más resistencia, antes se frena el arrastre. */
function damp(dx: number, width: number, resistance: number): number {
  if (resistance <= 0) return dx
  const limit = Math.max(1, width * (1 - resistance))
  return limit * Math.tanh(dx / limit)
}

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'

function subscribeReduced(listener: () => void): () => void {
  const query = window.matchMedia(REDUCED_QUERY)
  query.addEventListener('change', listener)
  return () => query.removeEventListener('change', listener)
}

function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  )
}
