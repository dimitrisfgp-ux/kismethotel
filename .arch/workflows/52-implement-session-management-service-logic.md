# Workflow: Implement session-management: Service Logic

## Executable Contract

**Requirement:** The system MUST support explicit session invalidation (logout) that immediately prevents the old token from granting access.
**Description:** Enforced constraint extracted from markdown blueprint.

## Compiled Domain Instructions

**Step 1:** Create `services/session-managementService.ts`.
**Step 2:** Write the required server action to fulfill the contract interface, ensuring pure execution without UI pollution.
