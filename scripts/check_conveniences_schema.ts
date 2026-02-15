
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log('--- Checking Context Tables Schema ---');

    // We can't query information_schema easily with supabase-js unless we have a helper.
    // But we can try to select a row and see the types, or use the 'rpc' if we had one.
    // Actually, the previous script `audit_cms_schema.ts` used `rpc` 'get_columns' which might not exist?
    // Ah, `audit_schema_columns.sql` CREATED the `get_schema_info` function? 
    // Let's check if that function exists.

    // If not, we can try to Insert a dummy record with a text ID and see if it fails with type error.

    try {
        const { data, error } = await supabase.from('conveniences').select('*').limit(1);
        if (error) {
            console.error('Error selecting:', error);
        } else {
            console.log('Sample Data:', data);
            if (data && data.length > 0) {
                const id = data[0].id;
                console.log('ID Value:', id);
                console.log('ID Type:', typeof id);

                const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
                console.log('Is UUID format?', isUuid);
            } else {
                console.log('Table is empty. Cannot infer type from data.');
                // Try to insert a text ID
                const testId = 'test_string_id_' + Date.now();
                const { error: insertError } = await supabase.from('conveniences').insert({
                    id: testId,
                    name: 'Test Schema Check',
                    lat: 0,
                    lng: 0,
                    category_id: 'no_cat', // This might fail FK
                    type: 'test'
                });

                if (insertError) {
                    console.log('Insert Error:', insertError.message);
                    if (insertError.message.includes('uuid')) {
                        console.log('CONCLUSION: ID is likely UUID.');
                    } else if (insertError.message.includes('integer') || insertError.message.includes('bigint')) {
                        console.log('CONCLUSION: ID is likely Integer.');
                    }
                }
            }
        }
    } catch (e) {
        console.error(e);
    }
}

checkSchema();
