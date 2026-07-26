import type { Metadata, Viewport } from 'next'
import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'
import { ConnectionNotice } from '../ConnectionNotice'

/**
 * El panel de administración completo, servido desde la propia web en `/admin`.
 *
 * Se monta en una ruta comodín (`[[...tool]]`) porque Sanity gestiona su propia
 * navegación por debajo de esa dirección. Quien entra sin sesión ve la pantalla de
 * acceso de Sanity: el contenido sólo se puede leer o cambiar con una cuenta invitada.
 */
export const metadata: Metadata = {
  title: 'Administración · Sangil Studio',
  // El panel nunca debe aparecer en buscadores.
  robots: { index: false, follow: false },
}

/** Ventana que necesita el panel para funcionar bien en móvil y tablet. */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  interactiveWidget: 'resizes-content',
}

export default function AdminPage() {
  return (
    <>
      <NextStudio config={config} />
      {/* Si la conexión en tiempo real está bloqueada, explica por qué en vez de dejar
          el panel girando sin decir nada. Ver ConnectionNotice.tsx. */}
      <ConnectionNotice />
    </>
  )
}
