# Tech Debt & Known Issues

_Sourced from ARCH.md audit — 2026-03-11_

---

## 🔴 Security

### `SEC-011` — Cron secret guard is conditional on both routes
**Files:**
- `src/app/api/cron/cleanup-holds/route.ts` L16-21
- `src/app/api/cron/pre-checkout/route.ts` L25-30

Both cron routes skip the `CRON_SECRET` check if the env var is not set, making them publicly callable without auth.

```typescript
// Current (unsafe if CRON_SECRET is not set in env)
if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {

// Fix: make it unconditional in both route files
if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
```

Also ensure `CRON_SECRET` is set in Vercel → Project → Environment Variables.

---

### `SEC-004` — RLS policies unverified
Verify in **Supabase Dashboard → Authentication → Policies** that Row Level Security is enabled and correctly configured for all tables. The service-role client (`createAdminClient`) bypasses RLS, but the public/anon client (`createPublicClient`) relies on it.

Tables to check: `profiles`, `bookings`, `media_assets`, `room_media`, `booking_holds`, `hotel_settings`, `blocked_dates`, `rooms`, `room_beds`, `contact_requests`, `roles`, `permissions`, `role_permissions`, `amenities`, `conveniences`, `location_categories`, `faqs`, `attractions`

---

### `SEC-016` — Middleware missing HTTP security headers
**File:** `src/middleware.ts`, `src/lib/supabase/middleware.ts`

Neither middleware file sets any HTTP security headers. Missing headers:
- `Content-Security-Policy`
- `X-Frame-Options`
- `X-Content-Type-Options`
- `Strict-Transport-Security` (HSTS)
- `Referrer-Policy`
- `Permissions-Policy`

**Recommendation:** Add security headers in `middleware.ts` or via `next.config` headers:
```typescript
// In middleware.ts, before returning the response:
response.headers.set('X-Frame-Options', 'DENY');
response.headers.set('X-Content-Type-Options', 'nosniff');
response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
```

---

## 🟡 Dead Code

### `DC-003` — Unused server actions
These server actions have no callers anywhere in the codebase. Safe to delete:

- `cancelBookingAction` — `src/app/actions/bookings.ts`
- `getRequestsAction` — `src/app/actions/request.ts`
- `getRoomsAction` — `src/app/actions/room.ts`

---

### `DC-001` — Unused components
These components have zero imports anywhere in the codebase. Safe to delete:

- `DebugAuth` — `src/components/admin/debug/DebugAuth.tsx`, debug utility with no callers
- `Can` — permission wrapper in `src/contexts/PermissionContext.tsx`, never imported
- `Dropdown` — `src/components/ui/Dropdown.tsx`, zero imports
- `OptimizedMedia` — `src/components/ui/OptimizedMedia.tsx`, zero imports

---

### `DC-002` — Unused hook: useDateParams
`useDateParams` (`src/hooks/useDateParams.ts`) has no callers in the codebase.

---

### `DC-011` — Dead environment variables
These env vars are defined in `.env.local` but never referenced in any source code:
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD` — also stored as plaintext `123`

Safe to remove from `.env.local` and `.env.example`.

---

## 🟡 Code Quality

### `AR-001` — Actions with excessive orchestration
These server actions perform many distinct operations (DB writes, auth API calls, email sends, cache invalidation) in a single function. Consider extracting into service-layer methods for testability and reuse:

| Action | File | Operations |
|---|---|---|
| `inviteUserAction` | `src/app/actions/auth.ts` | Auth API create user + DB upsert profile + send welcome email + revalidate (4 ops) |
| `updateProfileAction` | `src/app/actions/auth.ts` | Auth getUser + conditional role check + conditional admin email update + conditional DB email sync + auth updateUser + DB update name + revalidate (up to 6 ops) |
| `updateRoleAction` | `src/app/actions/roles.ts` | Auth check + DB update role + DB read permissions diff + conditional DELETE old + conditional INSERT new + revalidate (up to 5 ops) |

---

### `PR-001` — Unnecessary `'use client'` directives
These components have `'use client'` but use no hooks, state, event handlers, or browser APIs:

| Component | File | Reason |
|---|---|---|
| `PaymentMock` | `src/components/booking/PaymentMock.tsx` | Pure JSX, no interactivity |
| `OptimizedMedia` | `src/components/ui/OptimizedMedia.tsx` | Imports `useState` but never calls it (dead import) |
| `RoomsDropdown` | `src/components/layout/RoomsDropdown.tsx` | Renders `<Link>` elements only, no state |

Removing `'use client'` allows these to render as server components, reducing client bundle size.

---

### `PV-003` — Client-side DB query in admin/profile
`src/app/(admin)/admin/profile/page.tsx` is marked `'use client'` and uses `createClient` (browser Supabase client) to query the `profiles` table directly. 

While not a security vulnerability (it fetches only the authenticated user's own row via RLS), it is an architectural inconsistency. All other page data fetching in the application follows the React Server Component (RSC) or Server Action pattern.

**Recommendation:** Convert `profile/page.tsx` to a Server Component and fetch the profile server-side before passing it as initial data to a client component if interactivity is needed, or handle mutations via a Server Action.

---

## 🔵 Missing Infrastructure

### `MI-001` — No Supabase migrations directory
Schema changes are applied manually via Supabase SQL Editor with no version history.
**Recommendation:** Initialize `supabase/migrations/` and export current schema.

### `MI-002` — No auto-generated TypeScript types
Types are manually maintained in `src/types/entities.ts` with no guarantee they match the actual DB schema.
**Recommendation:** Run `supabase gen types typescript` and integrate into CI.

### `MI-012` / `AR-002` — No error boundary files
No `error.tsx` or `global-error.tsx` files exist anywhere in `src/app/`. Unhandled errors fall through to Next.js default error page across all 16 routes.
**Recommendation:** Add `error.tsx` at minimum for `(website)/error.tsx` and `(admin)/admin/error.tsx`. Consider `src/app/global-error.tsx` for root-level failures.

### `MI-013` — Missing `loading.tsx` near admin/profile
The only `loading.tsx` is at `src/app/(admin)/admin/loading.tsx` (top-level admin). The profile page does client-side data fetching with no Suspense/loading boundary.
**Recommendation:** Add `src/app/(admin)/admin/profile/loading.tsx` or refactor to server component.

### `MI-018` — Missing root `not-found.tsx`
No custom 404 page exists. Next.js will render its default not-found UI.
**Recommendation:** Add `src/app/not-found.tsx` with branded styling.

### `TC-001` — No tests
Zero test files in the project. No unit, integration, or e2e tests.

### `MC-010` — package.json missing `engines.node` field
No Node.js version constraint declared. Vercel and CI may resolve to unexpected Node versions.
**Recommendation:** Add to `package.json`:
```json
"engines": { "node": ">=20" }
```

---

## 🔵 SEO

### `SEO-006` — Missing noindex on transactional/auth pages
None of the following pages declare `robots: noindex`, meaning they can be crawled and indexed by search engines:

- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/reset-password/page.tsx`
- `src/app/(website)/book/page.tsx`
- `src/app/(website)/book/success/page.tsx`
- All `(admin)` pages

**Fix:** Add to each page or their respective layout:
```typescript
export const metadata: Metadata = {
  robots: { index: false, follow: false }
};
```

---

### `SEO-001` / `MI-022` — rooms/[slug] missing dynamic metadata
`/rooms/[slug]` has `generateStaticParams` but no `generateMetadata`. All room pages share the generic website metadata with no room-specific title, description, or OG image.

```typescript
// src/app/(website)/rooms/[slug]/page.tsx
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const room = await roomService.getRoomBySlug(params.slug);
  return {
    title: room?.name,
    description: room?.description,
    openGraph: { images: [room?.heroImage ?? ''] }
  };
}
```

---

### `SEO-005` — Missing root opengraph-image
No `opengraph-image.png` (or `.jpg`) exists at the app root. Next.js uses this as the default OG image for all pages that don't specify one.
**Recommendation:** Add `src/app/opengraph-image.png` (1200×630px, branded).

---

_Last updated: 2026-03-11 · Source: ARCH.md audit v6 (11:43 UTC), cross-verified against codebase_
