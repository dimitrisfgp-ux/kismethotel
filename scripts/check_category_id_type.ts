
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function check() {
    console.log('--- Checking location_categories ID type ---');
    // Insert a dummy to see if it accepts UUID or Int or String
    // Actually, I can just select one and see the type or use the error message trick again if I want speed.
    // But better, let's just select one.

    const { data, error } = await supabase.from('location_categories').select('id').limit(1);

    if (data && data.length > 0) {
        console.log('Sample ID:', data[0].id, 'Type:', typeof data[0].id);
    } else {
        console.log('No categories found. Trying to insert a test one to probe.');
        // Try inserting a string ID
        const { error: errString } = await supabase.from('location_categories').insert({ name: 'Test', id: 'test_string' });
        if (errString) console.log('String insert error:', errString.message);

        // Try inserting a UUID
        const { error: errUUID } = await supabase.from('location_categories').insert({ name: 'Test', id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' });
        if (errUUID) console.log('UUID insert error:', errUUID.message);
    }
}
check();
