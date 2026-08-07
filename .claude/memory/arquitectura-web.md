---
name: arquitectura-web
description: Stack y patrones de arquitectura de la web (Next.js 15 + TS + Tailwind 4, i18n es/en, contenido en ficheros, pipeline de imágenes)
metadata:
  type: project
---

Decisiones de stack y arquitectura tomadas al arrancar la construcción de la web (**2026-07-25**),
implementadas en la rama `feature/web-foundation` (nacida de `test`).

## Stack elegido

- **Next.js 16 (App Router, Turbopack) + TypeScript estricto + Tailwind CSS 4**, desplegado en Vercel.
  (se arrancó en 15.5 y se subió a 16.2 el mismo día, ver «Next 16» más abajo).
- **zod** para validar el contenido en build. **sharp** para el pipeline de imágenes.
- Sin CMS, sin base de datos, sin dependencias de UI: React 19 + Tailwind y nada más.

**Por qué Next y no Astro ni HTML a mano** (razonamiento aceptado por el usuario):
`next/image` optimiza y cachea nativamente en Vercel sin configurar nada; el catálogo (14 obras +
17 concursos × 2 idiomas) hecho a mano sería inmantenible; y Next deja el techo abierto a
formulario, CMS o revalidación sin cambiar de arquitectura. Astro era una alternativa razonable
(menos JS por defecto) y se descartó por integración y recorrido, no por calidad.

## Decisiones de producto acordadas

- **Idiomas: español + inglés desde el día 1** (`/es`, `/en`), porque retrofitear rutas después es
  reescribir navegación, `hreflang` y sitemap.
- **Contenido en ficheros del repo** (TS validado con zod), no CMS. Reversible por diseño.
- **Imágenes optimizadas en `public/media/`** del repo (~31 MB), no Vercel Blob.

## Patrones aplicados (los cinco que importan)

1. **Puerta única al contenido** — ninguna página importa `content/` directamente; todas pasan por
   `lib/content.ts`. Migrar a un CMS = reescribir ese módulo, cero cambios en vistas.
2. **Estático primero** — 87 rutas prerrenderizadas en build (cifra a 2026-07-27; conviene leerla del
   build y no fiarse de la escrita, que se ha desfasado varias veces). El guardia es
   `generateStaticParams` + un `notFound()` en el layout de idioma: un locale que no sea es/en es un
   404, no un render en petición. **`dynamicParams = false` ya no se usa**: `cacheComponents` no lo
   admite. Lo único que corre en servidor es `proxy.ts` (antes `middleware.ts`), que negocia idioma.
3. **Tokens de diseño sólo en `app/globals.css`** (`@theme` de Tailwind 4): 6 colores, escala
   tipográfica fluida con `clamp()`, dos ejes de espaciado. Si no está ahí, no se usa.
4. **Toda imagen pasa por `<Media>`** (`components/ui/Media.tsx`): dimensiones reales del manifiesto
   (CLS = 0), placeholder difuminado y `sizes` obligatorio. Una sola imagen con `priority` por
   página (la del LCP).
5. **Animación sin JS** — apariciones con `animation-timeline: view()` (utilidad `reveal`) y
   `prefers-reduced-motion` respetado. Sólo 2 componentes de cliente en todo el sitio.

## Estructura de la web (reescrita en el rediseño del 2026-08-04)

Páginas de verdad: **home**, **`work`** (índice), **`work/[slug]`** (ficha) y **`studio`**. Rutas
neutras centralizadas en `lib/i18n/routes.ts`. Las URLs **no cambiaron** con el rediseño, por decisión
expresa del usuario: la ficha sigue en `/es/work/slug` aunque las notas la llamaran `/proyectos`.

**La portada son dos bloques y nada más**: el hero (imágenes fundiéndose, enlace a `/work`) y el
contacto. Se fueron la rejilla de obra seleccionada y el bloque de estudio, que pasó a página propia.

**Contacto sigue siendo una sección con URL de ruta** (`/es/contact`, con barra y no con almohadilla).
La sirve un segmento dinámico `app/(site)/[locale]/[section]/page.tsx` que devuelve la **misma
portada** —extraída a `HomeContent.tsx`, que comparten las dos rutas— y coloca la vista en la sección
con `components/ui/ScrollToSection.tsx`. `work` y `studio` son estáticos y por eso tienen prioridad
sobre `[section]`; cualquier otro segmento no está en el mapa y da 404.

Al ser la misma página con dos direcciones, hay dos consecuencias que **no** se pueden olvidar: el
**canonical apunta a `/es`** (se hereda del layout de idioma, no se declara en la página) y la sección
**no entra en el sitemap**. `routes.ts` mantiene `routes` y `sections` separados justo para eso —no por
la forma del enlace, que es igual—, y `isSection()` es lo que distingue «página propia» de «vista de la
portada».

Al colocar una sección enlazable, el hueco de separación va **fuera** del elemento con `id` (envoltorio
con `pt-(--spacing-section)`): dentro, el navegador alinea el borde superior del elemento y ese hueco
deja asomando la sección anterior bajo la barra. Un `scroll-mt-8` en la sección la despega de la barra
fija; suma al `scroll-padding-top: 6rem` de `globals.css`. El encabezado cae a **128 px** (96 de
`scroll-padding` + 32 de `scroll-mt`), verificado a 390 px y 1920 px.

**Dos trampas medidas, las dos del mismo sitio:**

1. **Las fuentes mueven la página después del salto.** Van con `display: swap`, así que al llegar
   Montserrat cambian los altos de todo el texto de encima y la sección se desplaza **más de 50 px**.
   Colocar la vista una sola vez dejaba el encabezado **tapado por la barra** (72 px con una barra de
   96). Por eso `ScrollToSection` recoloca cuando `document.fonts.ready` resuelve, y sólo si el
   visitante no ha movido la página por su cuenta.
2. **Una sección corta al final de la página no puede subir hasta arriba.** El navegador no inventa
   recorrido: si por debajo de la sección no hay página suficiente, se queda a media pantalla por
   mucho que se le pida. Pasó con el contacto (se quedaba en 408 px de 200 admisibles) y se resuelve
   dándole **`min-h-[100svh]`**, con el contenido **arriba** y no centrado —centrarlo lo empujaba
   200 px y reproducía el fallo—. Lo cazó `npm run check:mobile`; la comprobación sigue en el script.

## Componentes de cliente (son cuatro, y cada uno tiene su motivo)

`Header` (scroll, ruta activa, menú de móvil), `Hero` (el temporizador del fundido),
`ProjectSearchGrid` (el buscador filtra mientras se escribe) y `ScrollToSection`. Todo lo demás es
servidor.

El buscador filtra **en el navegador**, no en el servidor: son unas decenas de proyectos y ya vienen
todos en la página; consultar al servidor en cada tecla sería más lento y **obligaría a renderizado
dinámico**, con lo que la web dejaría de ser estática por un campo de búsqueda.

**Dos detalles del menú de móvil que ya rompieron algo una vez** (ver [[verificacion-y-despliegue]]):
el panel se dibuja **fuera del `<header>`** —el `backdrop-blur` convierte al header en bloque
contenedor de sus descendientes `fixed` y el panel medía 0 px de alto—, y con el menú abierto
`data-top` pasa a `false`, porque si no la regla que pinta la barra en color papel sobre el hero
dejaba el «−» blanco sobre el panel blanco.

## Next 16 y despliegue en Vercel (2026-07-25)

- **El framework se declara en `vercel.json`** (`"framework": "nextjs"`), no en el panel. Los dos
  proyectos siguen con `framework: null` (preset _Other_, herencia de la landing estática); el
  `vercel.json` tiene prioridad, se versiona y vale para los dos entornos. No hace falta tocar Vercel.
- ⚠️ **`vercel build` NO funciona en Windows con este proyecto**: falla con
  `Unable to find lambda for route: /en/...`. Es un bug del builder `@vercel/next`, que crea las
  claves de funciones con `path.join` (Windows → `[locale]contact`) y las busca con
  `path.posix.join` (`/[locale]/contact`). En Linux (los servidores de Vercel) coinciden. Se comprobó
  leyendo el código del builder; **no es un problema de la web**. Validar en local con `npm run build`
  y el despliegue con un preview real. No perder tiempo depurándolo otra vez.
- **Cambios que trajo la subida a Next 16**: `middleware.ts` → **`proxy.ts`** (export `proxy`, runtime
  nodejs); `images.qualities` es lista blanca (declaradas 75 y 82); `eslint-config-next` ya es flat
  config (fuera `FlatCompat` y `@eslint/eslintrc`); `eslint` fuera de `next.config`;
  `data-scroll-behavior="smooth"` en `<html>` para conservar el scroll instantáneo al navegar.
- **Ventaja concreta**: `next dev` escribe en `.next/dev` y `next build` en `.next`, así que ya se
  puede construir con el servidor de desarrollo levantado (antes rompía el dev con 500 en todo).

## Detalles operativos que conviene no olvidar

- El framework va en `vercel.json` (ver arriba). Ver también [[despliegue-vercel]].
- **El entorno de test emite `noindex` + `robots: disallow`** automáticamente cuando
  `VERCEL_ENV !== 'production'`, para no competir en Google con sangilstudio.com.
- `npm run check` = typecheck + ESLint + Prettier, antes de cada commit. Prettier configurado al
  estilo del proyecto (`.prettierrc.json`: sin punto y coma, comillas simples, 100 columnas).
- `npm run brand` regenera favicon, icono iOS y la imagen de compartir desde `LOGO REDES/`. La marca
  usada es la **"S" del wordmark** recortada de `LINKEDIN.png`; se descartó `sss+ S.jpg` (la S hecha
  de "s" pequeñas) porque a 16 px es una mancha.
- **Accesibilidad**: utilidad `tap` en `globals.css` para que los enlaces pequeños lleguen a los
  24 px de área pulsable que pide WCAG 2.2 sin alterar el diseño (crece un pseudo-elemento invisible).
- **Verificación móvil**: hay un script de Playwright fuera del repo (scratchpad de la sesión) que
  abre Chrome a 390×844 y comprueba menú, bloqueo de scroll, desbordes y áreas pulsables. Reproducir
  con `playwright-core` + el Chrome instalado (sin descargar navegadores) si hace falta otra vez.
- Vulnerabilidades de `npm audit`: todas en dependencias de desarrollo (postcss, minimatch de
  eslint, libvips de sharp). No van al bundle del usuario y no hay fix sin romper; revisar al subir
  de versión de Next.

## Pendiente de validar con el estudio

- El **email de contacto** del contexto (`sangil@studio.com`) parece erróneo.
- **Textos de proyecto**: primer borrador redactado por Claude a partir de tipología/ubicación/año;
  los autores deben revisarlos.
- **Curaduría de imágenes**: primera propuesta en `scripts/curation.mjs`.
- Las carpetas **06 y 11 son el mismo proyecto** (IS House): unificadas en una ficha.
- El **logo** es hoy un wordmark tipográfico; si se quiere el trazo exacto, sustituir por SVG.

Relacionado: [[diseno-web-referencias]], [[proyectos-y-assets]], [[despliegue-vercel]], [[flujo-git-y-ramas]].
