'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/**
 * Nudges newly-invited users (user_metadata.must_change_password) to set their own
 * password on first login by redirecting them to /admin/profile until they do.
 * Enforced here (rendered by the admin layout — the real auth gate) rather than in
 * middleware, which this project doesn't run.
 */
export function FirstLoginGuard({ mustChange }: { mustChange: boolean }) {
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (mustChange && pathname !== '/admin/profile') {
            router.replace('/admin/profile');
        }
    }, [mustChange, pathname, router]);

    return null;
}
