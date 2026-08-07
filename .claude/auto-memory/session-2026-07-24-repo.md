# Sesión 2026-07-24 (3) — Repo creado y modelo de ramas afinado

- **Fecha:** 2026-07-24
- **Autor:** lfernandezs@mobilesmart.city (vía Claude)
- **Objetivo:** registrar la creación del repo de GitHub y afinar el flujo de ramas con la web ya en
  producción; preparar el arranque de la rama `claude`.

## Contexto aportado por el usuario

- Repo creado: https://github.com/luisfdzs/sangilstudio
- Ya hay una primera versión de código **en producción** (web pública para clientes).
- El desarrollo se hará en `test` y en ramas temporales que nacen y mueren en `test`.
- Subidas a producción puntuales cuando haya funcionalidades estables.
- Reparto confirmado: memoria/contexto en rama `claude`, código en el resto de ramas.

## Qué se hizo

1. `flujo-git-y-ramas`: añadida URL del repo, estado en producción y modelo de ramas afinado.
2. `CLAUDE.md`: estado actual (en producción), URL del repo y modelo de ramas actualizados.
3. `INDEX.md` y `CHANGELOG.md` actualizados.

## Estado al cerrar

- Documentación y reglas coherentes con el nuevo estado.
- **Git local aún sin inicializar**; a la espera de arrancar la rama `claude` huérfana y el push.

## Pendiente / abierto para la próxima sesión

- Inicializar Git en local, crear rama `claude` huérfana, conectar remoto y primer push del contexto.
  (Claude propone; el usuario supervisa y ejecuta commit/push.)
- Decidir dónde viven `IMAGENES PROYECTOS/` y `LOGO REDES/` (repo de código vs. fuera). Por ahora no
  se comitean a `claude`.
- Montar el `git worktree` de `claude` para tener el contexto disponible mientras se programa en `test`.
