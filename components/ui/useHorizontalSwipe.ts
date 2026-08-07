'use client'

import { useRef } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'

const SWIPE_MIN_PX = 44

export function useHorizontalSwipe(onSwipe: (delta: number) => void) {
  const origin = useRef<{ x: number; y: number } | null>(null)
  const swipedRef = useRef(false)

  const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse') return
    origin.current = { x: event.clientX, y: event.clientY }
    swipedRef.current = false
  }

  const onPointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    const start = origin.current
    origin.current = null
    if (!start) return

    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) <= Math.abs(dy)) return

    swipedRef.current = true
    onSwipe(dx < 0 ? 1 : -1)
  }

  const onPointerCancel = () => {
    origin.current = null
  }

  return { swipedRef, handlers: { onPointerDown, onPointerUp, onPointerCancel } }
}
