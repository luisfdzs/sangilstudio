# Sangil Studio — Web del estudio

Web de portfolio de **Sangil Studio**, estudio de arquitectura en Pamplona (Navarra).
Next.js 16 (App Router) + TypeScript + Tailwind CSS 4, con **Sanity** como panel de administración,
desplegada en Vercel.

🌐 **Producción:** [sangilstudio.com](https://sangilstudio.com) · **Test:** [sangilstudiotest.vercel.app](https://sangilstudiotest.vercel.app)

## Puesta en marcha

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script             | Qué hace                                                           |
| ------------------ | ------------------------------------------------------------------ |
| `npm run dev`      | Servidor de desarrollo (Turbopack)                                 |
| `npm run build`    | Build de producción (prerrenderiza las 87 rutas)                   |
| `npm run check`    | `tsc --noEmit` + ESLint + Prettier — pasar esto antes de commitear |
| `npm run format`   | Aplica Prettier a todo el proyecto                                 |
| `npm run images`   | Genera los derivados web desde el archivo maestro de imágenes      |
| `npm run brand`    | Genera favicon, icono de iOS e imagen de compartir (OG)            |
| `npm run wordmark` | Escribe los dos montajes del logotipo en `public/brand/*.svg`      |

## Panel de administración (/admin)

El contenido **no está en el código**: vive en Sanity y se edita en **`/admin`**, dentro de la propia
web. Quien edita entra con su cuenta (invitada por email), no con una contraseña compartida: se puede
dar y quitar acceso persona a persona, cada cambio queda con autor y fecha, y hay historial para
deshacer.

Desde ahí se puede hacer **todo** sin tocar el repositorio ni hablar con nadie:

- Crear, editar y borrar proyectos. **Un concurso es un proyecto con el estado «Concurso»**: misma
  lista, mismo formulario y misma ficha en la web, sin una sección aparte que mantener.
- **Reordenarlos arrastrando** (Proyectos › listado): ese orden es el de la web, y los seis marcados
  como destacados forman la portada — el primero es el que la abre a pantalla completa.
- Subir, sustituir, reordenar y borrar imágenes, **del tamaño que sean**: la CDN de Sanity entrega a
  cada pantalla la versión ligera que necesita (ver `sanity/imageLoader.ts`), así que una foto de
  25 MB llega optimizada igual que las que preparábamos con el script.
- Editar todos los textos en **español e inglés**, con los dos idiomas uno al lado del otro.
- Cambiar el manifiesto del estudio, el equipo, los colaboradores y los datos de contacto
  («Estudio y contacto»).

Al pulsar **Publicar**, Sanity avisa a `/api/revalidate` y la web se actualiza en segundos, **sin
desplegar nada**. Sigue siendo estática y servida desde el CDN.

Lo que **no** se puede tocar desde el panel, a propósito: el diseño. Los estados y tipos de proyecto
son listas cerradas (la web tiene traducción preparada para cada valor) y las memorias son párrafos,
no texto con formato libre, para que nadie pueda romper la estética con un titular gigante.

### Puesta en marcha del panel (una sola vez)

1. Crear el proyecto de Sanity: `npx sanity@latest login` y luego `npx sanity@latest init`
   (o desde el Marketplace de Vercel: `vercel integration add sanity/project`, que además deja las
   variables puestas en los dos entornos).
2. Copiar `.env.example` a `.env.local` y rellenar `NEXT_PUBLIC_SANITY_PROJECT_ID`,
   `SANITY_API_WRITE_TOKEN` (sanity.io/manage › API › Tokens, permiso Editor) y
   `SANITY_REVALIDATE_SECRET` (cualquier cadena larga y aleatoria).
3. `npm run migrate:sanity` — sube los 31 proyectos (14 obras y 17 presentados a concurso), los
   textos del estudio y las 79 imágenes con su descripción. Es idempotente: repetirla actualiza, no
   duplica.
4. En Vercel, las mismas variables en los dos proyectos (`vercel env add`), y en
   sanity.io/manage › API › Webhooks un webhook a `/api/revalidate` con ese secreto.
5. Invitar a quien vaya a editar en sanity.io/manage › Members, con rol **Administrator**.

## Arquitectura

```
app/
  [locale]/            ← todas las páginas viven bajo idioma (/es, /en)
    layout.tsx         · fuentes, header/footer, metadata y hreflang
    page.tsx           · home → HomeContent
    HomeContent.tsx    · la portada entera: hero, obra seleccionada, estudio y contacto
    work/              · índice de obra (concursos incluidos) y ficha de proyecto [slug]
    [section]/         · /es/studio y /es/contact: la MISMA portada, abierta en su sección
                         (canonical a /es; el mapa de secciones está en lib/i18n/routes.ts)
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
  generate-wordmark-svg.mjs ← los dos montajes del wordmark en public/brand/
proxy.ts               ← negocia el idioma y redirige / → /es | /en
                         (en Next 16 `middleware.ts` se llama `proxy.ts`)
```

Cuatro decisiones que conviene entender antes de tocar código:

1. **Ninguna página consulta Sanity directamente**: todas pasan por `lib/content.ts`. Cuando el
   contenido vivía en ficheros, ese módulo los leía; ahora lee del CMS y **ninguna vista cambió**.
   Era exactamente para esto.
2. **Todo es estático.** Las 87 rutas se prerrenderizan en build; no hay render en petición ni
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
- **Un documento incompleto no tumba la web**: `lib/content.ts` valida cada proyecto por separado y
  descarta el que no cumple, avisando por consola. Cuando el contenido estaba en el repositorio,
  romper el build era lo correcto; ahora lo edita una persona desde el navegador y la web no puede
  caerse porque alguien deje un proyecto a medias.
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

- **Producción:** rama `prod` → `sangilstudio.vercel.app` y **`sangilstudio.com`**
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
- **Logotipo**: ya es el trazo vectorial real del estudio, en montaje horizontal (SANGIL STUDIO en
  una línea). Los trazos están en `lib/brand/wordmark.ts` y de ahí salen tanto la cabecera como los
  dos ficheros `public/brand/wordmark-{horizontal,vertical}.svg` (`npm run wordmark`). Si alguna vez
  hay una versión oficial vectorizada por un diseñador, se sustituyen los dos `*_PATH` de ese módulo
  y todo lo demás sigue funcionando.
