# Workflow: Implement inventory-sync: Service Logic

## Executable Contract

**Requirement:** Application MUST NEVER read stock, subtract in memory, and write back.
**Description:** Enforced constraint extracted from markdown blueprint.

## Compiled Domain Instructions

**Step 1:** Create `services/inventory-syncService.ts`.
**Step 2:** Write the required server action to fulfill the contract interface, ensuring pure execution without UI pollution.
