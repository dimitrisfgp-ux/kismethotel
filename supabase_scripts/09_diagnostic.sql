-- DIAGNOSTIC SCRIPT
-- Run this to see what is actually in the DB

-- 1. Show all roles
SELECT * FROM public.roles;

-- 2. Show all profiles (limit 10)
SELECT id, email, full_name, role, role_id 
FROM public.profiles;

-- 3. Check for the specific user
SELECT * FROM public.profiles 
WHERE email ILIKE '%dimitris%';
