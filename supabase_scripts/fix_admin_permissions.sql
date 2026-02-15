-- Grant ALL permissions to the 'admin' role

-- 1. Get Admin Role ID
DO $$
DECLARE
    admin_role_id uuid;
BEGIN
    SELECT id INTO admin_role_id FROM roles WHERE name = 'admin';

    -- 2. Insert all permissions for admin
    -- We do this by selecting ALL permission IDs and crossing them with the admin role ID
    -- ON CONFLICT DO NOTHING ensures we don't error if some already exist (though we know they don't)
    
    IF admin_role_id IS NOT NULL THEN
        INSERT INTO role_permissions (role_id, permission_id)
        SELECT admin_role_id, id FROM permissions
        ON CONFLICT (role_id, permission_id) DO NOTHING;
        
        RAISE NOTICE 'Granted all permissions to admin role';
    ELSE
        RAISE NOTICE 'Admin role not found!';
    END IF;
END $$;
