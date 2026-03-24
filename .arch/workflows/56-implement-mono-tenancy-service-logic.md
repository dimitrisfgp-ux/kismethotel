# Workflow: Implement mono-tenancy: Service Logic

## Executable Contract

**Requirement:** Must implement strict vertical Permission boundaries (RBAC) on all queries, ignoring horizontal multi-tenant IDs.
**Description:** Enforced constraint extracted from markdown blueprint.

## Compiled Domain Instructions

**Step 1:** Create `services/mono-tenancyService.ts`.
**Step 2:** Write the required server action to fulfill the contract interface, ensuring pure execution without UI pollution.
