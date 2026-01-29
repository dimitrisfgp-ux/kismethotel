---
description: Create mock data, services, and helper utilities
---

# 2. Data & Services Layer

This workflow sets up the data layer using mock data files and service abstractions, strictly for Frontend Prototype.

## 2.1 Mock Data (Detailed)
- [ ] Create `/src/data/amenities.ts`:
    - List amenities from "Amenity Table" (AC, Wifi, etc.) with Lucide icon names.
- [ ] Create `/src/data/rooms.ts`:
    - Create 10 specific rooms: **Aegean Suite, Knossos, Meltemi, Olive Grove, Horizon, Selene, Zephyr, Iris, Poseidon, Elysium**.
    - Ensure correct fields: `beds`, `sections`, `sizeSqm`, `images` (placeholders).
- [ ] Create `/src/data/conveniences.ts`:
    - Add items: Supermarket, Bus Station, Car Rental, Beach, Pharmacy (include fake lat/lng around a central point).
- [ ] Create `/src/data/attractions.ts`:
    - Add items with generic high-key descriptions.
- [ ] Create `/src/data/faqs.ts`:
    - Add generic questions (Check-in time, Breakfast, etc.).
- [ ] Export all from `/src/data/index.ts`.

## 2.2 Services (Frontend Abstractions)
- [ ] Create `/src/services/roomService.ts`:
    - `getRooms()`: Returns mock array.
    - `getRoomBySlug(slug)`: Find in mock array.
    - `getRoomAvailability(roomId, dates)`: **Mock Logic** - Return random "unavailable" dates or hardcoded blocks for prototype.
- [ ] Create `/src/lib/placeholders.ts`:
    - Export constant `PLACEHOLDER_IMAGE = "https://placehold.co/800x600/E8DCC4/2F3437?text=Kismet+Hotel"`.
    - Use this for all mock data image fields initially.
- [ ] Create `/src/services/contentService.ts`:
    - `getAttractions()`, `getFAQs()`, `getConveniences()`.

## 2.3 Utilities
- [ ] Create `/src/lib/priceCalculator.ts`:
    - `calculateTotal(pricePerNight, nights)` functionality.
- [ ] Create `/src/lib/filterHelpers.ts`:
    - `matchesPrice(room, range)`, `matchesOccupancy(room, guests)`, etc.
    - Pure functions to keep hooks clean.
- [ ] Create `/src/lib/availability.ts`:
    - Helper `isDateAvailable(date, unavailableRanges)`.
- [ ] Create `/src/lib/mapHelpers.ts`:
    - `getPinPosition(lat, lng)`: Implement the linear interpolation math based on fixed map bounds (define arbitrary bounds for now).
