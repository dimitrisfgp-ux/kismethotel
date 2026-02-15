
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function check() {
    console.log('--- Checking conveniences table config ---');
    // 1. Get current count
    const { count: initialCount } = await supabase.from('conveniences').select('*', { count: 'exact', head: true });
    console.log('Initial count:', initialCount);

    // 2. Try simple insert without ID (should work if SERIAL)
    console.log('\n--- 1. Simple Insert (No ID) ---');
    // Need a valid category ID first. Let's find one or verify my test cat exists.
    // I'll create a temp category just in case.
    const { data: cat } = await supabase.from('location_categories').insert({
        id: 'cat_debug_upsert',
        label: 'Debug Cat',
        icon: 'MapPin',
        color: '#000'
    }).select().single();

    if (!cat) {
        console.error('Failed to create temp category');
        return;
    }

    try {
        const { data: insertData, error: insertError } = await supabase.from('conveniences').insert({
            name: 'Debug Loc 1',
            category_id: 'cat_debug_upsert',
            lat: 0,
            lng: 0,
            type: 'Attraction'
        }).select();

        if (insertError) {
            console.error('Insert Error:', insertError);
        } else {
            console.log('Insert Success. New ID:', insertData?.[0]?.id);
            const newId = insertData?.[0]?.id;

            // 3. Try mixed UPSERT: modify existing + add new
            console.log('\n--- 2. Mixed Upsert (1 Update, 1 New) ---');
            const payload = [
                {
                    id: newId, // Update existing
                    name: 'Debug Loc 1 - Updated',
                    category_id: 'cat_debug_upsert',
                    lat: 1,
                    lng: 1,
                    type: 'Attraction'
                },
                {
                    // No ID -> New
                    name: 'Debug Loc 2 - New',
                    category_id: 'cat_debug_upsert',
                    lat: 2,
                    lng: 2,
                    type: 'Attraction'
                }
            ];

            const { data: upsertData, error: upsertError } = await supabase.from('conveniences').upsert(payload, { onConflict: 'id' }).select();

            if (upsertError) {
                console.error('Mixed Upsert Error:', upsertError);
            } else {
                console.log('Mixed Upsert Success:', upsertData);
            }
        }

    } finally {
        // Cleanup
        console.log('\n--- Cleanup ---');
        await supabase.from('location_categories').delete().eq('id', 'cat_debug_upsert'); // cascade should handle conveniences
    }
}

check();
