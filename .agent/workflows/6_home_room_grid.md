---
description: Implement Room Grid, Date Selector Bar, and Filter Widget
---

# 6. Home Page: Room Grid & Filters

This workflow implements the main content area: the Date/Bed Selector Bar, the "Precise" Room Grid, and the filtering system.

## 6.1 Date & Bed Selector Bar
- [ ] Install `react-day-picker`.
- [ ] Create `/src/components/booking/DateRangePicker.tsx`:
    - **Theme**: Override default CSS.
    - **Selected**: `bg-[var(--color-aegean-blue)]` text-white.
    - **Range**: `bg-[var(--color-aegean-blue)]/10`.
    - **Today**: `text-[var(--color-aegean-blue)]` font-bold.
- [ ] Create `/src/components/home/DateSelectorBar.tsx`:
    - **Sticky**: `sticky top-[var(--header-height)] z-40`.
    - **Container**: White bg, border-y `border-[var(--color-sand)]`.
    - **Layout**: Flex row, inputs separated by vertical dividers.
    - **Shadow**: `shadow-sm`.

## 6.2 Selection State (Integration)
- [ ] Import `useDateContext` and `useDateParams` (created in Workflow 3).
- [ ] Ensure `DateSelectorBar` consumes `useDateContext` to display/update values.

## 6.3 Room Card
- [ ] Create `/src/components/rooms/RoomCard.tsx`:
    - **Structure**: Relative container, aspect-ratio `4/3` image.
    - **Badge**: "1 of 10" Gold Badge absolute top-right `m-3`.
    - **Hover Overlay**: Absolute bottom inset, gradient `from-transparent to-[rgba(47,52,55,0.85)]`, transition `0.3s`.
    - **Image Hover**: `scale(1.05)` transition `0.5s` `ease-premium`.
    - **Content**: Room Name (Montserrat white), Price (Inter white).
    - **Action**: "View Details" button appears on hover.
    - **Booked State**: If `isBooked`, opacity 70%, add "Reserved" Gray Badge.

## 6.4 Rooms Grid
- [ ] Create `/src/components/home/RoomsGrid.tsx`:
    - **Grid**: `grid-cols-1 md:grid-cols-2`.
    - **Gap**: `gap-[var(--space-lg)] md:gap-[var(--space-xl)]`.
    - **Container**: Full width `w-full` (no max-width).
    - **Pagination**: Client-side slice (Page 1: 0-4, Page 2: 4-8, Page 3: 8-10).
    - **Transitions**: Animated opacity/transform when page changes.
    - **Integration**: Place `DateSelectorBar` immediately above grid.
- [ ] Create `/src/components/home/PaginationControls.tsx`:
    - **Props**: `currentPage`, `totalPages`, `onPageChange`.
    - **UI**: Arrows (Lucide Chevrons) + Dots (current = filled).
    - **Style**: Minimal, centered below grid.

## 6.5 Filter Widget (Floating)
- [ ] Create `/src/components/home/FilterWidget.tsx`:
    - **Trigger**: FAB (56px circle), Aegean Blue, fixed bottom-right.
    - **Visibility**: Hidden initially (opacity 0, translate-y-20px). Use `IntersectionObserver` on RoomsGrid to toggle class `visible` (opacity 1, translate-y-0).
    - **Panel**: Slide-up modal (mobile) or Popover (desktop).
- [ ] Create `/src/components/home/FilterPanel.tsx`:
    - **Price**: Dual slider (€50 - €500) filtering `pricePerNight`.
    - **Guests**: Select (1-6) filtering `maxOccupancy`.
    - **Size**: Checkboxes (Small <40m², Medium 40-70m², Large >70m²) filtering `sizeSqm`.
    - **Floor**: Checkboxes (Ground, 1st, 2nd) filtering `floor`.
    - **Composition**: Checkboxes (Bedroom count, Kitchen presence) filtering `sections`.
    - **Bed Type**: Checkboxes (Single, Double) filtering `beds`.
    - **Amenities**: Checkboxes (WiFi, AC, TV) filtering `amenity_ids`.

## 6.6 Filter Logic
- [ ] Create `/src/hooks/useRoomFilters.ts`:
    - Combine `DateContext` (availability check) + `FilterPanel` state.
    - Implement `filterRooms(rooms, filters)` function to check all conditions.
    - Return `visibleRooms`.
