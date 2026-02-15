
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
    process.stdout.write("Querying rooms table columns...\n");
    // We can just select * from rooms limit 1 and print keys
    const { data, error } = await supabase.from('rooms').select('*').limit(1);

    if (error) {
        console.log(`rooms: Error ${error.message}`);
    } else if (data && data.length > 0) {
        const row = data[0];
        console.log('Columns in rooms table:');
        Object.keys(row).forEach(key => {
            console.log(`- ${key}: ${typeof row[key]} (Value: ${JSON.stringify(row[key])})`);
        });
    } else {
        console.log(`rooms: Empty`);
    }
}

main();
