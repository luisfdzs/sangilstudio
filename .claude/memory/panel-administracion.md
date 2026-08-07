---
name: panel-administracion
description: Panel de administración en /admin con Sanity — datos del proyecto, cómo se editan contenidos, roles y por qué no hay tokens de escritura
metadata:
  type: project
---

Desde el **2026-07-25** el contenido de la web **no vive en el repositorio**: vive en Sanity y se
edita en **`sangilstudio.com/admin`** (en test, `sangilstudiotest.vercel.app/admin`). Montado en la
rama `feature/admin-contenido`.

## Datos del proyecto

- **Project ID:** `d88iemmi` · **Dataset:** `production` (visibilidad **pública**: la web lee sin
  token; escribir sigue requiriendo cuenta).
- **Organización:** `ok5AKUaWz`, cuenta **luisfsangil@gmail.com** (la personal, ver [[cuenta-git-gh]]).
- **Plan:** empezó en *Growth Trial* de 30 días y **baja automáticamente a Free** al terminar. Free
  incluye 20 usuarios y 100 GB de imágenes: de sobra. **No hay riesgo de factura.**
- **Miembros:** Luis (Administrator) y **Yago — `sangil@sangilstudio.com`** (Administrator, invitado
  el 2026-07-25). El plan Free sólo tiene dos roles, Administrator y Viewer; para que Yago pueda
  hacer todo sin pedir permiso, el suyo es Administrator.

## Qué puede hacer quien edita (y qué no)

Puede **todo lo que afecta al contenido**: crear, editar y borrar proyectos y concursos,
**reordenarlos arrastrando** (el orden del listado es el de la web), marcar los destacados de la
portada, subir/sustituir/reordenar/borrar imágenes y editar todos los textos en español e inglés.
También el manifiesto del estudio, el equipo, los colaboradores y los datos de contacto.

**No puede tocar el diseño**, y es deliberado: estados y tipos de proyecto son listas cerradas (la web
tiene traducción preparada para cada valor) y las memorias son párrafos, no texto con formato libre.

## Cambios del rediseño del 2026-08-04

- **Nueva pestaña «Portada»** en *Estudio y contacto*, con el campo **`heroProjects`**: la lista de
  proyectos cuyas imágenes se funden a pantalla completa al entrar en la web. Se eligen **proyectos,
  no imágenes sueltas** —se usa la primera de cada galería, que es su portada—, para que no haya que
  volver a subir fotos que ya están y para que no existan dos sitios que puedan contradecirse.
  **Está vacío**: mientras lo esté, la web recurre a los proyectos marcados como destacados.
  ⚠️ Es lo primero que debería rellenar Yago; es literalmente lo que se ve al entrar.
- **Cuatro campos nuevos de contacto**: `street`, `postalCode`, `phone` y `website`. Componen, línea a
  línea, el bloque de contacto de la portada.
  ⚠️ **Son opcionales a propósito, y eso no es dejadez.** `initialValue` sólo se aplica a documentos
  **nuevos**, y el de este proyecto ya existe publicado: si se declararan obligatorios, la web entera
  dejaría de servirse (`getSiteSettings` lanza error) hasta que alguien abriera el panel y volviera a
  publicar. Se declaran opcionales y `lib/content.ts` los rellena con los valores que dio el estudio
  (`CONTACT_FALLBACK`). En cuanto se guarden en el panel, mandan los del panel.
- **`collaboration` se titula ahora «Arquitectos»** y se enseña en la ficha como `Arquitectos: …`.
  **El nombre interno del campo NO cambió**: renombrarlo obligaría a migrar los 31 documentos
  publicados para no perder lo escrito, que es justamente quién firma cada obra.
- **`featured` pasa a ser reserva**: ya no hay rejilla de destacados en la portada, sólo se usa si
  `heroProjects` está vacío.
- **El manifiesto del estudio se lee en `/studio`**, que ahora es una página propia, no en la portada.
- El nombre de usuario de Instagram **se deduce de la URL del perfil** (último segmento), así que no
  hay un campo que se pueda quedar desincronizado con el enlace.

## Decisiones técnicas que conviene no repensar

- **Nunca se creó un token de escritura.** La migración fue con NDJSON + `sanity dataset import`, que
  usa la sesión del CLI (`sanity login`). Menos secretos, menos superficie de fuga. Si hay que repetir
  la migración: `npm run migrate:build` y `npm run migrate:import`.
- **Las imágenes las optimiza la CDN de Sanity** (`sanity/imageLoader.ts`, declarado en
  `images.loaderFile`): cada `<Image>` pide el ancho exacto y `auto=format` elige AVIF/WebP. Así una
  foto de 25 MB subida desde el panel llega ligera, y **no se consume cuota de imágenes de Vercel**.
- **La web sigue siendo estática.** Las rutas se prerrenderizan; al publicar, el webhook llama a
  `/api/revalidate` (petición firmada; sin firma válida, y también si la firma tiene más de 5 minutos,
  devuelve 401) y Next regenera. **Medido de punta a punta: 11 segundos** desde pulsar «Publicar»
  hasta ver el cambio en https://sangilstudiotest.vercel.app, y ~20 s para deshacerlo. Sin desplegar.
- **Webhook configurado** en sanity.io/manage › API › Webhooks: «Revalidar web (test)» → POST a
  `https://sangilstudiotest.vercel.app/api/revalidate`, todos los datasets, disparadores create/update/
  delete, secreto = `SANITY_REVALIDATE_SECRET`, **sin** borradores. Al pasar a producción hace falta
  **otro webhook igual** apuntando a `https://sangilstudio.com/api/revalidate`.

## Los dos fallos de caché que costaron el rato (NO repetirlos)

Al montar la revalidación, el webhook respondía **200** y la web **no se actualizaba nunca**. Eran dos
fallos encadenados y los dos **silenciosos**:

1. **`client.fetch` ignora el tercer argumento `{ next: { tags, revalidate } }`.** Parece que Sanity
   reenvía esas opciones al `fetch` de Next, y **no lo hace**: no avisa, simplemente no etiqueta nada.
   Consecuencia: los datos quedaban horneados en el build sin etiqueta, así que `revalidateTag` no
   tenía qué invalidar. **La forma correcta en Next 16 es la directiva `use cache` + `cacheTag()`**
   (ver `lib/content.ts`), que exigió activar **`cacheComponents: true`** en `next.config.ts`. Efectos
   colaterales de ese flag, ya resueltos: `export const dynamicParams = false` **no está permitido**
   (el `notFound()` del layout hace el mismo papel) y **no se puede leer la hora** en un componente de
   servidor (el año del copyright del pie vive ahora en una función con `use cache` +
   `cacheLife('days')`).
2. **`useCdn: true` envenenaba la caché.** Al publicar, la página se regeneraba al instante y, si la
   CDN de Sanity aún servía el valor anterior, **se cacheaba el dato viejo como si fuera fresco** y ahí
   se quedaba indefinidamente. Síntoma característico: **intermitente** (una vez funcionaba y la
   siguiente no) y un texto de prueba quedándose publicado más de cinco minutos. Solución:
   **`useCdn: false`** en `sanity/client.ts`. No penaliza al visitante: esas consultas sólo ocurren al
   construir o regenerar, nunca en su petición.

**Cómo se diagnosticó, por si vuelve a pasar algo parecido:** en local no se reproduce (en desarrollo
no hay caché y el cambio se ve al instante), así que hay que mirar **las cabeceras del despliegue** —
`X-Vercel-Cache: HIT` significa que la invalidación no llegó; `STALE` que sí— y los **logs de entrega
del webhook** (`npx sanity hooks logs "<nombre>"`), que confirman si el problema está antes o después
del endpoint.
- **Un documento incompleto NO tumba la web:** `lib/content.ts` valida cada documento por separado y
  descarta el que falle, avisando por consola. Es el cambio de criterio respecto a la etapa de
  ficheros, donde romper el build era lo correcto.
- **CORS**: hay que registrar cada origen desde el que se abra el panel
  (`npx sanity cors add <url> --credentials`). Ya están localhost:3000, localhost:3020,
  sangilstudiotest.vercel.app, sangilstudio.com y www.sangilstudio.com.
- **Variables en Vercel** (los dos proyectos, los tres entornos): `NEXT_PUBLIC_SANITY_PROJECT_ID`,
  `NEXT_PUBLIC_SANITY_DATASET` y `SANITY_REVALIDATE_SECRET`.
- **Escape hatch:** si algún día se quiere salir de Sanity, `sanity dataset export` se lo lleva todo.
  Y en `scripts/migration/content-snapshot.json` queda el contenido tal como estaba en ficheros.

## Trampas encontradas al montarlo (para no volver a perder tiempo)

- El importador resuelve las rutas de `_sanityAsset` **relativas al directorio del NDJSON**, no al del
  comando; y `file://../..` interpreta esa parte como nombre de host. Solución: rutas **absolutas**
  (`pathToFileURL`).
- `npx sanity hooks create` ya no es interactivo en el CLI nuevo: imprime la URL del formulario web.
- El panel necesita su propio layout raíz, así que el sitio vive en `app/(site)/` y el panel en
  `app/(studio)/`; y `/admin` está excluido del `proxy.ts` de idiomas o quedaría inaccesible.

Relacionado: [[arquitectura-web]], [[pendientes-estudio]], [[estudio-identidad]], [[despliegue-vercel]].
