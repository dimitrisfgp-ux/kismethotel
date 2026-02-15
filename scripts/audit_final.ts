
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
} catch (e) {
    console.warn('Could not load .env.local');
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function main() {
    // Check room_layout_amenities columns (by selecting and printing keys)
    console.log("Checking room_layout_amenities...");
    const { data: rla, error: rlaError } = await supabase.from('room_layout_amenities').select('*').limit(1);
    if (rlaError) console.log(`room_layout_amenities: Error ${rlaError.message}`);
    else if (rla && rla.length > 0) {
        Object.keys(rla[0]).forEach(key => console.log(`  ${key}: ${typeof rla[0][key]}`));
    } else console.log("room_layout_amenities: Empty");

    // Check features table existence
    console.log("Checking features...");
    const { data: fe, error: feError } = await supabase.from('features').select('id').limit(1);
    if (feError) console.log(`features: Error ${feError.message}`);
    else if (fe && fe.length > 0) console.log(`features: ${typeof fe[0].id} (Value: ${fe[0].id})`);
    else console.log("features: Empty");
}

main();
