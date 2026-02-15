
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
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase URL or Service Role Key in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkIdType(tableName: string) {
    console.log(`Checking ${tableName}...`);
    const { data, error } = await supabase
        .from(tableName)
        .select('id')
        .limit(1);

    if (error) {
        console.error(`Error querying ${tableName}:`, error.message);
        return;
    }

    if (!data || data.length === 0) {
        console.log(`  -> ${tableName} is EMPTY. Cannot determine ID type from data.`);
        return;
    }

    const idValue = data[0].id;
    const type = typeof idValue;
    console.log(`  -> ${tableName} ID type: ${type} (Value: ${idValue})`);
}

async function main() {
    const tables = [
        'rooms',
        'bookings',
        'contact_requests',
        'media_assets',
        'location_categories', // Likely Int
        'conveniences', // Likely Int
        'faqs', // Likely Int
        'hotel_settings', // Likely distinct logic
        'profiles', // Likely UUID (user_id)
        'room_features',
        'room_amenities',
        'features',
        'amenities'
    ];

    for (const table of tables) {
        await checkIdType(table);
    }
}

main().catch(console.error);
