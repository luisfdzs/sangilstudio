---
name: retomar
description: >-
  Recupera y resume el contexto del proyecto SANGIL STUDIO — estado, progreso, última sesión y
  siguientes pasos. Úsala al empezar una sesión (o cuando el usuario escriba /retomar) para ponerse
  al día antes de trabajar. Lee CLAUDE.md, las memorias y el changelog; no modifica nada.
---

# /retomar — Recuperar el contexto del proyecto

Cuando se invoca esta skill, reconstruye el estado del proyecto y preséntalo al usuario de forma
concisa. **Es una operación de sólo lectura**: no cambies archivos.

## Pasos

0. **Origen del contexto:** el contexto de verdad vive en la rama Git **`claude`** (ver memoria
   `flujo-git-y-ramas`). Si el repo está inicializado, asegúrate de leer el contexto desde esa rama
   (y sugiere `git fetch`/`pull` de `claude` para partir del último estado). Nunca mergear ni borrar
   la rama `claude`.

1. **Lee** los siguientes archivos (usa la herramienta Read; si alguno no existe, indícalo y sigue):
   - `CLAUDE.md` (raíz) — contexto principal, estructura, stack y estado.
   - `.claude/auto-memory/INDEX.md` — foto del estado y puntero a la última sesión.
   - `.claude/auto-memory/CHANGELOG.md` — últimas entradas del historial.
   - La **auto-memoria de sesión más reciente** en `.claude/auto-memory/session-*.md`
     (la de fecha mayor).
   - `.claude/memory/MEMORY.md` y las memorias que sean relevantes para la tarea que pida el usuario.

2. **Sintetiza y muestra** un resumen con esta estructura:
   - **Proyecto:** qué es (SANGIL STUDIO, web del estudio) en 1 línea.
   - **Fase / estado actual.**
   - **Últimos cambios** (2-4 puntos del changelog más reciente).
   - **Última sesión:** fecha y qué se hizo.
   - **Siguiente paso sugerido** y cualquier decisión pendiente / contexto abierto.

3. **Pregunta** al usuario en qué quiere trabajar en esta sesión.

## Al terminar la sesión (recordatorio)

Cuando el trabajo de la sesión implique cambios relevantes, aplica el **protocolo de mantenimiento**
(ver memoria `convenciones-mantenimiento`): actualiza memorias afectadas + `MEMORY.md`, añade entrada
al `CHANGELOG.md`, crea/actualiza la `session-<fecha>.md`, refresca `INDEX.md` y `CLAUDE.md` si aplica.
