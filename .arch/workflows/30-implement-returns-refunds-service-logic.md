# Workflow: Implement returns-refunds: Service Logic

## Executable Contract

**Requirement:** Refunds MUST be issued through the payment gateway (not just a DB record) before marking status as `refunded`.
**Description:** Enforced constraint extracted from markdown blueprint.

## Compiled Domain Instructions

**Step 1:** Create `services/returns-refundsService.ts`.
**Step 2:** Write the required server action to fulfill the contract interface, ensuring pure execution without UI pollution.
