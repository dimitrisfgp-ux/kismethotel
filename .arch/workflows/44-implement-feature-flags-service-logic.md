# Workflow: Implement feature-flags: Service Logic

## Executable Contract

**Requirement:** Flag evaluation MUST happen server-side — flags must never be evaluated using raw client-side DB access.
**Description:** Enforced constraint extracted from markdown blueprint.

## Compiled Domain Instructions

**Step 1:** Create `services/feature-flagsService.ts`.
**Step 2:** Write the required server action to fulfill the contract interface, ensuring pure execution without UI pollution.
