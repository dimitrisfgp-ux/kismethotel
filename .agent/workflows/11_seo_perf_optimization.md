---
description: Implement SEO Metadata and Performance Optimization
---

# 11. SEO & Performance Optimization

This workflow applies final polish and SEO metadata.

## 11.1 SEO Metadata
- [ ] Update `/src/app/layout.tsx`:
    - Title Template: `%s | Kismet - Boutique Accommodations`.
    - Description: "Luxury Greek Island accommodations..."
    - Open Graph: Image from `implementation_plan.md` assets recommendation.
- [ ] Update `/src/app/rooms/[slug]/page.tsx`:
    - Dynamic title: `Room Name | Kismet`.
    - Dynamic description: First sentence of room description.
- [ ] Create `/src/app/sitemap.ts`:
    - iterate room list to generate XML.
- [ ] Create `/src/app/robots.ts`.

## 11.2 Performance
- [ ] Run Lighthouse Audit (Target 90+).
- [ ] Optimize Images:
    - Add `priority` to Hero images.
    - Ensure `sizes` attribute matches grid layout (`50vw` on desktop, `100vw` on mobile).
- [ ] Loading States:
    - Create `/src/app/loading.tsx` with a simple "Aegean" spinner/skeleton.
