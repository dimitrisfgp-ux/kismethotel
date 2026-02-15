-- Dump all Auth & RBAC tables to JSON format for easy sharing
-- Run this in Supabase SQL Editor and share the output.

SELECT json_build_object(
    'roles', (SELECT json_agg(r) FROM roles r),
    'permissions', (SELECT json_agg(p) FROM permissions p),
    'role_permissions', (
        SELECT COALESCE(json_agg(rp), '[]'::json)
        FROM (
            SELECT 
                r.name as role_name, 
                p.slug as permission_slug 
            FROM role_permissions rp_join
            LEFT JOIN roles r ON rp_join.role_id = r.id 
            LEFT JOIN permissions p ON rp_join.permission_id = p.id
        ) rp
    ),
    'profiles_roles', (
        SELECT json_agg(pr) 
        FROM (
            SELECT 
                p.email, 
                r.name as role 
            FROM profiles p 
            LEFT JOIN roles r ON p.role_id = r.id
        ) pr
    )
);
