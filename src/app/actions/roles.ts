'use server';

import { createClient } from "@/lib/supabase/server"; // Use valid implementation
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth/guards";
import { Role, Permission } from "@/types";

/**
 * Fetch all roles (with simplified logic)
 */
export async function getRolesAction() {
    // We allow 'users.manage' OR 'roles.manage' to see roles
    // But let's simplify: Any staff member who can manage users needs to see roles.
    // Let's use a lower permission if needed, but for now 'users.view' might be enough?
    // Actually, 'roles.view' is the specific permission.
    await requirePermission('roles.view');

    const supabase = await createClient();
    const { data: roles, error } = await supabase
        .from('roles')
        .select('*')
        .order('name');

    if (error) throw new Error(error.message);

    // Map snake_case to camelCase
    return roles.map((r: { id: string; name: string; description: string | null; is_system: boolean; created_at: string }) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        isSystem: r.is_system,
        createdAt: r.created_at
    })) as Role[];
}

/**
 * Fetch all available permissions (for the Role Editor)
 */
export async function getPermissionsAction() {
    await requirePermission('roles.manage');

    const supabase = await createClient();
    const { data: permissions, error } = await supabase
        .from('permissions')
        .select('*')
        .order('module, slug');

    if (error) throw new Error(error.message);

    return permissions as Permission[];
}

/**
 * Get a single role with its permissions
 */
export async function getRoleDetailsAction(roleId: string) {
    await requirePermission('roles.view');

    const supabase = await createClient();

    // 1. Get Role
    const { data: role, error: roleError } = await supabase
        .from('roles')
        .select('*')
        .eq('id', roleId)
        .single();

    if (roleError) throw new Error(roleError.message);

    // 2. Get Permissions for this role
    const { data: rolePerms, error: permError } = await supabase
        .from('role_permissions')
        .select('permission_id, permissions(*)')
        .eq('role_id', roleId);

    if (permError) throw new Error(permError.message);

    const permissions = rolePerms.map((rp: { permissions: Permission }) => rp.permissions);

    return {
        ...role,
        isSystem: role.is_system,
        permissions
    } as Role;
}

/**
 * Create a new Role
 */
export async function createRoleAction(data: { name: string; description?: string; permissionIds: string[] }) {
    await requirePermission('roles.manage');
    const supabase = await createClient();

    // 1. Create Role
    const { data: newRole, error: createError } = await supabase
        .from('roles')
        .insert({
            name: data.name,
            description: data.description,
            is_system: false
        })
        .select()
        .single();

    if (createError) throw new Error(createError.message);

    // 2. Assign Permissions
    if (data.permissionIds.length > 0) {
        const payload = data.permissionIds.map(pid => ({
            role_id: newRole.id,
            permission_id: pid
        }));

        const { error: permError } = await supabase
            .from('role_permissions')
            .insert(payload);

        if (permError) {
            // Cleanup? Ideally explicit transaction, but for now we throw
            console.error('Failed to assign permissions to new role:', permError);
            throw new Error('Role created but permissions failed to save.');
        }
    }

    revalidatePath('/admin/settings');
    return { success: true, roleId: newRole.id };
}

/**
 * Update an existing Role
 */
export async function updateRoleAction(roleId: string, data: { name: string; description?: string; permissionIds: string[] }) {
    await requirePermission('roles.manage');
    const supabase = await createClient();

    // 1. Check if System Role (prevent renaming if needed, but managing permissions is allowed)
    // For now, full update allowed.

    // 2. Update Metadata
    const { error: updateError } = await supabase
        .from('roles')
        .update({
            name: data.name,
            description: data.description
        })
        .eq('id', roleId);

    if (updateError) throw new Error(updateError.message);

    // 3. Sync Permissions (Delete All + Insert New) 
    // This is simple and effective for this scale
    const { error: deleteError } = await supabase
        .from('role_permissions')
        .delete()
        .eq('role_id', roleId);

    if (deleteError) throw new Error(deleteError.message);

    if (data.permissionIds.length > 0) {
        const payload = data.permissionIds.map(pid => ({
            role_id: roleId,
            permission_id: pid
        }));

        const { error: insertError } = await supabase
            .from('role_permissions')
            .insert(payload);

        if (insertError) throw new Error(insertError.message);
    }

    revalidatePath('/admin/settings');
    return { success: true };
}

/**
 * Delete a Role
 */
export async function deleteRoleAction(roleId: string) {
    await requirePermission('roles.manage');
    const supabase = await createClient();

    // 1. Check if System Role
    const { data: role } = await supabase.from('roles').select('is_system').eq('id', roleId).single();
    if (role?.is_system) {
        throw new Error("Cannot delete a System Role.");
    }

    // 2. Delete (Cascade handles permissions)
    const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', roleId);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/settings');
    return { success: true };
}
