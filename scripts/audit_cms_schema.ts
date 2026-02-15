
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load .env.local
try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
} catch (e) {
    console.warn('Could not load .env.local, relying on process.env');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use Service Role to bypass RLS

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase URL or Service Role Key in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function auditTable(tableName: string) {
    console.log(`\n--- Auditing Table: ${tableName} ---`);
    const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

    if (error) {
        console.error(`Error querying ${tableName}:`, error.message);
        return;
    }

    if (!data || data.length === 0) {
        console.log(`Table ${tableName} is empty. Cannot infer columns from data.`);
        // Try inserting a dummy verify wrapper if possible? No, too risky.
        // We'll rely on the fact that the SELECT * worked, meaning the table exists.
        console.log(`(Confirmed table exists)`);
        return;
    }

    const columns = Object.keys(data[0]);
    console.log(`Columns found (${columns.length}):`);
    columns.sort().forEach(col => console.log(` - ${col}`));
}

async function main() {
    const tables = [
        'hotel_settings',
        'rooms',
        'room_beds',
        'room_media',
        'room_layout_sections',
        'room_layout_amenities',
        'bookings',
        'booking_holds',
        'blocked_dates',
        'contact_requests',
        'page_content',
        'location_categories',
        'conveniences',
        'faqs',
        'media_assets',
        'profiles'
    ];

    for (const table of tables) {
        await auditTable(table);
    }
}

main().catch(console.error);
