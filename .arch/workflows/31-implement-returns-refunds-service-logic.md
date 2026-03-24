# Workflow: Implement returns-refunds: Service Logic

## Executable Contract

**Requirement:** Every status transition MUST append a row to `return_status_history` — the history is the audit trail.
**Description:** Enforced constraint extracted from markdown blueprint.

## Compiled Domain Instructions

**Step 1:** Create `services/returns-refundsService.ts`.
**Step 2:** Write the required server action to fulfill the contract interface, ensuring pure execution without UI pollution.
