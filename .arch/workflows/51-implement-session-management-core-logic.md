# Workflow: Implement session-management: Core Logic

## Executable Contract

**Requirement:** The active session credential MUST be stored in an HttpOnly, Secure, SameSite cookie. It MUST NEVER be accessible via client-side JavaScript.
**Description:** Enforced constraint extracted from markdown blueprint.

## Compiled Domain Instructions

**Step 1:** Implement strict auth checks guarding this boundary.
**Step 2:** Ensure RLS or application-level `Can` evaluations align with the Architecture above.
