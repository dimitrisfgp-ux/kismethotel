-- Full System Audit Script
-- Returns JSON of Policies and Table Info

SELECT json_build_object(
    'tables', (
        SELECT json_agg(t) FROM (
            SELECT 
                n.nspname AS schemaname,
                c.relname AS tablename,
                c.relrowsecurity AS rls_enabled
            FROM pg_class c
            JOIN pg_namespace n ON n.oid = c.relnamespace
            WHERE n.nspname = 'public'
            AND c.relkind = 'r' -- 'r' means ordinary table
            ORDER BY c.relname
        ) t
    ),
    'policies', (
        SELECT json_agg(p) FROM (
            SELECT 
                schemaname,
                tablename,
                policyname,
                roles,
                cmd,
                qual,
                with_check
            FROM pg_policies
            WHERE schemaname IN ('public', 'storage')
        ) p
    )
);
