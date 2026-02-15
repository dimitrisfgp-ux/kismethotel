
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
    const tables = ['location_categories', 'conveniences', 'faqs', 'amenities'];
    for (const t of tables) {
        const { data, error } = await supabase.from(t).select('id').limit(1);
        if (error) console.log(`${t}: Error ${error.message}`);
        else if (!data?.length) console.log(`${t}: Empty (Cannot determine)`);
        else console.log(`${t}: ${typeof data[0].id} (Value: ${data[0].id})`);
    }
}

main();
