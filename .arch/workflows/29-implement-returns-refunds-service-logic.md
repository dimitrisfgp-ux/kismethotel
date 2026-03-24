# Workflow: Implement returns-refunds: Service Logic

## Executable Contract

**Requirement:** Return window MUST be enforced server-side before inserting a return request — never rely on client-sent timestamps.
**Description:** Enforced constraint extracted from markdown blueprint.

## Compiled Domain Instructions

**Step 1:** Create `services/returns-refundsService.ts`.
**Step 2:** Write the required server action to fulfill the contract interface, ensuring pure execution without UI pollution.
