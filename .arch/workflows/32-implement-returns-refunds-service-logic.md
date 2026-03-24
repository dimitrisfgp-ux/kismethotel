# Workflow: Implement returns-refunds: Service Logic

## Executable Contract

**Requirement:** Inventory restock MUST only occur when `restock_approved = true` on the inspected return item.
**Description:** Enforced constraint extracted from markdown blueprint.

## Compiled Domain Instructions

**Step 1:** Create `services/returns-refundsService.ts`.
**Step 2:** Write the required server action to fulfill the contract interface, ensuring pure execution without UI pollution.
