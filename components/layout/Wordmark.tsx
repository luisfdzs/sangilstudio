import { cn } from '@/lib/cn'

/**
 * Logotipo como texto, no como imagen: nítido a cualquier tamaño, pesa cero y es
 * legible por buscadores y lectores de pantalla. Reproduce la jerarquía del
 * wordmark del estudio — SANGIL en tinta, STUDIO en gris.
 *
 * Pendiente: si el estudio quiere el trazo exacto de su logo (con la "U"
 * invertida de STUDIO), se sustituye por un SVG inline manteniendo esta API.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-baseline gap-[0.42em] text-[0.95rem] leading-none tracking-[0.2em] uppercase',
        className,
      )}
    >
      {/* Hereda el color del contexto (cabecera sobre hero vs. sobre papel) y
          marca la jerarquía con opacidad, como en el wordmark del estudio. */}
      <span>Sangil</span>
      <span className="opacity-55">Studio</span>
    </span>
  )
}
