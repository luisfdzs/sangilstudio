---
name: sistema-contexto
description: Cómo funciona el sistema de contexto local — .claude/memory, auto-memory, skills, settings
metadata:
  type: project
---

Todo el contexto de Claude para este proyecto vive **a nivel local** dentro de `.claude/`. Nada se
guarda en el directorio global de usuario. Estructura:

- **`.claude/settings.local.json`** — declara `automemorydirectory` → `.claude/auto-memory` y
  `memorydirectory` → `.claude/memory`. Cualquier MCP/skill/setting nuevo se añade aquí.
- **`.claude/memory/`** — memorias normales (curadas, estables). Índice: `MEMORY.md`. Una memoria
  por archivo con frontmatter (`name`, `description`, `metadata.type`).
- **`.claude/auto-memory/`** — auto-memorias generadas automáticamente: `INDEX.md`, `CHANGELOG.md`
  y `session-*.md` (registro por sesión con progreso y decisiones).
- **`.claude/skills/`** — skills locales del proyecto. Actualmente: `retomar` (`/retomar`).

La skill [[retomar]] no existe como memoria pero es la vía de recuperación de contexto: lee
`CLAUDE.md`, las memorias y el changelog para reconstruir el estado.

Reglas de mantenimiento en [[convenciones-mantenimiento]].
