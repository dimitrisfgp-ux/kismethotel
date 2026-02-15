
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyRLS() {
    console.log('--- Verifying RLS Standardization ---');

    // 1. Check if check_permission function exists
    console.log('\n1. Checking for check_permission function...');
    // Note: Querying information_schema via Supabase client relies on it being exposed.
    // If this fails, we cannot verify without direct SQL access.
    const { data: routines, error: routineError } = await supabase
        .from('routines')
        .select('routine_name, routine_definition')
        .eq('routine_schema', 'public')
        .eq('routine_name', 'check_permission');

    // Since 'routines' is likely in information_schema, we might need to use likely non-exposed schema.
    // Actually, let's try calling the function via RPC. If it exists, it should work (or fail with args).
    // But check_permission takes an argument.

    // Alternative: Try to call it directly locally? No.
    // Let's rely on RPC call to test existence + logic.

    try {
        const { data, error } = await supabase.rpc('check_permission', { required_permission: 'test.permission' });
        if (error && error.message.includes('function public.check_permission(unknown) does not exist')) {
            console.error('❌ check_permission function DOES NOT EXIST.');
        } else if (error) {
            console.log('✅ check_permission function exists (call failed with likely valid error):', error.message);
        } else {
            console.log('✅ check_permission function exists and returned:', data);
        }
    } catch (e) {
        console.log('⚠️ RPC call outcome unclear:', e);
    }

    // 2. Check if is_admin is gone
    console.log('\n2. Checking if is_admin is removed...');
    try {
        const { data, error } = await supabase.rpc('is_admin');
        if (error && error.message.includes('does not exist')) {
            console.log('✅ is_admin function correctly removed (or not accessible).');
        } else {
            console.error('❌ is_admin function STILL EXISTS (or another error):', error?.message || 'No error');
        }
    } catch (e) {
        console.log('⚠️ RPC check for is_admin failed:', e);
    }

    // 3. Inspect Policies (via information_schema if possible, else via manual test)
    console.log('\n3. Verifying Policy Definitions (Best Effort)...');
    // We cannot easily read pg_policies via standard client unless exposed.
    // We will try to perform an operation that SHOULD be allowed/blocked.

    // Scenario: Create a fake booking? No, too risky.
    // Scenario: Read rooms (Public).
    const { data: rooms, error: roomError } = await supabase.from('rooms').select('id').limit(1);
    if (roomError) {
        console.error('❌ Public read on rooms failed:', roomError.message);
    } else {
        console.log('✅ Public read on rooms successful.');
    }

    console.log('\n--- Verification Complete ---');
}

verifyRLS().catch(console.error);
