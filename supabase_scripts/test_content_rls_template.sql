
-- test_content_policies.sql
-- Run this in Supabase SQL Editor or via CLI
-- Replace 'USER_ID_HERE' with a valid Admin User ID

BEGIN;

-- 1. Simulate Authenticated User
SET LOCAL role authenticated;
SET LOCAL "request.jwt.claim.sub" = 'USER_ID_HERE'; -- We will replace this in the execution step

-- 2. Test FAQ Insert
DO $$
DECLARE
    new_id bigint;
BEGIN
    INSERT INTO public.faqs (question, answer, category, sort_order)
    VALUES ('Test Question', 'Test Answer', 'General', 99)
    RETURNING id INTO new_id;
    
    RAISE NOTICE '✅ FAQ Insert Success. ID: %', new_id;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ FAQ Insert Failed: %', SQLERRM;
END $$;

-- 3. Test Location Category Insert
DO $$
DECLARE
    new_id text;
BEGIN
    INSERT INTO public.location_categories (id, label, icon, color)
    VALUES ('test_cat_1', 'Test Category', 'MapPin', '#000000')
    RETURNING id INTO new_id;
    
    RAISE NOTICE '✅ Category Insert Success. ID: %', new_id;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ Category Insert Failed: %', SQLERRM;
END $$;

-- 4. Test Convenience Insert
DO $$
DECLARE
    new_id text;
BEGIN
    INSERT INTO public.conveniences (id, name, lat, lng, type, category_id)
    VALUES ('test_loc_1', 'Test Loc', 35.0, 25.0, 'Test', 'test_cat_1')
    RETURNING id INTO new_id;
    
    RAISE NOTICE '✅ Convenience Insert Success. ID: %', new_id;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ Convenience Insert Failed: %', SQLERRM;
END $$;

ROLLBACK; -- Always rollback changes
