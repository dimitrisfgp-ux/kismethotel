# Workflow: Implement tax-engine: Service Logic

## Executable Contract

**Requirement:** Tax calculations MUST occur exclusively on the server during checkout. Client-provided tax amounts MUST NEVER be trusted.
**Description:** Enforced constraint extracted from markdown blueprint.

## Compiled Domain Instructions

**Step 1:** Create `services/tax-engineService.ts`.
**Step 2:** Write the required server action to fulfill the contract interface, ensuring pure execution without UI pollution.
