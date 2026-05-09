import { cache } from 'react';
import { get } from '@vercel/edge-config';

export type SiteMode = 'guesty' | 'self_contained';

// Safe default: 'guesty' does not require Supabase, so falling back here
// keeps the public site usable even if Edge Config is misconfigured.
const DEFAULT_MODE: SiteMode = 'guesty';

const isValidMode = (v: unknown): v is SiteMode =>
    v === 'guesty' || v === 'self_contained';

export const getMode = cache(async (): Promise<SiteMode> => {
    // Local-dev override so we don't need Edge Config wired up to develop.
    // Set SITE_MODE=guesty or SITE_MODE=self_contained in .env.local.
    if (isValidMode(process.env.SITE_MODE)) {
        return process.env.SITE_MODE;
    }

    if (!process.env.EDGE_CONFIG) {
        return DEFAULT_MODE;
    }

    try {
        const value = await get('mode');
        return isValidMode(value) ? value : DEFAULT_MODE;
    } catch {
        return DEFAULT_MODE;
    }
});
