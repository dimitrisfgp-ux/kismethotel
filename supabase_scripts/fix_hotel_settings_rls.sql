-- 1. Ensure permission exists with correct module
INSERT INTO permissions (slug, description, module)
VALUES ('content.settings', 'Manage hotel global settings', 'content')
ON CONFLICT (slug) DO UPDATE
SET module = 'content'; -- Ensure module is set correctly even if it exists

-- 2. Ensure admin role satisfies the permission
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'admin' AND p.slug = 'content.settings'
ON CONFLICT DO NOTHING;

-- 3. Enable RLS on hotel_settings
ALTER TABLE hotel_settings ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies to avoid conflicts/stale logic
DROP POLICY IF EXISTS "Allow public read" ON hotel_settings;
DROP POLICY IF EXISTS "Allow admin update" ON hotel_settings;
DROP POLICY IF EXISTS "Allow editor update" ON hotel_settings;
DROP POLICY IF EXISTS "Allow content.settings update" ON hotel_settings;

-- 5. Create Read Policy (Public)
CREATE POLICY "Allow public read" ON hotel_settings
FOR SELECT USING (true);

-- 6. Create Update Policy (RBAC)
-- Uses the standard verify_permission function or direct join if function not available
-- Assuming direct join for safety as seen in other scripts
CREATE POLICY "Allow content.settings update" ON hotel_settings
FOR ALL -- Covers UPDATE/INSERT (Upsert)
USING (
    EXISTS (
        SELECT 1 FROM profiles
        JOIN role_permissions ON profiles.role_id = role_permissions.role_id
        JOIN permissions ON role_permissions.permission_id = permissions.id
        WHERE profiles.id = auth.uid()
        AND permissions.slug = 'content.settings'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles
        JOIN role_permissions ON profiles.role_id = role_permissions.role_id
        JOIN permissions ON role_permissions.permission_id = permissions.id
        WHERE profiles.id = auth.uid()
        AND permissions.slug = 'content.settings'
    )
);
