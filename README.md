# Sangil Studio — Web del estudio

Web de portfolio de **Sangil Studio**, estudio de arquitectura en Pamplona (Navarra).
Next.js 16 (App Router) + TypeScript + Tailwind CSS 4, desplegada en Vercel.

🌐 **Producción:** [sangilstudio.com](https://sangilstudio.com) · **Test:** [sangilstudiotest.vercel.app](https://sangilstudiotest.vercel.app)

> **📁 Contexto del proyecto y skill `/retomar`**
> El contexto compartido (memoria, decisiones, convenciones) y la skill `/retomar` **no están en esta
> rama de código**: viven en la rama Git huérfana **`claude`**. Para consultarlos tras clonar:
>
> ```bash
> git checkout claude          # o, para tenerlo junto al código:
> git worktree add ../sangil-claude claude
> ```
>
> En esa rama, empieza con `/retomar` para ponerte al día. Si vas a hacer _push_, reaplica la
> config local de git/`gh` descrita en la memoria `cuenta-git-gh`.

## Puesta en marcha

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script           | Qué hace                                                           |
| ---------------- | ------------------------------------------------------------------ |
| `npm run dev`    | Servidor de desarrollo (Turbopack)                                 |
| `npm run build`  | Build de producción (prerrenderiza las 46 rutas)                   |
| `npm run check`  | `tsc --noEmit` + ESLint + Prettier — pasar esto antes de commitear |
| `npm run format` | Aplica Prettier a todo el proyecto                                 |
| `npm run images` | Genera los derivados web desde el archivo maestro de imágenes      |
| `npm run brand`  | Genera favicon, icono de iOS e imagen de compartir (OG)            |

## Arquitectura

```
app/
  [locale]/            ← todas las páginas viven bajo idioma (/es, /en)
    layout.tsx         · fuentes, header/footer, metadata y hreflang
    page.tsx           · home (hero a pantalla completa + obra seleccionada)
    work/              · índice de obra y ficha de proyecto [slug]
    competitions/      · índice de concursos
    studio/ contact/
  globals.css          ← SISTEMA DE DISEÑO: todos los tokens, y sólo aquí
  sitemap.ts robots.ts ← generados del contenido real
content/               ← CONTENIDO: un fichero por proyecto, validado con zod
  media-manifest.json  · generado por `npm run images` (no editar a mano)
lib/
  content.ts           ← única puerta de acceso al contenido
  media.ts i18n/ cn.ts
  icon.png apple-icon.png opengraph-image.jpg  ← generados por `npm run brand`
components/
  layout/ sections/ ui/
scripts/
  curation.mjs         ← qué imágenes entran en la web y en qué orden
  optimize-images.mjs  ← pipeline sharp → WebP + placeholder
  generate-brand-assets.mjs ← favicon + OG desde el logotipo
proxy.ts               ← negocia el idioma y redirige / → /es | /en
                         (en Next 16 `middleware.ts` se llama `proxy.ts`)
```

Cuatro decisiones que conviene entender antes de tocar código:

1. **Ninguna página importa `content/` directamente**: todas pasan por `lib/content.ts`. Así,
   migrar a un CMS es reescribir ese módulo sin tocar ni una vista.
2. **Todo es estático.** Las 46 rutas se prerrenderizan en build; no hay render en petición ni
   base de datos. Lo único que corre en el servidor es `proxy.ts`, que negocia el idioma.
   `dynamicParams = false` en el layout de idioma: cualquier locale que no sea `es`/`en` es un 404,
   no algo que se renderice en petición.
3. **Los tokens de diseño están sólo en `app/globals.css`.** Si un color o un espaciado no está en
   ese `@theme`, no se usa. Es lo que evita que la web se descuadre con el tiempo.
4. **Las imágenes se ponen siempre con `<Media>`** (`components/ui/Media.tsx`), nunca con `<Image>`
   suelto: centraliza dimensiones reales (CLS = 0), placeholder difuminado y `sizes` obligatorio.
   Sólo **una** imagen por página lleva `priority` — la del LCP.

## Imágenes

- **Archivo maestro:** `IMAGENES PROYECTOS/` (y su ZIP de ~1,7 GB) — **nunca va a git**, está
  gitignorado. Backup en Drive + disco externo.
- **Derivados web:** `public/media/**` (~31 MB, WebP máx. 2560 px), sí versionados.
- Para añadir o cambiar imágenes: editar `scripts/curation.mjs` y ejecutar `npm run images`.
  La primera imagen de cada proyecto es la portada. `npm run images -- --force` rehace todo.
- Un proyecto sin imágenes **rompe el build a propósito**: la web es fotografía, un hueco vacío
  no es un estado válido.
- **Textos alternativos:** cada proyecto lleva un array `alts` en `content/projects/*.ts`, alineado
  con el orden de `curation.mjs`. Describen lo que se ve, no repiten el nombre del proyecto. Si
  añades una imagen, añade su alt: sin él se usa un genérico que funciona pero es peor.

## Idiomas

Español e inglés desde el primer día, en `/es` y `/en`. Los segmentos de ruta son neutros
(`/work`, `/studio`) y se centralizan en `lib/i18n/routes.ts`; si se quieren slugs localizados
(`/es/proyectos`) se resuelve ahí, sin tocar páginas. Los textos de interfaz están en
`lib/i18n/dictionaries.ts`: si añades una clave y no la traduces, falla el typecheck.

## Despliegue

Hospedado en **Vercel**, con dos entornos que se publican automáticamente al hacer _push_:

- **Producción:** rama `main` → `sangilstudio.vercel.app` y **`sangilstudio.com`**
  (DNS en IONOS, `www` canónico, SSL de Vercel).
- **Test:** rama `test` → `sangilstudiotest.vercel.app`. Emite `noindex` y `robots: disallow`
  automáticamente (`VERCEL_ENV !== 'production'`) para no competir en Google con el dominio real.

El framework se declara en **`vercel.json`** (`"framework": "nextjs"`). Los dos proyectos se
crearon con el preset _Other_ (`framework: null`) por la landing estática anterior; declararlo en el
repo tiene prioridad sobre ese ajuste, se versiona y se aplica igual a los dos entornos, así que no
hace falta tocar el panel de Vercel.

> ⚠️ **`vercel build` no funciona en Windows con este proyecto** (falla con
> `Unable to find lambda for route: /en/...`). Es un bug del builder `@vercel/next`: construye las
> claves de las funciones con `path.join` (que en Windows da `[locale]contact`) y luego las busca
> con `path.posix.join` (`/[locale]/contact`). En los servidores de Vercel (Linux) coinciden y el
> build funciona. Para validar en local usa `npm run build`; para validar el despliegue, un preview
> real en Vercel.

La landing anterior ("en construcción") se conserva en `docs/legacy-landing/` como referencia.

## Antes de dar por cerrada una tarea

1. `npm run check` — typecheck, ESLint y Prettier.
2. `npm run check:mobile` con el servidor levantado. **Obligatorio si has tocado interfaz**: los tres
   fallos más graves del andamiaje eran invisibles en escritorio (menú ilegible, panel de 0 px de
   alto por el `backdrop-blur`, áreas pulsables por debajo de 24 px). Cuando encuentres un fallo
   nuevo, añade su comprobación al script.

## Pendiente de decidir con el estudio

- **Email de contacto**: `content/site.ts` usa el que consta en el contexto, que parece erróneo.
- **Formulario de contacto**: hoy hay contacto directo (teléfono/email). Un formulario implica
  backend de envío, antispam y política de privacidad + aviso legal.
- **Textos**: las memorias de proyecto de `content/projects/` son un primer borrador redactado
  a partir de tipología, ubicación y año; deben revisarlas los autores.
- **Curaduría de imágenes**: la selección de `scripts/curation.mjs` es una primera propuesta.
- **Logotipo en vectorial**: el encabezado usa hoy una aproximación tipográfica (`components/layout/Wordmark.tsx`).
  Con el logo en SVG/AI se sustituye por el trazo real del estudio manteniendo la misma API.
