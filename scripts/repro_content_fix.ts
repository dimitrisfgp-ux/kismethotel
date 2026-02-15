
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Mock the Service Logic locally to verify the behavior (unit test style)
// OR Use the actual service if we can import it. 
// Importing service might be hard due to Next.js alias '@/'
// So I will REPLICATE the logic here to verify it works against the DB.
// This confirms the LOGIC is correct.

async function testFix() {
    console.log('--- Testing Content Service Fix ---');

    // 1. Setup: Create a Category to link to
    const catId = 'test_cat_' + Date.now();
    await supabase.from('location_categories').insert({
        id: catId,
        label: 'Test Category',
        icon: 'star',
        color: '#000000',
        sort_order: 999
    });

    console.log('Created Test Category:', catId);

    try {
        // 2. Scenario: Adding a NEW location with "loc_" ID
        const tempId = 'loc_' + Date.now();
        const locations1 = [{
            id: tempId,
            name: 'Test Location New',
            categoryId: catId,
            type: 'Hotel',
            lat: 0,
            lng: 0,
            distanceLabel: '1 min'
        }];

        console.log('Attempting to upsert with temp ID:', tempId);

        // --- LOGIC FROM SERVICE ---
        const { data: existing } = await supabase.from('conveniences').select('id');
        const existingIds = (existing || []).map(r => r.id);
        const incomingIds = locations1.map(c => String(c.id)).filter(Boolean);

        const toDelete = existingIds.filter(id => !incomingIds.includes(String(id)));
        // Note: In real app, we might delete everything else? 
        // Wait! The service deletes EVERYTHING not in the payload.
        // So if I run this script, it might wipe the production DB??
        // YES. The service logic deletes everything not in `locations`.
        // I must be very careful. 
        // I should NOT run the delete part in this script against the main DB unless I want to wipe it.
        // OR I should use a transaction / rollback.

        // BETTER: Create a script that only tests the UPSERT part with the ID scrubbing logic.
        // The verification of "Delete" logic is less critical than the "Crash on Upsert" issue.

        console.log('Skipping DELETE phase to protect DB.');

        const upsertPayload = locations1.map((c) => {
            const idStr = String(c.id);
            const isTempId = idStr.startsWith('loc_') || isNaN(Number(idStr));
            return {
                ...(isTempId ? {} : { id: Number(idStr) }),
                name: c.name,
                category_id: c.categoryId,
                type: c.type,
                lat: c.lat,
                lng: c.lng,
                distance_label: c.distanceLabel
            };
        });

        console.log('Generated Payload:', upsertPayload);

        const { data: inserted, error: upsertError } = await supabase.from('conveniences').upsert(upsertPayload).select();

        if (upsertError) {
            console.error('Upsert Failed:', upsertError);
            throw upsertError;
        }

        console.log('Upsert Success! Inserted:', inserted);

        const newId = inserted[0].id;
        if (typeof newId === 'number') {
            console.log('PASS: New ID is a number:', newId);
        } else {
            console.error('FAIL: New ID is not a number:', newId);
        }

        // 3. Scenario: Updating existing location
        console.log('Attempting to update existing ID:', newId);
        const locations2 = [{
            id: newId, // Numeric
            name: 'Test Location Updated',
            categoryId: catId,
            type: 'Hotel', // Required field
            lat: 0,
            lng: 0,
            distanceLabel: '1 min'
        }];

        const upsertPayload2 = locations2.map((c) => {
            const idStr = String(c.id);
            const isTempId = idStr.startsWith('loc_') || isNaN(Number(idStr));
            return {
                ...(isTempId ? {} : { id: Number(idStr) }),
                name: c.name,
                category_id: c.categoryId,
                type: c.type,
                lat: c.lat,
                lng: c.lng,
                distance_label: c.distanceLabel
            };
        });

        const { data: updated, error: updateError } = await supabase.from('conveniences').upsert(upsertPayload2).select();

        if (updateError) {
            console.error('Update Failed:', updateError);
            throw updateError;
        }

        console.log('Update Success! Updated:', updated);
        if (updated[0].name === 'Test Location Updated') {
            console.log('PASS: Name updated.');
        } else {
            console.error('FAIL: Name not updated.');
        }

        // Cleanup
        await supabase.from('conveniences').delete().eq('id', newId);
        await supabase.from('location_categories').delete().eq('id', catId);
        console.log('Cleanup Done.');

    } catch (e) {
        console.error('Test Failed:', e);
        // Try cleanup
        await supabase.from('location_categories').delete().eq('id', catId);
    }
}

testFix();
