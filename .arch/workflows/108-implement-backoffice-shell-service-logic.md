# Workflow: Implement backoffice-shell: Service Logic

## Executable Contract

**Requirement:** Unlike the Storefront layout, this layout MUST wrap its children in an Auth/Role Gate boundary ensuring unauthenticated access bounces instantly.
**Description:** Enforced constraint extracted from markdown blueprint.

## Compiled Domain Instructions

**Step 1:** Create `services/backoffice-shellService.ts`.
**Step 2:** Write the required server action to fulfill the contract interface, ensuring pure execution without UI pollution.
