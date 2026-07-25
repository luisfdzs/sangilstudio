/**
 * ¿Este despliegue debe aparecer en Google?
 *
 * **Sólo la rama `main`.** Y se decide por la rama, no por `VERCEL_ENV`, porque el
 * proyecto de test (`sangilstudiotest`) despliega la rama `test` **como su propio
 * entorno de producción**: allí `VERCEL_ENV === 'production'` también. Usar esa
 * variable dejaba `sangilstudiotest.vercel.app` con `index, follow` y
 * `Allow: /` — es decir, compitiendo en Google con sangilstudio.com por el mismo
 * contenido. Pasó, y se detectó revisando el entorno de test ya publicado.
 *
 * `VERCEL_GIT_COMMIT_REF` trae la rama desplegada y no hay que configurar nada:
 *
 *   proyecto `sangilstudio`      rama `main`  → indexable
 *   proyecto `sangilstudiotest`  rama `test`  → NO indexable
 *   previews de cualquier rama                → NO indexable
 *   desarrollo local (sin variables)          → NO indexable
 *
 * Falla del lado seguro: si mañana falta la variable, no se indexa.
 */
export const INDEXABLE_BRANCH = 'main'

export function isIndexable(): boolean {
  return (
    process.env.VERCEL_ENV === 'production' &&
    process.env.VERCEL_GIT_COMMIT_REF === INDEXABLE_BRANCH
  )
}
