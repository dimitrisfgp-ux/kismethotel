-- Create a secure function to check admin status
-- This function runs with SECURITY DEFINER, meaning it bypasses RLS on table access
-- This is crucial because policies typically cannot 'see' other tables if those tables have their own RLS (circular dependency or visibility issues)

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM profiles p 
    JOIN roles r ON p.role_id = r.id 
    WHERE p.id = auth.uid() 
      AND r.name = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS Policies to use this function
-- This simplifies them and ensures they work even if the user can't theoretically 'read' the profiles table in that context

-- Page Content
DROP POLICY IF EXISTS "Enable insert for admins only" ON page_content;
DROP POLICY IF EXISTS "Enable update for admins only" ON page_content;

CREATE POLICY "Enable insert for admins only" ON page_content FOR INSERT TO authenticated WITH CHECK ( is_admin() );
CREATE POLICY "Enable update for admins only" ON page_content FOR UPDATE TO authenticated USING ( is_admin() ) WITH CHECK ( is_admin() );

-- Media Assets
DROP POLICY IF EXISTS "Enable insert for admins only" ON media_assets;
DROP POLICY IF EXISTS "Enable update for admins only" ON media_assets;
DROP POLICY IF EXISTS "Enable delete for admins only" ON media_assets;

CREATE POLICY "Enable insert for admins only" ON media_assets FOR INSERT TO authenticated WITH CHECK ( is_admin() );
CREATE POLICY "Enable update for admins only" ON media_assets FOR UPDATE TO authenticated USING ( is_admin() ) WITH CHECK ( is_admin() );
CREATE POLICY "Enable delete for admins only" ON media_assets FOR DELETE TO authenticated USING ( is_admin() );

-- Hotel Settings
DROP POLICY IF EXISTS "Enable update for admins only" ON hotel_settings;
DROP POLICY IF EXISTS "Enable insert for admins only" ON hotel_settings;

CREATE POLICY "Enable update for admins only" ON hotel_settings FOR UPDATE TO authenticated USING ( is_admin() ) WITH CHECK ( is_admin() );
CREATE POLICY "Enable insert for admins only" ON hotel_settings FOR INSERT TO authenticated WITH CHECK ( is_admin() );

-- storage.objects (Fixing the Hero Upload RLS too!)
-- We need to drop existing custom policies if any, but since we don't know their names, we'll just create a new one that might overlap or we rely on the manual cleanup if needed.
-- But for now, let's try to add a permissive Admin policy for Storage.
-- Note: Storage policies are often on 'storage.objects', not 'public.objects'

DO $$
BEGIN
    -- Attempt to enable RLS on storage.objects if not already
    ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

DROP POLICY IF EXISTS "Admin Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update Access" ON storage.objects;

CREATE POLICY "Admin Upload Access" ON storage.objects FOR INSERT TO authenticated WITH CHECK ( public.is_admin() );
CREATE POLICY "Admin Delete Access" ON storage.objects FOR DELETE TO authenticated USING ( public.is_admin() );
CREATE POLICY "Admin Update Access" ON storage.objects FOR UPDATE TO authenticated USING ( public.is_admin() );

-- Allow public read (usually default, but good to ensure)
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
CREATE POLICY "Public Read Access" ON storage.objects FOR SELECT TO public USING ( bucket_id = 'hotel-media' );
