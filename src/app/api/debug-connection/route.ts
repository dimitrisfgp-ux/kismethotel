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

    // Attempt a simple count query
    const { count, error } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });

    return NextResponse.json({
        env: {
            supabaseUrl: url,
            hasServiceKey: !!serviceKey,
            serviceKeyPreview: keyPreview,
        },
        connection: {
            success: !error,
            itemCount: count,
            error: error ? error.message : null
        },
        timestamp: new Date().toISOString()
    });
}
