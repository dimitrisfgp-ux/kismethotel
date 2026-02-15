-- Secure RLS for RBAC tables (Roles, Permissions, RolePermissions)

-- 1. Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON roles;
DROP POLICY IF EXISTS "Enable insert for admins only" ON roles;
DROP POLICY IF EXISTS "Enable update for admins only" ON roles;
DROP POLICY IF EXISTS "Enable delete for admins only" ON roles;

DROP POLICY IF EXISTS "Enable read access for all users" ON permissions;

DROP POLICY IF EXISTS "Enable read access for all users" ON role_permissions;
DROP POLICY IF EXISTS "Enable insert for admins only" ON role_permissions;
DROP POLICY IF EXISTS "Enable delete for admins only" ON role_permissions;

-- 3. Roles Policies
-- Read: Authenticated users (staff) need to see roles
CREATE POLICY "Enable read access for authenticated users" ON roles FOR SELECT TO authenticated USING (true);

-- Write: Admins only
CREATE POLICY "Enable insert for admins only" ON roles FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p JOIN roles r ON p.role_id = r.id WHERE p.id = auth.uid() AND r.name = 'admin')
);
CREATE POLICY "Enable update for admins only" ON roles FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p JOIN roles r ON p.role_id = r.id WHERE p.id = auth.uid() AND r.name = 'admin')
) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p JOIN roles r ON p.role_id = r.id WHERE p.id = auth.uid() AND r.name = 'admin')
);
CREATE POLICY "Enable delete for admins only" ON roles FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p JOIN roles r ON p.role_id = r.id WHERE p.id = auth.uid() AND r.name = 'admin')
);

-- 4. Permissions Policies
-- Read: Authenticated users need to see what permissions exist
CREATE POLICY "Enable read access for authenticated users" ON permissions FOR SELECT TO authenticated USING (true);
-- Write: No one updates permissions via API, they are seeded via SQL.

-- 5. Role_Permissions Policies
-- Read: Authenticated users
CREATE POLICY "Enable read access for authenticated users" ON role_permissions FOR SELECT TO authenticated USING (true);

-- Write: Admins only
CREATE POLICY "Enable insert for admins only" ON role_permissions FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p JOIN roles r ON p.role_id = r.id WHERE p.id = auth.uid() AND r.name = 'admin')
);
CREATE POLICY "Enable delete for admins only" ON role_permissions FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p JOIN roles r ON p.role_id = r.id WHERE p.id = auth.uid() AND r.name = 'admin')
);
