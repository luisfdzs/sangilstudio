---
name: proyectos-y-assets
description: Inventario de assets — imágenes de 16 proyectos, 17 concursos VIA y branding en LOGO REDES
metadata:
  type: reference
---

Assets disponibles en el proyecto (materia prima para el portfolio de la web).

## `IMAGENES PROYECTOS/` — obra construida / en curso (16)

Cada proyecto es una carpeta numerada con renders, planos y, a veces, subcarpetas de variantes
(`Anteriores`, `maxima calidad`, `reducidas`).

1. (01 — reservado)
2. Z1 House refurbishment — Zizur, Navarra (2023, colab O Arquitectura)
3. Nabrawind Offices Competition — Pamplona, Navarra (2025)
4. VE House — Ibiricu, Navarra (2023)
5. 8 Housing units — Cintruénigo, Navarra (2025)
6. IS House refurbishment — Pamplona, Navarra (2026)
7. 4 Housing units — Cintruénigo, Navarra (2026)
8. Ancín Offices — Pamplona, Navarra (2026)
9. FR Apartment — Tajonar, Navarra (2026)
10. MZ1-6 Housing units — Zizur Mayor, Navarra (2025, promotora MUROA)
11. IS House refurbishment — Pamplona, Navarra (2026)
12. 10 Housing units — Salobreña, Granada (2025)
13. Residential Building — Pamplona, Navarra (2024, colab Vaillo architects)
14. Holy Land Visitor Center — Abu Gosh, Israel (2017, colab Vaillo architects)
15. Lantegi Cultural Centre — Pamplona, Navarra (2023, colab Vaillo architects)
16. Social Housing — Pamplona, Navarra (2023, colab Vaillo architects)

## `IMAGENES PROYECTOS/VIA - CONCURSOS/` — concursos (17)

Music Center (Polonia 2018), Barcelona City Archive (2018), Football Stadium Pamplona (2018),
Zamora Easter Museum (2018), Archaeological Museum Murcia (2019), Student Housing Lugano (2020),
Faculty of Health Sciences UPNA (2020), Barcelona Albacería Market (2020), Sports Complex Leioa
(2021), Visitor Center Cathedral-Mosque Córdoba (2022), National Art Museum of Catalonia (2018),
UDC Research Building Ferrol, Health Center Pamplona (2017), Kultural Center & Book Hub Barcelona
(2019), World Car Center Vigo (2018), Refurbishment Royal Cannon Foundry Barcelona (2023),
Congress and Exhibition Center Pozuelo Madrid.

## `LOGO REDES/` — branding

Variantes del logo (`sangil*.jpg`, `sss+ S.jpg`), banner (`sssssssssssss banner.png`), icono
LinkedIn, imagen generada del logo y **firmas de correo** de los socios (`firma Juan.jpg`,
`firma Yago.jpg`).

## Gestión de las imágenes (decidido 2026-07-24)

Las imágenes son la materia prima del portfolio (uso protagonista, tipo referencias en
[[diseno-web-referencias]]). Regla de oro:

- **`IMAGENES PROYECTOS.zip` (~1,7 GB) = ARCHIVO MAESTRO** (originales a máxima calidad). **NUNCA va al
  repo ni se sirve tal cual** (supera límites de GitHub; git no es backup). Está gitignorado (`*.zip`).
- **Backup ("que no se pierdan"):** subir el zip a la nube (**Google Drive** personal, cabe en 15 GB) +
  copia en **disco externo** (regla 3-2-1). Pendiente de hacer por el usuario.
- **Para la web:** de cada original elegido se generan **versiones optimizadas** (redimensionar +
  **WebP/AVIF**, ~100–400 KB). Curar pocas imágenes potentes por proyecto (estilo minimalista).
- **Entrega recomendada:** Next.js + `next/image` en Vercel, con las fuentes en el repo (`/public`) si
  el total curado es modesto, o en **Vercel Blob**/CDN si son muchas/pesadas. **Los originales de 1,7 GB
  nunca tocan repo ni hosting.** Los **planos** se tratan aparte (PDF descargable o imagen suelta).

## Pipeline implementado (2026-07-25)

Ya no es teoría: el pipeline existe y funciona en la rama `feature/web-foundation`.

- **`scripts/curation.mjs`** = la curaduría. Dice, por proyecto/concurso, **qué originales entran y en
  qué orden**; la primera imagen es la portada. Cuando existe variante en `maxima calidad/` (PNG de
  80–95 MB) se usa esa como origen.
- **`npm run images`** (`scripts/optimize-images.mjs`, sharp) genera **un derivado WebP por imagen**
  (máx. 2560 px, q82) en `public/media/<colección>/<slug>/NN.webp` y escribe
  **`content/media-manifest.json`** con dimensiones reales + placeholder difuminado en base64.
  Es idempotente (`--force` rehace todo).
- **Un solo derivado, no un srcset completo**: `next/image` ya genera las variantes responsive y las
  cachea en el CDN de Vercel; duplicarlo aquí engordaría el repo sin ganar nada.
- **Resultado actual: 78 imágenes, ~31 MB** versionados en el repo (14 proyectos + 17 concursos).
  El manifiesto es lo que garantiza CLS = 0.
- **Planos**: se procesan aparte (prefijo `plan-`, máx. 2000 px, q88) y se muestran sobre papel y sin
  recorte, en su propia sección de la ficha.
- **Descubierto al inventariar**: las carpetas **06 y 11 son el mismo proyecto** (IS House
  refurbishment); se unificaron en una ficha usando los renders de 11 y el plano de 06. La carpeta
  `13. Health Center` de concursos **no tiene imágenes**.

Contexto del estudio en [[estudio-identidad]]. Diseño de la web en [[diseno-web-referencias]].
Stack y patrones en [[arquitectura-web]].
