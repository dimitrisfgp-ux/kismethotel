# Kismet - Boutique Accommodation Booking Platform

A curated, luxury accommodation booking experience focusing on quality over quantity. Kismet offers a small selection of premium Greek Island accommodations with emphasis on comfort, relaxation, and anticipation.

## Brand Overview

**Brand Personality**: Relaxation, Anticipation, Comfort  
**Keywords**: Minimalism, Luxury, Blue Sky, Greek Island  
**Target Audience**: Tourist Families, Luxury Seekers  
**Visual Style**: Clean, minimal, warm, without heavy curves  
**USP**: Curated selection (not bulk) - focus on experience quality and vacation comfort details

---

## Design System Conceptualization

### Color Palette - "Aegean Serenity"

```css
:root {
  /* Neutrals - Foundation (Relaxation & Clarity) */
  --color-warm-white: #FAFAF8; /* Primary Background */
  --color-sand:       #E8DCC4; /* Secondary Backgrounds / Borders */
  
  /* Primary Hues (Sea & Sky) */
  --color-aegean-blue: #4A90E2; /* Primary Buttons / Brand Accents */
  --color-deep-med:    #2C5F8D; /* Hover States / Trust / Stability */
  
  /* Accents (Premium & Anticipation) */
  --color-accent-gold: #C9A961; /* Limited availability badges */
  --color-charcoal:    #2F3437; /* Typography */
  
  /* Functional */
  --color-white:       #FFFFFF;
  --color-success:     #5F9B7C; /* Muted olive-green */
  --color-error:       #D47B6A; /* Warm terracotta */
  --color-warning:     #E8B44C; /* Warm gold */
  
  /* Opacity Variants */
  --color-overlay:     rgba(47, 52, 55, 0.6);
  --color-disabled:    rgba(232, 220, 196, 0.5);
}
```

### Typography System

**Headings**: Montserrat (Architectural, Premium)
- H1 (Hero): `clamp(2rem, 5vw, 3.5rem)` | 700 weight | uppercase | 0.2em letter-spacing
- H2 (Section): `clamp(1.5rem, 3.5vw, 2.25rem)` | 600 weight | uppercase | 0.15em letter-spacing

**Body & Navigation**: Inter (Clean, Readable)
- Body Copy: `clamp(0.9375rem, 1.5vw, 1rem)` | 400 weight | 1.7 line-height
- Nav Links: 0.85rem | 500 weight | uppercase | 0.12em letter-spacing

### Spacing System (8px base)

```css
:root {
  --space-xs:  0.5rem;  /* 8px */
  --space-sm:  1rem;    /* 16px */
  --space-md:  1.5rem;  /* 24px */
  --space-lg:  2.5rem;  /* 40px - "Luxury Margin" */
  --space-xl:  4rem;    /* 64px */
  --space-2xl: 6rem;    /* 96px - section spacing */
}
```

### Shadow System (Subtle Elevation)

```css
:root {
  --shadow-sm:    0 1px 2px rgba(47, 52, 55, 0.06);
  --shadow-md:    0 2px 8px rgba(47, 52, 55, 0.08);
  --shadow-lg:    0 4px 16px rgba(47, 52, 55, 0.10);
  --shadow-hover: 0 6px 20px rgba(74, 144, 226, 0.12); /* Aegean tint */
}
```

### Border Radius

```css
:root {
  --radius-sharp:  2px;  /* Buttons, badges */
  --radius-subtle: 4px;  /* Cards, inputs */
  --radius-none:   0;    /* Dividers, headers */
}
```

### Animation Standards

```css
:root {
  /* Timing */
  --transition-quick:  0.2s ease;
  --transition-smooth: 0.3s ease;
  --transition-slow:   0.5s ease;
  
  /* Easing */
  --ease-premium:     cubic-bezier(0.4, 0, 0.2, 1);
  --ease-anticipate:  cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-bounce:      cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

#### Consistent Animation Patterns

| Element | Property | Duration | Easing |
|---------|----------|----------|--------|
| **Buttons** | `translateY(-2px)`, `background`, `shadow` | `--transition-smooth` | `ease` |
| **Cards** | `transform: scale(1.02)`, `shadow` | `--transition-smooth` | `--ease-premium` |
| **Images** | `transform: scale(1.05)` | `--transition-slow` | `--ease-premium` |
| **Links** | `color`, `border-color` | `--transition-quick` | `ease` |
| **Icons** | `color`, `transform` | `--transition-quick` | `ease` |
| **Dropdowns** | `opacity`, `translateY(8px)` | `--transition-quick` | `--ease-premium` |
| **Modals** | `opacity`, `scale(0.95)` | `--transition-smooth` | `--ease-premium` |
| **Accordions** | `max-height`, `opacity` | `--transition-smooth` | `ease` |

#### Hover State Standards

```css
/* Buttons */
.btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
  transition: all var(--transition-smooth);
}

/* Cards */
.card:hover {
  transform: scale(1.02);
  box-shadow: var(--shadow-hover);
  transition: all var(--transition-smooth) var(--ease-premium);
}

/* Card Images */
.card-image:hover {
  transform: scale(1.05);
  transition: transform var(--transition-slow) var(--ease-premium);
}

/* Links */
a:hover {
  color: var(--color-aegean-blue);
  transition: color var(--transition-quick);
}

/* Icon Buttons */
.icon-btn:hover {
  color: var(--color-aegean-blue);
  transform: scale(1.1);
  transition: all var(--transition-quick);
}
```

#### Filter Widget Animations

```css
/* FAB Button */
.filter-fab {
  transition: transform var(--transition-smooth) var(--ease-anticipate),
              box-shadow var(--transition-smooth);
}
.filter-fab:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-hover);
}
.filter-fab:active {
  transform: scale(0.95);
}

/* Visibility (Intersection Observer) */
.filter-fab.hidden {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
  pointer-events: none;
}
.filter-fab.visible {
  opacity: 1;
  transform: translateY(0) scale(1);
  transition: opacity var(--transition-smooth) var(--ease-premium),
              transform var(--transition-smooth) var(--ease-anticipate);
}

/* Panel Expand */
.filter-panel {
  opacity: 0;
  transform: scale(0.9) translateY(10px);
  transform-origin: bottom right;
  pointer-events: none;
  transition: opacity var(--transition-smooth) var(--ease-premium),
              transform var(--transition-smooth) var(--ease-anticipate);
}
.filter-panel.open {
  opacity: 1;
  transform: scale(1) translateY(0);
  pointer-events: auto;
}

/* Panel Close */
.filter-panel.closing {
  opacity: 0;
  transform: scale(0.95) translateY(5px);
  transition: opacity var(--transition-quick),
              transform var(--transition-quick);
}
```

#### Stagger Animation Pattern

```css
/* Sequential reveal for lists */
.stagger-item {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity var(--transition-smooth), 
              transform var(--transition-smooth) var(--ease-premium);
}
.stagger-item.visible { opacity: 1; transform: translateY(0); }
.stagger-item:nth-child(1) { transition-delay: 0ms; }
.stagger-item:nth-child(2) { transition-delay: 50ms; }
.stagger-item:nth-child(3) { transition-delay: 100ms; }
.stagger-item:nth-child(4) { transition-delay: 150ms; }
.stagger-item:nth-child(5) { transition-delay: 200ms; }
```

> [!IMPORTANT]
> All animations use the same timing tokens for consistency. No inline durations.

### Iconography

- **Library**: Lucide React (outlined style)
- **Sizes**: 16px (inline), 24px (standard), 32px (features)
- **Colors**: Charcoal default, Aegean Blue for interactive states

---

## Visual Execution Rules

1. **No Grayscale**: All photography high-key, saturated, bright - celebrates destination beauty
2. **Micro-Animations**: CSS-based subtle zoom (1.0 → 1.05 on hover, 0.5s)
3. **White Space**: "Luxury Margin" - minimum 40px from container edges
4. **Precision**: Straight lines, thin 1px borders, minimal curves (2-4px max)
5. **Shadows**: Warm charcoal-based, blue-tinted on hover states

---

## Component Style Guide

### Core Components

#### Button (Primary)
| Property | Token |
|----------|-------|
| Background | `--color-aegean-blue` |
| Background (hover) | `--color-deep-med` |
| Text | `--color-white` |
| Font | Inter 500, 0.875rem, uppercase, 0.08em tracking |
| Padding | `--space-sm` `--space-md` (16px 24px) |
| Border Radius | `--radius-sharp` (2px) |
| Shadow | `--shadow-sm` → `--shadow-hover` on hover |
| Transition | `--transition-smooth` |
| Hover Effect | `translateY(-2px)` |

#### Button (Secondary)
| Property | Token |
|----------|-------|
| Background | transparent |
| Border | 1px `--color-aegean-blue` |
| Text | `--color-aegean-blue` |
| Hover | Fill `--color-aegean-blue`, text `--color-white` |

#### Input / Textarea
| Property | Token |
|----------|-------|
| Background | `--color-white` |
| Border | 1px `--color-sand` |
| Border (focus) | 1px `--color-aegean-blue` |
| Text | `--color-charcoal` |
| Placeholder | `--color-charcoal` at 50% opacity |
| Font | Inter 400, 1rem |
| Padding | `--space-sm` (16px) |
| Border Radius | `--radius-subtle` (4px) |

#### Badge (Gold)
| Property | Token |
|----------|-------|
| Background | `--color-accent-gold` |
| Text | `--color-white` |
| Font | Inter 500, 0.75rem, uppercase |
| Padding | 4px 8px |
| Border Radius | `--radius-sharp` (2px) |

---

### Layout Components

#### Header (Transparent State)
| Property | Token |
|----------|-------|
| Background | transparent |
| Text | `--color-white` |
| Logo | White variant |
| Position | `position: fixed`, `z-index: 50` |

#### Header (Solid State - on scroll)
| Property | Token |
|----------|-------|
| Background | `--color-white` |
| Text | `--color-charcoal` |
| Logo | Dark variant |
| Shadow | `--shadow-md` |
| Transition | `--transition-smooth` |

#### Footer
| Property | Token |
|----------|-------|
| Background | `--color-charcoal` |
| Text | `--color-sand` |
| Headings | `--color-white`, Montserrat 600 |
| Links (hover) | `--color-aegean-blue` |
| Input Background | `rgba(255,255,255,0.05)` |
| Divider | 1px `rgba(255,255,255,0.1)` |

---

### Room Components

#### RoomCard
| Property | Token |
|----------|-------|
| Background | `--color-white` |
| Border | 1px `--color-sand` |
| Border Radius | `--radius-subtle` (4px) |
| Shadow | `--shadow-md` |
| Shadow (hover) | `--shadow-hover` |
| Image Aspect | 4:3 |
| Image Hover | `scale(1.05)`, `--transition-slow` |
| Overlay Gradient | `linear-gradient(transparent, rgba(47,52,55,0.85))` |
| Title | Montserrat 600, `--color-white` |
| Price | Inter 500, `--color-white` |
| CTA | `--color-aegean-blue` → `--color-deep-med` |

#### BookingCard (Room Detail Page)
| Property | Token |
|----------|-------|
| Background | `--color-white` |
| Border | 1px `--color-sand` |
| Shadow | `--shadow-lg` |
| Position | `position: sticky`, `top: 100px` |
| Price Display | Montserrat 700, 1.5rem, `--color-charcoal` |
| Total | `--color-accent-gold` |
| CTA Button | Full-width Primary Button |

---

### Calendar / Date Picker

| Property | Token |
|----------|-------|
| Background | `--color-white` |
| Border | 1px `--color-sand` |
| Day (available) | `--color-charcoal` |
| Day (selected) | `--color-aegean-blue` bg, `--color-white` text |
| Day (range) | `--color-aegean-blue` at 15% opacity |
| Day (disabled) | `--color-disabled`, `cursor: not-allowed` |
| Navigation Arrows | `--color-charcoal` → `--color-aegean-blue` |

---

### Floating Widget

| Property | Token |
|----------|-------|
| FAB Background | `--color-aegean-blue` |
| FAB Icon | `--color-white`, 24px |
| FAB Size | 56px diameter |
| FAB Shadow | `--shadow-lg` |
| Bubble Background | `--color-white` |
| Bubble Border | 1px `--color-sand` |
| Bubble Shadow | `--shadow-md` |
| WhatsApp Icon | `#25D366` |
| Viber Icon | `#7360F2` |
| Phone Icon | `--color-aegean-blue` |
| Animation | `--ease-anticipate`, staggered 50ms |

---

### Map Section

#### Static Map Container
| Property | Token |
|----------|-------|
| Border | 1px `--color-sand` |
| Shadow | `--shadow-sm` |
| Aspect Ratio | 16:9 |

#### Map Pins
| Property | Token |
|----------|-------|
| Hotel Pin | `--color-accent-gold`, 32px |
| Convenience Pin | `--color-deep-med`, 24px |
| Pin Shadow | `--shadow-md` |
| Hover Scale | `scale(1.15)` |

#### Pin Popup
| Property | Token |
|----------|-------|
| Background | `--color-white` |
| Border | none |
| Shadow | `--shadow-lg` |
| Border Radius | `--radius-subtle` |
| Title | Inter 600, `--color-charcoal` |
| Type Label | Inter 400, `--color-charcoal` at 60% |

---

### Conveniences Grid

| Property | Token |
|----------|-------|
| Background | `--color-warm-white` |
| Item Background | `--color-white` |
| Item Border | 1px `--color-sand` |
| Item Border (hover) | 1px `--color-aegean-blue` |
| Icon | `--color-charcoal`, 24px |
| Label | Inter 500, 0.875rem, `--color-charcoal` |
| Padding | `--space-sm` (16px) |

---

### Attractions Grid

| Property | Token |
|----------|-------|
| Image Aspect | Mixed (masonry) |
| Overlay | `linear-gradient(transparent 50%, rgba(47,52,55,0.7))` |
| Title | Montserrat 600, `--color-white`, 1.25rem |
| Distance Badge | `--color-accent-gold` bg, `--color-white` text |
| Hover | Image `scale(1.03)` |

---

### FAQ Accordion

| Property | Token |
|----------|-------|
| Background | `--color-warm-white` |
| Question | Inter 500, `--color-charcoal` |
| Answer | Inter 400, `--color-charcoal`, 1.7 line-height |
| Expand Icon | `--color-accent-gold`, 24px |
| Divider | 1px `--color-sand` |
| Transition | `--transition-smooth` |

---

### Booking Wizard Steps

| Property | Token |
|----------|-------|
| Step Indicator (inactive) | `--color-sand` |
| Step Indicator (active) | `--color-aegean-blue` |
| Step Indicator (complete) | `--color-success` with checkmark |
| Step Line | 2px `--color-sand` |
| Card Background | `--color-white` |
| Card Shadow | `--shadow-lg` |

---

### Alert / Toast Messages

| Property | Token |
|----------|-------|
| Success Background | `--color-success` at 10% |
| Success Border | 1px `--color-success` |
| Success Icon | `--color-success` |
| Error Background | `--color-error` at 10% |
| Error Border | 1px `--color-error` |
| Error Icon | `--color-error` |
| Border Radius | `--radius-subtle` |

---

## Layout & Grid System

### Responsive Design Principles

> [!IMPORTANT]
> All sizing uses dynamic values. No hardcoded pixel values for layout.

**Core Techniques**:
- `clamp()` for fluid typography and spacing
- `min()` / `max()` for constrained flexibility
- `%` and `vw/vh` for relative sizing
- CSS Grid `auto-fit` / `auto-fill` for adaptive layouts
- Container queries where supported

### Fluid Typography

```css
:root {
  /* Headings scale with viewport */
  --font-h1: clamp(2rem, 5vw, 3.5rem);
  --font-h2: clamp(1.5rem, 3.5vw, 2.25rem);
  --font-h3: clamp(1.25rem, 2.5vw, 1.5rem);
  
  /* Body stays readable */
  --font-body: clamp(0.9375rem, 1.5vw, 1rem);
  --font-small: clamp(0.75rem, 1vw, 0.875rem);
}
```

### Fluid Spacing

```css
:root {
  /* Spacing scales proportionally */
  --space-xs:  clamp(0.25rem, 0.5vw, 0.5rem);
  --space-sm:  clamp(0.75rem, 1.5vw, 1rem);
  --space-md:  clamp(1rem, 2vw, 1.5rem);
  --space-lg:  clamp(1.5rem, 3vw, 2.5rem);
  --space-xl:  clamp(2rem, 5vw, 4rem);
  --space-2xl: clamp(3rem, 7vw, 6rem);
}
```

### Container System

```css
.container {
  width: min(100% - 2rem, var(--container-max));
  margin-inline: auto;
}

:root {
  --container-sm: min(640px, 100%);
  --container-md: min(768px, 100%);
  --container-lg: min(1024px, 100%);
  --container-xl: min(1280px, 100%);
}
```

### Breakpoints

| Name | Width | Usage |
|------|-------|-------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet portrait |
| `lg` | 1024px | Tablet landscape / Small desktop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Large desktop |

### Responsive Grid Patterns

```css
/* Auto-fit columns that shrink gracefully */
.room-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  gap: var(--space-xl);
}

/* Constrained 2-col max for curation */
.room-grid-curated {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-xl);
}

@media (max-width: 768px) {
  .room-grid-curated {
    grid-template-columns: 1fr;
  }
}
```

### Dynamic Component Sizing

| Element | Sizing Approach |
|---------|-----------------|
| **Buttons** | `padding: var(--space-sm) var(--space-md)` |
| **Cards** | `width: 100%`, constrained by grid |
| **Images** | `width: 100%`, `aspect-ratio: 4/3` |
| **Icons** | `clamp(1rem, 2vw, 1.5rem)` |
| **Touch Targets** | `min-height: 44px`, `min-width: 44px` |
| **Inputs** | `width: 100%`, `max-width: 400px` |

### Image Treatment

**Aspect Ratios** (maintained across breakpoints):
- Hero: `aspect-ratio: 16/9`
- Thumbnails: `aspect-ratio: 4/3`
- Features: `aspect-ratio: 1/1`

**Responsive Images**:
```jsx
<Image
  src={src}
  alt={alt}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

---

## Technology Stack

- **Framework**: Next.js 14+ (App Router, Server Components default)
- **Styling**: Tailwind CSS + CSS Variables
- **Language**: TypeScript
- **Icons**: Lucide React
- **Deployment**: Vercel
- **Backend**: Supabase (PostgreSQL) + Stripe Payments
- **Email**: Resend or SendGrid (transactional)

### Vercel Deployment

| Setting | Value |
|---------|-------|
| **Platform** | Vercel |
| **Framework Preset** | Next.js |
| **Build Command** | `next build` |
| **Output Directory** | `.next` |
| **Node Version** | 18.x or 20.x |

**Environment Variables (Vercel Dashboard)**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only)
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `ADMIN_EMAIL` (for booking notifications)

### Animation Priority Hierarchy

1. **CSS transitions/keyframes** → Hover states, opacity, transforms, colors
2. **CSS + Intersection Observer** → Viewport-based animations
3. **Framer Motion** → Only for complex orchestration (AnimatePresence, layout animations, gestures)

---

## Implementation Principles

### 1. Separation of Concerns

| Layer | Location | Responsibility |
|-------|----------|----------------|
| **UI** | `/components` | Presentational only, receives data via props |
| **Logic** | `/hooks` | State, effects, data transformation |
| **Data** | `/services` | Fetch abstraction (mock → Supabase swap) |
| **Types** | `/types` | Shared TypeScript interfaces |
| **Utilities** | `/lib` | Helpers (map math, date formatters, etc.) |

**Rule**: Components never import from `/data` directly. All data flows through services/hooks.

### 2. Ruleset Consultation

Reference these workspace memory files during implementation:
- `next-js-app-router.md` — Server/Client component decisions
- `nextjs-performance.md` — Image optimization, caching, streaming
- `react-hooks.md` — Hook patterns, dependency arrays
- `react-performance.md` — Memoization, code splitting
- `modern-css.md` — Grid, Flexbox, clamp(), custom properties
- `mobile-performance.md` — 60fps target, memory management
- `semantic-html.md` — Accessibility, ARIA, heading hierarchy

### 3. Performance Optimization

| Area | Strategy |
|------|----------|
| **Rendering** | Server Components default, Client only when interactive |
| **Images** | Next.js `<Image>`, WebP, blur-up, priority for LCP |
| **Animations** | CSS first, no JS for simple transitions |
| **Map** | Self-hosted static image (zero JS overhead) |
| **Bundle** | Dynamic imports, tree-shaking, minimal dependencies |
| **Data** | ISR where applicable, client cache for availability |

---

## Architecture

### System Overview

```
┌─────────────────────┐         ┌─────────────────────┐         ┌─────────────────────┐
│   CMS Admin Panel   │         │     Supabase        │         │   Kismet Frontend   │
│   (Separate App)    │  WRITE  │   (PostgreSQL +     │  READ   │   (Next.js)         │
│                     │ ──────► │    Edge Functions)  │ ◄────── │                     │
└─────────────────────┘         └──────────┬──────────┘         └──────────┬──────────┘
                                           │                               │
                                           │                               │
                                ┌──────────┴──────────┐         ┌──────────┴──────────┐
                                │       Stripe        │         │    Email Service    │
                                │   (Payments API)    │         │   (Resend/SendGrid) │
                                └─────────────────────┘         └─────────────────────┘
```

### Three-Layer Separation (Frontend)

```
/src
  /components     ← UI Layer (presentational, receives data via props)
  /hooks          ← Logic Layer (state, effects, data transformation)
  /services       ← Data fetching abstraction (mock → Supabase swap)
  /data           ← Mock data (temporary, mirrors Supabase schema)
  /types          ← TypeScript interfaces (shared across layers)
  /lib            ← Utilities, Supabase client, map helpers
```

---

## System Interactions

### Systems & Responsibilities

| System | Role | Writes To | Reads From |
|--------|------|-----------|------------|
| **Kismet Frontend** | Display, booking initiation | Bookings (hold creation) | Rooms, Amenities, Bookings, Blocks |
| **Supabase (Backend)** | Database, Edge Functions, Webhooks | All tables | Stripe events |
| **CMS Admin Panel** | Content management, booking management | Rooms, Amenities, Bookings, Blocks, FAQs, Attractions | All tables |
| **Stripe** | Payment processing | — | — |
| **Email Service** | Transactional emails | — | Booking data |

---

### Booking Flow — Complete Event Sequence

#### Phase 1: Page Load
```
Frontend                          Backend (Supabase)
    │                                   │
    │  GET /api/rooms/[id]              │
    │ ─────────────────────────────────►│
    │                                   │  Query: rooms + amenities
    │                                   │  Query: bookings (confirmed + held)
    │                                   │  Query: room_blocks
    │  { room, unavailableDates[] }     │
    │ ◄─────────────────────────────────│
    │                                   │
    ▼                                   │
 Render calendar                        │
 (disabled dates = unavailable)         │
```

#### Phase 2: Booking Initiation
```
Frontend                          Backend                          Stripe
    │                                   │                              │
    │  User selects dates               │                              │
    │  User fills form                  │                              │
    │  Clicks "Proceed to Payment"      │                              │
    │                                   │                              │
    │  POST /api/bookings/create        │                              │
    │  { roomId, dates, guestInfo }     │                              │
    │ ─────────────────────────────────►│                              │
    │                                   │                              │
    │                                   │  1. Re-verify availability   │
    │                                   │  2. Create booking (held)    │
    │                                   │  3. Create Stripe session    │
    │                                   │ ────────────────────────────►│
    │                                   │  { sessionId, url }          │
    │                                   │ ◄────────────────────────────│
    │  { checkoutUrl }                  │                              │
    │ ◄─────────────────────────────────│                              │
    │                                   │                              │
    │  Redirect to Stripe ─────────────────────────────────────────────►
```

#### Phase 3: Payment & Confirmation
```
User (Stripe Page)                Stripe                    Backend                    Email
    │                                │                          │                         │
    │  Completes payment             │                          │                         │
    │ ──────────────────────────────►│                          │                         │
    │                                │                          │                         │
    │                                │  Webhook: session.completed                        │
    │                                │ ────────────────────────►│                         │
    │                                │                          │                         │
    │                                │                          │  Update booking:        │
    │                                │                          │  status → confirmed     │
    │                                │                          │  paid_at → NOW()        │
    │                                │                          │                         │
    │                                │                          │  Send customer email    │
    │                                │                          │ ───────────────────────►│
    │                                │                          │  Send admin email       │
    │                                │                          │ ───────────────────────►│
    │                                │                          │                         │
    │  Redirect to success page      │                          │                         │
    │ ◄──────────────────────────────│                          │                         │
```

#### Phase 4: Hold Expiration (Abandoned Payment)
```
Backend (Scheduled Job / Supabase Function)
    │
    │  Every 5 minutes:
    │  UPDATE bookings
    │  SET status = 'expired'
    │  WHERE status = 'held'
    │  AND held_until < NOW()
    │
    ▼
 Dates become available again
```

---

### CMS Operations

| Operation | Tables Affected | Effect on Frontend |
|-----------|-----------------|-------------------|
| **Add/Edit Room** | `rooms` | Room list updates |
| **Add/Edit Amenity** | `amenities` | Room detail amenities update |
| **Block Dates** | `room_blocks` | Calendar shows dates as disabled |
| **Early Checkout** | `bookings.actual_check_out` | Remaining dates become available |
| **Cancel Booking** | `bookings.status` | Dates released |
| **Add Attraction** | `attractions` | Attractions section updates |
| **Add FAQ** | `faqs` | FAQ section updates |

---

### Email Notifications

| Trigger | Recipient | Content |
|---------|-----------|---------|
| **Payment Success** | Customer | Booking ID, room, dates, costs, hotel contact |
| **Payment Success** | Admin | Customer info, room, dates, total paid |
| **Booking Cancelled** | Customer | Cancellation confirmation (future) |

---

### Session State (Frontend)

| State | Storage | Purpose |
|-------|---------|---------|
| **Selected Dates** | URL Query Params | Persist across navigation, bookmarkable |
| **Date Context** | React Context | Sync between Home filter and Room Booking Card |

---

## User Flow (Conceptualized)

```
Home Page → Accommodation Browsing → Room Details → Booking/Scheduling → Stripe Payment → Confirmation
```

## Home Page Flow — "Destiny" Palette Implementation

### 1. Header (First Impression)

**Behavior**: Transparent → Solid on scroll
- **Initial state**: `background: transparent` over hero video
- **On scroll**: Transitions to `--color-warm-white`
- **Logo**: Rendered in `--color-aegean-blue` for brand recognition

#### Navigation Items

| Item | Type | Action |
|------|------|--------|
| **Home** | Link | Navigate to `/` |
| **Rooms** | Dropdown | Expand room list (see below) |
| **Contact** | Button | Smooth scroll to `#footer` |

**Rooms Dropdown**:
```
┌─────────────────────┐
│  Aegean Suite       │ → /rooms/aegean-suite
│  Knossos            │ → /rooms/knossos
│  Meltemi            │ → /rooms/meltemi
│  Olive Grove        │ → /rooms/olive-grove
│  Horizon            │ → /rooms/horizon
│  Selene             │ → /rooms/selene
│  Zephyr             │ → /rooms/zephyr
│  Iris               │ → /rooms/iris
│  Poseidon           │ → /rooms/poseidon
│  Elysium            │ → /rooms/elysium
└─────────────────────┘
```

**Dropdown Styling**:
- Background: `--color-white`
- Border: 1px `--color-sand`
- Shadow: `--shadow-lg`
- Item Hover: `--color-warm-white` bg
- Animation: `--transition-quick` (fade + slide)

#### Mobile Navigation (Burger Menu)

**Burger Icon**:
- 3 horizontal bars, 2px thick
- Color: `--color-white` (transparent) / `--color-charcoal` (solid)
- Tap Target: 44px × 44px

**Burger → X Animation**:
```css
.burger-line {
  transition: transform var(--transition-smooth), opacity var(--transition-quick);
}
.menu-open .burger-line:nth-child(1) { transform: rotate(45deg) translateY(8px); }
.menu-open .burger-line:nth-child(2) { opacity: 0; }
.menu-open .burger-line:nth-child(3) { transform: rotate(-45deg) translateY(-8px); }
```

**Mobile Menu Panel**:
```css
.mobile-menu {
  position: fixed;
  inset: 0;
  background: var(--color-white);
  transform: translateX(100%);
  transition: transform var(--transition-smooth) var(--ease-premium);
}
.mobile-menu.open { transform: translateX(0); }
```

**Menu Items Stagger**:
```css
.mobile-menu-item {
  opacity: 0;
  transform: translateX(20px);
  transition: opacity var(--transition-smooth), transform var(--transition-smooth);
}
.mobile-menu.open .mobile-menu-item { opacity: 1; transform: translateX(0); }
.mobile-menu-item:nth-child(1) { transition-delay: 50ms; }
.mobile-menu-item:nth-child(2) { transition-delay: 100ms; }
.mobile-menu-item:nth-child(3) { transition-delay: 150ms; }
```

**Mobile Menu Layout**:
```
┌─────────────────────────────────┐
│  [KISMET LOGO]            [×]   │
├─────────────────────────────────┤
│       Home                      │
│       Rooms                  ▼  │ ← Accordion
│         ├ Aegean Suite          │
│         ├ Knossos               │
│         └ ...                   │
│       Contact                   │
├─────────────────────────────────┤
│  [WhatsApp] [Viber] [Call]      │
└─────────────────────────────────┘
```

---

### 2. Hero Section (First Impression)

**Video Background**:
- User-provided video asset
- **Overlay**: Subtle gradient `rgba(47, 52, 55, 0.2)` — keeps video vibrant while ensuring text legibility

**Content**:
- **Headline**: Montserrat (700), `--color-white`, uppercase, 0.2em letter-spacing
- Example: *"YOUR DESTINY AWAITS"*
- **CTA Button**: `--color-aegean-blue` background, sharp 2px radius

---

### 3. Rooms Section (The "Precise" Grid)

**Background**: `--color-warm-white`

---

#### 3.1 Date Range & Bed Selector Bar

**Purpose**: Primary filtering controls, always visible at top of section

**Layout**: Horizontal bar, full container width
- **Position**: Sticky at top of Rooms Section
- **Background**: `--color-white`
- **Border**: 1px `--color-sand` (top and bottom)
- **Sharp corners**: 2px radius on inputs

**Components**:
```
[ Date Range Picker ] [ Bed Count Selector ] [ Search/Apply Button ]
```

**Date Range Picker**:
- Two date inputs (Check-in / Check-out)
- Calendar dropdown on focus
- `--color-aegean-blue` accent on selected dates

**Bed Count Selector**:
- Dropdown or stepper control
- Options: 1, 2, 3, 4+ beds

**Apply Button**:
- `--color-aegean-blue` background
- Triggers filter with smooth grid animation

---

#### 3.2 Floating Filter Widget

**Purpose**: Additional filters, appears/disappears based on viewport scroll position

**Behavior** (CSS-based, no Framer Motion):
- **Hidden by default** (off-screen or `opacity: 0`)
- **When viewport enters Rooms Section**: Animate in smoothly
- **When viewport scrolls past Rooms Section**: Animate out smoothly

**CSS Animation Approach**:
```css
/* Initial state - hidden */
.filter-widget {
  position: fixed;
  right: 24px;
  bottom: 24px;
  opacity: 0;
  transform: translateY(20px);
  pointer-events: none;
  transition: opacity 0.4s ease, transform 0.4s ease;
}

/* Active state - visible (toggled via JS/Intersection Observer) */
.filter-widget.visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}
```

**Trigger**: Use Intersection Observer API to detect when Rooms Section is in viewport

**Widget Design**:
- **Collapsed state**: Circular button with filter icon (Lucide `SlidersHorizontal`)
- **Background**: `--color-aegean-blue`
- **Size**: 56px diameter
- **Shadow**: `--shadow-lg`

**Expanded state** (on click):
- Expands to panel with filters
- **Animation**: Scale + fade transition (CSS `transform: scale()`)
- **Background**: `--color-white`
- **Border**: 1px `--color-sand`

**Filter Categories**:

| Filter | Control | Options/Range |
|--------|---------|---------------|
| **Price Range** | Dual slider | €50 – €300, step €10 |
| **Guests** | Dropdown | 1, 2, 3, 4, 5, 6+ |
| **Size** | Checkboxes | Small (<40sqm), Medium (40-70), Large (>70) |
| **Floor** | Checkboxes | Ground, 1st, 2nd, 3rd+ |
| **Bedrooms** | Dropdown | 1, 2, 3+ |
| **Bed Type** | Checkboxes | Single, Double |
| **Features** | Checkboxes | Kitchen, Living Room, Multiple Bathrooms |
| **Amenities** | Checkboxes | AC, WiFi, TV, Refrigerator, Sea View, etc. |

**Filter State Interface**:
```typescript
interface RoomFilters {
  priceRange: { min: number; max: number };
  minOccupancy: number;
  sizeCategory: ('small' | 'medium' | 'large')[];
  floors: number[];
  minBedrooms: number;
  bedTypes: ('single' | 'double')[];
  features: SectionType[];
  amenityIds: number[];
}
```

---

#### 3.3 Room Grid Layout

**Total Rooms**: 10 (curated collection)

**Room Names** (Aegean Destiny Collection):
1. Aegean Suite
2. Knossos
3. Meltemi
4. Olive Grove
5. Horizon
6. Selene
7. Zephyr
8. Iris
9. Poseidon
10. Elysium

**Desktop Layout**: 2x2 grid with pagination
- 4 rooms visible per view
- Prev/Next navigation arrows
- Dot indicators (3 views: 4 + 4 + 2)

```css
.room-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-xl); /* 64px */
  width: 100%;
}
```

**Pagination Navigation**:
```
┌─────────────────────────────────────────┐
│  [Room 1]          [Room 2]             │
│                                         │
│  [Room 3]          [Room 4]             │
│                                         │
│         ◄  ●  ○  ○  ►                   │
└─────────────────────────────────────────┘
```

**Mobile Layout**: Single column, vertical scroll (no pagination)
```css
@media (max-width: 768px) {
  .room-grid {
    grid-template-columns: 1fr;
    gap: var(--space-lg); /* 40px */
  }
}
```

**Booked Room Behavior**:

| Location | Available Room | Booked Room |
|----------|----------------|-------------|
| **Home (Grid)** | Normal card | "Booked" badge, slightly dimmed, **still clickable** |
| **Room Detail** | Book Now enabled | Book Now **disabled**, "Unavailable for selected dates" |

**Filter Animation** (CSS-based):
- Booked rooms remain visible with overlay
- Use CSS transitions on `opacity` and `transform`

```css
/* Room card states */
.room-card {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.room-card.booked {
  opacity: 0.7;
}

.room-card.booked::after {
  content: "Booked";
  position: absolute;
  top: 12px;
  left: 12px;
  background: var(--color-charcoal);
  color: var(--color-white);
  padding: 4px 12px;
  font-size: 0.75rem;
  text-transform: uppercase;
}

/* Staggered animation */
.room-card:nth-child(1) { transition-delay: 0ms; }
.room-card:nth-child(2) { transition-delay: 50ms; }
.room-card:nth-child(3) { transition-delay: 100ms; }
.room-card:nth-child(4) { transition-delay: 150ms; }
```

---

#### 3.4 RoomCard Component

**Default State**: Image only (clean, minimal)

**Structure**:
```
┌─────────────────────────────┐
│  [Gold Badge: "1 of 10"]    │  ← Top-right
│                             │
│      Room Image             │  ← 4:3 aspect ratio
│      (full bleed)           │
│                             │
│  ┌─────────────────────┐    │  ← Hover overlay (hidden by default)
│  │ Room Name           │    │
│  │ Price / Night       │    │
│  │ [Book Now Button]   │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
```

**Card Styling**:
- **Background**: `--color-white`
- **Shadow**: `0 4px 20px rgba(0,0,0,0.05)`
- **Border**: 1px `--color-sand`
- **Border radius**: 4px (`--radius-subtle`)

**"1 of 10" Badge**:
- Position: Absolute, top-right (12px inset)
- **Background**: `--color-accent-gold`
- **Text**: `--color-white`, Inter 500, small caps, 0.75rem

**Hover Behavior** (CSS transitions):
```css
.room-card .overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--space-md);
  background: linear-gradient(transparent, rgba(47, 52, 55, 0.85));
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.room-card:hover .overlay {
  opacity: 1;
  transform: translateY(0);
}

.room-card:hover .room-image {
  transform: scale(1.05);
}
```

**Overlay Content**:
- **Room Name**: Montserrat 600, `--color-white`
- **Price**: Inter 500, `--color-white`, "€XX / night"
- **Details Button** (Updated): `--color-aegean-blue` → `--color-deep-med` on hover

**Room Object Properties** (to be defined next step):
- TBD - will define complete data model

---

### 4. Map & Conveniences Section (Discovery)

**Terminology Update**: "Commodities" → "**Conveniences**"

**Layout**: Stacked
1. **Full-Width Map Component** (Interactive)
2. **Conveniences Icon Grid** (Discreet, below map)

#### 4.1 Self-Hosted Georeferenced Map
*The "Silver Bullet": Custom style, zero cost, accurate placement*

**Technical Approach**:
1.  **Asset**: High-res JPG export (e.g., `map-bg.jpg`) stored in `/public`.
2.  **Calibration**: We record the **Bounding Box** (North, South, East, West bounds) during export.
3.  **Placement Engine**:
    - A simple helper function maps any `lat/lng` to `% x/y` using the known bounds.
    - `x% = (lng - West) / (East - West) * 100`
    - `y% = (North - lat) / (North - South) * 100`

**Workflow**:
- **Design**: Create perfect "Aegean" style in Mapbox Studio / SnazzyMaps *once*.
- **Export**: Save image + record the 4 corner coordinates.
- **Code**: `getPinPosition(supermarketLat, supermarketLng)` → Returns precise CSS placement.

**Benefits**:
- **Cost**: **$0.00 forever** (No API calls).
- **Control**: 100% custom styling (pixels are fixed).
- **Placement**: Accurate real-world coordinates (no manual guessing).
- **Performance**: Lowest possible footprint.

#### 4.2 Conveniences Icon Grid
*Discrete display of nearby amenities, below map*

**Layout**: Horizontal flex, centered
- **Background**: `--color-warm-white`
- **Items**: Supermarket, Bus Station, Car Rental, Beach, Pharmacy
- **Design**: Minimal icon box (Lucide icon + label)
- **Color**: `--color-charcoal` (text/icon), `--color-sand` (border on hover)

---

### 5. Attractions Section (The "Anticipation" Grid)

**Background**: `--color-white`

**Layout**: Asymmetric grid (masonry-style)
- Varying image sizes for visual interest

**Attraction Tiles**:
- **Images**: Large, high-key, saturated photography
- **Caption overlay**: Bottom-left, semi-transparent `--color-charcoal` backing
- **Title**: Montserrat 600, `--color-white`

---

### 6. FAQs Section

**Background**: `--color-warm-white`

**Accordion Style**:
- Question: Inter 500, `--color-charcoal`
- **Expand/Collapse icon**: `+` / `−` in `--color-accent-gold`
- Answer: Inter 400, 1.7 line-height
- Dividers: 1px `--color-sand`

---

### 7. Footer (The "Grounding")

**Background**: `--color-charcoal`

**Layout**: 2-Column Split
- **Left (50%)**: Contact Info
  - Logo (`--color-aegean-blue` or white)
  - Address, Phone, Email (Lucide icons: MapPin, Phone, Mail)
  - Text: `--color-sand`
- **Right (50%)**: Contact Form
  - Input bg: `rgba(255,255,255,0.05)`
  - Fields: Name, Email, Message (textarea)
  - Submit: `--color-aegean-blue` button

**Bottom Bar**:
- Links: Privacy Policy • Terms • Cookie Policy
- Centered, `--color-sand` text, 0.875rem

---

## Room Detail Page

**Header**: Transparent → Solid on scroll (matches Home)

### Image Gallery (Top)
- **Hero**: Large 16:9 cinematic shot
- **Thumbnails/Carousel**: Additional room views

### Main Content Split

**Left Side (60%) - Room Data**:
- **Title**: Room Name + "1 of 10" Badge
- **Description**: Detailed paragraph
- **Specs**: Size (sqm), Floor, Max Occupancy
- **Sections**: Bedroom/Kitchen/Bathroom counts with icons
- **Beds**: Type + quantity
- **Amenities**: Icon boxes (AC, TV, WiFi, etc.)

**Right Side (40%) - Booking Card**:
- **Sticky**: Stays in view while scrolling
- **Price**: `€XX / night`
- **Inputs**: Date Range Picker + Guest Count (informational)
- **Calculation**: `Nights × Price = Total`
- **CTA**: [ Book Now ] button
- **Logic**: Disabled dates = confirmed bookings

---

### Contact CTA (Room Page Only)

**Position**: Below room data, above Footer
**Background**: `--color-sand`

- **Headline**: "Have Questions About This Room?"
- **Actions**:
  - [ Direct Contact ] (Secondary) → Expands Floating Widget
  - [ Send Email ] (Primary) → Smooth scroll to Footer form

---

## Global Floating Communication Widget

**Position**: Fixed bottom-right (z-index above content)

**Collapsed State**:
- Circular FAB, 56px
- Icon: `MessageCircle` (Lucide)
- Background: `--color-aegean-blue`

**Expanded State** (on click):
- Reveals vertical stack of bubbles:
  1. **WhatsApp** → Opens WhatsApp chat
  2. **Viber** → Opens Viber app
  3. **Call Us**:
     - Mobile: `tel:` link (native dialer)
     - Desktop: Smooth scroll to Footer contact info

**Animation**: CSS spring effect, staggered bubble reveal

---

## Decisions Status

### Booking Flow
- [x] **Multi-step Wizard** (Dates → Details → Payment) — *Selected for cleaner UI*
- [x] **Date picker**: `react-day-picker` with custom "Aegean" theme

### Data Models
- [x] **Conveniences**: Defined below (lat/lng + type)
- [x] **Attractions**: Defined below (distance + image)
- [x] **FAQs**: Defined below (category + Q&A)

### Component Hierarchy
- [x] **Core components defined** (see Architecture section)

---

### Additional Data Models

#### `conveniences` Table
```sql
CREATE TABLE conveniences (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  type        TEXT NOT NULL, -- 'Supermarket' | 'Bus' | 'Pharmacy' | 'Beach' | 'Rentals'
  lat         DECIMAL NOT NULL,
  lng         DECIMAL NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

#### `attractions` Table
```sql
CREATE TABLE attractions (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url   TEXT NOT NULL,
  distance_km DECIMAL NOT NULL,
  location_url TEXT, -- Google Maps link
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

#### `faqs` Table
```sql
CREATE TABLE faqs (
  id          SERIAL PRIMARY KEY,
  question    TEXT NOT NULL,
  answer      TEXT NOT NULL,
  category    TEXT NOT NULL DEFAULT 'General',
  order_idx   INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Data Model & Supabase Schema

> [!NOTE]
> Phase 1: Mock data files mirroring this schema  
> Phase 2: Swap to Supabase reads (schema below)

### Supabase Schema (Future Reference)

#### `rooms` Table

```sql
CREATE TABLE rooms (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  description       TEXT,
  size_sqm          INTEGER NOT NULL,
  floor             INTEGER NOT NULL,
  max_occupancy     INTEGER NOT NULL,
  price_per_night   DECIMAL(10,2) NOT NULL,
  images            TEXT[] NOT NULL,
  beds              JSONB NOT NULL,        -- [{ type: "single"|"double", count: 1 }]
  sections          JSONB NOT NULL,        -- [{ type: "kitchen"|"living_room"|"bedroom"|"bathroom", count: 1 }]
  amenity_ids       INTEGER[] NOT NULL,    -- FK references to amenities.id
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);
```

#### `amenities` Table

```sql
CREATE TABLE amenities (
  id                SERIAL PRIMARY KEY,
  name              TEXT NOT NULL,
  icon_name         TEXT NOT NULL,         -- Lucide icon name (e.g., "AirVent", "Tv")
  category          TEXT,                  -- Optional grouping
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Example data:
-- INSERT INTO amenities (name, icon_name, category) VALUES
--   ('Air Conditioning', 'AirVent', 'Climate'),
--   ('Refrigerator', 'Refrigerator', 'Kitchen'),
--   ('Oven', 'CookingPot', 'Kitchen'),
--   ('Television', 'Tv', 'Entertainment'),
--   ('WiFi', 'Wifi', 'Connectivity');
```

#### `bookings` Table

```sql
CREATE TABLE bookings (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id             UUID NOT NULL REFERENCES rooms(id),
  
  -- Dates (original booking period)
  check_in            DATE NOT NULL,
  check_out           DATE NOT NULL,
  actual_check_out    DATE,                   -- Set by CMS if guest leaves early
  
  -- Guest info
  guest_first_name    TEXT NOT NULL,
  guest_last_name     TEXT NOT NULL,
  guest_email         TEXT NOT NULL,
  guest_phone         TEXT,                   -- Optional but recommended
  guests_count        INTEGER NOT NULL,       -- Informational only
  
  -- Pricing (per-night, snapshot at booking time)
  nights              INTEGER NOT NULL,
  price_per_night     DECIMAL(10,2) NOT NULL,
  total_price         DECIMAL(10,2) NOT NULL, -- nights × price_per_night
  
  -- Status (payment-driven with hold pattern)
  status              TEXT NOT NULL DEFAULT 'held',
    -- 'held'            → Dates blocked, awaiting payment (15min TTL)
    -- 'confirmed'       → Payment received, booking active
    -- 'completed'       → Check-out passed
    -- 'cancelled'       → Cancelled by admin/user
    -- 'expired'         → Hold expired without payment
  
  -- Hold pattern
  held_until          TIMESTAMPTZ,            -- NULL for confirmed, set for holds
  
  -- Stripe integration
  stripe_session_id   TEXT,
  stripe_payment_id   TEXT,
  paid_at             TIMESTAMPTZ,
  
  -- Cancellation tracking
  cancelled_at        TIMESTAMPTZ,
  cancellation_reason TEXT,
  
  -- Timestamps
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_date_range CHECK (check_out > check_in)
);

-- Indexes
CREATE INDEX idx_bookings_room_dates ON bookings(room_id, check_in, check_out);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_held ON bookings(status, held_until) WHERE status = 'held';
```

#### `room_blocks` Table (Manual Unavailability)

```sql
CREATE TABLE room_blocks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id     UUID NOT NULL REFERENCES rooms(id),
  start_date  DATE NOT NULL,
  end_date    DATE NOT NULL,
  reason      TEXT NOT NULL DEFAULT 'other',
    -- 'maintenance' | 'owner_use' | 'seasonal' | 'other'
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_block_range CHECK (end_date > start_date)
);

CREATE INDEX idx_room_blocks_dates ON room_blocks(room_id, start_date, end_date);
```

#### Availability Query (Combined)

```sql
-- Returns rooms available for requested dates
-- Blocked by: confirmed bookings, active holds, or manual blocks

SELECT * FROM rooms WHERE id NOT IN (
  -- Confirmed bookings (use actual_check_out if set)
  SELECT room_id FROM bookings
  WHERE status = 'confirmed'
  AND check_in < :requested_checkout
  AND COALESCE(actual_check_out, check_out) > :requested_checkin
  
  UNION
  
  -- Active holds (not expired)
  SELECT room_id FROM bookings
  WHERE status = 'held'
  AND held_until > NOW()
  AND check_in < :requested_checkout
  AND check_out > :requested_checkin
  
  UNION
  
  -- Manual blocks
  SELECT room_id FROM room_blocks
  WHERE start_date < :requested_checkout
  AND end_date > :requested_checkin
);
```

---

### TypeScript Interfaces

```typescript
// === Enums ===
type BedType = 'single' | 'double';
type SectionType = 'kitchen' | 'living_room' | 'bedroom' | 'bathroom';
type BookingStatus = 'held' | 'confirmed' | 'completed' | 'cancelled' | 'expired';
type BlockReason = 'maintenance' | 'owner_use' | 'seasonal' | 'other';

// === Room ===
interface RoomBed {
  type: BedType;
  count: number;
}

interface RoomSection {
  type: SectionType;
  count: number;
}

interface Amenity {
  id: number;
  name: string;
  iconName: string;  // Lucide icon
  category?: string;
}

interface Room {
  id: string;
  name: string;
  description: string;
  sizeSqm: number;
  floor: number;
  maxOccupancy: number;
  pricePerNight: number;
  images: string[];
  beds: RoomBed[];
  sections: RoomSection[];
  amenities: Amenity[];  // Resolved from amenity_ids
}

// === Booking ===
interface Booking {
  id: string;
  roomId: string;
  checkIn: string;           // ISO date
  checkOut: string;          // Original booked date
  actualCheckOut?: string;   // Set by CMS if guest leaves early
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  guestPhone?: string;       // Optional but recommended
  guestsCount: number;
  nights: number;
  pricePerNight: number;
  totalPrice: number;
  status: BookingStatus;
  heldUntil?: string;        // For 'held' status only
  stripeSessionId?: string;
  stripePaymentId?: string;
  paidAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

// === Room Blocks ===
interface RoomBlock {
  id: string;
  roomId: string;
  startDate: string;
  endDate: string;
  reason: BlockReason;
  notes?: string;
  createdAt: string;
}

// === Availability (for UI) ===
interface UnavailableDateRange {
  start: string;
  end: string;
  source: 'booking' | 'hold' | 'block';
}

interface RoomWithAvailability extends Room {
  unavailableRanges: UnavailableDateRange[];
}
```

---

### Booking Lifecycle (Payment-Driven)

```
User submits booking
        │
        ▼
   ┌─────────────────┐
   │ pending_payment │ ←── Does NOT block availability
   └─────────────────┘     Expires after 30 min if unpaid
        │
        │ Stripe webhook: payment_intent.succeeded
        ▼
   ┌─────────────────┐
   │   confirmed     │ ←── BLOCKS AVAILABILITY ✓
   └─────────────────┘     Room is officially booked
        │
        │ Check-out date passes
        ▼
   ┌─────────────────┐
   │   completed     │ ←── Historical record (analytics)
   └─────────────────┘
```

**Availability Query** (only confirmed bookings block dates):
```sql
SELECT * FROM rooms
WHERE id NOT IN (
  SELECT room_id FROM bookings
  WHERE status = 'confirmed'
  AND check_in < :selected_check_out
  AND check_out > :selected_check_in
);
```

---

### Pricing Model

```
Total Price = Nights × Price Per Night

Example:
  Room: €50/night
  Dates: Jan 15 → Jan 19 (4 nights)
  Charge: 4 × €50 = €200

Guest count is informational only (max occupancy validation).
Stripe charges: quantity (nights) × unit_amount (price_per_night).
```

---

### Data Retention Policy

| Status | Blocks Availability? | Kept for Analytics? |
|--------|---------------------|---------------------|
| `pending_payment` | No | ✓ Yes (conversion) |
| `confirmed` | **Yes** | ✓ Yes |
| `cancelled` | No | ✓ Yes (cancellation rate) |
| `expired` | No | ✓ Yes (abandonment rate) |
| `completed` | N/A | ✓ Yes (revenue) |

**No hard deletes** — All records retained permanently.

---

## Conceptualization Complete ✓

All architectural decisions have been finalized:

| Category | Decision |
|----------|----------|
| **Map** | Self-Hosted Georeferenced Image ($0, accurate pins) |
| **Booking Flow** | Multi-step Wizard (Dates → Details → Payment) |
| **Date Picker** | `react-day-picker` with Aegean theme |
| **Data Models** | Rooms, Amenities, Bookings, Conveniences, Attractions, FAQs |
| **Dark Mode** | Not implemented (light theme only) |

---

## Implementation Phases

> [!IMPORTANT]
> Each phase is designed to be small and self-contained. Complete and verify each phase before proceeding.

---

### Phase 1: Project Foundation
**Goal**: Bootable Next.js project with design system

| Step | Task | Files |
|------|------|-------|
| 1.1 | Initialize Next.js 14+ with TypeScript | `package.json`, `tsconfig.json` |
| 1.2 | Configure Tailwind CSS with fluid values | `tailwind.config.ts`, `postcss.config.js` |
| 1.3 | Set up folder structure | `/src/components`, `/hooks`, `/services`, `/data`, `/types`, `/lib` |
| 1.4 | Create CSS variables file (fluid tokens) | `globals.css` |
| 1.5 | Configure fonts (Montserrat + Inter) | `layout.tsx`, font imports |
| 1.6 | Set up responsive breakpoints | `tailwind.config.ts` |

**Verification**: `npm run dev` starts without errors, fonts load correctly

---

### Phase 2: TypeScript Foundation
**Goal**: All interfaces and types defined

| Step | Task | Files |
|------|------|-------|
| 2.1 | Create Room types | `/types/room.ts` |
| 2.2 | Create Booking types | `/types/booking.ts` |
| 2.3 | Create Amenity types | `/types/amenity.ts` |
| 2.4 | Create Convenience, Attraction, FAQ types | `/types/content.ts` |
| 2.5 | Create RoomBlock type | `/types/roomBlock.ts` |
| 2.6 | Create RoomFilters interface | `/types/filters.ts` |
| 2.7 | Create index barrel export | `/types/index.ts` |

**Verification**: TypeScript compiles with no errors

---

### Phase 3: Mock Data Layer
**Goal**: Static data files matching Supabase schema (10 rooms)

| Step | Task | Files |
|------|------|-------|
| 3.1 | Create amenities mock data | `/data/amenities.ts` |
| 3.2 | Create rooms mock data (10 rooms with names) | `/data/rooms.ts` |
| 3.3 | Create conveniences mock data | `/data/conveniences.ts` |
| 3.4 | Create attractions mock data | `/data/attractions.ts` |
| 3.5 | Create FAQs mock data | `/data/faqs.ts` |
| 3.6 | Create index barrel export | `/data/index.ts` |

**Room Names**: Aegean Suite, Knossos, Meltemi, Olive Grove, Horizon, Selene, Zephyr, Iris, Poseidon, Elysium

**Verification**: Data imports correctly, matches TypeScript types

---

### Phase 4: Services & Utilities Layer
**Goal**: Abstraction layer for data fetching and helpers

| Step | Task | Files |
|------|------|-------|
| 4.1 | Create room service | `/services/roomService.ts` |
| 4.2 | Create content service | `/services/contentService.ts` |
| 4.3 | Create availability helpers | `/lib/availability.ts` |
| 4.4 | Create map coordinate helpers | `/lib/mapHelpers.ts` |
| 4.5 | Create filter logic helpers | `/lib/filterHelpers.ts` |
| 4.6 | Create price calculator | `/lib/priceCalculator.ts` |

**Verification**: Services return typed data correctly

---

### Phase 5: Core UI Components
**Goal**: Reusable atomic components with fluid sizing

| Step | Task | Files |
|------|------|-------|
| 5.1 | Create Button component (Primary, Secondary) | `/components/ui/Button.tsx` |
| 5.2 | Create Input component | `/components/ui/Input.tsx` |
| 5.3 | Create Badge component (Gold, Booked) | `/components/ui/Badge.tsx` |
| 5.4 | Create Container component (responsive) | `/components/ui/Container.tsx` |
| 5.5 | Create SectionHeading component | `/components/ui/SectionHeading.tsx` |
| 5.6 | Create Dropdown component | `/components/ui/Dropdown.tsx` |

**Verification**: Components render correctly at all breakpoints

---

### Phase 6: Header & Navigation
**Goal**: Responsive header with navigation dropdown and mobile menu

| Step | Task | Files |
|------|------|-------|
| 6.1 | Create Header shell (transparent + solid states) | `/components/layout/Header.tsx` |
| 6.2 | Create DesktopNav with Home, Rooms dropdown, Contact | `/components/layout/DesktopNav.tsx` |
| 6.3 | Create RoomsDropdown (10 room links) | `/components/layout/RoomsDropdown.tsx` |
| 6.4 | Create BurgerIcon with animation | `/components/layout/BurgerIcon.tsx` |
| 6.5 | Create MobileMenu (slide-in panel) | `/components/layout/MobileMenu.tsx` |
| 6.6 | Create MobileRoomsAccordion | `/components/layout/MobileRoomsAccordion.tsx` |
| 6.7 | Add smooth scroll for Contact | Header.tsx |

**Verification**: Desktop dropdown works, mobile menu animates, scroll behavior smooth

---

### Phase 7: Footer & Floating Widget
**Goal**: Footer with contact form and floating communication widget

| Step | Task | Files |
|------|------|-------|
| 7.1 | Create Footer (2-column with form) | `/components/layout/Footer.tsx` |
| 7.2 | Create ContactForm component | `/components/layout/ContactForm.tsx` |
| 7.3 | Create FloatingWidget (WhatsApp, Viber, Call) | `/components/layout/FloatingWidget.tsx` |
| 7.4 | Update root layout with Header, Footer, Widget | `/app/layout.tsx` |

**Verification**: Layout renders on all pages, widget expands with animation

---

### Phase 8: Home Page — Hero Section
**Goal**: Video hero with overlay

| Step | Task | Files |
|------|------|-------|
| 8.1 | Create Hero component structure | `/components/home/Hero.tsx` |
| 8.2 | Add video background (placeholder) | Hero.tsx |
| 8.3 | Add overlay with text content | Hero.tsx |
| 8.4 | Add scroll indicator | Hero.tsx |
| 8.5 | Create Home page with Hero | `/app/page.tsx` |

**Verification**: Hero displays correctly, video plays (or placeholder)

---

### Phase 9: Home Page — Date Selector Bar
**Goal**: Date and bed selector sticky bar

| Step | Task | Files |
|------|------|-------|
| 9.1 | Install react-day-picker | `package.json` |
| 9.2 | Create DateRangePicker (Aegean theme) | `/components/booking/DateRangePicker.tsx` |
| 9.3 | Create DateSelectorBar | `/components/home/DateSelectorBar.tsx` |
| 9.4 | Create useDateContext hook | `/hooks/useDateContext.tsx` |
| 9.5 | Add URL query param sync | `/hooks/useDateParams.ts` |

**Verification**: Dates persist via URL, context syncs correctly

---

### Phase 10: Home Page — Room Cards
**Goal**: RoomCard with booked state

| Step | Task | Files |
|------|------|-------|
| 10.1 | Create RoomCard component | `/components/rooms/RoomCard.tsx` |
| 10.2 | Add booked badge overlay | RoomCard.tsx |
| 10.3 | Add hover animations (scale, shadow) | RoomCard.tsx |
| 10.4 | Create useRoomAvailability hook | `/hooks/useRoomAvailability.ts` |

**Verification**: Cards display correctly, booked state shows, hover works

---

### Phase 11: Home Page — Room Grid with Pagination
**Goal**: 2x2 grid with prev/next navigation (10 rooms)

| Step | Task | Files |
|------|------|-------|
| 11.1 | Create RoomsGrid component | `/components/home/RoomsGrid.tsx` |
| 11.2 | Add pagination state (pages of 4) | RoomsGrid.tsx |
| 11.3 | Create PaginationControls (arrows + dots) | `/components/home/PaginationControls.tsx` |
| 11.4 | Add transition animations | RoomsGrid.tsx |
| 11.5 | Mobile layout (single column, no pagination) | RoomsGrid.tsx |

**Verification**: Pagination navigates correctly, mobile scrolls all rooms

---

### Phase 12: Home Page — Filter Widget
**Goal**: Floating filter widget with all room filters

| Step | Task | Files |
|------|------|-------|
| 12.1 | Create FilterWidget FAB | `/components/home/FilterWidget.tsx` |
| 12.2 | Add Intersection Observer visibility | FilterWidget.tsx |
| 12.3 | Create FilterPanel (expanded state) | `/components/home/FilterPanel.tsx` |
| 12.4 | Create PriceRangeSlider | `/components/home/PriceRangeSlider.tsx` |
| 12.5 | Create filter checkbox groups | FilterPanel.tsx |
| 12.6 | Create useRoomFilters hook | `/hooks/useRoomFilters.ts` |
| 12.7 | Connect filters to RoomsGrid | page.tsx |

**Filters**: Price, Guests, Size, Floor, Bedrooms, Bed Type, Features, Amenities

**Verification**: Filters apply correctly, booked rooms still visible

---

### Phase 13: Home Page — Map & Conveniences
**Goal**: Static map with pins + icon grid

| Step | Task | Files |
|------|------|-------|
| 13.1 | Create StaticMap component | `/components/home/StaticMap.tsx` |
| 13.2 | Create MapPin component | `/components/home/MapPin.tsx` |
| 13.3 | Create PinPopup component | `/components/home/PinPopup.tsx` |
| 13.4 | Create ConveniencesGrid component | `/components/home/ConveniencesGrid.tsx` |
| 13.5 | Integrate into Home page | `/app/page.tsx` |

**Verification**: Map displays, pins are clickable, popups show

---

### Phase 14: Home Page — Attractions & FAQs
**Goal**: Content sections complete

| Step | Task | Files |
|------|------|-------|
| 14.1 | Create AttractionsGrid (masonry) | `/components/home/AttractionsGrid.tsx` |
| 14.2 | Create AttractionCard | `/components/home/AttractionCard.tsx` |
| 14.3 | Create FAQAccordion | `/components/home/FAQAccordion.tsx` |
| 14.4 | Create FAQItem | `/components/home/FAQItem.tsx` |
| 14.5 | Integrate into Home page | `/app/page.tsx` |

**Verification**: Home page complete, all sections render correctly

---

### Phase 15: Room Detail Page — Layout
**Goal**: Room page structure with data display

| Step | Task | Files |
|------|------|-------|
| 15.1 | Create room detail page route | `/app/rooms/[slug]/page.tsx` |
| 15.2 | Create ImageGallery component | `/components/rooms/ImageGallery.tsx` |
| 15.3 | Create RoomInfo component | `/components/rooms/RoomInfo.tsx` |
| 15.4 | Create AmenityIcon component | `/components/rooms/AmenityIcon.tsx` |

**Verification**: Room page loads with correct data from mock

---

### Phase 16: Room Detail Page — Booking Card
**Goal**: Sticky booking card with date picker

| Step | Task | Files |
|------|------|-------|
| 16.1 | Create BookingCard component | `/components/booking/BookingCard.tsx` |
| 16.2 | Add disabled state for booked dates | BookingCard.tsx |
| 16.3 | Add price calculation display | BookingCard.tsx |
| 16.4 | Sync with DateContext from Home | BookingCard.tsx |

**Verification**: Dates from Home persist, disabled dates show, CTA disabled when booked

---

### Phase 17: Room Detail Page — Contact CTA
**Goal**: Contact section and widget integration

| Step | Task | Files |
|------|------|-------|
| 17.1 | Create ContactCTA component | `/components/rooms/ContactCTA.tsx` |
| 17.2 | Add "Direct Contact" → Widget expand | ContactCTA.tsx |
| 17.3 | Add "Send Email" → Footer scroll | ContactCTA.tsx |

**Verification**: Both CTAs work correctly

---

### Phase 18: Booking Wizard
**Goal**: Multi-step booking form

| Step | Task | Files |
|------|------|-------|
| 18.1 | Create booking page route | `/app/booking/page.tsx` |
| 18.2 | Create WizardSteps component | `/components/booking/WizardSteps.tsx` |
| 18.3 | Create Step1Review | `/components/booking/Step1Review.tsx` |
| 18.4 | Create Step2GuestDetails | `/components/booking/Step2GuestDetails.tsx` |
| 18.5 | Create Step3Payment (placeholder) | `/components/booking/Step3Payment.tsx` |

**Verification**: Wizard navigation works, form validates

---

### Phase 19: Booking Success Page
**Goal**: Confirmation page after payment

| Step | Task | Files |
|------|------|-------|
| 19.1 | Create success page route | `/app/booking/success/page.tsx` |
| 19.2 | Create ConfirmationCard | `/components/booking/ConfirmationCard.tsx` |

**Verification**: Success page displays booking details

---

### Phase 20: SEO & Metadata
**Goal**: Search engine optimization

| Step | Task | Files |
|------|------|-------|
| 20.1 | Add metadata to root layout | `/app/layout.tsx` |
| 20.2 | Add dynamic metadata to room pages | `/app/rooms/[slug]/page.tsx` |
| 20.3 | Create sitemap | `/app/sitemap.ts` |
| 20.4 | Create robots.txt | `/app/robots.ts` |

**Verification**: Lighthouse SEO score > 90

---

### Phase 21: Performance Optimization
**Goal**: Fast, optimized bundle

| Step | Task | Files |
|------|------|-------|
| 21.1 | Audit with Lighthouse | — |
| 21.2 | Optimize images (priority, sizes) | All Image components |
| 21.3 | Add loading skeletons | Key components |
| 21.4 | Review bundle size | — |

**Verification**: Lighthouse Performance score > 90

---

### Future Phases (Post-Launch)

| Phase | Scope |
|-------|-------|
| **22** | Supabase integration (replace mock data) |
| **23** | Stripe Checkout integration |
| **24** | Webhook handlers (booking confirmation) |
| **25** | Email service integration (Resend) |
| **26** | Hold pattern implementation |
| **27** | CMS integration readiness |
