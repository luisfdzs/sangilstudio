---
name: pendientes-estudio
description: Cosas que bloquean o degradan la web y que sólo puede aportar el estudio — logotipo vectorial y email de contacto real
metadata:
  type: project
---

Lista corta y viva de lo que **depende del estudio** (no de programar). Abierta desde 2026-07-25;
se borra cada punto en cuanto llegue el dato.

## 1. Logotipo en vectorial (SVG o AI) — PENDIENTE

- **Qué falta:** el archivo vectorial del wordmark de SANGIL STUDIO.
- **Por qué importa:** el encabezado usa hoy una **aproximación tipográfica**
  (`components/layout/Wordmark.tsx`): texto con la misma jerarquía (SANGIL en tinta, STUDIO en gris)
  pero **no el trazo real** del estudio, que tiene rasgos propios — la "U" de STUDIO invertida y una
  "A" geométrica sin travesaño. Con una fuente no se reproducen.
- **Por qué es texto y no imagen ahora:** el logotipo del encabezado va sobre fotografía y sobre
  papel, y debe heredar el color en cada caso; una imagen con fondo blanco no sirve. Al sustituirlo,
  hacerlo con **SVG inline** que use `currentColor`, manteniendo la API del componente `<Wordmark />`.
- **Lo que hay hoy en el archivo maestro:** `LOGO REDES/LINKEDIN.png` (1084×879, wordmark negro/gris
  sobre blanco). De ahí sale la **"S" del favicon** y de la imagen de compartir (`npm run brand`),
  que sí funcionan bien; lo que no se puede es usar un PNG como logotipo del encabezado.

## 2. Email de contacto real — RESUELTO (2026-07-25)

- El correcto es **`sangil@sangilstudio.com`** — es además la cuenta de Yago. El
  `sangil@studio.com` que arrastraba el contexto original era erróneo.
- **Ya aplicado** en el panel («Estudio y contacto» → Email), así que sale en el pie y en Contacto de
  todas las páginas, en los dos idiomas.
- Para el futuro: **ya no se cambia en el código**, se cambia desde `/admin`.

## 3. Elegir los proyectos de la portada — PENDIENTE (desde 2026-08-04)

- **Qué falta:** rellenar *Estudio y contacto → Portada → «Proyectos de la portada»* en `/admin`.
- **Por qué importa:** es literalmente lo primero que ve quien entra en la web — el hero son esas
  imágenes fundiéndose a pantalla completa. Mientras el campo esté vacío la web tira de los proyectos
  marcados como destacados, que se eligieron para otra cosa (una rejilla que ya no existe).
- **Cómo:** se eligen proyectos, no imágenes; se usa la primera foto de cada uno y en ese orden.

## 4. Guardar los datos de contacto en el panel — PENDIENTE (desde 2026-08-04)

- Calle, código postal, teléfono y web se publican con los valores que dio el estudio, pero **escritos
  como reserva en el código**, porque el documento publicado aún no trae esos campos. Basta con abrir
  *Estudio y contacto → Contacto* en `/admin` y publicar para que queden guardados de verdad. Ver el
  porqué en [[panel-administracion]].

## Otros pendientes del estudio (menos bloqueantes)

- **Revisar los textos** de las 14 fichas: son un borrador redactado por Claude a partir de
  tipología, ubicación y año. Ya **no hace falta pedírnoslo**: Yago los corrige desde /admin.
- **Revisar la curaduría de imágenes** (`scripts/curation.mjs`) y los textos alternativos (`alts` en
  `content/projects/*.ts`), escritos describiendo lo que se ve en cada imagen.
- **Decidir el cargo de Yago** si quiere uno distinto al de Juan Luis (hoy ambos "Socio fundador",
  con Yago primero). Ahora **puede cambiarlo él mismo** desde /admin.
- **Decidir formulario de contacto**: implicaría backend de envío, antispam y páginas de aviso legal
  y privacidad (obligatorias en España para web de empresa).

Relacionado: [[estudio-identidad]], [[arquitectura-web]], [[proyectos-y-assets]].
