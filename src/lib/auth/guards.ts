import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { User } from "@supabase/supabase-js";

// Shared helper to extract the role name from a profile join result
function extractRoleName(rolesData: unknown): string | null {
    if (!rolesData) return null;
    if (Array.isArray(rolesData)) {
        return (rolesData[0] as { name: string })?.name ?? null;
    }
    return (rolesData as { name: string }).name ?? null;
}

/**
 * Cached per-request: get current authenticated user.
 * React cache() deduplicates within a single server request,
 * so middleware → layout → page → guards all share ONE getUser() call.
 */
const getCachedUser = cache(async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
});

/**
 * Cached per-request: get user + profile + role.
 * Reuses getCachedUser() so getUser() is only called once.
 */
const getCachedUserWithRole = cache(async (): Promise<{ user: User; roleName: string; roleId: string | null; fullName: string } | null> => {
    const user = await getCachedUser();
    if (!user) return null;

    const supabase = await createClient();
    const { data: profile } = await supabase
        .from('profiles')
        .select('role_id, full_name, roles ( name )')
        .eq('id', user.id)
        .single();

    const roleName = extractRoleName(profile?.roles) ?? 'viewer';
    const fullName = (profile?.full_name as string) || user.email?.split('@')[0] || 'User';
    return { user, roleName, roleId: profile?.role_id ?? null, fullName };
});

/**
 * Get the current user's role name.
 * Uses per-request cache — safe to call multiple times without extra queries.
 */
export async function getUserRole(): Promise<{ user: User; roleName: string } | null> {
    return getCachedUserWithRole();
}

/**
 * Get the authenticated user (cached per-request).
 * Exported so the layout can use it instead of creating its own client.
 */
export { getCachedUser, getCachedUserWithRole };

/**
 * Checks if the current user has a specific permission.
 * Returns true/false. Does not throw.
 */
export async function checkPermission(permissionSlug: string): Promise<boolean> {
    const result = await getCachedUserWithRole();
    if (!result || !result.roleId) return false;

    // Admin bypass
    if (result.roleName === 'admin') return true;

    // Check specific permission
    const supabase = await createClient();
    const { data: permissions } = await supabase
        .from('role_permissions')
        .select(`
            permissions!inner (
                slug
            )
        `)
        .eq('role_id', result.roleId)
        .eq('permissions.slug', permissionSlug)
        .single();

    return !!permissions;
}

/**
 * Enforces a permission check.
 * Throws an error if the user does NOT have the permission.
 * Returns the User object if successful.
 */
export async function requirePermission(permissionSlug: string): Promise<User> {
    const result = await getCachedUserWithRole();

    if (!result) {
        throw new Error("Unauthorized: Not logged in");
    }

    if (!result.roleId) {
        throw new Error("Unauthorized: No role assigned");
    }

    // Admin bypass — allow all permissions to prevent lockout
    if (result.roleName === 'admin') {
        return result.user;
    }

    // Check specific permission
    const supabase = await createClient();
    const { data: permissions } = await supabase
        .from('role_permissions')
        .select(`
            permissions!inner (
                slug
            )
        `)
        .eq('role_id', result.roleId)
        .eq('permissions.slug', permissionSlug)
        .single();

    if (!permissions) {
        throw new Error(`Unauthorized: Missing permission '${permissionSlug}'`);
    }

    return result.user;
}
