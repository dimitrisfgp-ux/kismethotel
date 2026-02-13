-- Secure RLS for Rooms table
-- Only allow public READ
-- Only allow 'admin' users to INSERT, UPDATE, DELETE

-- Drop existing policies (from 19_fix_rooms_rls.sql)
DROP POLICY IF EXISTS "Enable read access for all users" ON rooms;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON rooms;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON rooms;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON rooms;

-- Re-create READ policy (Public)
CREATE POLICY "Enable read access for all users" ON rooms
    FOR SELECT
    USING (true);

-- Create ADMIN-ONLY Write policies
-- Helper: Checks if the current user has the 'admin' role
-- We assume a 'profiles' table exists with 'role_id' linking to 'roles' table with 'name' column

CREATE POLICY "Enable insert for admins only" ON rooms
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN roles r ON p.role_id = r.id
            WHERE p.id = auth.uid()
              AND r.name = 'admin'
        )
    );

CREATE POLICY "Enable update for admins only" ON rooms
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN roles r ON p.role_id = r.id
            WHERE p.id = auth.uid()
              AND r.name = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN roles r ON p.role_id = r.id
            WHERE p.id = auth.uid()
              AND r.name = 'admin'
        )
    );

CREATE POLICY "Enable delete for admins only" ON rooms
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN roles r ON p.role_id = r.id
            WHERE p.id = auth.uid()
              AND r.name = 'admin'
        )
    );
