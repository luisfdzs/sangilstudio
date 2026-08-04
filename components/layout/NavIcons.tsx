/**
 * Los iconos del sitio: el «+» y el «−» que abren y cierran el menú de móvil, el globo
 * del selector de idioma y los tres del bloque de contacto (correo, web e Instagram).
 *
 * Van embebidos y no como `<img>` por una razón concreta: tienen que heredar el color
 * del texto (`stroke: currentColor`), y en la cabecera ese color cambia —papel sobre el
 * hero, tinta sobre fondo blanco—. Una imagen externa se quedaría de un color.
 *
 * Trazo a 1.25 en vez del 2 habitual de Lucide: esta web es blanco, filete de 1 px y
 * Montserrat en tamaños contenidos; un icono de trazo grueso pesaría más que la
 * tipografía que tiene al lado y rompería el gris de la página.
 *
 * Sin `title` ni `role`: el nombre accesible lo pone el enlace o el botón que los envuelve.
 */
type IconProps = { className?: string }

const common = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.25,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

/** «+»: abre el menú de móvil. Un signo, no tres rayas: es lo que pidió el estudio. */
export function PlusIcon({ className }: IconProps) {
  return (
    <svg {...common} aria-hidden className={className}>
      <path d="M12 4v16" />
      <path d="M4 12h16" />
    </svg>
  )
}

/** «−»: lo contrae. Es el mismo signo sin la barra vertical, y se lee como tal. */
export function MinusIcon({ className }: IconProps) {
  return (
    <svg {...common} aria-hidden className={className}>
      <path d="M4 12h16" />
    </svg>
  )
}

/** El globo del selector de idioma. Dos idiomas, y el sitio no bandera ninguno. */
export function GlobeIcon({ className }: IconProps) {
  return (
    <svg {...common} aria-hidden className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  )
}

/** Correo. Un sobre: aquí la consulta se resuelve escribiendo, no en un formulario. */
export function MailIcon({ className }: IconProps) {
  return (
    <svg {...common} aria-hidden className={className}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

/** Página web. El mismo globo del idioma valdría, pero en el bloque de contacto van
 *  los dos seguidos y hay que poder distinguirlos: éste lleva meridianos, no ecuador. */
export function WebIcon({ className }: IconProps) {
  return (
    <svg {...common} aria-hidden className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 9h18M3 15h18" />
      <path d="M12 3a13 13 0 0 1 0 18 13 13 0 0 1 0-18" />
    </svg>
  )
}

/** Instagram: el cuadrado redondeado con el objetivo y el punto del flash. */
export function InstagramIcon({ className }: IconProps) {
  return (
    <svg {...common} aria-hidden className={className}>
      <rect width="18" height="18" x="3" y="3" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </svg>
  )
}
