'use client'

import { useEffect } from 'react'

/**
 * Deja la vista en una sección de la portada al entrar por su ruta (`/es/studio`).
 *
 * Las secciones tienen dirección propia pero no página propia: la ruta devuelve la
 * portada completa, así que lo único que falta es la posición. Eso no lo hace el
 * navegador —no hay almohadilla que seguir— y tampoco `<Link scroll>`, que sólo sabe
 * ir arriba o quedarse quieto.
 *
 * El salto es EN SECO, igual llegando desde el menú que abriendo el enlace de cero.
 * Un desplazamiento suave tiene sentido en un ancla, donde la dirección no cambia y
 * hay que dar a entender que se sigue en la misma página; aquí la dirección sí cambia,
 * y quien ha pedido `/es/contact` no quiere ver antes toda la portada desfilando. Que
 * se comporte como una navegación es justo lo que promete la URL. De paso, no hay que
 * decidir nada sobre `prefers-reduced-motion`: sin animación no hay qué reducir.
 *
 * Va en `useEffect` y no en un efecto de layout a propósito: el router de Next
 * reposiciona la ventana en un efecto de layout al cambiar de ruta, y los pasivos
 * corren después, así que esto tiene la última palabra.
 */
export function ScrollToSection({ id }: { id: string }) {
  useEffect(() => {
    const target = document.getElementById(id)
    if (!target) return

    // Posición prevista tras el último salto. Sirve para saber si el visitante ha
    // movido la página por su cuenta entre medias: si la ha movido, no se le quita.
    let placed = -1
    let cancelled = false

    const place = () => {
      // El desplazamiento respeta `scroll-padding-top` del `html` y el `scroll-mt` de
      // la sección (globals.css y las propias secciones), así que el encabezado queda
      // despegado de la barra fija en vez de debajo.
      target.scrollIntoView({ behavior: 'instant' })
      placed = Math.round(window.scrollY)
    }

    place()

    /**
     * Y otra vez cuando las fuentes estén listas.
     *
     * Van con `display: swap` (ver el layout de idioma): el primer pintado usa la
     * tipografía del sistema y al llegar Montserrat cambian los altos de todo el texto
     * que hay por encima. Con la portada entera por medio eso movía la sección más de
     * 50 px, y el salto —que ya había ocurrido— dejaba el encabezado tapado por la
     * barra. Medido en `/es/contact` a 1920×855: caía en 72 px teniendo la barra 96.
     *
     * Sólo se recoloca si la página sigue donde la dejamos. En una navegación dentro
     * del sitio las fuentes ya están cargadas y esto se resuelve al instante, sin
     * segundo salto que valga.
     */
    void document.fonts.ready.then(() => {
      if (!cancelled && Math.round(window.scrollY) === placed) place()
    })

    return () => {
      cancelled = true
    }
  }, [id])

  return null
}
