import { createClient } from "@/lib/supabase/server";
import { User } from "@supabase/supabase-js";

/**
 * Checks if the current user has a specific permission.
 * Returns true/false. Does not throw.
 */
export async function checkPermission(permissionSlug: string): Promise<boolean> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    // We check the role_permissions table via RLS or direct query
    // Since we are checking *our own* permissions, RLS allows reading our own role's permissions
    // But we need to join tables.

    // Efficient Query:
    // Check if a row exists in role_permissions where:
    // 1. role_id matches the user's profile.role_id
    // 2. permission_id matches the slug

    // We first get the user's role_id from profiles
    const { data: profile } = await supabase
        .from('profiles')
        .select('role_id')
        .eq('id', user.id)
        .single();

    if (!profile?.role_id) return false;

    // Check for the permission
    const { count } = await supabase
        .from('role_permissions')
        .select('permission_id', { count: 'exact', head: true })
        .eq('role_id', profile.role_id)
        .eq('permissions.slug', permissionSlug) // Requires Foreign Key Join or flattening
        .not('permissions', 'is', null);

    // Supabase JS join syntax is tricky for "exists". 
    // Let's do it slightly differently to be safe with standard Postgrest:

    const { data: permissions } = await supabase
        .from('role_permissions')
        .select(`
            permissions!inner (
                slug
            )
        `)
        .eq('role_id', profile.role_id)
        .eq('permissions.slug', permissionSlug);

    return (permissions?.length || 0) > 0;
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

    // 1. SUPER ADMIN BYPASS checks? 
    // Usually "Admin" is just a role with all permissions, so we don't need a bypass code path.
    // But we might want to check if the role is 'is_system' & 'admin' just in case of DB sync issues.
    // For now, let's trust the permission system.

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role_id, roles ( name, is_system )')
        .eq('id', user.id)
        .single();

    if (profileError) {
        console.error('RBAC Guard Error: Failed to fetch profile', profileError);
        console.error('User ID:', user.id);
    }

    if (!profile) {
        console.warn('RBAC Guard: Profile is null for user', user.id);
    } else {
        console.log('RBAC Guard: Profile found', { roleId: profile.role_id, roleName: (profile.roles as any)?.name });
    }

    if (!profile?.role_id) {
        throw new Error("Unauthorized: No role assigned");
    }

    // Optimization: If role is 'admin', allow everything?
    // This saves DB queries and prevents lockout if we forget to seed a permission.
    // @ts-ignore - Supabase types might be complex here
    if (profile.roles?.name === 'admin') {
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
