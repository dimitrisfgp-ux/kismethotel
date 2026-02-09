import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client for browser/public access (respects RLS policies)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server client with service role for admin operations (bypasses RLS)
export function createServerClient() {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRoleKey) {
        console.warn('SUPABASE_SERVICE_ROLE_KEY not set, using anon key');
        return supabase;
    }

    return createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        },
        global: {
            fetch: (url, options) => {
                return fetch(url, {
                    ...options,
                    cache: 'no-store',
                });
            }
        }
    });
}
