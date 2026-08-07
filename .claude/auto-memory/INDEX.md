# INDEX.md — Auto-memorias (SANGIL STUDIO)

Registro automático del proyecto. Estos archivos los mantiene Claude sin intervención manual.

- [CHANGELOG.md](CHANGELOG.md) — historial cronológico de cambios del proyecto
- [session-2026-07-24.md](session-2026-07-24.md) — sesión 1: infraestructura de contexto
- [session-2026-07-24-reglas.md](session-2026-07-24-reglas.md) — sesión 2: reglas de proyecto y Git
- [session-2026-07-24-repo.md](session-2026-07-24-repo.md) — sesión 3: repo creado, web en producción, modelo de ramas afinado
- [session-2026-07-24-cuenta-gh.md](session-2026-07-24-cuenta-gh.md) — sesión 5: cuenta personal `luisfdzs` como única del repo (helper gh) + primer push real de `main` y `claude`
- [session-2026-07-24-vercel.md](session-2026-07-24-vercel.md) — sesión 6: despliegue en Vercel sirviendo la rama `test` como producción
- [session-2026-07-24-entornos-vercel.md](session-2026-07-24-entornos-vercel.md) — sesión 7: dos entornos Vercel (prod=`main`/`sangilstudio.com`, test=`test`) + migración de Netlify a Vercel
- [session-2026-07-24-plan-web.md](session-2026-07-24-plan-web.md) — sesión 9: dirección de diseño de la web (referencias) + estrategia de imágenes; cierre del día
- [session-2026-07-25-andamiaje-web.md](session-2026-07-25-andamiaje-web.md) — sesión 10: stack decidido (Next.js 15 + TS + Tailwind 4) y **andamiaje de la web construido** en `feature/web-foundation`
- sesión 12 (ajustes estéticos): manifiesto de la home **centrado** en escritorio — ver [CHANGELOG.md](CHANGELOG.md)

- [session-2026-07-25-panel-y-cache.md](session-2026-07-25-panel-y-cache.md) — cierre del día: panel de
  administración, migración al CMS, los dos fallos de caché y el listado que no cargaba
- [session-2026-07-26-secciones-portada.md](session-2026-07-26-secciones-portada.md) — estudio y
  contacto dejan de ser páginas y pasan a ser secciones de la portada (`feature/secciones-home`)
- [session-2026-07-27-urls-secciones.md](session-2026-07-27-urls-secciones.md) — las secciones pasan a
  tener **URL de ruta** (`/es/studio`, no `/es#studio`) sin dejar de ser la portada
  (`feature/urls-secciones`, ya mergeada)
- [session-2026-08-04-rediseno-notas-yago.md](session-2026-08-04-rediseno-notas-yago.md) —
  **rediseño completo** con las trece notas del estudio (`feature/rediseno-notas-yago`, mergeada en
  `develop` y `test`)

## Estado del proyecto (última foto)

- **Fecha:** 2026-08-04
- **Repo:** https://github.com/luisfdzs/sangilstudio
- **Fase:** web **rediseñada de arriba abajo** con las trece notas del estudio y publicada en
  `develop` y `test` (→ https://sangilstudiotest.vercel.app, con `noindex`). En **producción sigue la
  landing "en construcción"**: `main` no se ha tocado. `claude` = contexto (huérfana), desarrollo en
  `test`.
- **Despliegue:** **Vercel**, dos entornos que redespliegan por push:
  - Prod: proyecto `sangilstudio`, rama **`main`** → `sangilstudio.vercel.app` + **`sangilstudio.com`**.
  - Test: proyecto `sangilstudiotest`, rama **`test`** → `sangilstudiotest.vercel.app`.
  - DNS del dominio en **IONOS**; producción migrada de Netlify a Vercel. Ver memoria `despliegue-vercel`.
- **Cuenta del repo:** única cuenta activa Git/gh = **`luisfdzs`** (personal); auth vía `gh` sin
  tokens manuales. Ver memoria `cuenta-git-gh`.
- **Stack (confirmado):** Next.js 16 App Router (Turbopack) + TypeScript + Tailwind CSS 4 + zod.
  Estática, con `cacheComponents` para poder invalidar por etiquetas. Ver `arquitectura-web`.
- **Contenido: Sanity** (proyecto `d88iemmi`), editable por el estudio en **`/admin`**. Publicar se
  ve en la web en **11 segundos** (medido). Yago invitado como Administrator. Ver
  `panel-administracion`, que incluye los dos fallos de caché que costaron el rato.
- **Diseño (rediseñado el 2026-08-04):** blanco puro, **Montserrat como única tipografía**, márgenes
  laterales amplios (referencia paredespedrosa.com), **portada de dos bloques** —hero de imágenes
  fundiéndose + contacto—, estudio con página propia, rejilla de tres columnas con fotos cuadradas y
  buscador en vivo, ficha reducida a datos + imágenes, menú de móvil con «+» a pantalla completa y
  **sin pie de página**. Ver memoria `diseno-web-referencias`, que marca lo anterior como histórico.
- **Imágenes:** ZIP de 1,7 GB = archivo maestro (backup Drive+disco, fuera de git); pipeline propio
  (`npm run images`) → **78 derivados WebP, ~31 MB** en `public/media/`. Ver `proyectos-y-assets`.
- **Ramas (2026-08-04):** **no queda ninguna rama temporal**, ni local ni en el remoto. En el remoto
  sólo `main`, `develop`, `test` y `claude`. `feature/rediseno-notas-yago` se mergeó en `develop`
  (`ab4a3ad`) y de ahí a `test` (`b4b8de3`), y se borró con su worktree. Worktrees vivos:
  `C:/Proyectos/sangilstudio` (`develop`) y **`.claude/worktrees/claude`** (`claude`) — el de contexto
  se mudó ahí porque el anterior, fuera del repo, se perdió y con él la sesión 16.
- **Producción congelada a propósito:** `develop` y `test` van muy por delante de `main`, que sigue
  con la landing "en construcción". Decisión del usuario: **no promocionar a producción por ahora**.
- **Siguiente sesión / pendiente del estudio:** en `/admin`, **elegir los proyectos de la portada**
  (mientras esté vacío se usan los destacados) y **guardar los datos de contacto** para que dejen de
  venir de la reserva del código. Después, QA/UAT de Yago sobre `sangilstudiotest.vercel.app`.
- **Pendiente (usuario):** backup del ZIP (Drive + disco externo); regenerar y guardar los códigos 2FA
  (ahora en `.env.local`, gitignored); **logotipo en vectorial** (ver `pendientes-estudio`). El email
  de contacto ya está confirmado y publicado: `sangil@sangilstudio.com`.
- **Última sesión:**
  [session-2026-08-04-rediseno-notas-yago.md](session-2026-08-04-rediseno-notas-yago.md) — rediseño
  completo con las trece notas del estudio, mergeado en `develop` y `test`. `npm run check` limpio,
  build 88/88 y `check:mobile` **35/35**.
- **Al abrir un worktree nuevo** nace **sin `node_modules` ni `.env.local`**: hay que `npm install` y
  copiar el `.env.local` de la carpeta principal para poder hacer build. Y al borrarlo, si hay un
  `next dev` levantado, `git worktree remove` falla dejando la carpeta a medias: parar el servidor
  primero.
