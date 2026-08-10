'use client'

import { useEffect } from 'react'

/** Las flechas del teclado pasan de imagen, salvo mientras se escribe en un campo. */
export function useArrowKeys(step: (delta: number) => void): void {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      if (event.metaKey || event.ctrlKey || event.altKey) return

      const target = event.target
      if (
        target instanceof HTMLElement &&
        target.closest('input, textarea, select, [contenteditable]')
      ) {
        return
      }

      event.preventDefault()
      step(event.key === 'ArrowLeft' ? -1 : 1)
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [step])
}
