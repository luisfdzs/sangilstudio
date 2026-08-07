---
name: diseno-web-referencias
description: Referencias y dirección de diseño de la web de SANGIL STUDIO — minimalista, fotografía protagonista; stack previsto Next.js en Vercel
metadata:
  type: project
---

Dirección de diseño acordada para construir la web del estudio (aún **sin construir** a 2026-07-24; la
web actual es solo una landing "en construcción").

## Referencias (webs de otros estudios, dadas por el usuario)

- **https://noarchitects.es/** — minimalista, fondo crema, mucho aire; proyectos como **imágenes
  grandes** (una por bloque) con título y *fade-in* al hacer scroll.
- **https://dsarchitecture.co.uk/** — *hero* de **foto a pantalla completa** con monograma; luego
  intro/manifiesto y proyectos.

El usuario dice que "están bastante mal hechas": sirven como **referencia de estructura/estilo**, no
para copiarlas. Objetivo: hacerla **mejor** — chula, moderna, minimalista, potente.

## Dirección de diseño (libertad total dada a Claude)

- Estética **minimalista**, mucho espacio en blanco, tipografía cuidada, paleta sobria/neutra.
- **Fotografía protagonista**: hero grande / a pantalla completa, imágenes de proyecto grandes.
- **Grid de proyectos** con transiciones/animaciones suaves (fade-in, hover).
- Pocas imágenes pero muy potentes por vista → **rendimiento y calidad de imagen** son críticos
  (ver estrategia en [[proyectos-y-assets]]).
- Contenido: identidad del estudio + portfolio de obra construida + concursos (ver
  [[proyectos-y-assets]] y [[estudio-identidad]]).

## Stack (CONFIRMADO 2026-07-25)

- **Next.js 15 (App Router) + TypeScript + Tailwind CSS 4** en Vercel, con `next/image`.
- Detalle de stack, patrones y decisiones en [[arquitectura-web]].

## ⚠️ REDISEÑO DEL 2026-08-04 — lo que manda hoy

El estudio entregó **trece notas** (`NotasYago.txt`, en la carpeta de trabajo) y se aplicaron todas.
**Todo lo que viene después de esta sección describe el diseño ANTERIOR** y se conserva sólo para
entender por qué las cosas eran como eran; donde se contradigan, manda esto.

Referencia nueva que dio el usuario: **https://paredespedrosa.com** — por los **márgenes laterales
grandes** en escritorio.

- **Fondo blanco puro** `#ffffff` (antes un papel cálido `#f4f2ee`). Tinta `#111`, tres grises y un
  filete `#e4e4e4`.
- **Una sola tipografía: Montserrat** en toda la web, pesos 400/500/700. Fuera la serif editorial
  (Instrument Serif) y la neo-grotesca. La jerarquía la marcan tamaño, peso y versalitas, no el
  contraste entre dos familias. El estudio dio como alternativa «la Neuer» si Montserrat no valía.
- **Márgenes laterales grandes**: `--spacing-gutter: clamp(1.25rem, 8vw, 12rem)`. En 1440 px deja
  ~115 px por lado. **El hero es la excepción**: va a sangre, sin margen.
- **La portada son DOS bloques y nada más**: el hero y el contacto. Se fueron la rejilla de obra
  seleccionada y la sección de estudio.
- **Hero**: imágenes de proyectos a **pantalla completa fundiéndose por opacidad** (5 s cada una,
  fundido de 1,6 s), **sin texto encima** de ningún tipo. Toda la pantalla es un enlace a `/work`.
  Los proyectos que salen **se eligen en el panel** (campo «Proyectos de la portada»); si está vacío
  se usan los destacados. Con `prefers-reduced-motion` se queda en la primera imagen, fija.
- **Contacto**: una sola columna **pegada al margen izquierdo**, con el texto literal que dio el
  estudio y los huecos que pidió (un salto de línea tras el título, dos entre bloques, expresados en
  `em` sobre la interlínea). Tres enlaces con icono —correo, web, Instagram— que **se ponen en
  negrita al pasar el ratón sin mover la línea** (utilidad `hover-bold`: un pseudo-elemento reserva de
  antemano el ancho de la negrita). Cierra con los dos socios, Yago primero.
  ⚠️ La sección ocupa **`min-h-[100svh]`** aunque su texto sea corto: sin eso la página no da de sí
  y `/es/contact` no puede subir el bloque hasta arriba. Y el contenido va **arriba** de esa pantalla,
  no centrado — centrado volvía a dejarla sin recorrido.
- **Rejilla de proyectos**: **tres columnas** en escritorio, **una** en móvil, portadas **cuadradas**
  (1:1, el hotspot del panel decide el recorte). Al pasar el ratón la imagen **crece un 4 % dentro de
  su cuadro**, que no se mueve.
- **Buscador** sobre la rejilla, filtrando en vivo en el navegador: **contiene** (no «empieza por»),
  **sin distinguir mayúsculas** y **sin distinguir acentos** (`NFD` + quitar diacríticos en los dos
  lados). Busca en nombre, ubicación, año y tipo ya traducido.
- **Ficha de proyecto**: título en mayúsculas y grande, ubicación + año, tipo, `Arquitectos: …` y
  `Promotor: …` (esta última sólo si existe), y las imágenes **a una sola columna**, sin recortar.
  Fuera el resumen, la memoria, la superficie, el estado, los planos y el anterior/siguiente — los
  campos siguen en el panel y el resumen se usa como descripción para Google.
- **El estudio tiene página propia** (`/studio`), alineada a la izquierda igual que el contacto.
- **Sin pie de página en toda la web.** El bloque de contacto ya dice lo que decía el pie.
- **Menú de móvil**: un **«+» en la esquina superior derecha** que despliega el menú **a pantalla
  completa**; se convierte en «−» para contraerlo. Fuera la barra inferior de iconos, que comía cuatro
  centímetros de foto en todas las pantallas.

## Lenguaje visual implementado (2026-07-25) — HISTÓRICO, ver el rediseño de arriba

- **Paleta**: papel cálido `#f4f2ee` (no blanco puro), tinta `#14140f`, tres grises y un filete
  `#d9d5cd`. Seis colores en total, declarados en `app/globals.css`.
- **Tipografía**: Instrument Serif en titulares (aire editorial) + Instrument Sans en el resto,
  autoalojadas por Next, escala fluida con `clamp()`.
- **Home**: hero a pantalla completa (`100svh`) con la portada de Arrosadía, manifiesto centrado, y
  grid de obra que **alterna piezas a ancho completo y a mitad** para que no se lea como catálogo.
  ⚠️ El grid va en **ciclos de tres** (una ancha + dos a mitad): la home coge **8 destacados**
  (hero + 7, y cierra con una pieza ancha) y **recorta la pieza sobrante** cuando quedaría una mitad
  huérfana. **No se toleran huecos vacíos en el grid** (el usuario lo rechazó dos veces).
  ⚠️ **Criterio de vecindad**: dos piezas contiguas no deben parecerse. `z1-house-zizur` no debe ir
  junto a `mz-housing-zizur` (portadas casi idénticas); la sustitución acordada es `ancin-offices`
  (interior de oficina, contraste) más `fr-apartment-tajonar` como pieza ancha de cierre.
  ⚠️ **Los destacados ya NO se marcan en el repo**: desde la migración a Sanity, `featured` es un campo
  del CMS, así que ese cambio se hace en el panel `/admin` (quitar destacado a Z1 House, ponérselo a
  Ancín Offices y FR Apartment). **Pendiente de hacer en el panel.**
- **Manifiesto de la home (2026-07-25)**: el bloque va **centrado en todos los tamaños, sin
  distinción** (`mx-auto max-w-3xl text-center`) — el usuario lo pidió explícitamente así tras ver que
  centrarlo sólo en escritorio dejaba el móvil alineado a la izquierda. Antes iba alineado a la
  izquierda y en escritorio dejaba media pantalla vacía a la derecha.
- **Cierre de la home** (párrafo de concursos + enlace "Ver todos los concursos"): mismo criterio,
  bloque centrado en todos los tamaños con el enlace **debajo, en el mismo eje** (antes era un
  `flex justify-between` con el enlace pegado al borde derecho). Filete superior de 1 px, se mantiene.
  El aire de la sección se **reparte a partes iguales** entre los dos textos: filete → párrafo →
  enlace usan el mismo hueco, `calc(var(--spacing-section)*0.6)`, y la sección no lleva padding
  inferior (la separación con el pie ya la da el `mt-(--spacing-section)` del `<Footer>`). Un solo
  valor derivado del token, así escala igual en móvil que en escritorio.
  ⚠️ Se probó primero rellenar ese hueco con una ficha de datos del estudio a la derecha (rejilla de
  12 columnas) y **el usuario la rechazó de plano ("feísimo")**: no volver a proponerla. Para huecos
  en escritorio, la preferencia del estudio es **centrar y dejar aire**, no añadir piezas de datos.
- **Cabecera**: sticky, transparente sobre el hero (texto en color papel resuelto con `:has()`, sin
  JS extra) y fondo papel translúcido al hacer scroll. Jerarquía por opacidad, no por color.
- **Concursos**: índice tabular denso, deliberadamente distinto de la obra construida.
- **Pie (2026-07-25)**: rejilla de **cuatro columnas** con **todo el texto centrado** dentro de su
  columna — identidad (frase + ubicación + email) · **contacto como una sola sección** que ocupa dos
  columnas, con los dos socios uno al lado del otro (Yago primero) · navegación, cuyas tres opciones
  se reparten **en horizontal**, no en vertical. **Sin etiquetas de sección** (`CONTACTO`,
  `NAVEGACIÓN`): el usuario las quitó — un nombre con su teléfono ya se lee como contacto. El **aviso de
  copyright va en fila propia, abajo de todo, centrado y separado por un filete**, para que no compita
  con la información del estudio. En móvil todo se apila, centrado igual.

## Estado / siguiente paso

- **Andamiaje construido y funcionando** en `feature/web-foundation` (build limpio, 43 páginas
  estáticas, ~103 kB de JS). Falta: revisión de textos e imágenes por el estudio, favicon/OG,
  decidir formulario de contacto + páginas legales, y el paso a `test`.

Relacionado: [[proyectos-y-assets]], [[despliegue-vercel]], [[estudio-identidad]], [[flujo-git-y-ramas]].
