# Workflow: Implement identity-providers: Service Logic

## Executable Contract

**Requirement:** If a user signs up with one method and later uses another with the same email, identities MUST be merged or the collision explicitly handled — never silent duplicates.
**Description:** Enforced constraint extracted from markdown blueprint.

## Compiled Domain Instructions

**Step 1:** Create `services/identity-providersService.ts`.
**Step 2:** Write the required server action to fulfill the contract interface, ensuring pure execution without UI pollution.
