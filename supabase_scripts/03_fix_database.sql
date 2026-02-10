-- 1. Ensure Profiles Table Exists
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL, -- Removed UNIQUE for safety, though usually good
  full_name TEXT,
  role TEXT CHECK (role IN ('admin', 'manager', 'receptionist', 'viewer')) DEFAULT 'viewer',
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Verify RLS (Disable temporarily to unblock, or ensure policy exists)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Ensure "Service Role" has full access (Bypass RLS for the trigger/admin API)
DROP POLICY IF EXISTS "Service Role Full Access" ON public.profiles;
CREATE POLICY "Service Role Full Access"
  ON public.profiles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 3. Robust Trigger Function with Exception Handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'viewer')
  )
  ON CONFLICT (id) DO NOTHING; -- Idempotency
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but DO NOT Fail the transaction
  RAISE WARNING 'Error in handle_new_user trigger: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Re-bind Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
