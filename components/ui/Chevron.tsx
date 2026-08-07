/**
 * El chevron de la web: UNA línea, sin punta rellena y sin filete de acompañamiento.
 *
 * Lo eligió el estudio de entre cinco opciones (ver `diseno-web-referencias`) y se usa en
 * los tres sitios donde hay algo que pasar o de donde volver: las flechas de la portada,
 * las de la ficha y la barra de volver a proyectos. Vive aquí para que sigan siendo el
 * mismo dibujo: si engorda el trazo en uno, engorda en todos.
 *
 * `vector-effect` mantiene el grosor en 1,25 px sea cual sea el tamaño de la caja.
 */
export function Chevron({
  direction,
  className = 'h-9 w-[1.125rem]',
}: {
  direction: 'left' | 'right'
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 20 40"
      fill="none"
      aria-hidden="true"
      className={`${className} overflow-visible`}
    >
      <path
        d={direction === 'left' ? 'M15 4 5 20l10 16' : 'M5 4l10 16L5 36'}
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
