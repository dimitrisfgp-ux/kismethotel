# Workflow: Implement product-reviews: Service Logic

## Executable Contract

**Requirement:** Mutations creating a new Review MUST enforce that the user has a `DELIVERED` Order containing the specific product.
**Description:** Enforced constraint extracted from markdown blueprint.

## Compiled Domain Instructions

**Step 1:** Create `services/product-reviewsService.ts`.
**Step 2:** Write the required server action to fulfill the contract interface, ensuring pure execution without UI pollution.
