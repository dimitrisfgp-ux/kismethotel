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
 * Get the current user's role name.
 * Shared utility to eliminate duplicated role-fetching logic.
 */
export async function getUserRole(): Promise<{ user: User; roleName: string } | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
        .from('profiles')
        .select('role_id, roles ( name )')
        .eq('id', user.id)
        .single();

    const roleName = extractRoleName(profile?.roles) ?? 'viewer';
    return { user, roleName };
}

/**
 * Checks if the current user has a specific permission.
 * Returns true/false. Does not throw.
 */
export async function checkPermission(permissionSlug: string): Promise<boolean> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    // Combined query: profile + role + permission check in one join
    const { data: profile } = await supabase
        .from('profiles')
        .select(`
            role_id,
            roles!inner (
                name,
                role_permissions!inner (
                    permissions!inner ( slug )
                )
            )
        `)
        .eq('id', user.id)
        .single();

    if (!profile?.role_id) return false;

    // Admin bypass
    const roleName = extractRoleName(profile.roles);
    if (roleName === 'admin') return true;

    // Check if the permission slug exists in the joined result
    const roles = Array.isArray(profile.roles) ? profile.roles : [profile.roles];
    return roles.some((role: any) =>
        role.role_permissions?.some((rp: any) =>
            rp.permissions?.slug === permissionSlug
        )
    );
}

/**
 * Enforces a permission check.
 * Throws an error if the user does NOT have the permission.
 * Returns the User object if successful.
 */
export async function requirePermission(permissionSlug: string): Promise<User> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized: Not logged in");
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role_id, roles ( name )')
        .eq('id', user.id)
        .single();

    if (!profile?.role_id) {
        throw new Error("Unauthorized: No role assigned");
    }

    // Admin bypass — allow all permissions to prevent lockout
    const roleName = extractRoleName(profile.roles);
    if (roleName === 'admin') {
        return user;
    }

    // Check specific permission
    const { data: permissions } = await supabase
        .from('role_permissions')
        .select(`
            permissions!inner (
                slug
            )
        `)
        .eq('role_id', profile.role_id)
        .eq('permissions.slug', permissionSlug)
        .single();

    if (!permissions) {
        throw new Error(`Unauthorized: Missing permission '${permissionSlug}'`);
    }

    return user;
}
