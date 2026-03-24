# Workflow: Implement audit-log: Service Logic

## Executable Contract

**Requirement:** Actor email and role MUST be snapshotted at event time (not FK-only) to preserve historical accuracy.
**Description:** Enforced constraint extracted from markdown blueprint.

## Compiled Domain Instructions

**Step 1:** Create `services/audit-logService.ts`.
**Step 2:** Write the required server action to fulfill the contract interface, ensuring pure execution without UI pollution.
