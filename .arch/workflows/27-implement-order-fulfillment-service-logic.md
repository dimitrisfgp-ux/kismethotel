# Workflow: Implement order-fulfillment: Service Logic

## Executable Contract

**Requirement:** Transitions between states MUST be the sole triggers for fulfillment side-effects (e.g., delivery emails).
**Description:** Enforced constraint extracted from markdown blueprint.

## Compiled Domain Instructions

**Step 1:** Create `services/order-fulfillmentService.ts`.
**Step 2:** Write the required server action to fulfill the contract interface, ensuring pure execution without UI pollution.
