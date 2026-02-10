-- COMPREHENSIVE RLS FIX
-- Fixes Infinite Recursion (Error 42P17) by using SECURITY DEFINER functions.

-- Step 1: Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
DROP POLICY IF EXISTS "Service Role Full Access" ON public.profiles;

-- Bookings cleanup
DROP POLICY IF EXISTS "Staff can view bookings" ON public.bookings;
DROP POLICY IF EXISTS "Staff can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Managers can update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can delete bookings" ON public.bookings;


-- Step 2: Create helper functions (with SECURITY DEFINER)
-- These run with "God Mode" (the permissions of the creator) to bypass RLS loops.

CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role 
    FROM public.profiles 
    WHERE id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.get_user_role(user_id) = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.has_role(user_id UUID, required_roles TEXT[])
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.get_user_role(user_id) = ANY(required_roles);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_user_role(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, TEXT[]) TO authenticated;


-- Step 3: Create NEW policies using the helper functions

-- -- PROFILES -- --

-- Policy: Users can always view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy: Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Policy: Admins can update any profile
CREATE POLICY "Admins can update profiles"
  ON public.profiles FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- Policy: Users can update their own profile (except role - handled by trigger/admin)
-- Note: We generally don't want users changing their own role via API, so we keep this simple.
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    -- Prevent role hacking: ensure the new row's role matches the old row's role
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  );

-- Policy: Admins can delete profiles
CREATE POLICY "Admins can delete profiles"
  ON public.profiles FOR DELETE
  USING (public.is_admin(auth.uid()));

-- Policy: Service Role (for Seed/Admin API)
CREATE POLICY "Service role can insert profiles"
  ON public.profiles FOR INSERT
  TO service_role
  WITH CHECK (true);


-- -- BOOKINGS -- --

CREATE POLICY "Staff can view bookings"
  ON public.bookings FOR SELECT
  USING (
    public.has_role(auth.uid(), ARRAY['admin', 'manager', 'receptionist', 'viewer'])
  );

CREATE POLICY "Staff can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), ARRAY['admin', 'manager', 'receptionist'])
  );

CREATE POLICY "Managers can update bookings"
  ON public.bookings FOR UPDATE
  USING (
    public.has_role(auth.uid(), ARRAY['admin', 'manager', 'receptionist'])
  );

CREATE POLICY "Admins can delete bookings"
  ON public.bookings FOR DELETE
  USING (public.is_admin(auth.uid()));
