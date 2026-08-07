---
name: seguridad-secretos
description: REGLA — nunca sincronizar credenciales/keys/API keys/tokens de MCP/.env con GitHub; añadirlos al .gitignore
metadata:
  type: feedback
---

**Nunca se sincronizan con GitHub** credenciales, keys, API keys, tokens de MCPs ni variables de
`.env`.

**Why:** exponer secretos en el repositorio es un riesgo de seguridad grave y el repo es compartido
por todo el equipo.

**How to apply:**
- Cada vez que se añada un secreto nuevo, o un fichero local de configuración de un desarrollador
  para hacer una integración, **incluirlo en `.gitignore` ANTES de subir nada**.
- El `.gitignore` del proyecto ya cubre `.env*`, `*.key`/`*.pem`, `credentials.json`, `*.token`,
  ficheros de MCP con tokens, etc. Ampliarlo cuando aparezca un caso nuevo.
- `settings.local.json` SÍ se versiona porque sólo declara rutas (`automemorydirectory`,
  `memorydirectory`) y **no debe contener secretos**; si algún día hicieran falta, van a un `.env`
  ignorado.

Relacionado: [[flujo-git-y-ramas]].
