# Workflow: Implement rate-limiting: Service Logic

## Executable Contract

**Requirement:** Rate limiting MUST be applied at the Edge/middleware layer, not inside application handlers.
**Description:** Enforced constraint extracted from markdown blueprint.

## Compiled Domain Instructions

**Step 1:** Create `services/rate-limitingService.ts`.
**Step 2:** Write the required server action to fulfill the contract interface, ensuring pure execution without UI pollution.
