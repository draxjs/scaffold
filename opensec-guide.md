# Guía de Integración de OpenSpec

Esta guía explica cómo inicializar OpenSpec en este repositorio y configurarlo para que utilice las guías de arquitectura definidas en el directorio `ai-guide` al generar nuevas entidades (CRUDs) de backend y frontend.

## 1. Inicialización de OpenSpec

Requires Node.js 20.19.0 or higher.

Install OpenSpec globally:

```bash
npm install -g @fission-ai/openspec@latest
```

Para comenzar a utilizar OpenSpec en el proyecto, primero debes inicializar la configuración. Ejecuta el siguiente comando en la raíz del repositorio:

```bash
openspec init
```

Esto generará un directorio `openspec/` con un archivo de configuración base `openspec/config.yaml`.

## 2. Configuración del Contexto (AI Guide)

Para asegurar que OpenSpec siga estrictamente los patrones de diseño definidos en `ai-guide/entity-crud-backend.md` y `ai-guide/entity-crud-frontend.md`, debemos inyectar este conocimiento en el contexto del proyecto dentro de `openspec/config.yaml`.

Edita el archivo `openspec/config.yaml` para incluir las referencias a estas guías en la sección `context` y añadir reglas específicas.

### Ejemplo de Configuración (`openspec/config.yaml`)

```yaml
# openspec/config.yaml
schema: spec-driven

# Contexto global que el agente de IA verá para todos los artefactos
context: |
  Tech stack: 
    - Frontend: Vue 3, Vite, TypeScript, Drax Framework
    - Backend: Node.js, Fastify, Mongoose/MongoDB, Drax Framework
  
  Architecture Guidelines:
    - Este repositorio sigue patrones estrictos para la creación de entidades.
    - Las guías maestras para la creación de entidades se encuentran en:
      - Backend: ai-guide/entity-crud-backend.md
      - Frontend: ai-guide/entity-crud-frontend.md
    - Debes leer y seguir estas guías paso a paso para cualquier tarea relacionada con "Crear Entidad", "Nuevo CRUD" o "Entity Scaffolding".
    - La estructura de directorios y los nombres de archivos deben coincidir exactamente con los ejemplos de la guía.

rules:
  proposal:
    - Identificar si el cambio implica una nueva entidad.
    - Si es una nueva entidad, mencionar explícitamente que se seguirán las guías de `ai-guide`.
  
  tasks:
    - Desglosar la creación de archivos siguiendo el orden de las capas mencionado en las guías (Interfaces -> Permissions -> Models -> ...).
    - Incluir tareas para verificar que los archivos generados cumplan con las interfaces esperadas.
  
  specs:
    - Definir los campos de la entidad y sus tipos basándose en los requerimientos, pero manteniendo la estructura de esquemas de Drax.
```

> **Nota:** Al referenciar los archivos como `ai-guide/entity-crud-backend.md`, le indicamos al agente que esos archivos contienen la "verdad" sobre cómo construir el código. Dependiendo de la capacidad del agente para leer archivos referenciados, podría ser necesario copiar fragmentos clave si el agente no los lee automáticamente, pero OpenSpec está diseñado para trabajar con este tipo de referencias contextuales.

## 3. Flujo de Trabajo para Crear una Nueva Entidad

Una vez configurado, puedes iniciar un cambio para crear una nueva entidad (por ejemplo, `Product`) utilizando el flujo estándar de OpenSpec:

1.  **Iniciar el cambio:**
    ```bash
    openspec new change create-product-entity
    ```

2.  **Generar los artefactos (Proposal, Design, Tasks, Specs):**
    ```bash
    openspec ff
    ```
    *Durante este paso, el agente leerá el `context` configurado en `config.yaml` y sabrá que debe consultar `ai-guide`.*

3.  **Revisar los artefactos:**
    Verifica `openspec/changes/create-product-entity/tasks.md`. Deberías ver una lista de tareas que corresponde a la estructura de archivos definida en tus guías (ej. Crear `ProductModel.ts`, `ProductController.ts`, etc.).

4.  **Implementar:**
    ```bash
    openspec apply
    ```
    El agente generará el código siguiendo los patrones de Drax Framework definidos en `ai-guide`.
