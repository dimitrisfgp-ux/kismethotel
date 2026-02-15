
-- test_content_rls.sql
BEGIN;

-- 1. Simulate Authenticated User (Admin: dimitris)
-- User ID: 23faa818-de7f-4d6d-b871-1659cbabcb59
SET LOCAL role authenticated;
SET LOCAL "request.jwt.claim.sub" = '23faa818-de7f-4d6d-b871-1659cbabcb59';

RAISE NOTICE '--- Testing Content RLS ---';

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
    INSERT INTO public.location_categories (id, label, icon, color, sort_order)
    VALUES ('test_cat_rls_1', 'Test Category RLS', 'MapPin', '#000000', 99)
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
    VALUES ('test_loc_rls_1', 'Test Loc RLS', 35.0, 25.0, 'Test', 'test_cat_rls_1')
    RETURNING id INTO new_id;
    
    RAISE NOTICE '✅ Convenience Insert Success. ID: %', new_id;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ Convenience Insert Failed: %', SQLERRM;
END $$;

ROLLBACK;
