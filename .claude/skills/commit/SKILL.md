---
name: commit
description: Crea un commit Conventional Commits en español con lo que ya está en staging, solo cuando el usuario escribe /commit.
disable-model-invocation: true
---

1. Leer los cambios en staging con git diff --staged.
2. Si no hay nada en staging, avisar y detenerse. Nunca hacer git add por su cuenta.
3. Si los cambios incluyen .env, .env.local o algo que parezca una clave, detenerse y avisar.
4. Escribir el mensaje en formato Conventional Commits (feat, fix, docs, test, refactor, chore), en español y con máximo 72 caracteres.
5. Mostrar el mensaje y hacer el commit. Nunca hacer push.
