---
description: Implement reusable core UI components (atoms)
---

# 3. Core UI System

This workflow implements the fundamental UI components, strictly adhering to the "Component Style Guide" in the implementation plan.

## 3.1 Atoms
- [ ] Create `/src/components/ui/Button.tsx`:
    - **Primary Base**: `bg-[var(--color-aegean-blue)]` text-white uppercase tracking-[0.08em] font-medium.
    - **Primary Hover**: `translate-y-[-2px]` shadow-[var(--shadow-hover)] bg-[var(--color-deep-med)].
    - **Secondary**: Transparent bg, border `border-[var(--color-aegean-blue)]` text-[var(--color-aegean-blue)].
    - **Transition**: `transition-all duration-300 ease-[var(--ease-premium)]`.
- [ ] Create `/src/components/ui/Input.tsx`:
    - **Base**: Bg-white, border `border-[var(--color-sand)]`, text-[var(--color-charcoal)].
    - **Focus**: Border `border-[var(--color-aegean-blue)]` ring-1 ring-[var(--color-aegean-blue)].
    - **Radius**: `rounded-[var(--radius-subtle)]` (4px).
- [ ] Create `/src/components/ui/Badge.tsx`:
    - **Gold (Availability)**: `bg-[var(--color-accent-gold)]` text-white uppercase text-xs font-medium px-2 py-1 rounded-[var(--radius-sharp)].
    - **Gray (Booked)**: `bg-[var(--color-sand)]` opacity-50 text-[var(--color-charcoal)].
- [ ] Create `/src/components/ui/Skeleton.tsx`:
    - **Base**: `bg-[var(--color-sand)]/20` animate-pulse rounded-[var(--radius-subtle)].
- [ ] Create `/src/components/ui/Toast.tsx`:
    - **Types**: Success (Green), Error (Red).
    - **Style**: Fixed bottom-left, slide-in animation.
    - **Content**: Icon + Message.

## 3.2 Layout & Typography
- [ ] Create `/src/components/ui/Container.tsx`:
    - Max-width logic: `w-[min(100%-2rem,var(--container-max))]` mx-auto.
- [ ] Create `/src/components/ui/SectionHeading.tsx`:
    - `font-montserrat` font-semibold uppercase tracking-[0.15em] text-[var(--color-charcoal)].
    - Responsive size: `text-[length:var(--font-h2)]`.

## 3.3 Interactive
- [ ] Create `/src/components/ui/Dropdown.tsx`:
    - Trigger: Styled like Input.
    - Menu: Bg-white, shadow-lg, border `border-[var(--color-sand)]`.
    - Item Hover: `bg-[var(--color-warm-white)]` text-[var(--color-aegean-blue)].
    - Animation: `transition-all duration-200 ease-[var(--ease-premium)]` opacity/transform.

## 3.4 Global State & Context
- [ ] Create `/src/contexts/DateContext.tsx` (or `/src/hooks/useDateContext.tsx` if preferred pattern):
    - **State**: `dateRange` ({ form: Date, to: Date }), `bedCount` (number).
    - **Exports**: `DateProvider`, `useDateContext`.
- [ ] Create `/src/hooks/useDateParams.ts`:
    - Sync state with URL params `?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD&beds=N` (useEffect).
