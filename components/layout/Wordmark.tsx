import {
  SANGIL_PATH,
  STUDIO_OPACITY,
  STUDIO_PATH,
  STUDIO_TRANSFORM,
  VIEW_BOX,
} from '@/lib/brand/wordmark'
import { cn } from '@/lib/cn'

/**
 * Wordmark del estudio, en el montaje **horizontal**: STUDIO a la derecha de SANGIL y
 * compartiendo línea base. Antes iba debajo, apilado, y eso obligaba a la cabecera a
 * reservar una franja alta y estrecha; en horizontal la marca ocupa el sitio que le
 * sobra a una barra de 80 px y deja de competir con el menú.
 *
 * Los trazos y la geometría de los dos montajes están en `lib/brand/wordmark.ts`, que es
 * también de donde salen los dos ficheros .svg del archivo maestro (`npm run wordmark`).
 * Aquí sólo se elige el montaje.
 *
 * **Por qué sigue siendo SVG en línea y no `<img src="…svg">`:** `fill="currentColor"`.
 * La cabecera es transparente sobre el hero (letras en papel) y pasa a fondo papel al
 * bajar (letras en tinta), y eso se consigue heredando el color del contexto. Un fichero
 * externo no hereda nada: haría falta duplicarlo en dos colores y cambiarlo por CSS.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <svg
      viewBox={VIEW_BOX.horizontal}
      className={cn('w-auto', className)}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path fillRule="evenodd" d={SANGIL_PATH} />
      <g transform={STUDIO_TRANSFORM.horizontal} opacity={STUDIO_OPACITY}>
        <path fillRule="evenodd" d={STUDIO_PATH} />
      </g>
    </svg>
  )
}
