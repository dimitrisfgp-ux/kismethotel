# Workflow: Implement order-history: UI Component

## Executable Contract

**Requirement:** Queries against `orders` MUST be wrapped in strict Row Level Security (RLS) policies enforcing `customer_id = auth.uid()`.
**Description:** Enforced constraint extracted from markdown blueprint.

## Compiled Domain Instructions
You must implement this using the **shadcn-ui** design system.

**Step 1:** Create `components/order-history/order-historyWidget.tsx`.
**Step 2:** Ensure any interactive boundary properly handles loading/error states without breaking Server-Side Rendering.
