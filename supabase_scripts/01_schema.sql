-- 1. Create Profiles Table (Extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  role text check (role in ('admin', 'manager', 'receptionist', 'viewer')) default 'viewer',
  avatar_url text,
  phone text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. Enable RLS on Profiles
alter table public.profiles enable row level security;

-- 3. Profiles Policies
-- Users see themselves
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

-- Admins see everyone
create policy "Admins can view all profiles" on profiles
  for select using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Admins can update everyone
create policy "Admins can update all profiles" on profiles
  for update using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- 4. Update Bookings Table (For Manual Booking Feature)
-- Add created_by column to track if a booking was made by a specific staff member
alter table public.bookings 
add column if not exists created_by uuid references profiles(id);

-- 5. Helper Function: Auto-create Profile on Signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    coalesce(new.raw_user_meta_data->>'role', 'viewer') -- Allow passing role in metadata during invite
  );
  return new;
end;
$$ language plpgsql security definer;

-- 6. Trigger for Auto-Profile
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
