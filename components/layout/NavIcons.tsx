/**
 * Los iconos de navegación: los cinco huecos de la barra inferior de móvil y el globo
 * que encabeza el selector de idioma en escritorio.
 *
 * Van embebidos y no como `<img>` por una razón concreta: dentro de la barra el icono
 * tiene que heredar el color del texto (`stroke: currentColor`), y en la cabecera ese
 * color cambia —papel sobre el hero oscuro, tinta sobre fondo claro—. Una imagen externa
 * se quedaría de un color.
 *
 * Trazo a 1.25 en vez del 2 habitual de Lucide: esta web es papel, filete de 1 px y una
 * serif editorial; un icono de trazo grueso pesaría más que la tipografía que tiene al
 * lado y rompería el gris de la página.
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

/** Inicio. En escritorio ese papel lo hace el wordmark; en la barra de móvil, esto. */
export function HomeIcon({ className }: IconProps) {
  return (
    <svg {...common} aria-hidden className={className}>
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  )
}

/**
 * Proyectos: la rejilla. No una cámara ni una carpeta —la obra se enseña como una
 * retícula de imágenes, y el icono repite literalmente lo que hay al otro lado del toque.
 */
export function WorkIcon({ className }: IconProps) {
  return (
    <svg {...common} aria-hidden className={className}>
      <rect x="3" y="3" width="7.5" height="7.5" rx="1" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1" />
    </svg>
  )
}

/**
 * Estudio: el alzado de un edificio con su cuerpo bajo. Un estudio de arquitectura se
 * dibuja con lo que proyecta, no con un icono de oficina.
 */
export function StudioIcon({ className }: IconProps) {
  return (
    <svg {...common} aria-hidden className={className}>
      <path d="M3 21h18" />
      <path d="M6 21V5a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v16" />
      <path d="M15 21v-9h3a2 2 0 0 1 2 2v7" />
      <path d="M9.5 7h2M9.5 11h2M9.5 15h2" />
    </svg>
  )
}

/**
 * Contacto. Un sobre y no un bocadillo: aquí la consulta se resuelve por correo o por
 * teléfono —no hay formulario ni chat— y el sobre promete exactamente eso.
 */
export function ContactIcon({ className }: IconProps) {
  return (
    <svg {...common} aria-hidden className={className}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
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

export function CloseIcon({ className }: IconProps) {
  return (
    <svg {...common} aria-hidden className={className}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
