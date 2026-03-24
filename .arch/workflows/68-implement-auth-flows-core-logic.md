# Workflow: Implement auth-flows: Core Logic

## Executable Contract

**Requirement:** The active Session Token MUST be stored in an `HttpOnly`, `Secure`, `SameSite=Lax` browser cookie.
**Description:** Enforced constraint extracted from markdown blueprint.

## Compiled Domain Instructions

**Step 1:** Implement strict auth checks guarding this boundary.
**Step 2:** Ensure RLS or application-level `Can` evaluations align with the Architecture above.
