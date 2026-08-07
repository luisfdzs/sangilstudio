---
name: cuenta-git-gh
description: En ESTE repo la única cuenta git/gh activa es la personal luisfdzs; nunca la del trabajo. Identidad local, helper gh y setup tras clonar
metadata:
  type: project
---

**En este repositorio la ÚNICA cuenta que interactúa con Git/GitHub es la personal
`luisfdzs`.** La cuenta del trabajo (`luissangil` / `lfernandezs@mobilesmart.city`) **NUNCA**
se usa aquí, aunque sea la que tenga configurada la máquina a nivel global.

Esta información es **por repositorio**: cada repo declara cuál es su cuenta activa. Aquí es
`luisfdzs`, y así debe quedar cada vez que alguien trabaje en este proyecto.

## Datos de la cuenta de este repo

- **Cuenta GitHub / usuario:** `luisfdzs` (personal).
- **Email de commits:** `luisfsangil@gmail.com`.
- **Repositorio:** https://github.com/luisfdzs/sangilstudio
- **Cuenta que NO se usa aquí (trabajo):** `luissangil` / `lfernandezs@mobilesmart.city`.

## Cómo está configurado (y cómo dejarlo tras clonar)

La identidad `--local` y el credential helper viven en `.git/config`, que **no viaja en el clon**;
la cuenta activa de `gh` es estado **global** de la máquina. Por eso, tras clonar este repo hay que
reproducir esta configuración una vez:

```bash
# 1) Identidad de commits SOLO para este repo (no toca la config global del trabajo)
git config --local user.name  "luisfdzs"
git config --local user.email "luisfsangil@gmail.com"

# 2) Autenticación vía GitHub CLI (gh), sin tokens manuales.
#    gh debe tener logueada la cuenta personal:  gh auth login  (una vez por máquina)
#    Helper local que hace que ESTE repo use gh para github.com:
git config --local credential.https://github.com.helper ""
git config --local --add credential.https://github.com.helper "!gh auth git-credential"

# 3) La cuenta ACTIVA de gh debe ser la personal al trabajar en este repo:
gh auth switch --user luisfdzs -h github.com
```

## Notas importantes

- **La cuenta activa de `gh` es global**, no por repo. El helper de `gh` sólo sirve la cuenta activa,
  así que trabajar en este repo exige que `luisfdzs` esté activa (`gh auth switch --user luisfdzs`).
  Si se usa `gh` en un repo del trabajo, cambiar con `gh auth switch --user luissangil`.
- Los `git push`/`pull` de este repo van con el **token OAuth de `gh`** de `luisfdzs` → **no** hay
  que introducir tokens/contraseñas nunca.
- Los repos del trabajo autentican por su vía habitual (Git Credential Manager, `luissangil`) y no se
  ven afectados por esta configuración local.
- Nunca guardar tokens en ficheros versionados: ver [[seguridad-secretos]].

Relacionado: [[flujo-git-y-ramas]], [[politica-commits]], [[seguridad-secretos]].
