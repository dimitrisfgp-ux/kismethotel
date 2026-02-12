import { NextRequest, NextResponse } from 'next/server';
import { holdService } from '@/services/holdService';

/**
 * POST /api/holds/release
 * Used by cleanup effects and sendBeacon to release holds.
 * Handles both application/json and text/plain (sendBeacon sends text/plain).
 */
export async function POST(request: NextRequest) {
    try {
        let holdId: string | undefined;

        const contentType = request.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
            const body = await request.json();
            holdId = body.holdId;
        } else {
            // sendBeacon with string body sends text/plain
            const text = await request.text();
            try {
                const parsed = JSON.parse(text);
                holdId = parsed.holdId;
            } catch {
                holdId = undefined;
            }
        }

        if (!holdId || typeof holdId !== 'string') {
            return NextResponse.json({ error: 'Missing holdId' }, { status: 400 });
        }

        await holdService.releaseHold(holdId);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed to release hold' }, { status: 500 });
    }
}

