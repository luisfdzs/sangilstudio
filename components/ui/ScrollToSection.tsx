'use client'

import { useEffect } from 'react'

export function ScrollToSection({ id }: { id: string }) {
  useEffect(() => {
    const target = document.getElementById(id)
    if (!target) return

    let placed = -1
    let cancelled = false

    const place = () => {
      target.scrollIntoView({ behavior: 'instant' })
      placed = Math.round(window.scrollY)
    }

    place()

    void document.fonts.ready.then(() => {
      if (!cancelled && Math.round(window.scrollY) === placed) place()
    })

    return () => {
      cancelled = true
    }
  }, [id])

  return null
}
