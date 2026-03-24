# Workflow: Implement identity-providers: Service Logic

## Executable Contract

**Requirement:** Each identity method (OAuth, email/password, magic link) MUST be independently configurable.
**Description:** Enforced constraint extracted from markdown blueprint.

## Compiled Domain Instructions

**Step 1:** Create `services/identity-providersService.ts`.
**Step 2:** Write the required server action to fulfill the contract interface, ensuring pure execution without UI pollution.
