# Workflow: Implement identity-providers: Service Logic

## Executable Contract

**Requirement:** OAuth callback endpoints MUST validate the state parameter to prevent CSRF and exchange codes server-side.
**Description:** Enforced constraint extracted from markdown blueprint.

## Compiled Domain Instructions

**Step 1:** Create `services/identity-providersService.ts`.
**Step 2:** Write the required server action to fulfill the contract interface, ensuring pure execution without UI pollution.
