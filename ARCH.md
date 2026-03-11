# Arch Context: `kismethotel`

_Generated 2026-03-11 18:24 UTC · 364 nodes · 702 edges · 159 diagnostics_

> ⚠ **5 errors · 52 warnings** — review Diagnostics section

---

## Tech Stack

- **Next.js** 16.1.6
- Supabase (PostgreSQL + Auth + Storage)
- Email: Nodemailer

---

## Architecture Layers

| Layer | Count | Client | Diagnostics |
|-------|-------|--------|-------------|
| 📄 Pages | 23 | 4 client | 🔴 1 errors, 16 total |
| 🧩 Components | 132 | 115 client | 🟡 33 warnings/info |
| 🪝 Hooks | 19 | 19 client | 🟡 1 warnings/info |
| ⚡ Actions | 52 | — | 🔴 1 errors, 11 total |
| 🔌 API Routes | 5 | — | 🟡 4 warnings/info |
| 🛠 Services | 53 | — | 🔴 1 errors, 4 total |
| 🔐 Auth | 16 | — | 🔴 3 errors, 15 total |
| 🗄 Database | 23 | — | 🔴 2 errors, 23 total |
| ☁ Infrastructure | 41 | — | 🔴 2 errors, 33 total |

---

## Route Inventory

- `PAG` **admin/bookings** 🔒 ⚠[SEO-006,MI-012] → calls:roomService, calls:bookingService, calls:requestService, calls:getUserRole
- `LAY` **admin (layout)** → calls:contentService
- `PAG` **admin/media** 🔒 ⚠[MI-012]
- `PAG` **admin/page-content** 🔒 ⚠[MI-012] → calls:contentService
- `PAG` **admin** 🔒 ⚠[MI-012]
- `PAG` **admin/profile** 🔒 ⚠[PV-003,MI-012,MI-013] → calls:createClient, reads:profiles, calls:updateProfileAction
- `PAG` **admin/requests** 🔒 ⚠[MI-012] → calls:requestService, calls:bookingService
- `PAG` **admin/rooms/new** 🔒 ⚠[MI-012]
- `PAG` **admin/rooms** 🔒 ⚠[MI-012] → calls:roomService
- `PAG` **admin/rooms/[slug]** 🔒 ⚠[MI-012] → calls:roomService
- `PAG` **admin/settings** 🔒 ⚠[MI-012] → calls:createClient, calls:getUserRole, calls:contentService, calls:getUsersAction, calls:getRolesAction, calls:getPermissionsAction
- `LAY` **/ (layout)**
- `LAY` **/ (layout)**
- `PAG` **login** ⚠[SEO-006,MI-012] → calls:contentService, calls:createClient
- `PAG` **reset-password** ⚠[SEO-006,MI-012] → calls:updatePasswordAction
- `PAG` **book** ⚠[SEO-006,MI-012]
- `PAG` **book/success** ⚠[SEO-006,MI-012]
- `LAY` **/ (layout)** → calls:contentService, calls:roomService
- `PAG` **/** ⚠[SEO-001,MI-012] → calls:roomService, calls:contentService
- `PAG` **rooms/[slug]** ⚠[SEO-001,MI-022,MI-012] → calls:roomService, calls:bookingService
- `API` **GET /api/cron/cleanup-holds** ⚠[DC-004] → calls:createAdminClient, writes:booking_holds
- `API` **GET /api/cron/pre-checkout** ⚠[DC-004] → calls:bookingService, calls:roomService, calls:preCheckoutEmail, calls:sendEmail, calls:getAdminEmail
- `API` **POST /api/holds/release** → calls:holdService
- `API` **GET /auth/callback** ⚠[DC-004] → calls:createClient
- `MID` **middleware** ⚠[SEC-003,SEC-016,SG-008] → calls:updateSession

---

## Data Pipelines

**`profiles`** ⚠ PV-003, SEC-005, SEC-004
  - reads: admin/profile, getUsersAction, updateProfileAction, getUserRole
  - writes: inviteUserAction, deleteUserAction, updateUserAction, updateProfileAction
**`authUpdates`** ⚠ SEC-005, SEC-004
  - writes: updateProfileAction
**`bookings`** ⚠ SEC-004
  - reads: bookingService, holdService
  - writes: adminDeleteBookingAction, bookingService
**`page_content`** ⚠ SEC-004
  - reads: checkMediaUsageAction, contentService
  - writes: contentService
**`media_assets`** ⚠ SEC-004
  - reads: checkMediaUsageAction, deleteMediaAction, MediaGallery
  - writes: deleteMediaAction, MediaUploader
**`room_media`** ⚠ SEC-004
  - reads: checkMediaUsageAction, roomService
  - writes: roomService
**`attractions`** ⚠ SEC-004
  - reads: checkMediaUsageAction, contentService
**`roles`** ⚠ SEC-004
  - reads: getRolesAction, getRoleDetailsAction, deleteRoleAction
  - writes: createRoleAction, updateRoleAction, deleteRoleAction
**`permissions`** ⚠ SEC-004
  - reads: getPermissionsAction
**`role_permissions`** ⚠ SEC-004
  - reads: getRoleDetailsAction, updateRoleAction, getUserRole, requirePermission
  - writes: createRoleAction, updateRoleAction
**`booking_holds`** ⚠ SEC-004
  - reads: holdService
  - writes: GET /api/cron/cleanup-holds, holdService
**`storagePath`** ⚠ SEC-004
  - reads: MediaUploader
**`bucket`** ⚠ SEC-004
  - reads: MediaUploader
**`channel`** ⚠ SEC-004
  - reads: useRealtimeHolds
**`blocked_dates`** ⚠ SEC-004
  - reads: bookingService
  - writes: bookingService
**`hotel_settings`** ⚠ SEC-004
  - reads: contentService
  - writes: contentService
**`amenities`** ⚠ SEC-004
  - reads: contentService
**`conveniences`** ⚠ SEC-004
  - reads: contentService
  - writes: contentService
**`location_categories`** ⚠ SEC-004
  - reads: contentService
  - writes: contentService
**`faqs`** ⚠ SEC-004
  - reads: contentService
  - writes: contentService
**`contact_requests`** ⚠ SEC-004
  - reads: requestService
  - writes: requestService
**`rooms`** ⚠ SEC-004
  - reads: roomService
  - writes: roomService
**`room_beds`** ⚠ SEC-004
  - reads: roomService
  - writes: roomService

---

## Auth Pipeline

- Session provider: **SessionProvider**
- Middleware: **middleware**
  - ⚠ No outbound protection edges (check matcher config)

**DB Client Tiers:**
- `browser` **LogoutButton**
- `browser` **MediaGallery**
- `browser` **MediaUploader**
- `browser` **useRealtimeHolds**
- `user` **requirePermission**
- `admin` **createAdminClient**
- `user` **createClient**
- `unknown` **updateSession**
- `user` **createClient**
- `unknown` **createPublicClient**
- `unknown` **createAdminClient**
- `user` **bookingService**
- `user` **contentService**
- `user` **requestService**
- `user` **roomService**

**Layout Auth Guards:**
- **admin (layout)** protects: admin/bookings, admin/media, admin/page-content, admin, admin/profile, admin/requests, admin/rooms/new, admin/rooms +2 more
- **/ (layout)** protects: admin/bookings, admin/media, admin/page-content, admin, admin/profile, admin/requests, admin/rooms/new, admin/rooms +2 more

**Unprotected pages** (6/16):
- login
- reset-password
- book
- book/success
- /
- rooms/[slug]

---

## Critical Nodes (High Fan-In)

- **cn** `service` — 35 inbound edges
- **requirePermission** `supabase_client` — 32 inbound edges
- **usePermission** `hook` — 25 inbound edges
- **useToast** `hook` — 20 inbound edges
- **createClient** `supabase_server` — 20 inbound edges
- **roomService** `supabase_client` — 16 inbound edges
- **bookingService** `supabase_client` — 15 inbound edges
- **contentService** `supabase_client` — 13 inbound edges
- **Modal** `modal` — 11 inbound edges
- **ModalBody** `client_component` — 11 inbound edges

---

## Diagnostics

**Total:** 159 (5 errors · 52 warnings · 102 info)

### 🔴 Errors
- `PV-003` **Client page accesses DB directly: admin/profile**
  A page marked 'use client' is accessing the database directly without a server intermediary.
  Affected: admin/profile, profiles
  Fix: Fetch data server-side in a server component parent or via an API route.
- `SEC-005` **Action writes DB without auth: updateProfileAction**
  This server action performs DB writes but no authentication edge or permission guard was detected.
  Affected: updateProfileAction, profiles, authUpdates
  Fix: Call requirePermission() or validateSession() before any DB mutation.
- `SEC-013` **Admin DB client used in non-admin context: holdService**
  holdService uses the Supabase admin client (service role, bypasses RLS) but is not in an admin or cron path and does not use the Auth Admin API.
  Affected: holdService, createAdminClient
  Fix: Use the standard server client (createServerClient with anon key + RLS) for non-admin operations. Reserve service role for admin/cron contexts and auth.admin.* calls only.
- `SEC-013` **Admin DB client used in non-admin context: bookingService**
  bookingService uses the Supabase admin client (service role, bypasses RLS) but is not in an admin or cron path and does not use the Auth Admin API.
  Affected: bookingService, createAdminClient
  Fix: Use the standard server client (createServerClient with anon key + RLS) for non-admin operations. Reserve service role for admin/cron contexts and auth.admin.* calls only.
- `MI-021` **CRON_SECRET not configured in environment**
  The project has 2 cron job(s) but no CRON_SECRET environment variable was found. Without this secret, cron routes using conditional guards are publicly accessible.
  Affected: /api/cron/cleanup-holds (0 0 * * *), /api/cron/pre-checkout (0 7 * * *)
  Fix: Add CRON_SECRET=<random-secret> to .env.local and Vercel project environment variables.

### 🟡 Warnings
- `DC-003` **Unused server action: inline_action**
  This server action has no inbound calls or trigger edges.
  Affected: inline_action
  Fix: Remove the action or wire it to a form or component.
- `DC-003` **Unused server action: login**
  This server action has no inbound calls or trigger edges.
  Affected: login
  Fix: Remove the action or wire it to a form or component.
- `DC-003` **Unused server action: cancelBookingAction**
  This server action has no inbound calls or trigger edges.
  Affected: cancelBookingAction
  Fix: Remove the action or wire it to a form or component.
- `DC-003` **Unused server action: getRoomByIdAction**
  This server action has no inbound calls or trigger edges.
  Affected: getRoomByIdAction
  Fix: Remove the action or wire it to a form or component.
- `DC-003` **Unused server action: releaseHoldAction**
  This server action has no inbound calls or trigger edges.
  Affected: releaseHoldAction
  Fix: Remove the action or wire it to a form or component.
- `DC-003` **Unused server action: getRequestsAction**
  This server action has no inbound calls or trigger edges.
  Affected: getRequestsAction
  Fix: Remove the action or wire it to a form or component.
- `DC-003` **Unused server action: getRoomsAction**
  This server action has no inbound calls or trigger edges.
  Affected: getRoomsAction
  Fix: Remove the action or wire it to a form or component.
- `DC-001` **Unused component: BookingIdFilter**
  This component has no inbound render or wraps edges — it is never used in any page or layout.
  Affected: BookingIdFilter
  Fix: Remove the component or add it to a page/layout. Check if it was meant to replace an existing component.
- `DC-001` **Unused component: CostFilter**
  This component has no inbound render or wraps edges — it is never used in any page or layout.
  Affected: CostFilter
  Fix: Remove the component or add it to a page/layout. Check if it was meant to replace an existing component.
- `DC-001` **Unused component: DatesFilter**
  This component has no inbound render or wraps edges — it is never used in any page or layout.
  Affected: DatesFilter
  Fix: Remove the component or add it to a page/layout. Check if it was meant to replace an existing component.
- `DC-001` **Unused component: DetailsFilter**
  This component has no inbound render or wraps edges — it is never used in any page or layout.
  Affected: DetailsFilter
  Fix: Remove the component or add it to a page/layout. Check if it was meant to replace an existing component.
- `DC-001` **Unused component: GuestsFilter**
  This component has no inbound render or wraps edges — it is never used in any page or layout.
  Affected: GuestsFilter
  Fix: Remove the component or add it to a page/layout. Check if it was meant to replace an existing component.
- `DC-001` **Unused component: RequestsFilter**
  This component has no inbound render or wraps edges — it is never used in any page or layout.
  Affected: RequestsFilter
  Fix: Remove the component or add it to a page/layout. Check if it was meant to replace an existing component.
- `DC-001` **Unused component: RoomFilter**
  This component has no inbound render or wraps edges — it is never used in any page or layout.
  Affected: RoomFilter
  Fix: Remove the component or add it to a page/layout. Check if it was meant to replace an existing component.
- `DC-001` **Unused component: StatusFilter**
  This component has no inbound render or wraps edges — it is never used in any page or layout.
  Affected: StatusFilter
  Fix: Remove the component or add it to a page/layout. Check if it was meant to replace an existing component.
- `DC-001` **Unused component: DebugAuth**
  This component has no inbound render or wraps edges — it is never used in any page or layout.
  Affected: DebugAuth
  Fix: Remove the component or add it to a page/layout. Check if it was meant to replace an existing component.
- `DC-001` **Unused component: LocationPicker**
  This component has no inbound render or wraps edges — it is never used in any page or layout.
  Affected: LocationPicker
  Fix: Remove the component or add it to a page/layout. Check if it was meant to replace an existing component.
- `DC-001` **Unused component: BookingWizard**
  This component has no inbound render or wraps edges — it is never used in any page or layout.
  Affected: BookingWizard
  Fix: Remove the component or add it to a page/layout. Check if it was meant to replace an existing component.
- `DC-001` **Unused component: FilterPanel**
  This component has no inbound render or wraps edges — it is never used in any page or layout.
  Affected: FilterPanel
  Fix: Remove the component or add it to a page/layout. Check if it was meant to replace an existing component.
- `DC-001` **Unused component: AmenityGrid**
  This component has no inbound render or wraps edges — it is never used in any page or layout.
  Affected: AmenityGrid
  Fix: Remove the component or add it to a page/layout. Check if it was meant to replace an existing component.
- `DC-001` **Unused component: BedConfigSelector**
  This component has no inbound render or wraps edges — it is never used in any page or layout.
  Affected: BedConfigSelector
  Fix: Remove the component or add it to a page/layout. Check if it was meant to replace an existing component.
- `DC-001` **Unused component: FloorSelector**
  This component has no inbound render or wraps edges — it is never used in any page or layout.
  Affected: FloorSelector
  Fix: Remove the component or add it to a page/layout. Check if it was meant to replace an existing component.
- `DC-001` **Unused component: PriceRangeSlider**
  This component has no inbound render or wraps edges — it is never used in any page or layout.
  Affected: PriceRangeSlider
  Fix: Remove the component or add it to a page/layout. Check if it was meant to replace an existing component.
- `DC-001` **Unused component: SizeSlider**
  This component has no inbound render or wraps edges — it is never used in any page or layout.
  Affected: SizeSlider
  Fix: Remove the component or add it to a page/layout. Check if it was meant to replace an existing component.
- `DC-001` **Unused component: PaginationControls**
  This component has no inbound render or wraps edges — it is never used in any page or layout.
  Affected: PaginationControls
  Fix: Remove the component or add it to a page/layout. Check if it was meant to replace an existing component.
- `DC-001` **Unused component: InteractiveMap**
  This component has no inbound render or wraps edges — it is never used in any page or layout.
  Affected: InteractiveMap
  Fix: Remove the component or add it to a page/layout. Check if it was meant to replace an existing component.
- `DC-001` **Unused component: Dropdown**
  This component has no inbound render or wraps edges — it is never used in any page or layout.
  Affected: Dropdown
  Fix: Remove the component or add it to a page/layout. Check if it was meant to replace an existing component.
- `DC-001` **Unused component: Lightbox**
  This component has no inbound render or wraps edges — it is never used in any page or layout.
  Affected: Lightbox
  Fix: Remove the component or add it to a page/layout. Check if it was meant to replace an existing component.
- `DC-001` **Unused component: OptimizedMedia**
  This component has no inbound render or wraps edges — it is never used in any page or layout.
  Affected: OptimizedMedia
  Fix: Remove the component or add it to a page/layout. Check if it was meant to replace an existing component.
- `DC-001` **Unused component: Skeleton**
  This component has no inbound render or wraps edges — it is never used in any page or layout.
  Affected: Skeleton
  Fix: Remove the component or add it to a page/layout. Check if it was meant to replace an existing component.
- `DC-001` **Unused component: Can**
  This component has no inbound render or wraps edges — it is never used in any page or layout.
  Affected: Can
  Fix: Remove the component or add it to a page/layout. Check if it was meant to replace an existing component.
- `DC-002` **Unused hook: useDateParams**
  This custom hook has no inbound 'uses' edges — nothing calls it.
  Affected: useDateParams
  Fix: Delete the hook or find missing usages. May indicate a refactor left it behind.
- `DC-005` **Orphaned service: passwordResetEmail**
  This service has no edges in either direction and is not in a shared lib/constants path. It may be completely unused.
  Affected: passwordResetEmail
  Fix: Remove the service or connect it to its consumers.
- `DR-001` **Multiple email services (2 found)**
  sendEmail, getAdminEmail — multiple email service nodes suggest uncoordinated implementation.
  Affected: sendEmail, getAdminEmail
  Fix: Consolidate to a single email abstraction class or module. Template/helper files in the same pipeline are expected — only flag competing transport implementations.
- `DR-002` **Multiple Supabase browser clients (4 found)**
  4 Supabase clients of the same tier ('browser') detected. Each tier should be instantiated once as a singleton. Having separate tiers (browser/server/admin) is expected.
  Affected: LogoutButton, MediaGallery, MediaUploader, useRealtimeHolds
  Fix: Instantiate each Supabase client tier once in lib/supabase/ and re-import it everywhere.
- `DR-002` **Multiple Supabase server (anon) clients (7 found)**
  7 Supabase clients of the same tier ('user') detected. Each tier should be instantiated once as a singleton. Having separate tiers (browser/server/admin) is expected.
  Affected: requirePermission, createClient, createClient, bookingService, contentService, requestService +1 more
  Fix: Instantiate each Supabase client tier once in lib/supabase/ and re-import it everywhere.
- `DR-002` **Multiple Supabase browser clients (3 found)**
  3 Supabase clients of the same tier ('unknown') detected. Each tier should be instantiated once as a singleton. Having separate tiers (browser/server/admin) is expected.
  Affected: updateSession, createPublicClient, createAdminClient
  Fix: Instantiate each Supabase client tier once in lib/supabase/ and re-import it everywhere.
- `SEC-003` **Middleware protects no routes: middleware**
  Middleware is registered but has no outbound protection edges — it may be running with no effect.
  Affected: middleware
  Fix: Add auth check and matcher config, or remove the middleware if unused.
- `SEC-016` `suspected` **Middleware missing HTTP security headers: middleware**
  Middleware is the ideal place to set Strict-Transport-Security, X-Frame-Options, X-Content-Type-Options and Content-Security-Policy. No such headers were detected. Vercel does not inject these automatically.
  Affected: middleware
  Fix: In middleware.ts, set response headers: X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin, and Strict-Transport-Security: max-age=31536000; includeSubDomains.
- `AR-002` **No root error boundary (app/error.tsx missing)**
  The App Router uses error.tsx to catch unhandled errors and show a recovery UI. Without a root-level error.tsx, any uncaught error will fall through to Next.js's generic 500 page with no user-friendly recovery or custom branding.
  Fix: Create src/app/error.tsx with a React error boundary component that renders a user-friendly error state and a "Try again" retry button.
- `MI-001` **Supabase: missing migrations directory**
  Project uses Supabase but no supabase/migrations/ directory with SQL files was found.
  Fix: Run: supabase db diff --use-migra -f init
- `MI-002` **Supabase: missing generated TypeScript types**
  No database.types.ts file found. DB queries are untyped which reduces type safety.
  Fix: Run: supabase gen types typescript --linked > database.types.ts
- `SG-008` **Middleware may be missing matcher config: middleware**
  Middleware with minimal or no outbound connections may lack a config.matcher export, causing it to run on all routes including static assets.
  Affected: middleware
  Fix: Export a config.matcher array from middleware.ts to limit which routes it runs on.
- `TC-001` **No test files found in project**
  No *.test.ts, *.spec.ts or similar test files were found. Zero tests is a significant production risk.
  Fix: Set up Vitest or Jest with Testing Library. Start with critical actions and API routes.
- `SEO-001` **Public page missing metadata: /**
  No metadata export found in this page or any ancestor layout in the App Router tree.
  Affected: /
  Fix: Export a metadata object or generateMetadata function. The page will inherit metadata from the nearest ancestor layout if defined there.
- `SEO-001` **Public page missing metadata: rooms/[slug]**
  No metadata export found in this page or any ancestor layout in the App Router tree.
  Affected: rooms/[slug]
  Fix: Export a metadata object or generateMetadata function. The page will inherit metadata from the nearest ancestor layout if defined there.
- `SEO-006` **Auth/transactional page missing noindex: admin/bookings**
  Pages like login, checkout, and callback should be excluded from search engine indexing. Without noindex, they may appear in search results and consume crawl budget.
  Affected: admin/bookings
  Fix: Add export const metadata = { robots: { index: false, follow: false } } to this page or its layout.
- `SEO-006` **Auth/transactional page missing noindex: login**
  Pages like login, checkout, and callback should be excluded from search engine indexing. Without noindex, they may appear in search results and consume crawl budget.
  Affected: login
  Fix: Add export const metadata = { robots: { index: false, follow: false } } to this page or its layout.
- `SEO-006` **Auth/transactional page missing noindex: reset-password**
  Pages like login, checkout, and callback should be excluded from search engine indexing. Without noindex, they may appear in search results and consume crawl budget.
  Affected: reset-password
  Fix: Add export const metadata = { robots: { index: false, follow: false } } to this page or its layout.
- `SEO-006` **Auth/transactional page missing noindex: book**
  Pages like login, checkout, and callback should be excluded from search engine indexing. Without noindex, they may appear in search results and consume crawl budget.
  Affected: book
  Fix: Add export const metadata = { robots: { index: false, follow: false } } to this page or its layout.
- `SEO-006` **Auth/transactional page missing noindex: book/success**
  Pages like login, checkout, and callback should be excluded from search engine indexing. Without noindex, they may appear in search results and consume crawl budget.
  Affected: book/success
  Fix: Add export const metadata = { robots: { index: false, follow: false } } to this page or its layout.
- `MI-022` **Dynamic route missing generateMetadata: rooms/[slug]**
  This dynamic route has no generateMetadata() export. Every instance of this page (e.g. every room, product) renders with identical title/description/OG image, which harms SEO and social sharing.
  Affected: rooms/[slug]
  Fix: Add export async function generateMetadata({ params }) to return entity-specific title, description, and openGraph metadata for each dynamic page.

### 🔵 Info
- `DC-009` **Unlinked config: vercel.json**
  This configuration node has no edges. Nothing in the graph references it.
  Affected: vercel.json
  Fix: Verify this config file is still needed, or remove it.
- `DC-009` **Unlinked config: tailwind.config.ts**
  This configuration node has no edges. Nothing in the graph references it.
  Affected: tailwind.config.ts
  Fix: Verify this config file is still needed, or remove it.
- `DC-009` **Unlinked config: next.config**
  This configuration node has no edges. Nothing in the graph references it.
  Affected: next.config
  Fix: Verify this config file is still needed, or remove it.
- `DC-009` **Unlinked config: Image Config**
  This configuration node has no edges. Nothing in the graph references it.
  Affected: Image Config
  Fix: Verify this config file is still needed, or remove it.
- `DC-009` **Unlinked config: .env.local**
  This configuration node has no edges. Nothing in the graph references it.
  Affected: .env.local
  Fix: Verify this config file is still needed, or remove it.
- `DC-009` **Unlinked config: HOTEL_COORDINATES**
  This configuration node has no edges. Nothing in the graph references it.
  Affected: HOTEL_COORDINATES
  Fix: Verify this config file is still needed, or remove it.
- `DC-009` **Unlinked config: config**
  This configuration node has no edges. Nothing in the graph references it.
  Affected: config
  Fix: Verify this config file is still needed, or remove it.
- `DC-011` **Unreferenced env group: GMAIL_USER**
  This environment variable group is defined but nothing in the graph references it. May be legacy.
  Affected: GMAIL_USER
  Fix: Verify these env vars are still in use or remove them from .env.example.
- `DC-011` **Unreferenced env group: GMAIL_APP_PASSWORD**
  This environment variable group is defined but nothing in the graph references it. May be legacy.
  Affected: GMAIL_APP_PASSWORD
  Fix: Verify these env vars are still in use or remove them from .env.example.
- `DC-011` **Unreferenced env group: ADMIN_EMAIL**
  This environment variable group is defined but nothing in the graph references it. May be legacy.
  Affected: ADMIN_EMAIL
  Fix: Verify these env vars are still in use or remove them from .env.example.
- `DC-011` **Unreferenced env group: NEXT_PUBLIC_SUPABASE_URL**
  This environment variable group is defined but nothing in the graph references it. May be legacy.
  Affected: NEXT_PUBLIC_SUPABASE_URL
  Fix: Verify these env vars are still in use or remove them from .env.example.
- `DC-011` **Unreferenced env group: NEXT_PUBLIC_SUPABASE_ANON_KEY**
  This environment variable group is defined but nothing in the graph references it. May be legacy.
  Affected: NEXT_PUBLIC_SUPABASE_ANON_KEY
  Fix: Verify these env vars are still in use or remove them from .env.example.
- `DC-011` **Unreferenced env group: SUPABASE_SERVICE_ROLE_KEY**
  This environment variable group is defined but nothing in the graph references it. May be legacy.
  Affected: SUPABASE_SERVICE_ROLE_KEY
  Fix: Verify these env vars are still in use or remove them from .env.example.
- `DC-011` **Unreferenced env group: ADMIN_USERNAME**
  This environment variable group is defined but nothing in the graph references it. May be legacy.
  Affected: ADMIN_USERNAME
  Fix: Verify these env vars are still in use or remove them from .env.example.
- `DC-011` **Unreferenced env group: ADMIN_PASSWORD**
  This environment variable group is defined but nothing in the graph references it. May be legacy.
  Affected: ADMIN_PASSWORD
  Fix: Verify these env vars are still in use or remove them from .env.example.
- `DC-004` `suspected` **No internal callers for API route: GET /api/cron/cleanup-holds**
  No graph node fetches from this route internally. It may be invoked externally (webhooks, cron jobs, OAuth callbacks, third-party services) — static analysis cannot trace these callers.
  Affected: GET /api/cron/cleanup-holds
  Fix: If this route is called externally, no action needed. If purely internal, verify it is still used or remove it.
- `DC-004` `suspected` **No internal callers for API route: GET /api/cron/pre-checkout**
  No graph node fetches from this route internally. It may be invoked externally (webhooks, cron jobs, OAuth callbacks, third-party services) — static analysis cannot trace these callers.
  Affected: GET /api/cron/pre-checkout
  Fix: If this route is called externally, no action needed. If purely internal, verify it is still used or remove it.
- `DC-004` `suspected` **No internal callers for API route: GET /auth/callback**
  No graph node fetches from this route internally. It may be invoked externally (webhooks, cron jobs, OAuth callbacks, third-party services) — static analysis cannot trace these callers.
  Affected: GET /auth/callback
  Fix: If this route is called externally, no action needed. If purely internal, verify it is still used or remove it.
- `DC-012` **Dead barrel: BookingIdFilter**
  This barrel re-exports items but nothing imports from it.
  Affected: BookingIdFilter
  Fix: Clean up unused barrel exports to reduce bundle surface area.
- `DC-012` **Dead barrel: DetailsFilter**
  This barrel re-exports items but nothing imports from it.
  Affected: DetailsFilter
  Fix: Clean up unused barrel exports to reduce bundle surface area.
- `DC-012` **Dead barrel: NumericFilterValue**
  This barrel re-exports items but nothing imports from it.
  Affected: NumericFilterValue
  Fix: Clean up unused barrel exports to reduce bundle surface area.
- `DC-012` **Dead barrel: NumericOperator**
  This barrel re-exports items but nothing imports from it.
  Affected: NumericOperator
  Fix: Clean up unused barrel exports to reduce bundle surface area.
- `DC-012` **Dead barrel: GuestsFilter**
  This barrel re-exports items but nothing imports from it.
  Affected: GuestsFilter
  Fix: Clean up unused barrel exports to reduce bundle surface area.
- `DC-012` **Dead barrel: CostFilter**
  This barrel re-exports items but nothing imports from it.
  Affected: CostFilter
  Fix: Clean up unused barrel exports to reduce bundle surface area.
- `DC-012` **Dead barrel: RoomFilter**
  This barrel re-exports items but nothing imports from it.
  Affected: RoomFilter
  Fix: Clean up unused barrel exports to reduce bundle surface area.
- `DC-012` **Dead barrel: StatusFilter**
  This barrel re-exports items but nothing imports from it.
  Affected: StatusFilter
  Fix: Clean up unused barrel exports to reduce bundle surface area.
- `DC-012` **Dead barrel: RequestsFilter**
  This barrel re-exports items but nothing imports from it.
  Affected: RequestsFilter
  Fix: Clean up unused barrel exports to reduce bundle surface area.
- `DC-012` **Dead barrel: DatesFilter**
  This barrel re-exports items but nothing imports from it.
  Affected: DatesFilter
  Fix: Clean up unused barrel exports to reduce bundle surface area.
- `DC-012` **Dead barrel: PriceRangeSlider**
  This barrel re-exports items but nothing imports from it.
  Affected: PriceRangeSlider
  Fix: Clean up unused barrel exports to reduce bundle surface area.
- `DC-012` **Dead barrel: BedConfigSelector**
  This barrel re-exports items but nothing imports from it.
  Affected: BedConfigSelector
  Fix: Clean up unused barrel exports to reduce bundle surface area.
- `DC-012` **Dead barrel: FloorSelector**
  This barrel re-exports items but nothing imports from it.
  Affected: FloorSelector
  Fix: Clean up unused barrel exports to reduce bundle surface area.
- `DC-012` **Dead barrel: AmenityGrid**
  This barrel re-exports items but nothing imports from it.
  Affected: AmenityGrid
  Fix: Clean up unused barrel exports to reduce bundle surface area.
- `DC-012` **Dead barrel: SizeSlider**
  This barrel re-exports items but nothing imports from it.
  Affected: SizeSlider
  Fix: Clean up unused barrel exports to reduce bundle surface area.
- `DC-012` **Dead barrel: FilterSectionHeader**
  This barrel re-exports items but nothing imports from it.
  Affected: FilterSectionHeader
  Fix: Clean up unused barrel exports to reduce bundle surface area.
- `SEC-004` `unverifiable` **Verify RLS policy exists for table: profiles**
  No RLS policy edge was detected for this Supabase table in the static graph. Arch cannot verify RLS configuration from code — this requires checking Supabase Dashboard → Authentication → Policies.
  Affected: profiles
  Fix: Check Supabase Dashboard → Table Editor → profiles → RLS → Policies. If RLS is off, enable it and add at least one policy.
- `SEC-004` `unverifiable` **Verify RLS policy exists for table: authUpdates**
  No RLS policy edge was detected for this Supabase table in the static graph. Arch cannot verify RLS configuration from code — this requires checking Supabase Dashboard → Authentication → Policies.
  Affected: authUpdates
  Fix: Check Supabase Dashboard → Table Editor → authUpdates → RLS → Policies. If RLS is off, enable it and add at least one policy.
- `SEC-004` `unverifiable` **Verify RLS policy exists for table: bookings**
  No RLS policy edge was detected for this Supabase table in the static graph. Arch cannot verify RLS configuration from code — this requires checking Supabase Dashboard → Authentication → Policies.
  Affected: bookings
  Fix: Check Supabase Dashboard → Table Editor → bookings → RLS → Policies. If RLS is off, enable it and add at least one policy.
- `SEC-004` `unverifiable` **Verify RLS policy exists for table: page_content**
  No RLS policy edge was detected for this Supabase table in the static graph. Arch cannot verify RLS configuration from code — this requires checking Supabase Dashboard → Authentication → Policies.
  Affected: page_content
  Fix: Check Supabase Dashboard → Table Editor → page_content → RLS → Policies. If RLS is off, enable it and add at least one policy.
- `SEC-004` `unverifiable` **Verify RLS policy exists for table: media_assets**
  No RLS policy edge was detected for this Supabase table in the static graph. Arch cannot verify RLS configuration from code — this requires checking Supabase Dashboard → Authentication → Policies.
  Affected: media_assets
  Fix: Check Supabase Dashboard → Table Editor → media_assets → RLS → Policies. If RLS is off, enable it and add at least one policy.
- `SEC-004` `unverifiable` **Verify RLS policy exists for table: room_media**
  No RLS policy edge was detected for this Supabase table in the static graph. Arch cannot verify RLS configuration from code — this requires checking Supabase Dashboard → Authentication → Policies.
  Affected: room_media
  Fix: Check Supabase Dashboard → Table Editor → room_media → RLS → Policies. If RLS is off, enable it and add at least one policy.
- `SEC-004` `unverifiable` **Verify RLS policy exists for table: attractions**
  No RLS policy edge was detected for this Supabase table in the static graph. Arch cannot verify RLS configuration from code — this requires checking Supabase Dashboard → Authentication → Policies.
  Affected: attractions
  Fix: Check Supabase Dashboard → Table Editor → attractions → RLS → Policies. If RLS is off, enable it and add at least one policy.
- `SEC-004` `unverifiable` **Verify RLS policy exists for table: roles**
  No RLS policy edge was detected for this Supabase table in the static graph. Arch cannot verify RLS configuration from code — this requires checking Supabase Dashboard → Authentication → Policies.
  Affected: roles
  Fix: Check Supabase Dashboard → Table Editor → roles → RLS → Policies. If RLS is off, enable it and add at least one policy.
- `SEC-004` `unverifiable` **Verify RLS policy exists for table: permissions**
  No RLS policy edge was detected for this Supabase table in the static graph. Arch cannot verify RLS configuration from code — this requires checking Supabase Dashboard → Authentication → Policies.
  Affected: permissions
  Fix: Check Supabase Dashboard → Table Editor → permissions → RLS → Policies. If RLS is off, enable it and add at least one policy.
- `SEC-004` `unverifiable` **Verify RLS policy exists for table: role_permissions**
  No RLS policy edge was detected for this Supabase table in the static graph. Arch cannot verify RLS configuration from code — this requires checking Supabase Dashboard → Authentication → Policies.
  Affected: role_permissions
  Fix: Check Supabase Dashboard → Table Editor → role_permissions → RLS → Policies. If RLS is off, enable it and add at least one policy.
- `SEC-004` `unverifiable` **Verify RLS policy exists for table: booking_holds**
  No RLS policy edge was detected for this Supabase table in the static graph. Arch cannot verify RLS configuration from code — this requires checking Supabase Dashboard → Authentication → Policies.
  Affected: booking_holds
  Fix: Check Supabase Dashboard → Table Editor → booking_holds → RLS → Policies. If RLS is off, enable it and add at least one policy.
- `SEC-004` `unverifiable` **Verify RLS policy exists for table: storagePath**
  No RLS policy edge was detected for this Supabase table in the static graph. Arch cannot verify RLS configuration from code — this requires checking Supabase Dashboard → Authentication → Policies.
  Affected: storagePath
  Fix: Check Supabase Dashboard → Table Editor → storagePath → RLS → Policies. If RLS is off, enable it and add at least one policy.
- `SEC-004` `unverifiable` **Verify RLS policy exists for table: bucket**
  No RLS policy edge was detected for this Supabase table in the static graph. Arch cannot verify RLS configuration from code — this requires checking Supabase Dashboard → Authentication → Policies.
  Affected: bucket
  Fix: Check Supabase Dashboard → Table Editor → bucket → RLS → Policies. If RLS is off, enable it and add at least one policy.
- `SEC-004` `unverifiable` **Verify RLS policy exists for table: channel**
  No RLS policy edge was detected for this Supabase table in the static graph. Arch cannot verify RLS configuration from code — this requires checking Supabase Dashboard → Authentication → Policies.
  Affected: channel
  Fix: Check Supabase Dashboard → Table Editor → channel → RLS → Policies. If RLS is off, enable it and add at least one policy.
- `SEC-004` `unverifiable` **Verify RLS policy exists for table: blocked_dates**
  No RLS policy edge was detected for this Supabase table in the static graph. Arch cannot verify RLS configuration from code — this requires checking Supabase Dashboard → Authentication → Policies.
  Affected: blocked_dates
  Fix: Check Supabase Dashboard → Table Editor → blocked_dates → RLS → Policies. If RLS is off, enable it and add at least one policy.
- `SEC-004` `unverifiable` **Verify RLS policy exists for table: hotel_settings**
  No RLS policy edge was detected for this Supabase table in the static graph. Arch cannot verify RLS configuration from code — this requires checking Supabase Dashboard → Authentication → Policies.
  Affected: hotel_settings
  Fix: Check Supabase Dashboard → Table Editor → hotel_settings → RLS → Policies. If RLS is off, enable it and add at least one policy.
- `SEC-004` `unverifiable` **Verify RLS policy exists for table: amenities**
  No RLS policy edge was detected for this Supabase table in the static graph. Arch cannot verify RLS configuration from code — this requires checking Supabase Dashboard → Authentication → Policies.
  Affected: amenities
  Fix: Check Supabase Dashboard → Table Editor → amenities → RLS → Policies. If RLS is off, enable it and add at least one policy.
- `SEC-004` `unverifiable` **Verify RLS policy exists for table: conveniences**
  No RLS policy edge was detected for this Supabase table in the static graph. Arch cannot verify RLS configuration from code — this requires checking Supabase Dashboard → Authentication → Policies.
  Affected: conveniences
  Fix: Check Supabase Dashboard → Table Editor → conveniences → RLS → Policies. If RLS is off, enable it and add at least one policy.
- `SEC-004` `unverifiable` **Verify RLS policy exists for table: location_categories**
  No RLS policy edge was detected for this Supabase table in the static graph. Arch cannot verify RLS configuration from code — this requires checking Supabase Dashboard → Authentication → Policies.
  Affected: location_categories
  Fix: Check Supabase Dashboard → Table Editor → location_categories → RLS → Policies. If RLS is off, enable it and add at least one policy.
- `SEC-004` `unverifiable` **Verify RLS policy exists for table: faqs**
  No RLS policy edge was detected for this Supabase table in the static graph. Arch cannot verify RLS configuration from code — this requires checking Supabase Dashboard → Authentication → Policies.
  Affected: faqs
  Fix: Check Supabase Dashboard → Table Editor → faqs → RLS → Policies. If RLS is off, enable it and add at least one policy.
- `SEC-004` `unverifiable` **Verify RLS policy exists for table: contact_requests**
  No RLS policy edge was detected for this Supabase table in the static graph. Arch cannot verify RLS configuration from code — this requires checking Supabase Dashboard → Authentication → Policies.
  Affected: contact_requests
  Fix: Check Supabase Dashboard → Table Editor → contact_requests → RLS → Policies. If RLS is off, enable it and add at least one policy.
- `SEC-004` `unverifiable` **Verify RLS policy exists for table: rooms**
  No RLS policy edge was detected for this Supabase table in the static graph. Arch cannot verify RLS configuration from code — this requires checking Supabase Dashboard → Authentication → Policies.
  Affected: rooms
  Fix: Check Supabase Dashboard → Table Editor → rooms → RLS → Policies. If RLS is off, enable it and add at least one policy.
- `SEC-004` `unverifiable` **Verify RLS policy exists for table: room_beds**
  No RLS policy edge was detected for this Supabase table in the static graph. Arch cannot verify RLS configuration from code — this requires checking Supabase Dashboard → Authentication → Policies.
  Affected: room_beds
  Fix: Check Supabase Dashboard → Table Editor → room_beds → RLS → Policies. If RLS is off, enable it and add at least one policy.
- `DR-010` `suspected` **Intentional RLS bypass in guarded service: getUsersAction**
  getUsersAction uses the Supabase admin client (bypasses RLS) outside admin paths but is protected by a permission guard. This is intentional but should be documented — if the guard ever changes, RLS enforcement disappears.
  Affected: getUsersAction, createAdminClient
  Fix: Document why admin client is needed here. If the operation is user-scoped, consider using the session client with RLS enabled instead.
- `AR-001` `suspected` **Action with excessive orchestration: inviteUserAction**
  inviteUserAction calls ~13 distinct functions and writes 1 DB table(s). Actions should orchestrate at a high level — detailed business logic belongs in a service layer.
  Affected: inviteUserAction
  Fix: Extract the core logic into a dedicated service function. The action should validate, call the service, and return a result — nothing more.
- `AR-001` `suspected` **Action with excessive orchestration: updateProfileAction**
  updateProfileAction calls ~18 distinct functions and writes 2 DB table(s). Actions should orchestrate at a high level — detailed business logic belongs in a service layer.
  Affected: updateProfileAction
  Fix: Extract the core logic into a dedicated service function. The action should validate, call the service, and return a result — nothing more.
- `AR-001` `suspected` **Action with excessive orchestration: updateRoleAction**
  updateRoleAction calls ~18 distinct functions and writes 2 DB table(s). Actions should orchestrate at a high level — detailed business logic belongs in a service layer.
  Affected: updateRoleAction
  Fix: Extract the core logic into a dedicated service function. The action should validate, call the service, and return a result — nothing more.
- `MI-012` **Missing error.tsx near: admin/bookings**
  No error boundary (error.tsx) found in the same route segment as this page.
  Affected: admin/bookings
  Fix: Add error.tsx in the same folder as admin/bookings to handle runtime errors gracefully.
- `MI-012` **Missing error.tsx near: admin/media**
  No error boundary (error.tsx) found in the same route segment as this page.
  Affected: admin/media
  Fix: Add error.tsx in the same folder as admin/media to handle runtime errors gracefully.
- `MI-012` **Missing error.tsx near: admin/page-content**
  No error boundary (error.tsx) found in the same route segment as this page.
  Affected: admin/page-content
  Fix: Add error.tsx in the same folder as admin/page-content to handle runtime errors gracefully.
- `MI-012` **Missing error.tsx near: admin**
  No error boundary (error.tsx) found in the same route segment as this page.
  Affected: admin
  Fix: Add error.tsx in the same folder as admin to handle runtime errors gracefully.
- `MI-012` **Missing error.tsx near: admin/profile**
  No error boundary (error.tsx) found in the same route segment as this page.
  Affected: admin/profile
  Fix: Add error.tsx in the same folder as admin/profile to handle runtime errors gracefully.
- `MI-012` **Missing error.tsx near: admin/requests**
  No error boundary (error.tsx) found in the same route segment as this page.
  Affected: admin/requests
  Fix: Add error.tsx in the same folder as admin/requests to handle runtime errors gracefully.
- `MI-012` **Missing error.tsx near: admin/rooms/new**
  No error boundary (error.tsx) found in the same route segment as this page.
  Affected: admin/rooms/new
  Fix: Add error.tsx in the same folder as admin/rooms/new to handle runtime errors gracefully.
- `MI-012` **Missing error.tsx near: admin/rooms**
  No error boundary (error.tsx) found in the same route segment as this page.
  Affected: admin/rooms
  Fix: Add error.tsx in the same folder as admin/rooms to handle runtime errors gracefully.
- `MI-012` **Missing error.tsx near: admin/rooms/[slug]**
  No error boundary (error.tsx) found in the same route segment as this page.
  Affected: admin/rooms/[slug]
  Fix: Add error.tsx in the same folder as admin/rooms/[slug] to handle runtime errors gracefully.
- `MI-012` **Missing error.tsx near: admin/settings**
  No error boundary (error.tsx) found in the same route segment as this page.
  Affected: admin/settings
  Fix: Add error.tsx in the same folder as admin/settings to handle runtime errors gracefully.
- `MI-012` **Missing error.tsx near: login**
  No error boundary (error.tsx) found in the same route segment as this page.
  Affected: login
  Fix: Add error.tsx in the same folder as login to handle runtime errors gracefully.
- `MI-012` **Missing error.tsx near: reset-password**
  No error boundary (error.tsx) found in the same route segment as this page.
  Affected: reset-password
  Fix: Add error.tsx in the same folder as reset-password to handle runtime errors gracefully.
- `MI-012` **Missing error.tsx near: book**
  No error boundary (error.tsx) found in the same route segment as this page.
  Affected: book
  Fix: Add error.tsx in the same folder as book to handle runtime errors gracefully.
- `MI-012` **Missing error.tsx near: book/success**
  No error boundary (error.tsx) found in the same route segment as this page.
  Affected: book/success
  Fix: Add error.tsx in the same folder as book/success to handle runtime errors gracefully.
- `MI-012` **Missing error.tsx near: /**
  No error boundary (error.tsx) found in the same route segment as this page.
  Affected: /
  Fix: Add error.tsx in the same folder as / to handle runtime errors gracefully.
- `MI-012` **Missing error.tsx near: rooms/[slug]**
  No error boundary (error.tsx) found in the same route segment as this page.
  Affected: rooms/[slug]
  Fix: Add error.tsx in the same folder as rooms/[slug] to handle runtime errors gracefully.
- `MI-013` **Missing loading.tsx near: admin/profile**
  This page fetches data but no loading.tsx was found in its route segment for React Suspense streaming.
  Affected: admin/profile
  Fix: Add loading.tsx in the same folder as admin/profile.
- `MI-018` **Missing root not-found.tsx**
  No not_found node found at the app root. Next.js will show its default 404 page.
  Fix: Create app/not-found.tsx to provide a custom branded 404 experience.
- `SEO-005` **Missing root opengraph-image**
  No opengraph-image file found at the app root. Social link previews will show no image.
  Fix: Add app/opengraph-image.tsx or app/opengraph-image.png for social sharing previews.
- `PR-001` **Possibly unnecessary 'use client': LocationPicker**
  No browser hooks, event handlers, or store consumption detected. Consider converting to a server component.
  Affected: LocationPicker
  Fix: Remove 'use client' and render as a server component to reduce client bundle size.
- `PR-001` **Possibly unnecessary 'use client': RequestsMobileList**
  No browser hooks, event handlers, or store consumption detected. Consider converting to a server component.
  Affected: RequestsMobileList
  Fix: Remove 'use client' and render as a server component to reduce client bundle size.
- `PR-001` **Possibly unnecessary 'use client': BookingSummary**
  No browser hooks, event handlers, or store consumption detected. Consider converting to a server component.
  Affected: BookingSummary
  Fix: Remove 'use client' and render as a server component to reduce client bundle size.
- `PR-001` **Possibly unnecessary 'use client': PaymentMock**
  No browser hooks, event handlers, or store consumption detected. Consider converting to a server component.
  Affected: PaymentMock
  Fix: Remove 'use client' and render as a server component to reduce client bundle size.
- `PR-001` **Possibly unnecessary 'use client': StepItinerary**
  No browser hooks, event handlers, or store consumption detected. Consider converting to a server component.
  Affected: StepItinerary
  Fix: Remove 'use client' and render as a server component to reduce client bundle size.
- `PR-001` **Possibly unnecessary 'use client': RoomsDropdown**
  No browser hooks, event handlers, or store consumption detected. Consider converting to a server component.
  Affected: RoomsDropdown
  Fix: Remove 'use client' and render as a server component to reduce client bundle size.
- `PR-001` **Possibly unnecessary 'use client': Calendar**
  No browser hooks, event handlers, or store consumption detected. Consider converting to a server component.
  Affected: Calendar
  Fix: Remove 'use client' and render as a server component to reduce client bundle size.
- `PR-001` **Possibly unnecessary 'use client': ModalBody**
  No browser hooks, event handlers, or store consumption detected. Consider converting to a server component.
  Affected: ModalBody
  Fix: Remove 'use client' and render as a server component to reduce client bundle size.
- `PR-001` **Possibly unnecessary 'use client': ModalFooter**
  No browser hooks, event handlers, or store consumption detected. Consider converting to a server component.
  Affected: ModalFooter
  Fix: Remove 'use client' and render as a server component to reduce client bundle size.
- `PR-001` **Possibly unnecessary 'use client': OptimizedMedia**
  No browser hooks, event handlers, or store consumption detected. Consider converting to a server component.
  Affected: OptimizedMedia
  Fix: Remove 'use client' and render as a server component to reduce client bundle size.
- `PR-002` **Static-only client component: LocationPicker**
  No hooks, event handlers, or store usage detected. This component may not need 'use client'.
  Affected: LocationPicker
  Fix: Convert to a server component by removing the 'use client' directive.
- `PR-002` **Static-only client component: BookingSummary**
  No hooks, event handlers, or store usage detected. This component may not need 'use client'.
  Affected: BookingSummary
  Fix: Convert to a server component by removing the 'use client' directive.
- `PR-002` **Static-only client component: PaymentMock**
  No hooks, event handlers, or store usage detected. This component may not need 'use client'.
  Affected: PaymentMock
  Fix: Convert to a server component by removing the 'use client' directive.
- `PR-002` **Static-only client component: StepItinerary**
  No hooks, event handlers, or store usage detected. This component may not need 'use client'.
  Affected: StepItinerary
  Fix: Convert to a server component by removing the 'use client' directive.
- `PR-002` **Static-only client component: RoomsDropdown**
  No hooks, event handlers, or store usage detected. This component may not need 'use client'.
  Affected: RoomsDropdown
  Fix: Convert to a server component by removing the 'use client' directive.
- `PR-002` **Static-only client component: Calendar**
  No hooks, event handlers, or store usage detected. This component may not need 'use client'.
  Affected: Calendar
  Fix: Convert to a server component by removing the 'use client' directive.
- `PR-002` **Static-only client component: ModalBody**
  No hooks, event handlers, or store usage detected. This component may not need 'use client'.
  Affected: ModalBody
  Fix: Convert to a server component by removing the 'use client' directive.
- `PR-002` **Static-only client component: ModalFooter**
  No hooks, event handlers, or store usage detected. This component may not need 'use client'.
  Affected: ModalFooter
  Fix: Convert to a server component by removing the 'use client' directive.
- `PR-002` **Static-only client component: OptimizedMedia**
  No hooks, event handlers, or store usage detected. This component may not need 'use client'.
  Affected: OptimizedMedia
  Fix: Convert to a server component by removing the 'use client' directive.
- `CV-018` **Action file with zero auth guards: page.tsx**
  None of the 1 export(s) in 'page.tsx' contain an auth guard. This may be intentional for pre-auth flows (login, registration) but should be verified for actions that modify data.
  Affected: inline_action
  Fix: Verify this is intentional. If these actions modify protected data, add an auth guard.
- `CV-018` **Action file with zero auth guards: page.tsx**
  None of the 1 export(s) in 'page.tsx' contain an auth guard. This may be intentional for pre-auth flows (login, registration) but should be verified for actions that modify data.
  Affected: login
  Fix: Verify this is intentional. If these actions modify protected data, add an auth guard.
- `MC-010` **package.json missing engines.node field**
  No Node.js version constraint specified. Vercel may deploy on an unexpected Node runtime.
  Fix: Add "engines": { "node": ">=20" } to package.json.


---

## Environment Variables

- `GMAIL_USER`
- `GMAIL_APP_PASSWORD` `SECRET`
- `ADMIN_EMAIL`
- `NEXT_PUBLIC_SUPABASE_URL` `PUBLIC`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` `PUBLIC`
- `SUPABASE_SERVICE_ROLE_KEY` `SECRET`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD` `SECRET`
- `HOTEL_COORDINATES`
- `NAV_LINKS`

---

_This file is auto-generated by [Arch](https://github.com/arch-app). Do not edit manually._
