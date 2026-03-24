# Workflow: Implement media-library: Core Logic

## Executable Contract

**Requirement:** File uploads MUST utilize presigned URLs or direct connections to Blob Storage.
**Description:** Enforced constraint extracted from markdown blueprint.

## Compiled Domain Instructions

**Step 1:** Implement strict auth checks guarding this boundary.
**Step 2:** Ensure RLS or application-level `Can` evaluations align with the Architecture above.
