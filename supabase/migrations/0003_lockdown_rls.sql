-- 0003_lockdown_rls.sql
-- Security hardening: the public (anon / publishable) API key must NOT be able to
-- reach booking data, holds, or RBAC/PII tables. The current production grants give
-- anon ALL on these tables, and "USING (true)" policies expose guest names/emails.
--
-- Server-side writes use the service_role key, which BYPASSES RLS and table grants,
-- so revoking anon does not affect legitimate app flows (booking creation, holds,
-- admin actions all run via service_role or authenticated staff sessions).
--
-- Idempotent: safe to re-run (drop ... if exists; revoke of unheld privs is a no-op).

-- Drop the policies that exposed guest PII / holds to anyone holding the anon key.
drop policy if exists "Public read access for bookings"      on public.bookings;
drop policy if exists "Public can view holds"                on public.booking_holds;
drop policy if exists "Public full access for booking_holds" on public.booking_holds;

-- Revoke blanket table privileges from anon on sensitive tables.
revoke all on public.bookings         from anon;
revoke all on public.booking_holds    from anon;
revoke all on public.profiles         from anon;
revoke all on public.roles            from anon;
revoke all on public.permissions      from anon;
revoke all on public.role_permissions from anon;

-- contact_requests: the public contact form needs INSERT only — nothing else.
revoke all    on public.contact_requests from anon;
grant  insert on public.contact_requests to   anon;
