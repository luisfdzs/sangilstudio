---
name: politica-commits
description: REGLA CRÍTICA — Claude nunca hace commits ni push; sólo propone un mensaje de commit CORTO en inglés; el usuario supervisa
metadata:
  type: feedback
---

**Claude NUNCA hace `git commit` ni `git push` por su cuenta.** Cuando se pide un cambio, Claude
modifica el código/ficheros y **propone un mensaje de commit CORTO y en inglés**; es el usuario
quien revisa y ejecuta el commit/push, supervisando en todo momento.

**Excepción:** sólo si el usuario pide **explícitamente** en ese momento que Claude ejecute el
commit/push (p. ej. "haz el push tú", "súbelo tú"), Claude puede hacerlo — pero el comportamiento por
defecto es NO commitear.

**Why:** el usuario quiere control y supervisión total sobre lo que entra en el repositorio; los
commits/push son acciones difíciles de revertir y afectan al trabajo en paralelo del equipo.

**How to apply:**
- Tras terminar una tarea o modificación: dejar los ficheros listos, resumir qué cambió y **proponer
  un mensaje de commit CORTO y en inglés** (y, si aplica, la rama destino y el comando `git`), pero
  **no ejecutar** `commit`/`push` salvo petición explícita del usuario.
- Esto matiza el "flujo automático a GitHub": Claude prepara y propone; el usuario aprueba y ejecuta.
- Aplica también a la rama `claude` de contexto: se propone el commit, no se ejecuta.

Relacionado: [[flujo-git-y-ramas]], [[convenciones-mantenimiento]].
