import { RotateIcon } from '@/components/layout/NavIcons'
import type { Dictionary } from '@/lib/i18n/dictionaries'

/**
 * Con el móvil tumbado, la web no se ve: se tapa con este aviso.
 *
 * La web está pensada en vertical, y en un móvil tumbado no hay alto para nada
 * (una pantalla de 390 px de alto se queda en menos de 200 para la foto una vez
 * puestas la cabecera y la barra). En vez de mantener dos diseños, aquí sólo se
 * ofrece el vertical.
 *
 * No es un bloqueo de verdad —una página web no puede fijar la orientación:
 * la `Screen Orientation API` sólo bloquea a pantalla completa y en Android, e
 * iOS no la implementa—, pero el efecto para quien mira es el mismo.
 *
 * La condición está en la variante `lying` de globals.css: pantalla baja y dedo
 * en vez de ratón, para que no salte en una ventana de ordenador achatada. La
 * excepción son las fotos de un proyecto: mientras el visor está abierto este
 * aviso no aparece, porque ahí el horizontal sí se aprovecha.
 */
export function RotateNotice({ dictionary }: { dictionary: Dictionary }) {
  return (
    <div
      data-rotate
      role="alert"
      className="page-gutter fixed inset-0 z-70 hidden flex-col items-center justify-center gap-5 bg-paper text-center lying:flex"
    >
      <RotateIcon className="h-10 w-10 text-ink-soft" />
      <p className="text-micro tracking-[0.12em] uppercase">{dictionary.nav.rotate}</p>
    </div>
  )
}
