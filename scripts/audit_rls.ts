
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkPolicies() {
    console.log('--- RLS POLICIES AUDIT ---');

    // We can't directly query pg_policies via the JS client easily unless we have a stored procedure or direct connection.
    // However, we can try to infer or use a different approach if direct SQL isn't an option.
    // Actually, let's try to use the rpc 'exec_sql' if it exists, or just print a message that we need to check this manually or via a different method if this fails.
    // But wait, the user provided `supabase_scripts` folder suggests they might have a way to run sql. 
    // The previous script `audit_cms_schema.ts` used `rpc`? No, it used `information_schema` which is accessible via standard query if permissions allow.
    // `pg_policies` is a system catalog view. Let's try selecting from it.

    const { data, error } = await supabase
        .from('pg_policies')
        .select('*');

    if (error) {
        console.error('Error querying pg_policies:', error.message);
        console.log('NOTE: Accessing system tables like pg_policies via client requires specific permissions or might be restricted.');
        console.log('Attempting to use information_schema (standard SQL) triggers/routines as proxies? No, that is not standard.');
        return;
    }

    // Filter for our key tables
    const interestingTables = [
        'hotel_settings', 'rooms', 'bookings', 'page_content',
        'contact_requests', 'media_assets', 'profiles',
        'roles', 'permissions', 'role_permissions'
    ];

    const relevantPolicies = data.filter((p: any) => interestingTables.includes(p.tablename));

    // Group by table
    const policiesByTable: Record<string, any[]> = {};
    relevantPolicies.forEach((p: any) => {
        if (!policiesByTable[p.tablename]) {
            policiesByTable[p.tablename] = [];
        }
        policiesByTable[p.tablename].push(p);
    });

    for (const table of interestingTables) {
        console.log(`\nTable: ${table}`);
        const policies = policiesByTable[table] || [];
        if (policies.length === 0) {
            console.log('  WARNING: No policies found! (Data might be public or completely locked if RLS is on)');
        } else {
            policies.forEach((p: any) => {
                console.log(`  - ${p.policyname} (${p.cmd}): Roles=[${p.roles.join(', ')}]`);
                // Note: We can't easily see the 'qual' (using clause) or 'with_check' clause via this view simple select easily in log
                // without likely getting a permission error on the content of the definition if strictly locked, but usually policy name is descriptive.
            });
        }
    }
}

checkPolicies().catch(console.error);
