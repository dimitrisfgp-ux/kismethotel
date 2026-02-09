import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

    // Sanitize key for display
    const keyPreview = serviceKey
        ? `${serviceKey.substring(0, 5)}...${serviceKey.substring(serviceKey.length - 5)}`
        : 'MISSING';

    const supabase = createServerClient();

    // Check counts for multiple tables
    const [bookings, rooms, requests] = await Promise.all([
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('rooms').select('*', { count: 'exact', head: true }),
        supabase.from('contact_requests').select('*', { count: 'exact', head: true })
    ]);

    // Probe: Try a dummy insert with a String ID to see if it fails (Supabase usually expects UUID)
    // We expect this to fail if the ID column is UUID type
    let insertErrorMsg: string | null = null;

    try {
        const { error: insertError } = await supabase
            .from('bookings')
            .insert({
                id: 'test-string-id',
                room_id: '00000000-0000-0000-0000-000000000000',
                check_in: new Date().toISOString(),
                check_out: new Date().toISOString(),
                guest_name: 'Debug Probe',
                guest_email: 'debug@test.com',
                guests_count: 1,
                total_price: 100,
                status: 'held'
            })
            .select() // This forces the insert to execute and return data
            .single();

        if (insertError) {
            insertErrorMsg = insertError.message;
        }
    } catch (e: any) {
        insertErrorMsg = e.message || String(e);
    }

    return NextResponse.json({
        env: {
            supabaseUrl: url,
            hasServiceKey: !!serviceKey,
            serviceKeyPreview: keyPreview,
        },
        counts: {
            bookings: bookings.count,
            rooms: rooms.count,
            requests: requests.count
        },
        connection: {
            success: !bookings.error && !rooms.error,
            errors: {
                bookings: bookings.error?.message,
                rooms: rooms.error?.message,
                insertProbe: insertErrorMsg
            }
        },
        timestamp: new Date().toISOString()
    });
}
