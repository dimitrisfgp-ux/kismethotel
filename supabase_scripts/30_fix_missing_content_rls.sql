-- 30_fix_missing_content_rls.sql
-- Goal: Apply standardized RLS policies to FAQs, Conveniences, and Location Categories.
-- These tables were missed in the initial standardization and may have broken or missing policies.

-- 1. FAQs
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Drop old policies (if any) to ensure clean slate
DROP POLICY IF EXISTS "Public Read Access" ON public.faqs;
DROP POLICY IF EXISTS "Staff Manage Access" ON public.faqs;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.faqs;
DROP POLICY IF EXISTS "Enable insert for admins only" ON public.faqs;
DROP POLICY IF EXISTS "Enable update for admins only" ON public.faqs;
DROP POLICY IF EXISTS "Enable delete for admins only" ON public.faqs;

-- Create new policies
CREATE POLICY "Public Read Access" ON public.faqs FOR SELECT TO public USING (true);
-- Using 'content.faqs' permission (as seen in actions/content.ts)
CREATE POLICY "Staff Manage Access" ON public.faqs FOR ALL TO authenticated 
USING ( check_permission('content.faqs') ) 
WITH CHECK ( check_permission('content.faqs') );


-- 2. Location Categories
ALTER TABLE public.location_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Access" ON public.location_categories;
DROP POLICY IF EXISTS "Staff Manage Access" ON public.location_categories;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.location_categories;
DROP POLICY IF EXISTS "Enable insert for admins only" ON public.location_categories;
DROP POLICY IF EXISTS "Enable update for admins only" ON public.location_categories;
DROP POLICY IF EXISTS "Enable delete for admins only" ON public.location_categories;

CREATE POLICY "Public Read Access" ON public.location_categories FOR SELECT TO public USING (true);
-- Using 'content.locations' permission (as seen in actions/content.ts)
CREATE POLICY "Staff Manage Access" ON public.location_categories FOR ALL TO authenticated 
USING ( check_permission('content.locations') ) 
WITH CHECK ( check_permission('content.locations') );


-- 3. Conveniences (Locations)
ALTER TABLE public.conveniences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Access" ON public.conveniences;
DROP POLICY IF EXISTS "Staff Manage Access" ON public.conveniences;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.conveniences;
DROP POLICY IF EXISTS "Enable insert for admins only" ON public.conveniences;
DROP POLICY IF EXISTS "Enable update for admins only" ON public.conveniences;
DROP POLICY IF EXISTS "Enable delete for admins only" ON public.conveniences;

CREATE POLICY "Public Read Access" ON public.conveniences FOR SELECT TO public USING (true);
-- Using 'content.locations' permission (as seen in actions/content.ts)
CREATE POLICY "Staff Manage Access" ON public.conveniences FOR ALL TO authenticated 
USING ( check_permission('content.locations') ) 
WITH CHECK ( check_permission('content.locations') );


-- 4. Attractions (Just in case)
ALTER TABLE public.attractions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Access" ON public.attractions;
DROP POLICY IF EXISTS "Staff Manage Access" ON public.attractions;

CREATE POLICY "Public Read Access" ON public.attractions FOR SELECT TO public USING (true);
CREATE POLICY "Staff Manage Access" ON public.attractions FOR ALL TO authenticated 
USING ( check_permission('content.locations') ) 
WITH CHECK ( check_permission('content.locations') );

