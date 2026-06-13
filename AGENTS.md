# AGENTS.md - Agent Studio Development Guide

This document provides essential information for agentic coding agents working in this repository.

## Project Overview

Agent Studio is a monorepo with three main packages:
- **front/** - Vue 3 + Vuetify frontend application
- **back/** - Fastify (Node.js) backend API with MongoDB
- **arch/** - Architecture package using @drax/arch

## Local Skills

Project-specific Codex skills are available in `.agent/skills`. When a task matches one of those skills, inspect the corresponding `SKILL.md` before implementing changes.

## Directory Structure

```
agent-studio/
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
└── arch/              # Architecture package
```

---

## Build, Lint & Test Commands

### Frontend (front/)

```bash
# Install dependencies
npm install

# Development server (hot reload)
npm run front

# Type check only
npm run vuetsc

# Build for production
npm run build

# Lint and fix
npm run lint
```

### Backend (back/)

```bash
# Install dependencies
npm install

# Development server with hot reload
npm run back

# Build TypeScript
npm run build        # or: npm run tsc

# Run all tests
npm run test

# Run single test file (vitest)
node --import tsx --test test/modules/agents/agent/agent-endpoints.test.ts

# Run single test by name pattern
node --import tsx --test test/modules/agents/agent/agent-endpoints.test.ts --test-name-pattern="should create"

# Run tests in watch mode
node --import tsx --test test/**/*.test* --watch
```

### Architecture (arch/)

```bash
npm run build        # Build the arch package
```

---

## Code Style Guidelines

### General Principles

- **No comments** - Avoid adding comments unless absolutely necessary for complex logic
- **Prefer explicit over implicit** - Clear variable/function names
- **Single responsibility** - Keep functions and modules focused

### TypeScript Conventions

- Use `type` for interfaces and types
- Use explicit return types for public functions
- Enable strict mode (`strict: true`, `strictNullChecks: true`)
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
├── repository/   # Data access layer
│   └── mongo/    # MongoDB implementation
│   └── sqlite/   # SQLite implementation (if needed)
└── factory/      # Service/Factory pattern
```

### Error Handling

- Use built-in error classes from `@drax/common-back` (e.g., `NotFoundError`)
- Controllers should use `try/catch` with `this.handleError(e, reply)`
- Validate input using Zod schemas
- Return appropriate HTTP status codes (200, 400, 401, 403, 404, 422)

```typescript
async findById(request: CustomRequest, reply: FastifyReply): Promise<IAgent> {
    try {
        request.rbac.assertPermission(this.permission.View)
        // ... logic
    } catch (e) {
        this.handleError(e, reply)
    }
}
```

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

describe("Agent Endpoints Test", function () {
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

### ESLint Configuration (front/)

The frontend uses ESLint flat config with:
- `eslint-plugin-vue`
- `@typescript-eslint/parser`
- TypeScript recommended rules
- Vue essential rules

Run `npm run lint` to fix issues automatically.

---

## Environment Variables

Required environment variables for back (`.env`):
```
DRAX_DB_ENGINE=mongo
DRAX_JWT_SECRET=your-secret
# MongoDB connection string if not using in-memory
```

---

## Common Development Tasks

### Adding a New Backend Module

1. Create directory structure under `back/src/modules/{module-name}/`
2. Create interfaces in `interfaces/`
3. Create schemas in `schemas/`
4. Create model in `models/`
5. Create repository in `repository/mongo/`
6. Create service extending `AbstractService`
7. Create controller extending `AbstractFastifyController`
8. Create routes in `routes/`
9. Create permissions in `permissions/`
10. Create test file in `back/test/modules/{module-name}/`

### Adding a New Frontend Page

1. Create Vue component in `front/src/modules/{module}/pages/`
2. Add route in router configuration
3. Use existing CRUD components from `@drax/crud-vue` when possible

---

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
