-- Enable RLS on rooms table
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Policy: Allow everyone to read rooms (public)
DROP POLICY IF EXISTS "Allow public read access" ON rooms;
CREATE POLICY "Allow public read access" ON rooms
FOR SELECT USING (true);

-- Policy: Allow authenticated users (admins) to update rooms
DROP POLICY IF EXISTS "Allow authenticated update" ON rooms;
CREATE POLICY "Allow authenticated update" ON rooms
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Allow authenticated users to insert rooms
DROP POLICY IF EXISTS "Allow authenticated insert" ON rooms;
CREATE POLICY "Allow authenticated insert" ON rooms
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Allow authenticated users to delete rooms
DROP POLICY IF EXISTS "Allow authenticated delete" ON rooms;
CREATE POLICY "Allow authenticated delete" ON rooms
FOR DELETE
TO authenticated
USING (true);
