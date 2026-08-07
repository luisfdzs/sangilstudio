---
name: despliegue-vercel
description: Dos proyectos Vercel (prod=main/sangilstudio.com, test=test) que redespliegan con cada push; URLs, dominio, DNS en IONOS y correo
metadata:
  type: project
---

Toda la web se despliega en **Vercel**, con **dos proyectos** (dos entornos) conectados al mismo repo
`luisfdzs/sangilstudio`. Cada uno redespliega automáticamente al hacer push a su rama.

## Entornos

| Entorno | Proyecto Vercel | Rama que despliega | URL `.vercel.app` | Dominio real |
|---|---|---|---|---|
| **Producción** | `sangilstudio` | **`main`** | `sangilstudio.vercel.app` | **`sangilstudio.com`** (+ `www`) |
| **Test** | `sangilstudiotest` | **`test`** | `sangilstudiotest.vercel.app` | — |

- **Redespliegue automático:** `git push origin main` → publica producción; `git push origin test` →
  publica test. Sin pasos manuales. Auth de los push vía `gh` con la cuenta `luisfdzs` (ver
  [[cuenta-git-gh]]).
- **Team Vercel:** *Luis Fernández* (plan Hobby), cuenta `luisfdzs`.
- **Preset:** "Other" (sitio estático, `index.html` en la raíz). Sin build command.
- La rama de producción de cada proyecto se fija en *Project Settings → Environments → Production →
  Branch Tracking*.

## Dominio de producción (sangilstudio.com) — DNS en IONOS

El dominio está registrado/gestionado en **IONOS**. Producción se sirve desde Vercel con estos
registros DNS (el resto —MX/SPF/DKIM/DMARC del correo— NO se tocan):

| Tipo | Host | Valor |
|---|---|---|
| **A** | `@` | `216.198.79.1` (Vercel; legacy `76.76.21.21` también vale) |
| **CNAME** | `www` | `9398d7ca5b02378f.vercel-dns-017.com` (legacy `cname.vercel-dns.com` también vale) |

- **Canónico = `www.sangilstudio.com`**: el apex `sangilstudio.com` hace redirect 308 a `www`
  (opción "Redirect apex to www" de Vercel).
- **SSL** lo emite Vercel automáticamente.
- **Correo:** `sangil@sangilstudio.com` sigue en IONOS; los registros de mail quedaron intactos.

## Historia / migración

- Producción **antes estaba en Netlify** (sitio `clinquant-elf-090382`; apex `75.2.60.5`, CNAME `www` a
  `clinquant-elf-090382.netlify.app`). Migrada a Vercel el 2026-07-24 cambiando esos dos registros en
  IONOS. El sitio de Netlify quedó para **dar de baja** (ya no se usa).
- El proyecto `sangilstudio` de Vercel se creó primero apuntando a `test`; luego se renombró a
  `sangilstudiotest` y se creó un `sangilstudio` nuevo para producción (rama `main`). Los dominios
  `.vercel.app` se reasignaron a mano (Vercel no cambia el dominio `.vercel.app` al renombrar).

## Cómo publicar

1. **Test:** trabajar en `test` (o rama temporal que muere en `test`) → `git push origin test`.
2. **Producción:** llevar lo estable a `main` → `git push origin main` (ver modelo en
   [[flujo-git-y-ramas]]).

Relacionado: [[flujo-git-y-ramas]], [[cuenta-git-gh]], [[seguridad-secretos]].
