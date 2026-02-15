
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
    const tables = ['conveniences', 'attractions', 'faqs'];

    for (const table of tables) {
        console.log(`Checking ${table}...`);
        const { data, error } = await supabase.from(table).select('id').limit(1);
        if (error) {
            console.log(`  ${table}: Error ${error.message} (Table might not exist)`);
        } else if (data && data.length > 0) {
            console.log(`  ${table}: ${typeof data[0].id} (Value: ${data[0].id})`);
        } else {
            console.log(`  ${table}: Empty`);
            // Check column type from empty table if possible? 
            // Hard to do without insert or info schema. 
            // We can assume if it exists we need to check schema.
        }
    }
}

main();
