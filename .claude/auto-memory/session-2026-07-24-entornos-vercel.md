# Sesión 2026-07-24 (7) — Dos entornos Vercel + migración de Netlify

**Autor:** luisfdzs (luisfsangil@gmail.com) vía Claude.

## Objetivo

Dejar todo en Vercel con dos entornos que redespliegan por push:
- **Prod:** rama `main` → `sangilstudio.vercel.app` + `sangilstudio.com`.
- **Test:** rama `test` → `sangilstudiotest.vercel.app`.
Y vincular `sangilstudio.com` (antes en Netlify) a Vercel.

## Qué se hizo (con navegador)

1. Renombrado el proyecto Vercel inicial `sangilstudio` → **`sangilstudiotest`** (sigue en `test`).
2. Creado proyecto **`sangilstudio`** nuevo para prod (rama `main`).
3. Reasignados los dominios `.vercel.app`: `sangilstudiotest.vercel.app` al test y
   `sangilstudio.vercel.app` al prod (Vercel no los cambia solo al renombrar).
4. Añadido `sangilstudio.com` (+ `www`) al proyecto de prod; disparado deploy de `main` (commit vacío).
5. **En IONOS** (DNS): `A @ → 216.198.79.1` y `CNAME www → 9398d7ca5b02378f.vercel-dns-017.com`.
   MX/SPF/DKIM/DMARC intactos. Verificado: `www` = Vercel, apex redirige 308 a `www`, SSL OK.

## Pendiente (usuario)

- **Borrar el sitio de Netlify** `clinquant-elf-090382` (Site configuration → Danger zone → Delete).
  Claude no ejecuta borrados permanentes; se guió al usuario.
- Revocar el PAT `github_pat_…` expuesto en chat (ya no se usa; auth por `gh`).
- Asegurar que la rama `main` tiene el contenido de producción definitivo.
- Caché DNS local del apex puede tardar ~1 h en reflejar Vercel desde la máquina del usuario.
