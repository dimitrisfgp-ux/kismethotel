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
const getCachedUserWithRole = cache(async (): Promise<{ user: User; roleName: string; roleId: string | null; fullName: string; permissions: string[] } | null> => {
    const user = await getCachedUser();
    if (!user) return null;

    const supabase = await createClient();

    // Step 1: Get Profile & Role
    const { data: profile } = await supabase
        .from('profiles')
        .select(`
            role_id, 
            full_name, 
            roles ( name )
        `)
        .eq('id', user.id)
        .single();

    const roleName = extractRoleName(profile?.roles) ?? 'viewer';
    const fullName = (profile?.full_name as string) || user.email?.split('@')[0] || 'User';

    // Step 2: Get Permissions separately to avoid join issues or data recursion
    let permissions: string[] = [];
    if (profile?.role_id) {
        const { data: rolePerms } = await supabase
            .from('role_permissions')
            .select('permissions ( slug )')
            .eq('role_id', profile.role_id);

        if (rolePerms) {
            permissions = rolePerms.map((rp: any) => rp.permissions?.slug).filter(Boolean);
        }
    }

    return { user, roleName, roleId: profile?.role_id ?? null, fullName, permissions };
});

/**
 * Get the current user's role name.
 * Uses per-request cache — safe to call multiple times without extra queries.
 */
export async function getUserRole(): Promise<{ user: User; roleName: string; permissions: string[] } | null> {
    return getCachedUserWithRole();
}

/**
 * Get the authenticated user (cached per-request).
 * Exported so the layout can use it instead of creating its own client.
 */
export { getCachedUser, getCachedUserWithRole };

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
