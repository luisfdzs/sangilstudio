/**
 * Datos de conexión con Sanity.
 *
 * `projectId` y `dataset` **no son secretos** (van en el HTML de cualquier web con
 * Sanity), así que viven en variables públicas. El token de escritura sí lo es: sólo
 * se usa en el script de migración, se lee de `.env.local` y nunca llega al navegador.
 */

function required(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(
      `[sanity] Falta la variable de entorno ${name}.\n` +
        `Copia .env.example a .env.local y rellénala con los datos del proyecto de Sanity ` +
        `(los ves en https://sanity.io/manage).`,
    )
  }
  return value
}

export const projectId = required(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
)

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

/** Fecha de la API: se fija para que Sanity no cambie de comportamiento por su cuenta. */
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2026-07-25'
