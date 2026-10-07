# AGENTS.md

## Project Overview
Monorepo with three main packages:
- **front/** - Vue 3 + Vuetify frontend application
- **back/** - Fastify (Node.js) backend API with MongoDB
- **arch/** - Architecture package using @drax/arch


## Local Skills

Project-specific Codex skills are available in `.agent/skills`. When a task matches one of those skills, inspect the corresponding `SKILL.md` before implementing changes.

### Entity Architecture Rules

- Every entity must include Model, Schema, Interface, Service, Repository, and ServiceFactory.
- Database operations must be performed exclusively from the entity Repository.
- Communication between entities must go through their Services.
- When an entity needs to access another entity, import that entity ServiceFactory to obtain its Service instance.

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
- 
## Directory Structure

```
root/
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
│   │   │       ├── providers/
│   │   │       ├── repository/
│   │   │       └── factory/
│   │   ├── setup/     # App initialization
│   │   ├── databases/ # DB connections
│   │   └── servers/   # Server configuration
│   ├── test/
│   │   ├── setup/     # Test utilities (TestSetup, MongoInMemory)
│   │   └── modules/   # Tests mirroring src structure
│   └── tsconfig.json
└── arch/              # Architecture package
```


## Code Style Guidelines

### General Principles

- **No comments** - Avoid adding comments unless absolutely necessary for complex logic
- **Prefer explicit over implicit** - Clear variable/function names
- **Single responsibility** - Keep functions and modules focused

### TypeScript Conventions

- Use `type` for interfaces and types
- Use explicit return types for public functions
- Avoid `any` - use `unknown` or proper types instead

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Classes | PascalCase | `AgentService`, `AgentController` |
| Interfaces | PascalCase (I prefix) | `IAgent`, `IAgentRepository` |
| Variables | camelCase | `agentService`, `newAgent` |
| Functions | camelCase | `findById`, `createAgent` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES`, `API_BASE_URL` |
| Files | kebab-case | `agent-service.ts`, `agent-routes.ts` |
| Vue Components | PascalCase | `AgentCrud.vue`, `NotificationButton.vue` |

### Import Conventions

```typescript
// Group imports by type (no blank lines in this project)

// 1. External libraries
import type { FastifyInstance } from "fastify";
import { z } from "zod";

// 2. Internal packages (drax)
import { AbstractService } from "@drax/crud-back";
import { NotFoundError } from "@drax/common-back";

// 3. Local modules (relative)
import AgentServiceFactory from "../factory/services/AgentServiceFactory.js";
import type { IAgent, IAgentBase } from "../interfaces/IAgent";
```

### Vue Component Style (front/)

```vue
<script setup lang="ts">
import AgentCrud from '../../components/cruds/AgentCrud.vue'
</script>

<template>
  <AgentCrud />
</template>

<style scoped>
/* Component styles */
</style>
```

### Backend Architecture Pattern

Follow the module structure in `back/src/modules/`:

```
module/
├── controllers/   # HTTP handlers (extend AbstractFastifyController)
├── services/      # Business logic (extend AbstractService)
├── routes/        # Fastify route definitions
├── models/        # Data models
├── schemas/       # Zod validation schemas
├── interfaces/    # TypeScript interfaces (I prefix)
├── permissions/   # RBAC permissions
├── providers/    # Integrations with external APIs or Service
├── repository/   # Data access layer
│   └── mongo/    # MongoDB implementation
│   └── sqlite/   # SQLite implementation (if needed)
└── factory/      # Service/Factory pattern
```

### Error Handling

- Use built-in error classes from `@drax/common-back` (e.g., `NotFoundError`)
- Controllers should use `try/catch` with `this.handleError(e, reply)`
- Validate input using Zod schemas


### Testing Guidelines (back/)

- Use **Vitest** for testing
- Tests go in `back/test/modules/{module}/{feature}.test.ts`
- Use the `TestSetup` class for integration tests with MongoDB in-memory
- Test pattern:

```typescript
import { describe, it, beforeAll, afterAll, expect } from "vitest"
import TestSetup from "../../../setup/TestSetup"
import AgentRoutes from "../../../../src/modules/agents/routes/AgentRoutes"
import AgentPermissions from "../../../../src/modules/agents/permissions/AgentPermissions"

describe("Endpoints Test", function () {
    let testSetup = new TestSetup({
        routes: [AgentRoutes],
        permissions: [AgentPermissions]
    })

    beforeAll(async () => {
        await testSetup.setup()
    })

    afterAll(async () => {
        await testSetup.dropAndClose()
        return
    })

    it("should create a new agent", async () => {
        const { accessToken } = await testSetup.rootUserLogin()
        // Test implementation...
    })
})
```

## Key Dependencies

### Frontend
- Vue 3 + Composition API
- Vuetify 3
- Pinia (state management)
- Vue Router
- vue-i18n (internationalization)

### Backend
- Fastify 5
- MongoDB + Mongoose
- Zod (validation)
- TypeScript
- Vitest (testing)
