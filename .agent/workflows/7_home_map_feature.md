---
description: Implement Map Section with 'Silver Bullet' positioning
---

# 7. Home Page: Map & Conveniences

This workflow focuses exclusively on the "Silver Bullet" static map implementation and the accompanying conveniences checklist.

## 7.1 Map Logic (The Silver Bullet)
- [ ] Create `/src/lib/mapHelpers.ts` (if not created in Workflow 2):
    - **Constants**: Define `BOUNDS = { N, S, E, W }` (use placeholder values for Crete prototype area until image is exported).
    - **Function**: `getPinPosition(lat, lng)` returns `{ left: 'xx%', top: 'yy%' }`.
    - **Formula**:
        ```typescript
        const x = (lng - W) / (E - W) * 100;
        const y = (N - lat) / (N - S) * 100;
        return { left: `${x}%`, top: `${y}%` };
        ```

## 7.2 Map Component
- [ ] Create `/src/components/home/StaticMap.tsx`:
    - **Container**: Relative, `aspect-video` (16:9), `w-full` (Full Screen Width), shadow-sm, border-y `border-[var(--color-sand)]`.
    - **Image**: Next.js `<Image>` fill, object-cover. Use a placeholder high-res map for now.
    - **Pins Layer**: Absolute overlay.

## 7.3 Pins & Popups
- [ ] Create `/src/components/home/MapPin.tsx`:
    - **Props**: `type: 'hotel' | 'convenience'`, `onClick`.
    - **Style**:
        - Hotel: 32px Gold Icon (`var(--color-accent-gold)`).
        - Convenience: 24px Blue Dot (`var(--color-deep-med)`).
    - **Interaction**: Hover scale 1.15.
- [ ] Create `/src/components/home/PinPopup.tsx`:
    - **Style**: White bg, rounded-sm, shadow-lg, absolute (adjust position to stay on screen).
    - **Content**: Title (Inter 600) + Type (Inter 400 gray).

## 7.4 Conveniences Grid
- [ ] Create `/src/components/home/ConveniencesGrid.tsx`:
    - **Data**: Fetch from `contentService.getConveniences()`.
    - **Layout**: Flex wrap centered or Simple Grid.
    - **Card**: Minimalist. Icon + Label + "Type" (Bus, Beach, etc.).
    - **Hover**: Border color change to Aegean Blue.

## 7.5 Page Integration
- [ ] Update `/src/app/page.tsx` to include the **Map and Conveniences Section**:
    - Place `<StaticMap />` and `<ConveniencesGrid />` below the RoomsGrid.
    - Wrap in a container with "Location" SectionHeading.
