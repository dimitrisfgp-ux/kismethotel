# Workflow: Implement courier-integration: Service Logic

## Executable Contract

**Requirement:** Tracking status polling MUST execute as background jobs, not within user-facing request cycles.
**Description:** Enforced constraint extracted from markdown blueprint.

## Compiled Domain Instructions

**Step 1:** Create `services/courier-integrationService.ts`.
**Step 2:** Write the required server action to fulfill the contract interface, ensuring pure execution without UI pollution.
