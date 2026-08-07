# Sesión 2026-07-24 (6) — Despliegue en Vercel (rama test)

**Autor:** luisfdzs (luisfsangil@gmail.com) vía Claude.

## Objetivo

Crear un proyecto en Vercel vinculado al repo y que **lo desplegado sea la rama `test`**, no `master`.

## Qué se hizo (con navegador)

1. Importado el repo `luisfdzs/sangilstudio` en Vercel (team *Luis Fernández*, Hobby). La pantalla de
   importación **no permite elegir rama**, así que el primer build fue de `master`/`main`.
2. En *Settings → Environments → Production → Branch Tracking* se cambió la rama de producción a
   **`test`** (guardado OK: "Every commit pushed to the `test` branch will create a Production Deployment").
3. Para publicar `test` ya mismo: **commit vacío** en `test` (`5d94607`) + `git push origin test`.
4. Verificado en https://sangilstudio.vercel.app → muestra "SITIO EN CONSTRUCCIÓN (TEST)" = rama `test`.

## Resultado

- Proyecto Vercel `sangilstudio`, dominio `sangilstudio.vercel.app`, **producción = rama `test`**.
- Cada push a `test` despliega automáticamente. Documentado en memoria `despliegue-vercel`.

## Pendiente

- **Usuario:** revocar el PAT `github_pat_…` expuesto en el chat (ya no se usa).
- Opcional: ordenar la convivencia de ramas `master` (producción original) y `main` (subida hoy).
