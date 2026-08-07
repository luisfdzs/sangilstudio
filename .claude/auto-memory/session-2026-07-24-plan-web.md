# Sesión 2026-07-24 (9) — Dirección de diseño + estrategia de imágenes (cierre del día)

**Autor:** luisfdzs (luisfsangil@gmail.com) vía Claude.

## Qué se habló

- **README** alineado por el usuario en las ramas de código: apunta a la rama `claude` para el contexto
  y `/retomar`, y sección de despliegue corregida a Vercel.
- **Referencias de la web** (dadas por el usuario): https://noarchitects.es/ y
  https://dsarchitecture.co.uk/ — se miraron; patrón minimalista con fotografía protagonista (hero
  grande/pantalla completa, proyectos como imágenes grandes con fade-in). Sirven de referencia, no para
  copiar. Libertad total a Claude para hacerla mejor. → memoria `diseno-web-referencias`.
- **Estrategia de imágenes** (el ZIP de 1,7 GB): es el archivo maestro; backup en Drive + disco externo,
  fuera de git; la web usa derivados optimizados. → añadido a `proyectos-y-assets`.

## Estado al cerrar

- **Configuración de entornos y contexto: COMPLETA** (GitHub, cuenta `luisfdzs`/`gh`, dos entornos
  Vercel con dominio en IONOS, memoria y skill `/retomar` en rama `claude`).
- **La web en sí: sin construir todavía** (solo landing "en construcción").

## Siguiente sesión (mañana)

1. Decidir stack (previsto Next.js en Vercel) y **diseñar/maquetar** la web (minimalista, fotografía
   protagonista) mejorando las referencias.
2. Backup del ZIP a Drive + disco externo (usuario).
3. Curar y **optimizar imágenes** (script sharp → WebP/AVIF) e integrarlas (repo `/public` o Vercel Blob).

## Pendientes sueltos (usuario)

- Backup del ZIP `IMAGENES PROYECTOS.zip` (Drive + disco externo).
- Códigos 2FA: regenerarlos en la cuenta correcta y guardarlos en gestor de contraseñas (ahora en
  `.env.local`, gitignored).
