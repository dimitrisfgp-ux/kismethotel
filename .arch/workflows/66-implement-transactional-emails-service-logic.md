# Workflow: Implement transactional-emails: Service Logic

## Executable Contract

**Requirement:** Transactional emails MUST NOT be sent through the same IP pools or marketing pipelines as Newsletter campaigns.
**Description:** Enforced constraint extracted from markdown blueprint.

## Compiled Domain Instructions

**Step 1:** Create `services/transactional-emailsService.ts`.
**Step 2:** Write the required server action to fulfill the contract interface, ensuring pure execution without UI pollution.
