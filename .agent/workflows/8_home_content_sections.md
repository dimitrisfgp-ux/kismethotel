---
description: Implement Home Page Exploration Sections (Attractions, FAQ)
---

# 8. Home Page: Exploration Sections

This workflow implements the "Exploration" content sections: Attractions (Anticipation) and FAQ (Utility).

## 8.1 Attractions Section
- [ ] Create `/src/components/home/AttractionsGrid.tsx`:
- [ ] Create `/src/components/home/AttractionsGrid.tsx`:
    - **Layout**: Masonry-style (using CSS Grid columns).
    - **Container**: Full width `w-full` (no margins).
    - **Data**: `contentService.getAttractions()`.
- [ ] Create `/src/components/home/AttractionCard.tsx`:
    - **Image**: Large, high-key, saturated. Hover: `scale(1.05)` (transition-slow).
    - **Overlay**: Gradient from bottom-left.
    - **Text**: Title (Montserrat white) + Distance Badge (Gold).

## 8.2 FAQ Section
- [ ] Create `/src/components/home/FAQAccordion.tsx`:
    - **Container**: `bg-[var(--color-warm-white)]`.
    - **Layout**: Center column `max-w-3xl`.
- [ ] Create `/src/components/home/FAQItem.tsx`:
    - **State**: Open/Closed.
    - **Header**: Question (Inter 500) + Toggle Icon (+/-).
    - **Body**: Answer (Inter 400, leading-relaxed).
    - **Animation**: CSS Grid `grid-template-rows` transition trick for smooth height animation.

## 8.3 Page Integration
- [ ] Update `/src/app/page.tsx` to include these sections in order:
    1.  `(HeroSection - aligned in Workflow 5)`
    2.  `(RoomsSection - aligned in Workflow 6)`
    3.  `(MapSection - aligned in Workflow 7)`
    4.  **<AttractionsGrid />** (Section Title: "Explore Crete")
    5.  **<FAQAccordion />** (Section Title: "Good to Know")
