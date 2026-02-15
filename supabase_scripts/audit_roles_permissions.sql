-- 1. List all Defined Roles
SELECT id, name, description FROM roles;

-- 2. List all Defined Permissions
SELECT id, slug, module, description FROM permissions ORDER BY module, slug;

-- 3. Show Role -> Permission Mapping
SELECT 
    r.name as role_name,
    p.slug as permission_slug,
    p.module,
    p.description
FROM role_permissions rp
JOIN roles r ON rp.role_id = r.id
JOIN permissions p ON rp.permission_id = p.id
ORDER BY r.name, p.module, p.slug;

-- 4. Check User Assignments (from profiles)
-- Note: This assumes a 'profiles' table exists and links to 'roles'
SELECT 
    p.id as user_id,
    p.email, 
    r.name as assigned_role
FROM profiles p
LEFT JOIN roles r ON p.role_id = r.id;
