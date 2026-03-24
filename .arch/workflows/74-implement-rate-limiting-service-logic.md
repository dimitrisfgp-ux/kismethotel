# Workflow: Implement rate-limiting: Service Logic

## Executable Contract

**Requirement:** Rate limit counters SHOULD use Redis (Upstash) for accuracy under concurrent load.
**Description:** Enforced constraint extracted from markdown blueprint.

## Compiled Domain Instructions

**Step 1:** Create `services/rate-limitingService.ts`.
**Step 2:** Write the required server action to fulfill the contract interface, ensuring pure execution without UI pollution.
