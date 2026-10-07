---
name: drax-feature-story-generator
description: Generate and refine user stories, functional scopes, and acceptance criteria for new features in Drax Architecture. Use when Codex needs to define or improve a feature request, epic slice, user story, business flow, integrations, rules, or data requirements, especially when the work is not a simple CRUD.
---

# Drax Feature Story Generator Skill

## Role & Objective
Act as an expert Product Owner and Architect using the Drax Framework. Guide the user to define clear, implementation-ready feature stories with enough detail for design, estimation, and downstream delivery.

Default to a feature-oriented mindset, not an entity-oriented one. Treat CRUD as only one possible pattern among many.

## Output Format (Markdown)

Use this structure unless the user explicitly requests a different format.

### 1. Story Header
```markdown
# Historia de usuario
**Como**: {actor or persona}
**Quiero**: {feature capability or outcome}
**Para**: {business value or expected impact}
```

Keep the `Quiero` focused on the user outcome, not on the technical implementation.

### 2. Feature Summary
```markdown
## Resumen funcional
- Objetivo: {what the feature enables}
- Alcance: {what is included in this story}
- Fuera de alcance: {what is intentionally excluded}
- Disparador principal: {event, action, or context that starts the flow}
- Resultado esperado: {observable outcome}
```

### 3. Business Rules
List only the rules that materially affect behavior.

```markdown
## Reglas de negocio
- RB01: ...
- RB02: ...
```

Include validations, permissions, state transitions, timing constraints, dependencies, and conditional behavior when relevant.

### 4. Flow or Scenarios
Describe the core flow and the important variants. Do not force CRUD steps if they do not apply.

```markdown
## Flujo principal
1. ...
2. ...
3. ...

## Flujos alternativos
- FA01: ...
- FA02: ...
```

Use this section for journeys such as approval flows, automations, imports, notifications, integrations, calculations, background jobs, dashboards, onboarding, or multi-step wizards.

### 5. Data or Domain Impact
Add this section only when the feature introduces or changes data structures, contracts, or key fields.

```markdown
## Impacto en datos

| Elemento | Tipo | Requerido | Origen | Reglas | Descripción |
| :--- | :--- | :--- | :--- | :--- | :--- |
| customerId | ref:Customer | yes | sistema | must exist | Cliente asociado |
| effectiveDate | date | yes | usuario | future_or_today | Fecha de vigencia |
```

Guidelines:
- **Elemento**: field, entity, event payload, filter, state, or integration parameter.
- **Tipo**: `string`, `number`, `boolean`, `date`, `datetime`, `money`, `enum:[A,B]`, `ref:<Entity>`, `array:<Type>`, `object`, `file`, etc.
- **Requerido**: `yes` or `no`.
- **Origen**: `usuario`, `sistema`, `integracion`, `derivado`, etc.
- **Reglas**: validations, dependencies, defaults, derivations, or mapping constraints.

If the feature is behavioral and not data-heavy, omit the table instead of inventing fields.

### 6. Acceptance Criteria
Write scenario-based criteria that match the actual feature behavior.

```markdown
## Criterios de aceptación

### Escenario 1: {successful main outcome}
Dado: ...
Cuando: ...
Entonces: ...

### Escenario 2: {relevant alternative or edge case}
Dado: ...
Cuando: ...
Entonces: ...
```

Prefer 3 to 7 scenarios covering:
- happy path
- failure or validation path
- authorization or permission behavior
- state changes or side effects
- integration outcomes
- visibility/reporting/audit effects when relevant


## Authoring Rules

- Generalize the story around the feature goal before choosing structure details.
- Ask for missing context only when it blocks quality; otherwise make explicit assumptions.
- Prefer domain language from the user over generic product wording.
- Separate business objective, functional behavior, and technical implications.
- Keep acceptance criteria testable and observable.
- Avoid embedding implementation details in the user story unless they are constraints.
- Do not invent entities or attribute tables unless the feature truly needs them.
- If the request is broad, break it into smaller stories or slices when that improves delivery clarity.

## How to Improve a Story

When asked to improve a story:

1. Validate the story goal: confirm the user outcome is explicit and meaningful.
2. Tighten the scope: distinguish included behavior from out-of-scope behavior.
3. Expand business rules: add missing permissions, state conditions, exceptions, and dependencies.
4. Strengthen flows: cover the main path and meaningful alternatives, not generic CRUD placeholders.
5. Review data impact only if applicable: check fields, contracts, mappings, and validations.
6. Improve acceptance criteria: make each scenario observable, specific, and aligned with the feature.
7. Check consistency: ensure summary, rules, flows, data, and criteria describe the same behavior.

## Adaptation Heuristics

Use these patterns depending on feature type:

- CRUD or master data: include data impact and lifecycle scenarios.
- Workflow or approval: emphasize states, transitions, actors, and exceptions.
- Integration: emphasize triggers, contracts, retries, failures, and reconciliation.
- Reporting or dashboard: emphasize filters, calculations, visibility, and refresh behavior.
- Automation or background process: emphasize triggers, timing, idempotency, and side effects.
- UX-heavy feature: emphasize navigation, entry points, feedback, blocking validations, and empty states.

If unsure, prioritize feature behavior and business value over storage structure.
