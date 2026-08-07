# Sesión 2026-07-25 (10) — Arranque de la web: stack decidido y andamiaje construido

**Autor:** luisfdzs (luisfsangil@gmail.com) vía Claude.
**Rama de trabajo:** `feature/web-foundation`, nacida de `test` (morirá en `test`).

## Qué se decidió

El usuario pidió arrancar la web y aceptó la recomendación de stack tras pedir el razonamiento:

- **Next.js 15 (App Router) + TypeScript + Tailwind CSS 4** en Vercel. Descartados Astro (buena
  opción, pero menos integración con `next/image`/Vercel y menos recorrido para formulario/CMS) y
  HTML a mano (inmantenible con 14 obras + 17 concursos × 2 idiomas).
- **Bilingüe es/en desde el día 1** (`/es`, `/en`) — retrofitearlo sería reescribir rutas y SEO.
- **Contenido en ficheros del repo** validado con zod, con puerta única de acceso para poder migrar
  a CMS sin tocar vistas.
- **Imágenes optimizadas en `public/media/`** del repo (no Vercel Blob).

Detalle y razonamiento completo en la memoria `arquitectura-web`.

## Qué se construyó (funcionando, build limpio)

- Proyecto Next completo: `app/[locale]/` con **home** (hero `100svh` + manifiesto + grid alterno),
  **work** (índice + ficha con portada 21:9, ficha técnica, memoria, galería, planos y
  anterior/siguiente), **competitions** (índice tabular denso), **studio**, **contact** (contacto
  directo, sin formulario), 404, `sitemap.ts` y `robots.ts` generados del contenido.
- **Sistema de diseño** en `app/globals.css`: 6 colores (papel `#f4f2ee`, tinta `#14140f`…), escala
  tipográfica fluida, Instrument Serif + Instrument Sans autoalojadas.
- **Capa de contenido**: 14 proyectos y 17 concursos en `content/`, esquemas zod, `lib/content.ts`.
- **Pipeline de imágenes**: `scripts/curation.mjs` + `npm run images` → **78 derivados WebP (~31 MB)**
  y `content/media-manifest.json` con dimensiones + placeholder difuminado.
- **Resultado del build:** 43 páginas estáticas, ~103 kB de JS de primera carga, sólo el middleware
  de idioma corre en servidor. `npm run check` (typecheck + lint) limpio.
- `.gitignore` reforzado: `IMAGENES PROYECTOS/` y `LOGO REDES/` (además del ZIP) fuera del repo.
- Landing anterior movida a `docs/legacy-landing/`; README reescrito.

## Comprobado en navegador (dev)

Se revisó en Chrome y se corrigieron **tres fallos reales**: navegación sin contraste sobre el hero
(resuelto con `:has()` y jerarquía por opacidad, sin JS), `col-span` aplicado a la tarjeta en vez del
hijo del grid (las piezas anchas no ocupaban dos columnas) y portada de ficha que no llegaba a
sangre (conflicto entre altura fija y `aspect-ratio`).

## Cierre del andamiaje (segunda parte de la sesión)

El usuario pidió cerrar tres cosas antes de mergear: móvil, favicon/OG y el framework de Vercel.

- **Móvil verificado de verdad** con Playwright + el Chrome instalado a 390×844 (la herramienta de
  redimensionar ventana no funcionaba porque estaba maximizada). 14 comprobaciones en verde tras
  corregir: menú blanco sobre papel, panel de 0 px de alto por el `backdrop-blur` del header, y áreas
  pulsables por debajo de 24 px.
- **Marca**: favicon + icono iOS + OG con `npm run brand`.
- **Vercel**: framework en `vercel.json`; `vercel build` local descartado por bug del builder en
  Windows.
- **Next 16.2** y Prettier incorporados; ver `arquitectura-web`.
- **Correcciones del usuario**: Instagram `@sangilstudio`; **Yago siempre primero**.

## Últimos arreglos antes del merge

Alts curados para las 78 imágenes (vistos, no inventados), tarjeta OG neutra de idioma,
`npm run check:mobile` incorporado al repo (17 comprobaciones) y las dos reglas nuevas en
`CLAUDE.md` + memoria `verificacion-y-despliegue`.

## Pendientes

**Del estudio (bloquean publicar):** validar el **email de contacto** (el del contexto parece
erróneo), revisar los **textos** de proyecto (borrador de Claude) y la **curaduría de imágenes**.

**Técnicos:** validar el build en un **preview real de Vercel** (en Windows no se puede); decidir
formulario de contacto (implica antispam + aviso legal y privacidad); merge de
`feature/web-foundation` → `test` y QA/UAT de Yago. Framework y assets de marca: **hechos**.

**Del usuario, sueltos:** backup del ZIP (Drive + disco externo), regenerar los códigos 2FA,
confirmar el email de contacto y **facilitar el logotipo en vectorial (SVG/AI)** para sustituir la
aproximación tipográfica del encabezado.
