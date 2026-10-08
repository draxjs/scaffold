# AGENTS.md

## Project Overview
Monorepo with three main packages:
- **front/** - Vue 3 + Vuetify frontend application
- **back/** - Fastify (Node.js) backend API with MongoDB
- **arch/** - Architecture package using @drax/arch

## Keep It Simple
Avoid overengineering: add only the fields and logic strictly necessary for the current requirement, unless explicitly requested otherwise

## GIT COMMIT
At the end of a task generate a git commit with the changes. Dont push the changes to the remote repository.

## Local Skills

Project-specific Codex skills are available in `.agent/skills`. When a task matches one of those skills, inspect the corresponding `SKILL.md` before implementing changes.

### Highlighted Skills
Use `.agent/skills/drax-arch-generator` when need to generate a new entity model crud.
Use `.agent/skills/drax-crud-backend` for backend CRUD operations.
Use `.agent/skills/drax-crud-frontend` for frontend CRUD operations and customize crud forms.
Use `.agent/skills/drax-test-endpoints` for testing backend endpoints (CRUD operations).
Use `.agent/skills/drax-identity-vue` for frontend identity, authentication, and authorization management.


## Local Workflows

Project-specific workflows are available in `.agent/workflows`. When a task matches one of those workflows, inspect the corresponding `workflow-name.md` before implementing changes.

### Entity Architecture Rules

- Every entity must include Model, Schema, Interface, Service, Repository, and ServiceFactory.
- Database operations must be performed exclusively from the entity Repository.
- Communication between entities must go through their Services.
- When an entity needs to access another entity, import that entity ServiceFactory to obtain its Service instance.

### Entity backend Zod schemas

- Single Source of Truth: Zod schemas define entity structures and runtime validation.
- EntityBaseSchema: Used for create/update inputs, with relationships represented by IDs.
- EntitySchema: Used for outputs, with relationships represented as populated objects.
- CRUD Services: Use both schemas to validate inputs and outputs.
- Fastify / Swagger / OpenAPI: CrudSchemaBuilder generates route schemas and API documentation from Zod.
- AI Tools: BuilderTool generates AI tool definitions from the same schemas.
- Schema First: Always update Zod schemas when modifying entities. Avoid duplicate definitions or manual JSON schemas.
- Type Conversion: Builders automatically adapt dates and other types to JSON Schema.
- Partial Updates (PATCH): Never inject default() values into fields that were not provided.

### Frontend Rules

- Prioritize using Vuetify components for the UI
- Prioritize using v-row and v-col for responsive layouts
- Prioritize using classes provided by Vuetify over custom classes
- Generate composable components to encapsulate reusable component logic
- Generate vue subcomponents when a vue component is very large and has sections that can be modularized
- Use i18n for labels and text

### Error Handling

- Use built-in error classes from `@drax/common-back` (e.g., `NotFoundError`)
- Validate input using Zod schemas

## Directory Structure

```
/
├── front/               # Vue 3 frontend (Vuetify)
│   ├── src/
│   │   ├── modules/    # Feature modules (agents, base, google, etc.)
│   │   ├── components/ # Shared components
│   │   ├── layouts/   # Vue layouts
│   │   ├── stores/    # Pinia stores
│   │   └── plugins/   # Vue plugins
│   └── eslint.config.js
├── back/               # Fastify backend API
│   ├── src/
│   │   ├── modules/   # Feature modules with MVC structure
│   │   │   └── {module}/
│   │   │       ├── controllers/
│   │   │       ├── services/
│   │   │       ├── routes/
│   │   │       ├── models/
│   │   │       ├── schemas/
│   │   │       ├── interfaces/
│   │   │       ├── permissions/
│   │   │       ├── repository/
│   │   │       └── factory/
│   │   ├── setup/     # App initialization
│   │   ├── databases/ # DB connections
│   │   └── servers/   # Server configuration
│   ├── test/
│   │   ├── setup/     # Test utilities (TestSetup, MongoInMemory)
│   │   └── modules/   # Tests mirroring src structure
│   └── tsconfig.json
└── arch/              # Architecture generator package
```
