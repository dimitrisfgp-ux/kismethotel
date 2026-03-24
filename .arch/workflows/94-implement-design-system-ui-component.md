# Workflow: Implement design-system: UI Component

## Executable Contract

**Requirement:** You MUST NOT hardcode raw hex values in individual Next.js component files; all coloring MUST route through the Tailwind tailwind.config.ts `theme.extend` mapped to the injected CSS variables.
**Description:** Enforced constraint extracted from markdown blueprint.

## Compiled Domain Instructions
You must implement this using the **shadcn-ui** design system.

**Step 1:** Create `components/design-system/design-systemWidget.tsx`.
**Step 2:** Ensure any interactive boundary properly handles loading/error states without breaking Server-Side Rendering.
