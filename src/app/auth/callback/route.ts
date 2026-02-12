import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Auth callback route — verifies a recovery token and establishes a session,
 * then redirects to the reset-password page.
 *
 * Uses verifyOtp with token_hash (instead of exchangeCodeForSession) to avoid
 * PKCE/hash-fragment issues with Supabase's default redirect behavior.
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const tokenHash = searchParams.get('token_hash');
    const type = searchParams.get('type');

    if (!tokenHash || !type) {
        return NextResponse.redirect(new URL('/login?error=Invalid recovery link', request.url));
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: type as 'recovery',
    });

    if (error) {
        console.error('Token verification failed:', error.message);
        return NextResponse.redirect(new URL('/login?error=Invalid or expired recovery link', request.url));
    }

    // Session established — redirect to the password reset form
    return NextResponse.redirect(new URL('/reset-password', request.url));
}
