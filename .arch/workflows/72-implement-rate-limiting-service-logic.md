# Workflow: Implement rate-limiting: Service Logic

## Executable Contract

**Requirement:** Auth endpoints MUST have a rate limit of ≤10 requests/minute per IP.
**Description:** Enforced constraint extracted from markdown blueprint.

## Compiled Domain Instructions

**Step 1:** Create `services/rate-limitingService.ts`.
**Step 2:** Write the required server action to fulfill the contract interface, ensuring pure execution without UI pollution.
