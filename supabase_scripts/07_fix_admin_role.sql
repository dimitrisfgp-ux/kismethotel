-- FIX: Ensure Admin User has the correct role_id

-- 1. Force update for any profile with 'admin' text role
UPDATE public.profiles p
SET role_id = (SELECT id FROM public.roles WHERE name = 'admin')
WHERE role = 'admin' AND role_id IS NULL;

-- 2. Fallback: If the user was 'dimitris.katopodis@distarter.com', force them to be admin
UPDATE public.profiles
SET role_id = (SELECT id FROM public.roles WHERE name = 'admin')
WHERE email = 'dimitris.katopodis@distarter.com';

-- 3. Verify the result
SELECT email, role, role_id FROM public.profiles;
