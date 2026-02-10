-- 1. Enable pgcrypto (Required for password hashing)
create extension if not exists "pgcrypto";

-- 2. Create User Transaction
DO $$
DECLARE
  new_uid uuid := gen_random_uuid();
  admin_email text := 'admin@kismethotel.com';
  admin_password text := 'admin123';
BEGIN
  -- A. Insert into auth.users
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    role,
    aud,
    raw_app_meta_data,
    raw_user_meta_data
  )
  VALUES (
    new_uid,
    admin_email,
    crypt(admin_password, gen_salt('bf')),
    now(),
    'authenticated',
    'authenticated',
    '{"provider":"email","providers":["email"]}',
    jsonb_build_object('full_name', 'System Admin')
  );

  -- B. Insert into auth.identities (Required for login)
  -- FIXED: Added provider_id
  INSERT INTO auth.identities (
    id,
    user_id,
    provider_id, -- ADDED
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  )
  VALUES (
    gen_random_uuid(),
    new_uid,
    new_uid::text, -- ADDED: Use user_id as provider_id for email auth
    jsonb_build_object('sub', new_uid, 'email', admin_email),
    'email',
    now(),
    now(),
    now()
  );

  -- C. Update the Profile to Admin
  -- Using ON CONFLICT to handle cases where trigger already fired
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new_uid, admin_email, 'System Admin', 'admin')
  ON CONFLICT (id) DO UPDATE SET role = 'admin';

END $$;
