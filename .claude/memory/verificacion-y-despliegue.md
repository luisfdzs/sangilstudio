---
name: verificacion-y-despliegue
description: Dos reglas de calidad — una tarea de interfaz no está hecha hasta verla en móvil, y los despliegues se validan con un preview real, no con `vercel build` en local
metadata:
  type: feedback
---

Dos reglas nacidas de tropezar con ellas el 2026-07-25, durante la construcción del andamiaje de
la web. Las dos son obligatorias para todo el equipo.

## Regla A — una tarea de interfaz no está terminada hasta verla en móvil

Antes de dar por cerrada cualquier tarea que toque interfaz, hay que ejecutar
**`npm run check:mobile`** (Chrome real a 390×844, script en `scripts/check-mobile.mjs`) y, si el
cambio es visual, mirar también una captura.

**Por qué:** ese día se dio por terminado el andamiaje tras revisarlo sólo en escritorio, y el móvil
sacó **tres fallos que en escritorio eran literalmente invisibles**:

1. El menú se abría con el texto en color papel sobre fondo papel — ilegible. La regla CSS de
   contraste sobre el hero afectaba a todo el `<header>`, incluido el panel desplegable.
2. El panel del menú medía **0 px de alto**: el `backdrop-blur` de la barra convierte al `<header>`
   en bloque contenedor de sus descendientes `fixed`, así que el panel calculaba su altura contra
   una barra de 80 px. Se resolvió sacando el panel fuera del `<header>`.
3. Enlaces con menos de 24 px de área pulsable (incumple WCAG 2.2). Se resolvió con la utilidad
   `tap` de `globals.css`.
4. **Enlaces relativos en el menú** (lo vio el usuario, no el script): `href()` devolvía `es/work` en
   vez de `/es/work`. Desde la portada la resolución relativa coincidía y parecía correcto; desde
   cualquier página interior encadenaba (`/es/work/es/work`) y daba 404. Lección concreta: **probar la
   navegación desde una página profunda, no sólo desde la home**. Ya está en el script.

**Cómo aplicarla:** el script no necesita descargar navegadores (usa `playwright-core` + el Chrome
instalado). Funciona contra local o contra un despliegue:
`BASE=https://sangilstudiotest.vercel.app npm run check:mobile`. Cuando encuentres un fallo nuevo,
**añade la comprobación al script**: es la lista de lo que ya se ha roto una vez en este proyecto.

**Los fallos 1 y 2 volvieron a estar vivos el 2026-08-04.** El rediseño devolvió el menú desplegable a
la cabecera (un «+» arriba a la derecha, a pantalla completa), que es exactamente el patrón que los
provocó. Se evitaron desde el principio —panel fuera del `<header>`, `data-top` a `false` con el menú
abierto— y las dos comprobaciones están de vuelta en el script, midiendo que el panel ocupe la pantalla
entera y que su texto contraste con el fondo. **No volver a meter el panel dentro del `<header>`.**

**Fallo nuevo (2026-08-04), y este no se ve mirando la pantalla:** una sección corta al final de la
página **no puede colocarse arriba** aunque se le pida, porque el navegador no tiene recorrido que dar.
El bloque de contacto se quedaba a 408 px del borde. Se arregla dándole altura de pantalla completa.
Lo detectó la comprobación de `/es/contact`, que exige que la sección caiga por debajo del borde real
de la cabecera y por encima de 200 px — no vale con que «se vea».

**Corolario de método (2026-08-04):** cuando el script falle, **antes de tocar la web hay que
comprobar si el que se equivoca es el script**. Ese día señaló cinco enlaces por debajo de 24 px que no
existían: eran los de la navegación de escritorio, que en móvil están en el DOM con `display:none`
—alto real 0— pero a los que la utilidad `tap` les sigue calculando su pseudo-elemento de 12,8 px. El
script sumaba antes de filtrar. Regla: **descartar primero lo que no se ve y medir después.**

## Regla B — los despliegues se validan con un preview real, no con `vercel build` en local

No intentes validar el build con `vercel build` en Windows: **falla siempre** en este proyecto con
`Unable to find lambda for route: /en/...`, y no es culpa de la web.

**Por qué:** es un bug del builder `@vercel/next`, que crea las claves de las funciones con
`path.join` (en Windows → `\[locale]\contact`) y luego las busca con `path.posix.join`
(`/[locale]/contact`). En Linux —los servidores de Vercel— coinciden y el build funciona. Se
comprobó leyendo el código del builder tras descartar versiones de Next (15.5 y 16.2 fallan igual),
el middleware, los route handlers y `dynamicParams`. Perder tiempo aquí otra vez no aporta nada.

**Cómo aplicarla:** en local, `npm run build` (Next puro, sí funciona). Para validar el despliegue,
un **preview real en Vercel**, que además comprueba lo único que el build local no puede: que el
framework se detecta bien (va declarado en `vercel.json`). Confirmado el 2026-07-25: el preview
construyó a la primera (`READY`), lo que ratifica que el fallo era exclusivo de Windows.

**Corolario nº 2 (2026-07-25): la caché tampoco se puede validar en local.** En desarrollo no hay
caché, así que un cambio publicado en el CMS se ve al instante y todo *parece* correcto, mientras en
el despliegue no se veía nunca. Cualquier cosa que dependa de revalidación se comprueba **contra el
entorno de test desplegado**, mirando la cabecera `X-Vercel-Cache` (`HIT` = la invalidación no llegó;
`STALE` = sí llegó) y los logs de entrega del webhook (`npx sanity hooks logs "<nombre>"`), que dicen
si el problema está antes o después del endpoint. Los dos fallos concretos y su diagnóstico, en
[[panel-administracion]].

**Corolario, y por qué esta regla salva cosas:** al revisar el entorno de test ya publicado se
descubrió que **se anunciaba como indexable** (`index, follow` y `Allow: /`). Motivo: el proyecto
`sangilstudiotest` despliega su rama como **su propio entorno de producción**, así que allí
`VERCEL_ENV === 'production'` también. La indexación depende ahora de la **rama desplegada**
(`VERCEL_GIT_COMMIT_REF === 'main'`, en `lib/site-env.ts`), que falla del lado seguro, y
`npm run check:mobile` lo vigila cuando se ejecuta contra un despliegue. **Nunca deducir el entorno
de `VERCEL_ENV` en este repo.**

Relacionado: [[arquitectura-web]], [[despliegue-vercel]], [[convenciones-mantenimiento]].
