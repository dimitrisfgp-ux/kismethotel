-- 29_standardize_rls.sql
-- Goal: Standardize Row Level Security using a single, data-driven permission check function.
-- FIXED: Drops dependent policies BEFORE dropping the is_admin function.

-- 1. Create the standardized helper function (Safe to do first)
CREATE OR REPLACE FUNCTION public.check_permission(required_permission text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles prof
    JOIN public.role_permissions rp ON prof.role_id = rp.role_id
    JOIN public.permissions perm ON rp.permission_id = perm.id
    WHERE prof.id = auth.uid()
      AND perm.slug = required_permission
  );
END;
$$;

-- 2. DROP DEPENDENT POLICIES FIRST (Fixes dependency error)

-- Hotel Settings
ALTER TABLE public.hotel_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable insert for admins only" ON public.hotel_settings;
DROP POLICY IF EXISTS "Enable update for admins only" ON public.hotel_settings;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.hotel_settings;

-- Page Content
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable insert for admins only" ON public.page_content;
DROP POLICY IF EXISTS "Enable update for admins only" ON public.page_content;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.page_content;

-- Media Assets
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable insert for admins only" ON public.media_assets;
DROP POLICY IF EXISTS "Enable update for admins only" ON public.media_assets;
DROP POLICY IF EXISTS "Enable delete for admins only" ON public.media_assets;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.media_assets;

-- Storage Objects (Handle global storage policies carefully)
DROP POLICY IF EXISTS "Admin Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update Access" ON storage.objects;

-- Rooms (Not in error list, but good to clean up)
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.rooms;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.rooms;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.rooms;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.rooms;
DROP POLICY IF EXISTS "Allow public read access" ON public.rooms;
DROP POLICY IF EXISTS "Allow admin create" ON public.rooms;
DROP POLICY IF EXISTS "Allow admin update" ON public.rooms;
DROP POLICY IF EXISTS "Allow admin delete" ON public.rooms;

-- 3. NOW it is safe to drop the legacy function
DROP FUNCTION IF EXISTS public.is_admin();

-- 4. Re-create Policies with proper "check_permission" logic

-- Rooms
CREATE POLICY "Public Read Access" ON public.rooms FOR SELECT TO public USING (true);
CREATE POLICY "Staff Create Access" ON public.rooms FOR INSERT TO authenticated WITH CHECK ( check_permission('rooms.create') );
CREATE POLICY "Staff Update Access" ON public.rooms FOR UPDATE TO authenticated USING ( check_permission('rooms.update') ) WITH CHECK ( check_permission('rooms.update') );
CREATE POLICY "Staff Delete Access" ON public.rooms FOR DELETE TO authenticated USING ( check_permission('rooms.delete') );

-- Hotel Settings
CREATE POLICY "Public Read Access" ON public.hotel_settings FOR SELECT TO public USING (true);
CREATE POLICY "Staff Update Access" ON public.hotel_settings FOR UPDATE TO authenticated USING ( check_permission('content.settings') ) WITH CHECK ( check_permission('content.settings') );
CREATE POLICY "Staff Insert Access" ON public.hotel_settings FOR INSERT TO authenticated WITH CHECK ( check_permission('content.settings') );

-- Page Content
CREATE POLICY "Public Read Access" ON public.page_content FOR SELECT TO public USING (true);
CREATE POLICY "Staff Create Access" ON public.page_content FOR INSERT TO authenticated WITH CHECK ( check_permission('content.pages') );
CREATE POLICY "Staff Update Access" ON public.page_content FOR UPDATE TO authenticated USING ( check_permission('content.pages') ) WITH CHECK ( check_permission('content.pages') );
CREATE POLICY "Staff Delete Access" ON public.page_content FOR DELETE TO authenticated USING ( check_permission('content.pages') );

-- Media Assets
CREATE POLICY "Public Read Access" ON public.media_assets FOR SELECT TO public USING (true);
CREATE POLICY "Staff Manage Access" ON public.media_assets FOR ALL TO authenticated USING ( 
    check_permission('content.pages') OR check_permission('rooms.create') 
) WITH CHECK ( 
    check_permission('content.pages') OR check_permission('rooms.create') 
);

-- Contact Requests
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.contact_requests;
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON public.contact_requests;

CREATE POLICY "Public Create Access" ON public.contact_requests FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Staff View Access" ON public.contact_requests FOR SELECT TO authenticated USING ( check_permission('requests.view') );
CREATE POLICY "Staff Update Access" ON public.contact_requests FOR UPDATE TO authenticated USING ( check_permission('requests.manage') ) WITH CHECK ( check_permission('requests.manage') );

-- Bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Insert" ON public.bookings;
DROP POLICY IF EXISTS "Staff View" ON public.bookings;
DROP POLICY IF EXISTS "Staff Manage" ON public.bookings;

CREATE POLICY "Public Create Access" ON public.bookings FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Staff View Access" ON public.bookings FOR SELECT TO authenticated USING ( check_permission('bookings.view') );
CREATE POLICY "Staff Update Access" ON public.bookings FOR UPDATE TO authenticated USING ( check_permission('bookings.manage') ) WITH CHECK ( check_permission('bookings.manage') );
CREATE POLICY "Staff Delete Access" ON public.bookings FOR DELETE TO authenticated USING ( check_permission('bookings.manage') );

-- Storage Objects
CREATE POLICY "Staff Storage Upload" ON storage.objects FOR INSERT TO authenticated 
WITH CHECK ( bucket_id = 'hotel-media' AND (check_permission('content.pages') OR check_permission('rooms.create')) );

CREATE POLICY "Staff Storage Update" ON storage.objects FOR UPDATE TO authenticated 
USING ( bucket_id = 'hotel-media' AND (check_permission('content.pages') OR check_permission('rooms.create')) );

CREATE POLICY "Staff Storage Delete" ON storage.objects FOR DELETE TO authenticated 
USING ( bucket_id = 'hotel-media' AND (check_permission('content.pages') OR check_permission('rooms.create')) );
