
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
    const tables = ['room_amenities', 'room_features'];
    for (const t of tables) {
        console.log(`Checking ${t}...`);
        // We can't describe table easily via JS client without admin rights to pg_tables or similar using RPC.
        // But we can select * limit 1 and see the value types.
        const { data, error } = await supabase.from(t).select('*').limit(1);

        if (error) {
            console.log(`${t}: Error ${error.message}`);
        } else if (data && data.length > 0) {
            const row = data[0];
            for (const key in row) {
                console.log(`  ${key}: ${typeof row[key]} (Value: ${row[key]})`);
            }
        } else {
            console.log(`${t}: Empty`);
        }
    }
}

main();
