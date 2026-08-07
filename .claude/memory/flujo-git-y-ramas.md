---
name: flujo-git-y-ramas
description: Modelo de ramas del repo, rama claude para contexto (nunca se mergea/borra), sync antes de trabajar y rama por tarea
metadata:
  type: project
---

Reglas de Git y flujo de trabajo del proyecto (a nivel de proyecto, para todo el equipo).

## Repositorio

- **URL:** https://github.com/luisfdzs/sangilstudio
- **Estado:** el proyecto **ya está en producción** (web pública para clientes).

## Modelo de ramas del repositorio

- **`main`** — estado de producción ya subido ("lo que se ha subido"); web pública en vivo.
- **`develop`** — lo que se va a subir a producción.
- **`test`** — entorno TEST; **es donde se desarrolla el día a día**. Además, **es la rama que Vercel
  despliega como producción** (cada push a `test` publica en https://sangilstudio.vercel.app; ver
  [[despliegue-vercel]]).
- **Ramas temporales** — nacen y mueren en `test`: se sacan de `test` para desarrollar una
  funcionalidad y se fusionan de vuelta a `test`. **"Morir" es literal: se BORRAN** (ver abajo).
  De vez en cuando, cuando hay funcionalidades estables, se sube a producción (`develop` → `main`).
- **`claude`** — rama especial de CONTEXTO, huérfana y aislada del ciclo de despliegue (ver abajo).
  Aquí se actualiza la memoria del proyecto; en el resto de ramas va el código.

## Una rama temporal se BORRA al mergearla en `test` (aclarado por el usuario 2026-07-25)

"Nacen y mueren en `test`" es literal: **cuando su contenido ya está en `test`, la rama desaparece**,
en local y en GitHub. No se dejan ramas viejas colgando en el remoto; el historial queda en `test`,
que es donde vive el código.

El procedimiento completo, cada vez:

```bash
git checkout test && git pull --ff-only
git merge --no-ff feature/lo-que-sea      # commit de merge explícito: se ve qué entró y cuándo
git push origin test
git branch -d feature/lo-que-sea          # -d, no -D: falla si quedara algo sin mergear
git push origin --delete feature/lo-que-sea
```

Dos detalles que importan:

- **`git branch -d` (minúscula) a propósito.** Se niega a borrar si la rama tiene commits que no
  estén en `test`, así que hace de red de seguridad. Nunca `-D`, que borra a lo bruto.
- **`--no-ff` en el merge.** Deja un commit de merge aunque se pudiera avanzar en línea recta, de modo
  que en `test` se ve el bloque de trabajo que entró. Es compatible con borrar la rama: el commit de
  merge conserva la referencia a esos commits, así que **borrar la rama no pierde nada de historia**.

## Política de merge: `--no-ff` por defecto, squash como excepción (decidido 2026-07-25)

El usuario preguntó si no sería mejor usar **squash merge** siempre y delegó la decisión. Regla
adoptada:

- **Por defecto, `git merge --no-ff`.** Rama temporal → `test`.
- **NUNCA squash en las promociones a producción** (`test` → `develop` → `main`). Es la regla dura.
- **Squash sólo como excepción**, para ramas pequeñas con historial de tanteo ("wip", "ahora sí"),
  cuando condensarlas mejore de verdad el historial de `test`. Decisión caso por caso.

**Por qué no squash por defecto, en este repo concreto:** aquí el **mismo código viaja por tres ramas
largas** (`test` → `develop` → `main`). El squash crea commits **nuevos**, con SHA distinto del
original, así que las ramas dejan de compartir historia y Git ya no puede reconocer "esto ya está
allí": cada promoción reabre conflictos por cambios que en realidad ya estaban aplicados. Con merges
normales, el mismo commit se reconoce en las tres ramas y las promociones son limpias. El squash
brilla en el modelo de una sola rama principal con Pull Requests, que no es el de este repo.

Dos efectos secundarios que también pesaron:

- **Con squash se pierde la red de seguridad al borrar la rama.** Git no la considera fusionada (sus
  commits originales no están en `test`), así que `git branch -d` se niega y hay que usar `-D`, que
  borra sin comprobar nada. Si alguna vez se hace squash, recordar este detalle.
- **Se pierde granularidad útil.** Ejemplo real del 2026-07-25: la rama del andamiaje traía dos
  commits, el andamiaje y la normalización de finales de línea. Squasheados, el motivo del
  `.gitattributes` quedaría enterrado en un commit de 143 ficheros, y bisecar un fallo futuro
  apuntaría a "algún sitio de aquí".

**Sobre el nombre:** no hay un único término canónico para esto. Lo más cercano es el flujo de
**ramas temáticas de vida corta** (*short-lived topic branches*, el "topic branch" de Pro Git), y la
parte del borrado es lo que GitHub automatiza con su opción **"Automatically delete head branches"**
(sólo aplica a ramas fusionadas vía Pull Request; aquí se mergea en local, así que se borra a mano
con los dos comandos de arriba). Ojo: **no** es lo mismo que un *squash merge*, que además condensa
todos los commits en uno — aquí se conservan.

Aplicado ya: `feature/web-foundation` y `fix/noindex-test` se borraron (local y remoto) tras entrar
en `test` el 2026-07-25.

## `master` borrada (2026-07-25)

La rama **`master`** del arranque del repo **ya no existe**. Era una historia **independiente** (sin
ancestro común con `main`) con un único commit, `c8a69ae` "first commit" del 2026-06-26, que contenía
la primera landing (`index.html`, `assets/logo.png`, `README.md`, `.gitignore`) y estaba firmado con
la **cuenta del trabajo** (`lfernandezs@mobilesmart.city`), que en este repo no debe usarse (ver
[[cuenta-git-gh]]). Ese contenido sigue vivo, ya evolucionado, en `docs/legacy-landing/` dentro de
`test`, así que no se perdió nada útil.

Para poder borrarla hubo que **cambiar la rama por defecto del repositorio en GitHub de `master` a
`main`** (GitHub no permite borrar la rama por defecto). Ahora `origin/HEAD` → `main`.

Ramas remotas actuales, y no debería haber más: **`main`**, **`develop`**, **`test`**, **`claude`**.

## Rama `claude` (contexto) — REGLAS INVIOLABLES

- Contiene el directorio `.claude/` y el `CLAUDE.md` con todo el contexto del proyecto.
- Es una rama **huérfana** (`git checkout --orphan claude`): sin historia compartida con las demás,
  lo que refuerza que nunca se mergea.
- **NUNCA se fusiona (merge)** con `main`, `develop`, `test` ni ninguna otra rama.
- **NUNCA se elimina.**
- **Implicación práctica:** al ser huérfana, `.claude/` y `CLAUDE.md` NO existen en el árbol de las
  ramas de código (feature/`develop`/etc.). Para trabajar con el contexto siempre disponible mientras
  se programa en otra rama hace falta un **`git worktree`** dedicado a `claude`.
- **Dónde va ese worktree (decidido 2026-08-04):** dentro del propio repo, en
  **`.claude/worktrees/claude`**:

  ```bash
  git worktree add .claude/worktrees/claude claude
  ```

  Antes vivía fuera (`C:/Proyectos/sangil-claude`) y se perdía en cuanto alguien borraba la carpeta;
  de hecho se perdió, y el `.claude/` suelto de la carpeta de trabajo —que es el que lee Claude al
  arrancar— **se adelantó a la rama** sin que nadie lo notara: la sesión 16 estaba escrita en local y
  no en `claude`. Metido en `.claude/worktrees/`, el worktree viaja con el repo y se ve.
- ⚠️ **Hay dos copias del contexto y hay que sincronizarlas a mano.** El harness lee
  `.claude/CLAUDE.md`, `.claude/memory/` y `.claude/auto-memory/` de la carpeta de trabajo, que en las
  ramas de código están **sin versionar**; lo que se publica es el worktree. Al terminar de actualizar
  el contexto: commit y push en el worktree, y **copiar los ficheros de vuelta** a `.claude/`. Si un
  día divergen, la referencia es la que tenga contenido más reciente, no la rama: comparar con
  `diff -r --strip-trailing-cr` (el `.claude/` local tiene finales de línea CRLF y la rama LF, así que
  sin esa opción todo sale como distinto).
- **Claude siempre toma el contexto desde esta rama `claude`** (memorias, auto-memorias, reglas,
  CLAUDE.md). Al iniciar una tarea, situarse en/leer el contexto de `claude`.
- Motivo: el repo es de desarrollo; mantener el contexto aislado evita que la rama `main` afecte al
  despliegue de producción o cause confusión.

## Flujo de trabajo por cambio

1. **Antes de empezar** cualquier modificación: sincronizar el repo (`git fetch` + `pull` de `test` y
   de `claude`) para partir del último estado, aunque otro del equipo haya subido cambios entretanto.
2. **Crear una rama temporal** con nombre representativo de la tarea (p. ej. `feature/portfolio-grid`)
   sacada de **`test`**, para no "machacar" `test` hasta terminar. Nace y muere en `test`.
3. Al **finalizar la modificación/tarea**: subir el cambio de código a **su rama temporal** (y de ahí
   a `test`), y el **contexto actualizado** (`.claude/`, `CLAUDE.md`) siempre a la **rama `claude`**.
   Las funcionalidades estables se promocionan a producción (`develop` → `main`) puntualmente.
4. Todo esto respetando [[politica-commits]]: Claude **propone** el commit (mensaje en inglés) y los
   comandos; **el usuario ejecuta** commit/push.

## Sincronización con GitHub

- Todo el conocimiento del proyecto (`.claude/`, memorias, skills, reglas, `CLAUDE.md`) vive en la
  rama `claude` para que cualquiera que sincronice tenga el contexto al día sin acciones extra.
- Nunca subir secretos: ver [[seguridad-secretos]].

## Cuenta activa (Git/gh)

- En este repo la **única** cuenta que interactúa con GitHub es la personal `luisfdzs` (no la del
  trabajo). Identidad local, helper `gh` y setup tras clonar en [[cuenta-git-gh]].

Relacionado: [[convenciones-mantenimiento]], [[sistema-contexto]], [[cuenta-git-gh]].
