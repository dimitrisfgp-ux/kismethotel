# Workflow: Implement product-variants: Service Logic

## Executable Contract

**Requirement:** The `price` and `cost` integer columns MUST belong to the Variant SKU entity, not the Parent Product entity.
**Description:** Enforced constraint extracted from markdown blueprint.

## Compiled Domain Instructions

**Step 1:** Create `services/product-variantsService.ts`.
**Step 2:** Write the required server action to fulfill the contract interface, ensuring pure execution without UI pollution.
