-- FIX: Infinite Recursion in RBAC Policies (Error 42P17)
-- The previous policies on 'roles' and 'role_permissions' queried themselves via JOINs, creating a loop.
-- We fix this by using a SECURITY DEFINER function to check permissions "God Mode" style.

-- 1. Create Helper Function (Bypasses RLS)
CREATE OR REPLACE FUNCTION public.has_permission(target_uid UUID, required_slug TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_role_id UUID;
BEGIN
  -- Get the role_id directly from profiles (bypassing profile RLS)
  SELECT role_id INTO v_role_id 
  FROM public.profiles 
  WHERE id = target_uid;

  IF v_role_id IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Check existence of permission (bypassing role_permissions RLS)
  RETURN EXISTS (
    SELECT 1 
    FROM public.role_permissions rp
    JOIN public.permissions p ON rp.permission_id = p.id
    WHERE rp.role_id = v_role_id
    AND p.slug = required_slug
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 2. Drop Bad Policies
DROP POLICY IF EXISTS "Admins can manage roles" ON public.roles;
DROP POLICY IF EXISTS "Admins can manage role_permissions" ON public.role_permissions;

-- 3. Re-create Policies using the Safe Function

-- Roles
CREATE POLICY "Admins can manage roles" ON public.roles 
  FOR ALL 
  USING (public.has_permission(auth.uid(), 'roles.manage'));

-- Role Permissions
CREATE POLICY "Admins can manage role_permissions" ON public.role_permissions 
  FOR ALL 
  USING (public.has_permission(auth.uid(), 'roles.manage'));
  
-- 4. Verify Admin Access (If the function returns false for admin, something is deeper wrong)
-- This is just a test query you can run manually if needed:
-- SELECT public.has_permission('YOUR_ID', 'roles.manage');
