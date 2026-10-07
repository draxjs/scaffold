# Drax Scaffold

Scaffold base para iniciar proyectos con Drax Framework.

El repositorio esta organizado como monorepo con tres paquetes principales:

- `front/`: aplicacion frontend con Vue 3 y Vuetify.
- `back/`: API backend con Fastify, MongoDB, Zod y Vitest.
- `arch/`: paquete de arquitectura y generacion basado en `@drax/arch`.

## AI skills

Este scaffold usa `.agent` como submodulo Git para compartir los skills de agentes entre proyectos Drax.

El submodulo apunta a:

```text
https://github.com/draxjs/ai-skills.git
```

La carpeta `.agent` no es una copia local de archivos versionados por este repositorio. Es un puntero a un commit especifico del repositorio compartido de skills.

## Clonar el scaffold

Para clonar el proyecto con los skills ya descargados:

```bash
git clone --recurse-submodules <repo-url>
```

Si el proyecto ya fue clonado sin submodulos, inicializar `.agent` con:

```bash
git submodule update --init --recursive
```

## Sincronizar skills

Para configurar el submodulo en un proyecto viejo que todavia tiene `.agent` como carpeta local:

```bash
./init-agent-skills.sh
```

Ese script revisa si `.agent` ya esta configurado como submodulo. Si no lo esta, mueve la carpeta local existente a un backup `.agent.local-backup-<timestamp>` y agrega `https://github.com/draxjs/ai-skills.git` como submodulo en `.agent`.

Para inicializar o sincronizar `.agent` con la ultima version del repositorio compartido:

```bash
./update-agent-skills.sh
```

El script:

- inicializa `.agent` si todavia no fue descargado;
- sincroniza la configuracion del submodulo;
- actualiza `.agent` desde la rama `main` de `draxjs/ai-skills`;
- deja staged el nuevo puntero del submodulo cuando hay cambios.

Luego de sincronizar, commitear el puntero actualizado:

```bash
git commit -m "Update shared AI skills"
```

Tambien se puede pedir al script que cree el commit:

```bash
./update-agent-skills.sh --commit
```

Para usar otro mensaje:

```bash
./update-agent-skills.sh --commit --message "Update Drax AI skills"
```

## Comandos utiles

Ver el commit actual del submodulo:

```bash
git submodule status .agent
```

Actualizar manualmente sin script:

```bash
git submodule update --remote .agent
git add .agent
git commit -m "Update shared AI skills"
```

## Actualizar dependencias Drax

El scaffold incluye un script para actualizar dependencias `@drax/*` en:

- `arch/package.json`
- `back/package.json`
- `front/package.json`

El script consulta npm para cada dependencia que empieza con `@drax/` y actualiza el `package.json` a la ultima version disponible solo si la version mayor no cambia. Por ejemplo, puede actualizar de `^3.60.0` a `^3.61.2`, pero no de `^3.60.0` a `4.0.0`.

Despues de modificar los `package.json`, ejecuta `npm install` en cada paquete actualizado para regenerar el `package-lock.json`.

Ejecutar:

```bash
./update-drax-dependencies.mjs
```

Para revisar que cambios haria sin modificar archivos ni ejecutar `npm install`:

```bash
./update-drax-dependencies.mjs --dry-run
```

Para actualizar solo los `package.json` sin correr `npm install`:

```bash
./update-drax-dependencies.mjs --no-install
```
