---
description: Initialize Next.js project, setup Tailwind, fonts, and TS types
---

# 1. Project Setup & Foundations

This workflow initializes the Next.js project and sets up the foundational technologies with the "Aegean Serenity" design system.

## 1.1 Initialize Next.js
- [ ] Initialize Next.js 14+ app (if not already done).
   ```bash
   npx create-next-app@latest . --typescript --tailwind --eslint
   npm install lucide-react clsx tailwind-merge date-fns
   ```
   (Skip if project already exists and has these configured).

## 1.2 Configure Tailwind CSS
    - **Add Animations**:
        - `ease-premium`: `cubic-bezier(0.4, 0, 0.2, 1)`.
        - `transition-smooth`: `0.3s`.
        - `transition-slow`: `0.5s`.
    - **Add Fonts**:
        - `Montserrat`: weights 600, 700 (Headings).
        - `Inter`: weights 400, 500 (Body).

## 1.3 Folder Structure
- [ ] Create directory structure:
   ```
   /src
     /components/ui
     /components/layout
     /components/home
     /components/rooms
     /components/booking
     /hooks
     /services
     /data
     /types
     /lib
   ```
- [ ] Ensure no backend folders (api routes usually not needed for static/mock, but keep `app/api` if mocking endpoints).

## 1.4 Global CSS
- [ ] Update `src/app/globals.css`:
    - Define CSS variables for colors, shadows, animations, and border-radius tokens (`--radius-sharp`, `--radius-subtle`).
    - Implement "Fluid Typography" variables (`--font-h1`, `--font-body`).

## 1.5 Fonts
- [ ] Configure `next/font/google` in `src/app/layout.tsx`.
    - `Montserrat`: Weights 600, 700. Variable: `--font-montserrat`.
    - `Inter`: Weights 400, 500. Variable: `--font-inter`.

## 1.6 TypeScript Types
- [ ] Create `/src/types/index.ts`.
- [ ] Define interfaces matching the "TypeScript Interfaces" section:
    - `Room` (include beds, sections, amenities)
    - `Booking` (status: held, confirmed)
    - `Amenity`
    - `Convenience`
    - `Attraction`
    - `FAQ`
    - `RoomBlock`
    - `RoomFilters` interface (priceRange, minOccupancy, etc.)
