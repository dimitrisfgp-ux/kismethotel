---
description: Implement global layout components (Header, Footer, Navigation)
---

# 4. Layout & Navigation Structure

This workflow implements the main application shell, including the responsive header and footer with specific "Aegean" behaviors.

## 4.1 Header & Navigation
- [ ] Create `/src/components/layout/Header.tsx`:
    - **Scroll Behavior**: `transparent` at top -> `white` background + `shadow-md` on scroll. Toggle logo color (White -> Dark).
    - **Position**: `fixed`, `z-index: 50`.
- [ ] Create `/src/components/layout/DesktopNav.tsx`:
    - Links: Home, Rooms (Dropdown), Contact.
    - Font: Inter, uppercase, 500 weight, tracking.
- [ ] Create `/src/components/layout/RoomsDropdown.tsx`:
    - Lists all 10 curated rooms.
    - Animation: Fade in + Slide down (`translateY(8px)` -> `0`).
    - Styling: White bg, border, shadow-lg.
- [ ] Create `/src/components/layout/MobileMenu.tsx`:
    - **Burger Icon**: Animated to X (rotate 45deg, opacity toggle).
    - **Panel**: Slide in from right (`translateX(100%)` -> `0`) with `ease-premium`.
    - **Staggered Items**: Menu items fade/slide in sequentially (50ms delay steps: 0ms, 50ms, 100ms...).

## 4.2 Footer
- [ ] Create `/src/components/layout/Footer.tsx`:
    - Bg: Charcoal. Text: Sand.
    - 2-Column layout (Contact Info + Form).
    - Links: Privacy, Terms.
- [ ] Create `/src/components/layout/ContactForm.tsx`:
    - Input bg: `rgba(255,255,255,0.05)`.
    - Submit button: Aegean Blue.

## 4.3 Floating Widget
- [ ] Create `/src/components/layout/FloatingWidget.tsx`:
    - **FAB**: Bottom-right fixed. Aegean Blue circle.
    - **Expansion**: Reveals staggered bubbles (WhatsApp, Viber, Call) with spring animation.
- [ ] Integrate Header, Footer, and Widget into `/src/app/layout.tsx`.
- [ ] Wrap `children` (or specific content) with `DateContextProvider` (created in Workflow 3). *Note: Ensure this is a client component or wrapped correctly.*
