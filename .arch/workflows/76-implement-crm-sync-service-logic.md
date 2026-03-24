# Workflow: Implement crm-sync: Service Logic

## Executable Contract

**Requirement:** Every sync operation MUST be idempotent to prevent duplicate profiles or events in the external platform.
**Description:** Enforced constraint extracted from markdown blueprint.

## Compiled Domain Instructions

**Step 1:** Create `services/crm-syncService.ts`.
**Step 2:** Write the required server action to fulfill the contract interface, ensuring pure execution without UI pollution.
