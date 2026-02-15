
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
    console.log("Checking media_assets...");
    const { data: ma, error: maError } = await supabase.from('media_assets').select('id').limit(1);
    if (maError) console.log(`media_assets: Error ${maError.message}`);
    else if (ma && ma.length > 0) console.log(`media_assets: ${typeof ma[0].id} (Value: ${ma[0].id})`);
    else console.log("media_assets: Empty");
}

main();
