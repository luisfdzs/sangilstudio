---
name: convenciones-mantenimiento
description: Regla del usuario — actualizar memorias, changelog y CLAUDE.md automáticamente en cada cambio
metadata:
  type: feedback
---

En **cada cambio relevante** del proyecto, hay que actualizar el contexto automáticamente, sin
esperar a que el usuario lo pida.

**Why:** el usuario quiere centralizar el conocimiento del proyecto para que varios desarrolladores
colaboren con contexto coherente y siempre al día; que el contexto quede desfasado rompe ese objetivo.

**How to apply:** en cada cambio relevante —
1. Actualizar las memorias afectadas en `.claude/memory/` y su índice `MEMORY.md`.
2. Crear/actualizar la auto-memoria de sesión en `.claude/auto-memory/` y añadir una entrada al
   `CHANGELOG.md` (fecha `AAAA-MM-DD`, autor, resumen). Convertir fechas relativas a absolutas.
3. Actualizar `CLAUDE.md` si cambian estructura, stack, estado o convenciones.

Todo el material nuevo (memorias, skills, auto-memorias, MCPs, reglas) se guarda **a nivel de
proyecto** en `.claude/`, **nunca en el directorio global**, para que cualquiera que retome el
proyecto pueda continuar con el contexto completo. Detalle del sistema en [[sistema-contexto]].

**Sincronización con GitHub:** tras aplicar un cambio y actualizar las memorias, el contexto debe
reflejarse en GitHub (rama `claude`) para que el resto del equipo lo tenga al día sin acciones extra.
Esa sincronización respeta [[politica-commits]] (Claude propone commit/push en inglés; el usuario
ejecuta) y el flujo de ramas de [[flujo-git-y-ramas]]. Nunca subir secretos: [[seguridad-secretos]].
