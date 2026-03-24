# Workflow: Implement wishlist: Core Logic

## Executable Contract

**Requirement:** Queries MUST be isolated to the requesting user via RLS policies.
**Description:** Enforced constraint extracted from markdown blueprint.

## Compiled Domain Instructions

**Step 1:** Implement strict auth checks guarding this boundary.
**Step 2:** Ensure RLS or application-level `Can` evaluations align with the Architecture above.
