# Workflow: Implement audit-log: Service Logic

## Executable Contract

**Requirement:** audit_log MUST be append-only — no UPDATE or DELETE operations permitted.
**Description:** Enforced constraint extracted from markdown blueprint.

## Compiled Domain Instructions

**Step 1:** Create `services/audit-logService.ts`.
**Step 2:** Write the required server action to fulfill the contract interface, ensuring pure execution without UI pollution.
