---
description: Generates a complete CRUD module from a user story to full implementation with tests.
---

# Redmine Workflow

This workflow guides you through the process of creating a new ticket  by redmine api. 

## Language 
Generate the user stories in Spanish.


## Steps

1.  **Generate User Story**
    If the requirement is an Entity CRUD, Use the `drax-crud-user-story` skill to generate an initial user story for your entity in specifications/crud.
    If the requirement is a feature, use the `drax-feature-user-story` skill to generate an initial user story for the feature in specifications/feature.

2.  **Edit User Story**
    **MANUAL STEP**: The developer must review and edit the generated user story file to refine requirements. **Do not proceed until this is done.**

3.  **Create Redmine Ticket**
    Once the user story is finalized, use the `redmine-api` skill to create the ticket.
