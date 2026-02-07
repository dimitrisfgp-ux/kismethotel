import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // 1. Check if the path is an admin route
    if (request.nextUrl.pathname.startsWith('/admin')) {

        // 2. Allow access to the login page itself
        if (request.nextUrl.pathname === '/admin/login') {
            return NextResponse.next();
        }

        // 3. Check for the session cookie
        const session = request.cookies.get('admin_session');

        // 4. Redirect to login if no session
        if (!session) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
