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
                rooms: rooms.error?.message
            }
        },
        timestamp: new Date().toISOString()
    });
}
