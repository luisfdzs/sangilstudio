# CHANGELOG — SANGIL STUDIO

Historial cronológico de cambios del proyecto. Se añade una entrada en **cada cambio relevante**
(ver `convenciones-mantenimiento` en `.claude/memory/`). Formato de fecha: `AAAA-MM-DD`.

## 2026-08-04 (17) — Rediseño completo: las trece notas del estudio, aplicadas

- **Trece puntos de `NotasYago.txt`, todos aplicados.** Fondo **blanco puro**, **Montserrat** como
  única tipografía (fuera la serif), **márgenes laterales amplios** (`clamp(1.25rem, 8vw, 12rem)`,
  referencia paredespedrosa.com) y **sin pie de página** en toda la web.
- **La portada son dos bloques y nada más**: un **hero de imágenes a pantalla completa fundiéndose por
  opacidad**, sin texto encima y enlazando entero a `/work`, y el **bloque de contacto**, escrito
  literal, a una columna por la izquierda, con tres enlaces con icono que se ponen en negrita al pasar
  el ratón **sin mover la línea**. Se van la rejilla de obra seleccionada y la sección de estudio.
- **El estudio pasa a página propia** (`/studio`); `sections` se queda sólo con `contact`.
- **Proyectos**: tres columnas en escritorio y una en móvil, portadas **cuadradas** con zoom contenido
  al pasar el ratón, y **buscador que filtra en vivo** —contiene, sin mayúsculas y sin acentos—.
- **Ficha reducida a lo que pidió el estudio**: título, ubicación + año, tipo, `Arquitectos:` y
  `Promotor:`, e imágenes a una sola columna. Fuera resumen, memoria, superficie, estado, planos y
  anterior/siguiente; los campos siguen en el panel.
- **Menú de móvil**: «+» arriba a la derecha que despliega a pantalla completa, «−» que lo contrae.
  Fuera la barra inferior de iconos.
- **Panel**: pestaña «Portada» nueva con **`heroProjects`** (qué proyectos se ven al entrar), cuatro
  campos de contacto (`street`, `postalCode`, `phone`, `website`) y `collaboration` retitulado
  **«Arquitectos»** conservando el nombre interno, para no migrar 31 documentos.
- **Cuatro decisiones consultadas antes de empezar**: URLs sin tocar (`/es/work/slug`, no
  `/proyectos`); ficha **literal**; buscador que **filtra la rejilla**, no un desplegable; y pie fuera
  de **toda** la web, no sólo de la portada.
- **Aprendizajes medidos:** (a) una **sección corta al final de la página no puede subir hasta
  arriba** —el navegador no inventa recorrido—, se arregla con `min-h-[100svh]` y el contenido arriba,
  no centrado; (b) **el script de móvil también se equivoca**: acusaba a cinco enlaces ocultos de no
  llegar a 24 px porque sumaba el pseudo-elemento de `tap` antes de filtrar lo invisible; (c) los
  campos nuevos de Sanity **deben ser opcionales**, porque `initialValue` no toca los documentos ya
  publicados y declararlos obligatorios habría tumbado la web.
- **Rama `feature/rediseno-notas-yago`** (worktree aparte, sacada de **`develop`** a petición del
  usuario) → `develop` (`ab4a3ad`) → `test` (`b4b8de3`), empujadas las dos; rama y worktree
  **borrados**. `npm run check` limpio, build **88/88** y **`check:mobile` 35/35**. Detalle en
  [session-2026-08-04-rediseno-notas-yago.md](session-2026-08-04-rediseno-notas-yago.md).
- ⚠️ **La rama `claude` iba por detrás**: la sesión 16 vivía sólo en el `.claude/` sin versionar de la
  carpeta de trabajo. Recuperada aquí. El worktree de contexto pasa a **`.claude/worktrees/claude`**,
  dentro del repo, para que no se pierda otra vez.

## 2026-07-27 (16) — Las secciones de la portada tienen URL de ruta: `/es/studio`, no `/es#studio`

- **`/es/studio` y `/es/contact` con barra, no con almohadilla.** Siguen siendo secciones de la
  portada: las sirve un segmento dinámico `app/(site)/[locale]/[section]/page.tsx` que devuelve la
  **misma portada** —extraída a `HomeContent.tsx`, compartida por las dos rutas— y coloca la vista en
  la sección (`components/ui/ScrollToSection.tsx`). Al usuario se le plantearon las dos formas
  posibles y **eligió conservar la portada única**, no volver a páginas propias.
- **Canonical a `/es` y fuera del sitemap:** tres direcciones, un HTML. El canonical se **hereda** del
  layout de idioma en vez de declararse, para no crear duplicados.
- **`Header.tsx` ya marca la sección activa** con `aria-current`: era imposible con anclas (señalaba
  las dos a la vez estando en la portada). Queda resuelta la decisión 3 de la sesión del 2026-07-26.
- **Quitadas las redirecciones 308** de `/:locale/studio` y `/:locale/contact` de `next.config.ts`:
  habrían interceptado las rutas nuevas y hecho lo contrario de lo pedido. **Ojo:** un 308 se cachea
  sin caducidad, así que el navegador del usuario puede seguir mandándole al ancla — se confunde con un
  fallo del código; probar en incógnito.
- **Aprendizaje medido:** con `display: swap`, las fuentes cambian los altos del texto de encima y la
  sección se mueve **más de 50 px después** del salto; colocar la vista una sola vez dejaba el
  encabezado **tapado por la barra** (72 px con barra de 96). Se recoloca en `document.fonts.ready`, y
  sólo si el visitante no ha movido la página por su cuenta.
- **`check:mobile` actualizado** al contrato nuevo (entra por `/es/studio`, exige que la sección caiga
  bajo el borde real de la barra y que no quede almohadilla en la URL): 23 → 25 comprobaciones.
- Rama **`feature/urls-secciones`** en `C:/Proyectos/sangilstudio-urls`, **SIN COMPROMETER** — falta el
  OK del usuario. `npm run check` limpio, build 87/87, `check:mobile` 24/25 (el fallo es el del
  logotipo, ajeno a esta tarea). Detalle en
  [session-2026-07-27-urls-secciones.md](session-2026-07-27-urls-secciones.md).

## 2026-07-26 (15) — Estudio y contacto pasan a ser secciones de la portada

- **`/es/studio` y `/es/contact` dejan de ser páginas.** Su contenido vive ahora en la portada, en el
  orden del menú (hero → obra → estudio → contacto), y el menú lleva a las anclas `/es#studio` y
  `/es#contact`. Nuevos `components/sections/StudioSection.tsx` y `ContactSection.tsx`.
- **`lib/i18n/routes.ts`** distingue páginas (`routes`) de anclas de portada (`sections`): `href()`
  devuelve una u otra sin que quien enlaza tenga que saberlo. Las URLs antiguas **redirigen 308** a su
  ancla, y el sitemap ya no las lista.
- **Se quita el manifiesto de la portada** (repetía el texto que ahora se lee entero en la sección
  Estudio) y la sección Estudio va **sin imagen**: la foto que tenía la página ya se ve en la rejilla.
- **Aprendizaje:** el aire de separación no puede ir en el relleno del elemento con `id` —el navegador
  alinea su borde superior y asoma la sección anterior—; va en un envoltorio, con `scroll-mt-8` para
  despegarlo de la barra.
- Rama **`feature/secciones-home`** (worktree aparte, para no mezclarse con `feature/logo-horizontal`),
  **mergeada en `test`** (`--no-ff`, `e76a80f`) y borrada con su worktree. `npm run check` limpio y
  build 80/80 sobre el merge.
- **Queda un fallo abierto que no es de esta tarea:** la revisión móvil da 22/23 porque el enlace del
  logotipo mide 20 px de alto (WCAG pide 24). Lo trajo el logo horizontal; ya fallaba en `778b329`.

## 2026-07-25 (14) — El listado del panel no cargaba: dos causas, una nuestra

- **Causa nuestra:** la migración escribió `orderRank` como cadenas propias (`a000`…) y el plugin de
  arrastre espera **LexoRank** (`0|hzzzzz:`); lanzaba excepción y **el listado no se pintaba nunca**.
  Reparados los 31 documentos (`scripts/fix-order-ranks.mjs`, sólo toca ese campo) y corregido el
  generador de la migración para que no se repita.
- **Causa del entorno:** el Studio necesita una conexión **SSE permanente** con `api.sanity.io`, y en el
  portátil del usuario **Sophos Intercept X** la bloquea. Acotado con cuatro pruebas (consulta normal OK,
  `curl` streaming OK, Chrome limpio sin extensiones falla, Chrome contra SSE local conecta).
  **No es un problema de la web.**
- **Mejora:** `ConnectionNotice` avisa cuando esa conexión está bloqueada, en vez de dejar el panel en
  blanco sin explicación. Verificado: el aviso aparece en la máquina afectada.
- **Rama `feature/panel-rendimiento` empujada pero SIN MERGEAR** (`0f396d0`): quedó pendiente de decidir.

## 2026-07-25 (13) — El panel de administración funciona de punta a punta

- **Panel de Sanity en `/admin`** montado, migrado y **mergeado a `test`** (rama
  `feature/admin-contenido`, ya borrada). Proyecto `d88iemmi`, dataset `production` público, 32
  documentos y 78 imágenes. Detalle completo en la memoria **`panel-administracion`**.
- **Yago invitado** como Administrator a `sangil@sangilstudio.com` (pendiente de que acepte). Ese
  email era además **el de contacto real**: corregido en el CMS, así que ya sale publicado.
- **Prueba de fuego superada: 11 segundos** desde pulsar «Publicar» hasta ver el cambio en
  https://sangilstudiotest.vercel.app, y ~20 s para deshacerlo. Repetida dos veces y en los dos
  sentidos. 20/20 en la revisión móvil contra el entorno desplegado.
- **Dos fallos de caché encadenados, ambos silenciosos** (el webhook respondía 200 y la web no cambiaba
  nunca): `client.fetch` **ignora** el argumento `{ next: { tags } }`, así que no se etiquetaba nada
  (solución: directiva `use cache` + `cacheTag`, que obligó a activar `cacheComponents`); y
  `useCdn: true` hacía que la regeneración **cacheara el dato viejo como fresco** de forma
  intermitente (solución: `useCdn: false`). Documentados en `panel-administracion`, con cómo se
  diagnosticaron.
- **Endurecido el webhook:** una firma capturada valía indefinidamente; ahora caduca a los 5 minutos.
- **Regla nueva** en `verificacion-y-despliegue`: la caché **no se puede validar en local** (en
  desarrollo no hay caché y todo parece correcto); se comprueba contra el despliegue mirando
  `X-Vercel-Cache` y los logs del webhook.
- **Pendiente en el panel** (viene de la sesión de ajustes estéticos): la home pide 8 destacados y en
  el CMS hay 7; hay que quitar el destacado a Z1 House y ponérselo a Ancín Offices y FR Apartment.
  Ya no es un cambio de código, se hace en `/admin`.

## 2026-07-25 (12) — Ajustes estéticos: manifiesto de la home centrado en escritorio

- **Problema (detectado por el usuario):** el manifiesto de la home se veía bien en móvil pero en
  escritorio dejaba **medio ancho de pantalla vacío** a la derecha (`max-w-3xl` alineado a la izquierda).
- **Solución final: bloque centrado en todos los tamaños** (`mx-auto max-w-3xl text-center`), móvil
  incluido a petición expresa del usuario. Un solo cambio, sin contenido nuevo.
- **Mismo criterio en el cierre de la home** (párrafo de concursos): centrado en todos los tamaños y
  el enlace "Ver todos los concursos" **debajo en el mismo eje**, en vez de pegado al borde derecho.
  El aire de la sección se **reparte a partes iguales** entre los dos textos (mismo hueco filete →
  párrafo → enlace, `calc(var(--spacing-section)*0.6)`) y se quita el padding inferior de la sección,
  que duplicaba la separación que ya aporta el pie.
- **Intento descartado:** primero se rellenó el hueco con una ficha de datos del estudio a la derecha
  (rejilla de 12 columnas, datos derivados del contenido). **El usuario la rechazó ("feísimo") y se
  revirtió por completo**, incluidas las claves de i18n que añadía. Anotado en
  `diseno-web-referencias` para no volver a proponerlo.
- **Pie reordenado**: de tres columnas con todo apilado y alineado a la izquierda a **cuatro columnas
  con el texto centrado** — identidad · **CONTACTO como sección única** (ocupa dos columnas, los dos
  socios uno al lado del otro, Yago primero) · navegación con las tres opciones **en horizontal**.
  **Sin etiquetas de sección** (`CONTACTO` / `NAVEGACIÓN`), quitadas a petición del usuario; la clave
  `footer.navigation` que se había añadido se eliminó al dejar de usarse.
  El **copyright pasa a fila propia, centrada, abajo de todo y separada por un filete**.
- **Grid de obra sin huecos:** la home mostraba 6 destacados (hero + 5) y el ritmo ancho+mitad+mitad
  dejaba la última fila a medias (`MZ1-6 Housing` sola). Ahora coge **8 destacados** (hero + 7) y
  **recorta la pieza sobrante** sólo cuando quedaría una mitad huérfana, así que no puede volver a
  aparecer un hueco aunque cambien los destacados.
- **Destacados recompuestos por contraste** (a petición del usuario): fuera `z1-house-zizur` (su
  portada se parecía demasiado a la de `MZ1-6 Housing`, que va al lado) y dentro **`ancin-offices`**
  (interior de oficina, contraste con el render exterior de viviendas) y **`fr-apartment-tajonar`**
  como **pieza ancha de cierre** al estilo de `IS House`. ⚠️ **Este cambio se perdió al mergear**: en
  `test` el contenido ya vive en **Sanity**, así que `featured` es un campo del CMS y hay que tocarlo
  en el panel `/admin`. La home pide 8 destacados y con los 7 del CMS no queda hueco, pero **Z1 House
  sigue junto a MZ1-6**: pendiente de arreglar en el panel.
- **Merge con el panel de Sanity:** la rama nació antes de la migración a CMS, así que se integró
  `origin/test` (páginas movidas a `app/(site)/`, contenido en Sanity, `Footer` leyendo
  `getSiteSettings()` y el año del copyright cacheado). Conflictos resueltos manteniendo la
  maquetación nueva sobre los datos del CMS; los `content/projects/*.ts` se aceptaron como borrados.
- **Publicado en `test`:** `feature/ajustes-esteticos` → `test` (`--no-ff`) y push (`ff1c8dc`).
- **Verificado:** `npm run check` limpio, `npm run build` OK, capturas a 1920/1440/390 y
  `npm run check:mobile` **20/20**. Rama `feature/ajustes-esteticos` (nace y muere en `test`).

## 2026-07-25 (11) — Preview validado, andamiaje mergeado a `test` y dos fallos más

- **Preview real en Vercel: `READY`.** Confirma que el build funciona en sus servidores y que el
  fallo de `vercel build` es exclusivo de Windows. El preview queda tras el SSO de Vercel (protección
  de despliegue), así que sólo se ve estando logueado.
- **Bug corregido (lo detectó el usuario):** los enlaces del menú eran **relativos** (`es/work`), así
  que desde cualquier página interior encadenaban y daban 404. Arreglado en `lib/i18n/routes.ts`.
- **Bug corregido (detectado al revisar el test ya publicado):** `sangilstudiotest.vercel.app` se
  anunciaba **indexable**, porque ese proyecto despliega su rama como su propia "production" y
  `VERCEL_ENV` valía `production`. Ahora la indexación depende de la rama (`lib/site-env.ts`).
- **`.gitattributes` con `eol=lf`:** en Windows cada `checkout` reescribía todo a CRLF y
  `npm run check` fallaba en 56 ficheros sin que nadie hubiera tocado nada.
- **Commits y merge hechos** (a petición del usuario): `feature/web-foundation` → `test`, más una rama
  corta `fix/noindex-test` que nació y murió en `test`. Rama `claude` actualizada.
- **Nueva memoria `pendientes-estudio`**: logotipo vectorial y email de contacto real.
- **Verificación final contra https://sangilstudiotest.vercel.app: 20/20 comprobaciones.**

## 2026-07-25 (10) — Arranque de la web: stack decidido y andamiaje construido

- **Stack confirmado** (razonado y aceptado por el usuario): **Next.js 15 App Router + TypeScript +
  Tailwind CSS 4** en Vercel, con zod para validar contenido y sharp para las imágenes. Descartados
  Astro y HTML a mano. Nueva memoria **`arquitectura-web`** con el razonamiento y los patrones.
- **Decisiones de producto:** web **bilingüe es/en** desde el día 1 (`/es`, `/en`); **contenido en
  ficheros del repo** (con puerta única `lib/content.ts` para poder migrar a CMS sin tocar vistas);
  **imágenes optimizadas en `public/media/`** del repo.
- **Andamiaje construido** en la rama `feature/web-foundation` (de `test`): home con hero a pantalla
  completa, índice y ficha de proyecto, índice de concursos, estudio, contacto, 404, sitemap y robots.
  Sistema de diseño con tokens en `app/globals.css`. **43 páginas estáticas, ~103 kB de JS**,
  `npm run check` limpio.
- **Pipeline de imágenes propio:** `scripts/curation.mjs` (curaduría) + `npm run images` →
  **78 derivados WebP (~31 MB)** y `content/media-manifest.json` con dimensiones y placeholder
  difuminado (CLS = 0). Actualizada la memoria `proyectos-y-assets`.
- **`.gitignore` reforzado:** `IMAGENES PROYECTOS/` y `LOGO REDES/` fuera del repo, no sólo el ZIP.
- Landing anterior movida a `docs/legacy-landing/`; **README reescrito** (arquitectura, scripts,
  imágenes, despliegue y pendientes).
- **Aviso de despliegue:** hay que cambiar el **Framework Preset de Vercel de _Other_ a _Next.js_** en
  los dos proyectos; el entorno de test emite `noindex`/`robots: disallow` automáticamente.
- **Pendiente del estudio antes de publicar:** email de contacto real, revisión de los textos de
  proyecto (borrador de Claude) y de la curaduría de imágenes.

## 2026-07-24 (9) — Dirección de diseño de la web + estrategia de imágenes

- **README** (ramas de código) apunta ahora a la rama `claude` para el contexto/`/retomar`, y su
  sección de despliegue corregida (Netlify → Vercel). Alineado por el usuario en las ramas.
- **Nueva memoria `diseno-web-referencias`**: la web se construirá tomando como referencia de estilo
  https://noarchitects.es/ y https://dsarchitecture.co.uk/ (minimalista, fotografía protagonista, hero
  grande, grid de proyectos). Libertad total a Claude para mejorarlas. Stack previsto: Next.js en Vercel.
  La web sigue **sin construir** (solo landing "en construcción").
- **Estrategia de imágenes** añadida a `proyectos-y-assets`: el `IMAGENES PROYECTOS.zip` (1,7 GB) es el
  **archivo maestro** → backup en Google Drive + disco externo (pendiente usuario), fuera de git; la web
  usará derivados optimizados (WebP/AVIF) vía `next/image` (repo `/public` o Vercel Blob).
- Índice `MEMORY.md` actualizado.

## 2026-07-24 (8) — Regla de commits reforzada + secreto movido a `.env.local`

- **`politica-commits` reforzada:** el mensaje de commit propuesto debe ser **CORTO** y en inglés;
  añadida la excepción (Claude sólo commitea/push si el usuario lo pide explícitamente en el momento).
  Reflejado también en la regla 3 de `CLAUDE.md`.
- **Secreto reorganizado:** los códigos de recuperación 2FA (supuestamente de Vercel) se movieron de
  `recovery-codes.txt` (borrado) a **`.env.local`** (ignorado por git, patrón `.env.*`; no se sube).
  Pendiente del usuario: regenerarlos en la cuenta y guardarlos en un gestor de contraseñas.

## 2026-07-24 (7) — Dos entornos en Vercel + migración de producción de Netlify a Vercel

- **Arquitectura de dos entornos en Vercel**, ambos redespliegan con cada push:
  - **Producción:** proyecto `sangilstudio`, rama **`main`** → `sangilstudio.vercel.app` + dominio real
    **`sangilstudio.com`** (`www` canónico, apex redirige 308 a `www`).
  - **Test:** proyecto `sangilstudiotest`, rama **`test`** → `sangilstudiotest.vercel.app`.
- El proyecto Vercel inicial (test) se renombró a `sangilstudiotest`; se creó `sangilstudio` nuevo para
  producción (rama `main`). Dominios `.vercel.app` reasignados a mano (Vercel no los cambia al renombrar).
- **Migración de producción de Netlify a Vercel** (dominio en **IONOS**): cambiados en IONOS
  `A @: 75.2.60.5 → 216.198.79.1` y `CNAME www: clinquant-elf-090382.netlify.app →
  9398d7ca5b02378f.vercel-dns-017.com`. Registros de correo (MX/SPF/DKIM/DMARC) intactos. Verificado en
  vivo: `www` sirve Vercel y el apex redirige a `www` (SSL de Vercel).
- **Netlify** (`clinquant-elf-090382`) queda para **dar de baja** (ya no se usa). El borrado permanente
  lo ejecuta el usuario (Claude no hace borrados permanentes).
- Memoria `despliegue-vercel` reescrita con la arquitectura final; `CLAUDE.md` (sección Stack) y
  `MEMORY.md` actualizados.

## 2026-07-24 (6) — Despliegue en Vercel sirviendo la rama `test`

- **Proyecto `sangilstudio` creado en Vercel** (team *Luis Fernández*, Hobby, cuenta `luisfdzs`),
  vinculado a `luisfdzs/sangilstudio`. Dominio: https://sangilstudio.vercel.app.
- La UI de importación no permite elegir rama → Vercel desplegó `master`/`main` por defecto. Se cambió
  la **rama de producción a `test`** en *Settings → Environments → Production → Branch Tracking*.
- Para publicar el primer build de `test` se hizo un **commit vacío** en `test` (`5d94607`) y push;
  Vercel desplegó `test` como producción (verificado en vivo: la web muestra "SITIO EN CONSTRUCCIÓN (TEST)").
- **Nueva memoria `despliegue-vercel`** (dominio, rama de producción, cómo redeplegar). Indexada en
  `MEMORY.md`. `CLAUDE.md` sección 5 (Stack) actualizada: hosting = Vercel, sitio estático por ahora.
- A partir de ahora: cada `git push origin test` despliega producción automáticamente (auth vía `gh`,
  cuenta `luisfdzs`).

## 2026-07-24 (5) — Cuenta personal `luisfdzs` como única del repo + primer push real

- **Identidad de commits fijada a nivel local** (no toca la config global del trabajo):
  `user.name=luisfdzs`, `user.email=luisfsangil@gmail.com`.
- **Autenticación vía GitHub CLI (`gh`)** como credential helper **local** de este repo
  (`credential.https://github.com.helper = !gh auth git-credential`). Cuenta activa de `gh` cambiada a
  `luisfdzs` (`gh auth switch`). Ya **no hay que introducir tokens** en los push/pull.
- La cuenta del trabajo (`luissangil` / `lfernandezs@mobilesmart.city`) **no se usa aquí**; sus repos
  siguen autenticando por Git Credential Manager sin verse afectados.
- **Nueva memoria `cuenta-git-gh`**: declara que en este repo la única cuenta activa es `luisfdzs` e
  incluye el setup a reproducir tras clonar (identidad local + helper gh + `gh auth switch`).
  Enlazada desde `flujo-git-y-ramas` e indexada en `MEMORY.md`.
- **Push realizado con `luisfdzs`:** subidas `main` (código: `index.html`, `README.md`, `assets/logo.png`,
  `.gitignore`) y `claude` (contexto: `.claude/` + `CLAUDE.md`). El ZIP `IMAGENES PROYECTOS.zip` (1,7 GB)
  quedó fuera e ignorado (`*.zip`) por superar el límite de GitHub.
- `settings.local.json` (solo rutas de memoria, sin secretos) se versiona en `claude` forzando el add
  (lo bloqueaba el gitignore global de la máquina).
- Pendiente del usuario: **revocar el PAT** `github_pat_…` expuesto en el chat (ya no se usa, gh va por OAuth).

## 2026-07-24 (4) — Repo creado y web en producción

- Repo de GitHub creado: **https://github.com/luisfdzs/sangilstudio**. Registrado en
  `flujo-git-y-ramas` y `CLAUDE.md`.
- La web ya está **en producción** (pública). Estado del proyecto actualizado.
- **Modelo de ramas afinado:** el desarrollo se hace en `test` y en ramas temporales que nacen y
  mueren en `test`; promociones puntuales a producción (`develop` → `main`) cuando hay funcionalidades
  estables. Actualizado en `flujo-git-y-ramas` y `CLAUDE.md`.
- Confirmado el reparto: contexto/memoria en rama `claude`, código en el resto de ramas.
- Git local inicializado; remoto `origin` conectado; rama `claude` huérfana creada y contexto staged
  (16 ficheros + `.gitignore` + `CLAUDE.md`). **Sin commit** (lo supervisa el usuario).
- **Seguridad:** detectado `recovery-codes.txt` en el directorio (secreto) → añadido al `.gitignore`
  (`recovery-codes.txt`, `*recovery-code*`, `*recovery-codes*`). Verificado que queda ignorado.
- Observado: el remoto solo tiene la rama `master` (no `main`/`develop`/`test` todavía); el directorio
  local mezcla código (`index.html`, `README.md`, `assets_old/`) con el contexto — recomendado separar
  vía `git worktree`.

## 2026-07-24 (3) — Decisión: rama `claude` huérfana

- Confirmado por el usuario: la rama `claude` será **huérfana** (`git checkout --orphan claude`).
- Registrada en `flujo-git-y-ramas` la implicación práctica: usar un `git worktree` dedicado a
  `claude` para tener el contexto disponible mientras se programa en ramas de código.
- Repo de GitHub aún no creado (sin URL). A la espera de instrucciones del usuario para crearlo.

## 2026-07-24 (2) — Reglas de proyecto y Git

- **Nuevas reglas de proyecto añadidas** (autor: lfernandezs@mobilesmart.city vía Claude).
  - `.gitignore` creado para no subir secretos (`.env`, keys, tokens de MCP, config local de integración).
  - Memorias nuevas: `politica-commits` (Claude nunca hace commit/push; propone mensaje en inglés,
    el usuario supervisa), `flujo-git-y-ramas` (modelo de ramas, rama `claude` de contexto que nunca
    se mergea ni se borra, sync antes de trabajar, rama por tarea) y `seguridad-secretos`.
  - `convenciones-mantenimiento` ampliada: todo a nivel de proyecto (nada global) + sincronización a
    GitHub (rama `claude`).
  - `CLAUDE.md`: nueva sección "Reglas del proyecto" + modelo de ramas; skill `/retomar` ahora lee el
    contexto desde la rama `claude`.
  - **Pendiente (requiere al usuario):** inicializar Git, crear rama `claude`, conectar el remoto de
    GitHub y hacer el primer commit/push. Claude sólo propone; el usuario ejecuta.

## 2026-07-24 (1)

- **Infraestructura de contexto creada** (autor: lfernandezs@mobilesmart.city vía Claude).
  - Creada la estructura `.claude/` con `memory/`, `auto-memory/` y `skills/`.
  - `settings.local.json` con `automemorydirectory` → `.claude/auto-memory` y
    `memorydirectory` → `.claude/memory`.
  - `CLAUDE.md` raíz con el contexto principal del estudio y el protocolo de mantenimiento.
  - Memorias normales: `estudio-identidad`, `proyectos-y-assets`, `sistema-contexto`,
    `convenciones-mantenimiento` (+ índice `MEMORY.md`).
  - Skill local `retomar` (`/retomar`) para recuperar el contexto del proyecto.
  - Auto-memoria de sesión: `session-2026-07-24.md`.
  - Estado: web sin empezar; sólo assets (`IMAGENES PROYECTOS/`, `LOGO REDES/`) + `.claude/`.
