-- Enable RLS on contact_requests if not already enabled
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- 1. Policy for Public Insert (Contact Form)
-- Drop existing policy if it exists to avoid conflicts (optional, or just create if not exists using DO block)
DROP POLICY IF EXISTS "Allow public insert contact_requests" ON contact_requests;
CREATE POLICY "Allow public insert contact_requests"
ON contact_requests FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 2. Policy for Admin Select (CMS)
DROP POLICY IF EXISTS "Allow authenticated select contact_requests" ON contact_requests;
CREATE POLICY "Allow authenticated select contact_requests"
ON contact_requests FOR SELECT
TO authenticated
USING (true);

-- 3. Policy for Admin Update/Delete
DROP POLICY IF EXISTS "Allow authenticated update contact_requests" ON contact_requests;
CREATE POLICY "Allow authenticated update contact_requests"
ON contact_requests FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated delete contact_requests" ON contact_requests;
CREATE POLICY "Allow authenticated delete contact_requests"
ON contact_requests FOR DELETE
TO authenticated
USING (true);
