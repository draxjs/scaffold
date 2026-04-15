---
description: Generates a complete Entity CRUD .
---

# Drax CRUD Generator Workflow

This workflow guides you through the process of creating a new CRUD entity in the Drax architecture.

## Steps

1.  **Generate Entity Schema**
    Once the user story is finalized, use the `drax-arch-generator` skill to generate the `IEntitySchema` and register it.

2.  **Review Entity Schema**
    **MANUAL STEP**: Review the generated schema file in `arch/src/schemas`. Ensure the fields, types, and validations match the requirements. Modify the schema code directly if necessary.

3.  **Build Architecture**
    Generate the architectural files.
    // turbo
    ```bash
    cd arch
    npm run build
    ```
    *Verify that files are generated in `arch/output`.*

4.  **Deploy Code**
    Copy the generated code to the frontend and backend directories.
    // turbo
    ```bash
    cd arch
    npm run copy:safe
    ```
    *Verify that files are copied to `back/src/modules` and `front/src/modules`.*


5.  **Setup permissions and routes on back**
    - Add entity permissions to back/src/setup/InitializePermissions.ts
    - Add entity route to back/src/factories/FastifyServerFactory.ts

6.  **Setup routes and i18n on front**
    - Add entity frontend routes to front/src/router/modules-routes.ts
    - Add entity i18n to front/src/i18n/modules-I18n.ts


7.  **Add entity menu**
    Add entity menu in front/src/menu/index.ts
