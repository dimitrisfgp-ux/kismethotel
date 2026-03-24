# Workflow: Implement auth-flows: Core Logic

## Executable Contract

**Requirement:** It MUST NEVER be accessible via `localStorage` or `document.cookie`.
**Description:** Enforced constraint extracted from markdown blueprint.

## Compiled Domain Instructions

**Step 1:** Implement strict auth checks guarding this boundary.
**Step 2:** Ensure RLS or application-level `Can` evaluations align with the Architecture above.
