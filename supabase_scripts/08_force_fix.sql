-- COMPREHENSIVE FIX for Missing Roles

DO $$
DECLARE
    v_admin_role_id UUID;
    v_user_email TEXT := 'dimitris.katopodis@distarter.com';
BEGIN
    -- 1. Ensure 'admin' role exists
    SELECT id INTO v_admin_role_id FROM public.roles WHERE name = 'admin';

    IF v_admin_role_id IS NULL THEN
        INSERT INTO public.roles (name, description, is_system)
        VALUES ('admin', 'System Administrator', true)
        RETURNING id INTO v_admin_role_id;
    END IF;

    -- 2. Force Update the Profile for the known email
    UPDATE public.profiles
    SET role_id = v_admin_role_id
    WHERE email = v_user_email;

    -- 3. Force Update ANY profile that has role='admin' text but no role_id
    UPDATE public.profiles
    SET role_id = v_admin_role_id
    WHERE role = 'admin' AND role_id IS NULL;

    -- 4. Safety Net: Ensure Role Permissions exist for Admin
    -- (Re-run key permission mapping just in case)
    INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT v_admin_role_id, id FROM public.permissions
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Fixed Admin Role ID: %', v_admin_role_id;
END $$;
