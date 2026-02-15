
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
    const tables = [
        'hotel_settings', 'rooms', 'room_beds', 'room_media', 'room_layout_sections',
        'room_layout_amenities', 'bookings', 'booking_holds', 'blocked_dates',
        'contact_requests', 'page_content', 'location_categories', 'conveniences',
        'faqs', 'media_assets', 'profiles', 'roles', 'permissions', 'role_permissions'
    ];

    let output = `Table                     | ID Type    | Sample ID\n`;
    output += `------------------------------------------------------------\n`;

    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('id').limit(1);

        let idType = 'UNKNOWN';
        let sampleId = 'N/A';

        if (error) {
            idType = 'ERROR/NONE';
        } else if (data && data.length > 0) {
            const idVal = data[0].id;
            sampleId = String(idVal);
            if (typeof idVal === 'number') {
                idType = 'INTEGER';
            } else if (typeof idVal === 'string') {
                if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idVal)) {
                    idType = 'UUID';
                } else {
                    idType = 'STRING';
                }
            }
        } else {
            // Try to infer from schema error if possible or defaults
            // Just assume based on conventions if empty:
            // most are UUID except settings/content which are Int/String
            const { error: typeCheckError } = await supabase.from(table).select('id').eq('id', 'not-a-uuid').limit(1);
            if (typeCheckError && typeCheckError.message.includes('uuid')) {
                idType = 'UUID (Inferred)';
            } else if (typeCheckError && typeCheckError.message.includes('integer')) {
                idType = 'INTEGER (Inferred)';
            } else {
                idType = 'EMPTY';
            }
        }

        output += `${table.padEnd(25)} | ${idType.padEnd(10)} | ${sampleId}\n`;
    }

    fs.writeFileSync('audit_output.txt', output);
    console.log('Audit complete. output written to audit_output.txt');
}

main();
