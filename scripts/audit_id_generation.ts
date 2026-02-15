
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load .env.local
try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
} catch (e) {
    console.warn('Could not load .env.local', e);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
    console.log('--- Auditing ID Generation Strategies ---');

    // Try detecting if we can access information_schema directly
    // This is often not allowed even for service role in Supabase REST API, but let's try.
    // The workaround is usually a custom RPC or using the Postgres connection string.

    // Attempt 1: REST API query on information_schema (Unlikely to work but cheapest to try)
    // Supabase usually exposes logic via 'rpc' for execution if needed.

    // Better Approach: 
    // Since I can't easily query schema, I will check the `id` type by inspecting the data of *every* table.
    // IF the ID is a string looking like a UUID, we assume UUID.
    // IF the ID is an integer, we assume Integer.
    // For "Generation", we can check if we can insert without an ID.

    const tables = [
        'hotel_settings', 'rooms', 'room_beds', 'room_media', 'room_layout_sections',
        'room_layout_amenities', 'bookings', 'booking_holds', 'blocked_dates',
        'contact_requests', 'page_content', 'location_categories', 'conveniences',
        'faqs', 'media_assets', 'profiles', 'roles', 'permissions', 'role_permissions'
    ];

    console.log(`\n${"Table".padEnd(25)} | ${"ID Type".padEnd(10)} | ${"Sample ID"}`);
    console.log('-'.repeat(60));

    for (const table of tables) {
        // Query one row to check ID type
        const { data, error } = await supabase.from(table).select('id').limit(1);

        let idType = 'UNKNOWN';
        let sampleId = 'N/A';

        if (error) {
            // Some tables might not have 'id' (e.g. join tables)
            idType = 'ERROR/NONE';
        } else if (data && data.length > 0) {
            const idVal = data[0].id;
            sampleId = String(idVal);
            if (typeof idVal === 'number') {
                idType = 'INTEGER';
            } else if (typeof idVal === 'string') {
                // Check if UUID format
                if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idVal)) {
                    idType = 'UUID';
                } else {
                    idType = 'STRING';
                }
            }
        } else {
            idType = 'EMPTY (Assuming UUID if standard, or need to check schema)';
            // Fallback: Try to retrieve column definition via a different method if possible?
            // Actually, we can check the error when filtering by a wrong type!
            // E.g. .eq('id', 'not-a-uuid') -> if it returns "invalid input syntax for type uuid" then it is UUID.
            const { error: typeCheckError } = await supabase.from(table).select('id').eq('id', 'not-a-uuid').limit(1);
            if (typeCheckError && typeCheckError.message.includes('uuid')) {
                idType = 'UUID (Inferred)';
            } else if (typeCheckError && typeCheckError.message.includes('integer')) {
                idType = 'INTEGER (Inferred)';
            }
        }

        console.log(`${table.padEnd(25)} | ${idType.padEnd(10)} | ${sampleId}`);
    }
}

main();
