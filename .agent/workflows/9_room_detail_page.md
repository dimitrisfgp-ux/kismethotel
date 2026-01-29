---
description: Implement Room Detail Page
---

# 9. Room Detail Page

This workflow implements the detailed room view component.

## 9.1 Page Route Setup
- [ ] Create `/src/app/rooms/[slug]/page.tsx`:
    - Fetch room data by slug (mock service).
    - Handle "Not Found" state if slug is invalid.

## 9.2 Layout Components
- [ ] Create `/src/components/rooms/ImageGallery.tsx`:
    - **Hero**: `aspect-video` full width.
    - **Grid**: 4 small thumbnails below.
- [ ] Create `/src/components/rooms/RoomInfo.tsx`:
    - **Header**: Title (H1 Montserrat) + "1 of 10" Badge.
    - **Specs Row**: Icons for `sizeSqm`, `floor`, `maxOccupancy`.
    - **Composition**: "Bedroom: 1", "Kitchen: 1" (using `sections` data).
    - **Amenities**: Grid of icon + label (AC, Wifi, TV).
- [ ] Create `/src/components/rooms/AmenityIcon.tsx`:
    - **Props**: `name` (string), `size` (number).
    - **Logic**: Map string name to Lucide Icon component.

## 9.3 Booking Card (Sticky Sidebar)
- [ ] Create `/src/components/booking/BookingCard.tsx`:
    - **Position**: `sticky top-[var(--header-height)]`.
    - **Style**: White bg, border `border-[var(--color-sand)]`, shadow-lg.
    - **Price**: "€XXX / night" (Large Montserrat).
    - **Inputs**: `DateRangePicker` (inline mode) + Guest Select.
    - **Summary**: "4 nights x €100 = €400".
    - **CTA**: "Request to Book" (Aegean Blue). Disable if dates blocked.

## 9.4 Contact CTA
- [ ] Create `/src/components/rooms/ContactCTA.tsx`:
    - **Layout**: Gray/Sand background section at bottom.
    - **Text**: "Have questions about this room?"
    - **Actions**: "Chat now" (triggers Widget) or "Email us" (scrolls to footer).

## 9.5 Page Assembly
- [ ] Assemble `/src/app/rooms/[slug]/page.tsx` structure:
    ```tsx
    <Container>
      <ImageGallery />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 mt-8">
         <RoomInfo />
         <aside>
           <BookingCard />
         </aside>
      </div>
      <ContactCTA />
    </Container>
    ```
