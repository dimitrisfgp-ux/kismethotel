-- Check profiles and their assigned roles
SELECT 
    p.id, 
    p.email, 
    p.full_name, 
    p.role_id, 
    r.name as role_name 
FROM profiles p
LEFT JOIN roles r ON p.role_id = r.id;

-- Check if the specific admin role exists and what permissions it has
SELECT r.name, count(rp.permission_id) as permission_count
FROM roles r
LEFT JOIN role_permissions rp ON r.id = rp.role_id
GROUP BY r.name;
