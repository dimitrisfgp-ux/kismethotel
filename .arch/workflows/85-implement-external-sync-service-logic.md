# Workflow: Implement external-sync: Service Logic

## Executable Contract

**Requirement:** Long-running syncs MUST NOT execute within standard Vercel HTTP API limits. They MUST use robust background runners (Inngest, Upstash).
**Description:** Enforced constraint extracted from markdown blueprint.

## Compiled Domain Instructions

**Step 1:** Create `services/external-syncService.ts`.
**Step 2:** Write the required server action to fulfill the contract interface, ensuring pure execution without UI pollution.
