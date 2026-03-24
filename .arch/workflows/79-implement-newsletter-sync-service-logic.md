# Workflow: Implement newsletter-sync: Service Logic

## Executable Contract

**Requirement:** Synchronizing data to a CRM MUST happen asynchronously (via Inngest, BullMQ, or edge tasks) to avoid blocking checkout.
**Description:** Enforced constraint extracted from markdown blueprint.

## Compiled Domain Instructions

**Step 1:** Create `services/newsletter-syncService.ts`.
**Step 2:** Write the required server action to fulfill the contract interface, ensuring pure execution without UI pollution.
