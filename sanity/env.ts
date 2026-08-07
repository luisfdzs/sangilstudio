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

export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2026-07-25'
