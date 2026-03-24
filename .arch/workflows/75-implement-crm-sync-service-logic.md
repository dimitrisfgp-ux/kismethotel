# Workflow: Implement crm-sync: Service Logic

## Executable Contract

**Requirement:** Data synchronization to external CRM platforms MUST happen asynchronously, never blocking user-facing operations.
**Description:** Enforced constraint extracted from markdown blueprint.

## Compiled Domain Instructions

**Step 1:** Create `services/crm-syncService.ts`.
**Step 2:** Write the required server action to fulfill the contract interface, ensuring pure execution without UI pollution.
