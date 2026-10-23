'use client'

import { useCallback, useState } from 'react'

/**
 * Qué fotos han terminado de cargar, para que aparezcan con un fundido en vez
 * de saltar de golpe. Las que ya estaban en la caché cuentan como cargadas
 * antes de pintarse, así que no repiten el fundido al volver a una página.
 */
export function useLoaded(initial: () => Iterable<string> = () => []) {
  const [loaded, setLoaded] = useState<ReadonlySet<string>>(() => new Set(initial()))

  const mark = useCallback(
    (id: string) => setLoaded((current) => (current.has(id) ? current : new Set(current).add(id))),
    [],
  )

  const track = useCallback(
    (id: string) => ({
      ref: (img: HTMLImageElement | null) => {
        if (img?.complete && img.naturalWidth > 0) mark(id)
      },
      onLoad: () => mark(id),
    }),
    [mark],
  )

  return { loaded, track }
}
