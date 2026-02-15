-- Secure RLS for Content tables (Page Content, Media, Settings)

-- 1. Enable RLS on tables
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_settings ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable read access for all users" ON page_content;
DROP POLICY IF EXISTS "Enable insert for admins only" ON page_content;
DROP POLICY IF EXISTS "Enable update for admins only" ON page_content;

DROP POLICY IF EXISTS "Enable read access for all users" ON media_assets;
DROP POLICY IF EXISTS "Enable insert for admins only" ON media_assets;
DROP POLICY IF EXISTS "Enable update for admins only" ON media_assets;
DROP POLICY IF EXISTS "Enable delete for admins only" ON media_assets;

DROP POLICY IF EXISTS "Enable read access for all users" ON hotel_settings;
DROP POLICY IF EXISTS "Enable update for admins only" ON hotel_settings;

-- 3. Create READ policies (Public)
CREATE POLICY "Enable read access for all users" ON page_content FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON media_assets FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON hotel_settings FOR SELECT USING (true);

-- 4. Create ADMIN-ONLY Write policies for page_content
CREATE POLICY "Enable insert for admins only" ON page_content FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p JOIN roles r ON p.role_id = r.id WHERE p.id = auth.uid() AND r.name = 'admin')
);
CREATE POLICY "Enable update for admins only" ON page_content FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p JOIN roles r ON p.role_id = r.id WHERE p.id = auth.uid() AND r.name = 'admin')
) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p JOIN roles r ON p.role_id = r.id WHERE p.id = auth.uid() AND r.name = 'admin')
);

-- 5. Create ADMIN-ONLY Write policies for media_assets
CREATE POLICY "Enable insert for admins only" ON media_assets FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p JOIN roles r ON p.role_id = r.id WHERE p.id = auth.uid() AND r.name = 'admin')
);
CREATE POLICY "Enable update for admins only" ON media_assets FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p JOIN roles r ON p.role_id = r.id WHERE p.id = auth.uid() AND r.name = 'admin')
) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p JOIN roles r ON p.role_id = r.id WHERE p.id = auth.uid() AND r.name = 'admin')
);
CREATE POLICY "Enable delete for admins only" ON media_assets FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p JOIN roles r ON p.role_id = r.id WHERE p.id = auth.uid() AND r.name = 'admin')
);

-- 6. Create ADMIN-ONLY Write policies for hotel_settings
CREATE POLICY "Enable update for admins only" ON hotel_settings FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p JOIN roles r ON p.role_id = r.id WHERE p.id = auth.uid() AND r.name = 'admin')
) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p JOIN roles r ON p.role_id = r.id WHERE p.id = auth.uid() AND r.name = 'admin')
);
-- Note: hotel_settings usually has a single row (id=1), so INSERT might strict or governed by a seed script. We allow update.
CREATE POLICY "Enable insert for admins only" ON hotel_settings FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p JOIN roles r ON p.role_id = r.id WHERE p.id = auth.uid() AND r.name = 'admin')
);
