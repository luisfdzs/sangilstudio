/**
 * Layout raíz del panel de administración.
 *
 * El sitio público tiene su propio layout raíz en `app/(site)/[locale]/layout.tsx` (con
 * el idioma en la URL). El panel no lleva idioma ni cabecera ni tipografías del sitio,
 * así que vive en otro grupo de rutas con su propio `<html>`: Next admite varios
 * layouts raíz siempre que no exista uno en la raíz de `app/`.
 */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}
