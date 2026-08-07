# CLAUDE.md — SANGIL STUDIO · Web del estudio

> Contexto principal del proyecto. Este archivo se mantiene **actualizado automáticamente** en cada
> cambio relevante (ver la sección _Protocolo de mantenimiento_ al final). Es la fuente de verdad
> compartida por todos los desarrolladores que colaboran en el proyecto.

---

## 1. Qué es este proyecto

Sitio web para **SANGIL STUDIO**, un estudio de arquitectura con base en Pamplona (Navarra, España).
El objetivo es tener una web de portfolio que muestre los proyectos construidos, los concursos y la
identidad del estudio, con un espacio central para el contexto y conocimiento compartido entre los
distintos desarrolladores que colaboran.

**Estado actual (2026-08-04):** en producción sigue publicada la landing "en construcción". La web
definitiva vive en **test** (https://sangilstudiotest.vercel.app, con `noindex`) y en **`develop`**:
Next.js 16 + TS + Tailwind 4, bilingüe, 31 proyectos (obra y concursos), contenido en **Sanity** con
panel en `/admin`.

El **2026-08-04 se rediseñó entera** aplicando las trece notas del estudio (`NotasYago.txt`): fondo
blanco, **Montserrat** como única tipografía, márgenes laterales amplios, **portada de dos bloques**
—hero de imágenes fundiéndose + contacto—, **estudio con página propia**, rejilla de proyectos a tres
columnas con fotos cuadradas y buscador en vivo, ficha de proyecto reducida a datos + imágenes, menú
de móvil con «+» a pantalla completa y **sin pie de página**. Mergeado en `develop` y `test`. El
lenguaje visual vigente está en la memoria `diseno-web-referencias`.

El día a día sigue en `test` (y ramas temporales que nacen y **mueren** ahí). El contexto vive en la
rama `claude`, con su worktree en **`.claude/worktrees/claude`**.

**Repositorio:** https://github.com/luisfdzs/sangilstudio

## 2. Identidad del estudio

- **Nombre:** SANGIL STUDIO (marca: `sangil.studio`).
- **Logotipo:** wordmark minimalista — "SANGIL" en negro + "STUDIO" en gris, tipografía geométrica
  redondeada. Assets en `LOGO REDES/`.
- **Socios / contacto** (⚠️ **Yago va siempre primero**: es el jefe del estudio, así que encabeza
  cualquier listado de personas en la web y en cualquier texto):
  - **Yago Fernández Sangil** — +34 664 197 624
  - Juan Luis Irigaray Huarte — +34 609 400 525
  - Email: **sangil@sangilstudio.com** (confirmado 2026-07-25; es también la cuenta de Yago)
  - Instagram: **@sangilstudio** (sin punto, aunque la marca se escriba `sangil.studio`)
- **Ubicación principal de proyectos:** Pamplona y Navarra (también Granada, Barcelona, Israel, etc.).
- **Colaboraciones habituales:** Vaillo architects, O Arquitectura, promotora MUROA, VIA (concursos).

## 3. Estructura de carpetas

En la **rama de código** (`test` y ramas temporales) el árbol es el de la web Next.js:

```
sangilstudio/
├── app/(site)/[locale]/       ← páginas: home (hero + contacto, en HomeContent.tsx), work,
│                                work/[slug], studio, y [section]/ → /es/contact: la MISMA
│                                portada, con canonical a /es
├── app/(studio)/admin/        ← PANEL de administración (Sanity), con su propio layout raíz
├── app/globals.css            ← SISTEMA DE DISEÑO: todos los tokens, y sólo aquí
├── app/api/revalidate/        ← webhook: al publicar en el panel, la web se regenera
├── components/                ← layout/ (Header: también el menú de móvil) · sections/ (Hero,
│                                ContactSection, ProjectCard, ProjectSearchGrid) · ui/ (toda
│                                imagen pasa por ui/Media.tsx). SIN Footer: no hay pie.
├── sanity/                    ← esquemas del panel, consultas GROQ, cliente, cargador de imágenes
├── content/site.ts            ← sólo constantes técnicas; lo editorial vive en el panel
├── lib/                       ← content.ts (puerta única) · site-env.ts · i18n/
├── scripts/                   ← curation.mjs (curaduría) + optimize-images.mjs (npm run images)
│                                + generate-brand-assets.mjs (npm run brand: favicon y OG)
├── public/media/              ← 78 derivados WebP (~31 MB) generados por el pipeline
├── vercel.json                ← declara el framework (nextjs) para los dos entornos
├── proxy.ts                   ← negocia idioma y redirige / → /es | /en (antes middleware.ts)
└── docs/legacy-landing/       ← landing anterior "en construcción", como referencia
```

En la **rama `claude`** (contexto, huérfana) el árbol es:

```
sangilstudio/
├── CLAUDE.md                  ← este archivo (contexto principal)
├── .gitignore                 ← protege secretos (.env, keys, tokens de MCP) — nunca subir a GitHub
└── .claude/                   ← todo el contexto de Claude (memoria, skills, mcps, settings)
    ├── settings.local.json    ← declara automemorydirectory y memorydirectory
    ├── memory/                ← memorias "normales" (curadas manualmente)
    │   ├── MEMORY.md          ← índice de memorias normales
    │   └── *.md               ← una memoria por archivo
    ├── auto-memory/           ← auto-memorias (generadas automáticamente en cada cambio)
    │   ├── INDEX.md           ← índice de auto-memorias
    │   ├── CHANGELOG.md       ← changelog automático del proyecto
    │   └── session-*.md       ← registro por sesión
    └── skills/
        └── retomar/           ← skill /retomar (recupera el contexto del proyecto)
```

## 4. Assets disponibles

- **`IMAGENES PROYECTOS/`** — 16 proyectos numerados (viviendas, rehabilitaciones, oficinas) más la
  subcarpeta **`VIA - CONCURSOS/`** con 17 propuestas de concurso. Cada proyecto trae renders,
  planos y variantes (`Anteriores`, `maxima calidad`, `reducidas`).
- **`LOGO REDES/`** — variantes del logo, banner, iconos de LinkedIn y firmas de correo de los socios.

Ambas carpetas son **locales y están gitignoradas**: son el archivo maestro y nunca van al repo. La
web sólo versiona los derivados optimizados de `public/media/`, que genera `npm run images`.

Ver el detalle completo en `.claude/memory/` (memoria `proyectos-y-assets`).

## 5. Stack técnico

- **Hosting/despliegue:** **Vercel** (plan Hobby, cuenta `luisfdzs`), con **dos proyectos/entornos**
  vinculados al repo, que redespliegan solos con cada push:
  - **Producción:** proyecto `sangilstudio`, rama **`main`** → `sangilstudio.vercel.app` y el dominio
    real **`sangilstudio.com`** (DNS en IONOS, `www` canónico, SSL de Vercel).
  - **Test:** proyecto `sangilstudiotest`, rama **`test`** → `sangilstudiotest.vercel.app`.
  - Detalle completo (URLs, registros DNS de IONOS, correo) en la memoria `despliegue-vercel`.
- **Frontend (confirmado 2026-07-25):** **Next.js 16 (App Router, Turbopack) + TypeScript estricto +
  Tailwind CSS 4**, con `next/image` y **zod** validando el contenido. Web **bilingüe es/en**
  (`/es`, `/en`), **estática** (88 rutas prerrenderizadas, lo que reporta `npm run build` a
  2026-08-04; conviene leer la cifra del build y no fiarse de la escrita, que se desfasa). En servidor
  sólo `proxy.ts`, que negocia el idioma, y el webhook de revalidación. **Tipografía: Montserrat**,
  única familia, autoalojada. Razonamiento y patrones en **`arquitectura-web`**; lenguaje visual en
  `diseno-web-referencias`.
- **Contenido: Sanity** (proyecto `d88iemmi`), que el estudio edita en **`/admin`**: crear, borrar,
  reordenar, traducir y subir imágenes —las optimiza la CDN de Sanity—. Al publicar, la web se
  regenera en segundos. Detalle en la memoria **`panel-administracion`**.
- **Vercel:** el framework se declara en **`vercel.json`** (`"framework": "nextjs"`), no en el panel
  (los proyectos siguen con el preset _Other_ heredado y el fichero manda sobre él). Sólo la rama
  **`main`** se indexa: el criterio está en `lib/site-env.ts` y **no** puede basarse en `VERCEL_ENV`,
  porque el proyecto de test despliega su rama como su propia "production" (ver
  `verificacion-y-despliegue`).
  ⚠️ `vercel build` **no funciona en Windows** con este proyecto (bug del builder; detalle en
  `arquitectura-web`): validar en local con `npm run build` y el despliegue con un preview real.
- **Calidad:** `npm run check` (typecheck + ESLint + Prettier) antes de cada commit.

## 6. Sistema de memoria y contexto

Este proyecto centraliza **todo** el contexto a nivel local dentro de `.claude/`:

- **Memorias normales** (`.claude/memory/`): hechos curados y estables (identidad, decisiones,
  convenciones). Índice en `MEMORY.md`.
- **Auto-memorias** (`.claude/auto-memory/`): registro automático de lo que va ocurriendo — sesiones,
  progreso y `CHANGELOG.md`. Su ubicación está declarada en `settings.local.json` mediante la clave
  `automemorydirectory`.
- **Skill `/retomar`**: al ejecutarse recupera el estado del proyecto (progreso, última sesión y
  contexto relevante) leyendo `CLAUDE.md`, las memorias y el changelog.

## 7. Reglas del proyecto (para todo el equipo)

Reglas vigentes. Su versión completa vive en `.claude/memory/` (indicada entre paréntesis).

1. **Contexto siempre a nivel de proyecto, nada global** — todas las memorias, skills, reglas y
   contexto se guardan y actualizan dentro de `.claude/`, nunca en el directorio global, para que
   cualquiera que retome el proyecto pueda continuar. (`convenciones-mantenimiento`)
2. **Nunca subir secretos** — credenciales, keys, API keys, tokens de MCP y variables `.env` jamás
   se sincronizan con GitHub; al añadir uno nuevo (o un fichero local de integración de un
   desarrollador) se incluye en `.gitignore` antes de subir. (`seguridad-secretos`)
3. **Claude nunca hace commit ni push** — ante un cambio, modifica los ficheros y **propone un
   mensaje de commit CORTO y en inglés**; el usuario revisa y ejecuta, supervisando siempre. Sólo si el
   usuario lo pide explícitamente en el momento, Claude ejecuta el commit/push. (`politica-commits`)
4. **Sincronizar antes de trabajar** — antes de empezar una modificación se sincroniza el repo
   (fetch/pull) para partir del último estado aunque otro del equipo haya subido cambios. (`flujo-git-y-ramas`)
5. **Rama por tarea, y la rama se BORRA al mergear** — cada cambio se hace en una rama con nombre
   representativo sacada de `test`. Al terminar: `git merge --no-ff` en `test`, push, y **la rama
   temporal desaparece** — `git branch -d` (minúscula, falla si algo quedó sin mergear) y
   `git push origin --delete`. En local y en GitHub. El contexto actualizado va siempre a la rama
   `claude`. (`flujo-git-y-ramas`)
   - **Merges: `--no-ff` por defecto y NUNCA squash en las promociones** (`test` → `develop` → `main`):
     el squash crea SHA nuevos, las ramas dejan de compartir historia y cada promoción reabre
     conflictos ya resueltos. Squash sólo como excepción, en ramas pequeñas con historial de tanteo.
     (`flujo-git-y-ramas`)
6. **Rama `claude` de contexto (inviolable)** — contiene `.claude/` y `CLAUDE.md`; **NUNCA se
   fusiona** con otras ramas y **NUNCA se elimina**. Claude siempre toma el contexto desde esta
   rama. (`flujo-git-y-ramas`)
7. **Una tarea de interfaz no está hecha hasta verla en móvil** — antes de cerrarla, ejecutar
   `npm run check:mobile` (Chrome real a 390×844). Nació de tres fallos que en escritorio eran
   invisibles, uno de ellos dejaba el menú vacío. (`verificacion-y-despliegue`)
8. **Los despliegues se validan con un preview real de Vercel**, nunca con `vercel build` en local:
   en Windows falla siempre por un bug del builder, no de la web. En local, `npm run build`.
   (`verificacion-y-despliegue`)

### Modelo de ramas del repositorio

- `main` — producción ya subida; web pública en vivo.
- `develop` — lo que se va a subir a producción.
- `test` — entorno TEST; **donde se desarrolla el día a día**.
- ramas temporales — nacen y **mueren de verdad** en `test`: se borran (local y remoto) en cuanto su
  contenido está mergeado; las funcionalidades estables se promocionan a
  producción (`develop` → `main`) puntualmente.
- `claude` — rama de contexto huérfana (ver regla 6). Aislada del despliegue de producción; aquí se
  actualiza la memoria, en el resto de ramas el código.

### Cuenta Git/GitHub de este repositorio

La **única** cuenta que interactúa con GitHub en este repo es la personal **`luisfdzs`**
(`luisfsangil@gmail.com`), autenticada vía **GitHub CLI (`gh`)** sin tokens manuales. La cuenta del
trabajo (`luissangil` / `lfernandezs@mobilesmart.city`) **nunca** se usa aquí. Detalle y setup a
reproducir tras clonar en la memoria `cuenta-git-gh`.

## 8. Protocolo de mantenimiento (IMPORTANTE)

En **cada cambio relevante** del proyecto, Claude debe, de forma automática y sin que se lo pidan:

1. **Actualizar las memorias** afectadas en `.claude/memory/` (y su índice `MEMORY.md`).
2. **Registrar una auto-memoria** de sesión en `.claude/auto-memory/` y añadir una entrada al
   **`CHANGELOG.md`** con fecha (formato `AAAA-MM-DD`), autor y resumen del cambio.
3. **Actualizar este `CLAUDE.md`** si el cambio afecta a la estructura, el stack, el estado o las
   convenciones.
4. **Sincronizar con GitHub** el contexto actualizado en la rama `claude` (proponiendo commit/push
   en inglés; ejecuta el usuario — ver regla 3 de arriba).

Regla de oro: **el contexto nunca debe quedar desactualizado respecto al estado real del proyecto.**

---

_Última actualización: 2026-08-04 — **rediseño completo** con las trece notas del estudio: blanco, Montserrat, portada de dos bloques (hero de imágenes + contacto), estudio con página propia, rejilla de tres columnas con buscador, ficha reducida y sin pie. En `develop` y `test`. El worktree de la rama `claude` pasa a vivir en `.claude/worktrees/claude`._
