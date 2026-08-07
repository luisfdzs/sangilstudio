# Sesión 2026-07-24 (2) — Reglas de proyecto y Git

- **Fecha:** 2026-07-24
- **Autor:** lfernandezs@mobilesmart.city (vía Claude)
- **Objetivo:** añadir reglas de proyecto sobre almacenamiento local del contexto, seguridad de
  secretos, integración con GitHub, modelo de ramas y política de commits.

## Qué se hizo

1. `.gitignore` creado (secretos, `.env`, keys, tokens de MCP, config local de integración).
2. Memorias nuevas: `politica-commits`, `flujo-git-y-ramas`, `seguridad-secretos`.
3. `convenciones-mantenimiento` ampliada (todo a nivel de proyecto/nada global + sync a GitHub).
4. `CLAUDE.md`: sección "Reglas del proyecto" + modelo de ramas + paso de sync en el protocolo.
5. `/retomar`: ahora toma el contexto desde la rama `claude`.
6. Índices `MEMORY.md` e `INDEX.md` actualizados.

## Reglas registradas

- Contexto siempre a nivel de proyecto, nada global.
- Nunca subir secretos a GitHub; añadirlos al `.gitignore`.
- Claude nunca hace commit/push; propone mensaje en inglés; el usuario supervisa.
- Sincronizar el repo antes de empezar a trabajar.
- Rama por tarea; el contexto siempre va a la rama `claude`.
- Rama `claude`: nunca se mergea, nunca se borra; es la fuente de contexto de Claude.

## Estado al cerrar

- Reglas y documentación listas. **Git aún no inicializado** localmente y **sin remoto** (no se
  facilitó la URL del repo).
- Pendiente (lo ejecuta el usuario, Claude sólo propone): `git init`, rama `claude`, conectar remoto
  de GitHub, primer commit/push.

## Contexto abierto para la próxima sesión

- Facilitar la URL del repositorio de GitHub para conectar el remoto.
- Confirmar la rama base desde la que sacar la rama `claude` (o si `claude` parte de un árbol vacío).
