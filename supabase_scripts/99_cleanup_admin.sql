-- Force delete the user to clean up any corrupted state
delete from auth.users where email = 'admin@kismethotel.com';
delete from public.profiles where email = 'admin@kismethotel.com';

-- Verify it's gone
select * from auth.users where email = 'admin@kismethotel.com';
