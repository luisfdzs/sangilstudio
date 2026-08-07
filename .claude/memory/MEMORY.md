# MEMORY.md — Índice de memorias (SANGIL STUDIO)

Índice de las memorias normales del proyecto. Una línea por memoria. El contenido vive en cada
archivo `.md`, nunca aquí.

- [Identidad del estudio](estudio-identidad.md) — quiénes son SANGIL STUDIO, socios y contacto
- [Proyectos y assets](proyectos-y-assets.md) — inventario de imágenes de proyectos, concursos y branding
- [Sistema de contexto](sistema-contexto.md) — cómo funciona la memoria/skills/settings en `.claude/`
- [Convenciones de mantenimiento](convenciones-mantenimiento.md) — actualizar memorias + changelog + CLAUDE.md en cada cambio (todo a nivel de proyecto, nada global)
- [Política de commits](politica-commits.md) — Claude nunca hace commit/push; propone mensaje en inglés; el usuario supervisa
- [Flujo Git y ramas](flujo-git-y-ramas.md) — modelo de ramas, rama `claude` de contexto (no merge/no borrar) con su worktree en `.claude/worktrees/claude`, sync antes de trabajar, rama por tarea
- [Seguridad de secretos](seguridad-secretos.md) — nunca subir credenciales/keys/tokens/.env; añadir al .gitignore
- [Cuenta Git/gh del repo](cuenta-git-gh.md) — en este repo la única cuenta activa es la personal `luisfdzs`; identidad local, helper `gh` y setup tras clonar
- [Despliegue en Vercel](despliegue-vercel.md) — dos proyectos Vercel: prod (`sangilstudio` → rama `main` → `sangilstudio.com`) y test (`sangilstudiotest` → rama `test`); DNS en IONOS
- [Diseño web y referencias](diseno-web-referencias.md) — **rediseño del 2026-08-04**: blanco, Montserrat, portada de dos bloques, márgenes amplios, sin pie. Lo anterior queda marcado como histórico
- [Arquitectura de la web](arquitectura-web.md) — stack confirmado (Next.js 16 + TS + Tailwind 4), patrones (puerta única al contenido, estático primero, tokens, `<Media>`) y pendientes con el estudio
- [Panel de administración](panel-administracion.md) — Sanity en `/admin`: proyecto `d88iemmi`, qué puede editar Yago, sin tokens de escritura, imágenes optimizadas por su CDN
- [Pendientes del estudio](pendientes-estudio.md) — **logotipo vectorial** y **email de contacto real**: lo que hace falta del estudio para cerrar la web
- [Verificación y despliegue](verificacion-y-despliegue.md) — dos reglas: una tarea de interfaz no está hecha hasta pasar `npm run check:mobile`; los despliegues se validan con preview real, nunca con `vercel build` en Windows
