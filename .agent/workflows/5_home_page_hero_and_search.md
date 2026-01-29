---
description: Implement Home Page Hero Section (Top Fold)
---

# 5. Home Page: Hero

This workflow implements the top section of the home page (the "Hero" fold), setting the "Destiny" tone immediately upon load.

## 5.1 Hero Section Implementation
- [ ] Create `/src/components/home/Hero.tsx`:
    - **Full-screen**: `h-screen` or `100vh`.
    - **Video Background**: Use a placeholder if the video asset is missing, but prepare the `<video>` tag with `loop`, `muted`, and `playsinline` attributes.
    - **Overlay**: Apply an `rgba(47, 52, 55, 0.2)` gradient to ensure text readability against the video.
    - **Typography**: Display "YOUR DESTINY AWAITS" in Montserrat 700 uppercase centered in the screen.
    - **Scroll Indicator**: Add a subtle bounce animation at the bottom to encourage scrolling.

## 5.2 Updates to Page
- [ ] Integrate Hero component into `/src/app/page.tsx` as the first section.
