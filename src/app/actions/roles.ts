'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth/guards";
import { Role, Permission } from "@/types";
import { DbRole, DbPermission, DbRolePermission } from "@/types/db";

// Helper to map DB Role (snake_case) to App Role (camelCase)
function mapRole(role: DbRole, permissions: Permission[] = []): Role {
    return {
        id: role.id,
        name: role.name,
        description: role.description || undefined,
        isSystem: role.is_system,
        createdAt: role.created_at,
        permissions: permissions.length > 0 ? permissions : undefined
    };
}

/**
 * Fetch all roles
 */
export async function getRolesAction(): Promise<Role[]> {
    await requirePermission('roles.view');

    const supabase = await createClient();
    const { data: roles, error } = await supabase
        .from('roles')
        .select('*')
        .order('name');

    if (error) throw new Error(error.message);

    // Safe casting to known DB type, then mapping
    return (roles as unknown as DbRole[]).map(r => mapRole(r));
}

/**
 * Fetch all available permissions
 */
export async function getPermissionsAction(): Promise<Permission[]> {
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
export async function getRoleDetailsAction(roleId: string): Promise<Role> {
    await requirePermission('roles.view');

    const supabase = await createClient();

    // 1. Get Role
    const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .select('*')
        .eq('id', roleId)
        .single();

    if (roleError) throw new Error(roleError.message);
    const role = roleData as unknown as DbRole;

    // 2. Get Permissions for this role
    const { data: rolePerms, error: permError } = await supabase
        .from('role_permissions')
        .select('permission_id, permissions(*)')
        .eq('role_id', roleId);

    if (permError) throw new Error(permError.message);

    // Map nested permissions
    const permissions = rolePerms.map((rp: any) => rp.permissions as Permission);

    return mapRole(role, permissions);
}

/**
 * Create a new Role
 */
export async function createRoleAction(data: { name: string; description?: string; permissionIds: string[] }) {
    await requirePermission('roles.manage');
    const supabase = await createClient();

    // 1. Create Role
    const { data: newRoleData, error: createError } = await supabase
        .from('roles')
        .insert({
            name: data.name,
            description: data.description,
            is_system: false
        })
        .select()
        .single();

    if (createError) throw new Error(createError.message);
    const newRole = newRoleData as unknown as DbRole;

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
            console.error('Failed to assign permissions to new role:', permError);
            throw new Error('Role created but permissions failed to save.');
        }
    }

    revalidatePath('/admin/settings');
    return { success: true, roleId: newRole.id };
}

/**
 * Update an existing Role (SAFE DIFF IMPLEMENTATION)
 */
export async function updateRoleAction(roleId: string, data: { name: string; description?: string; permissionIds: string[] }) {
    await requirePermission('roles.manage');
    const supabase = await createClient();

    // 1. Update Metadata
    const { error: updateError } = await supabase
        .from('roles')
        .update({
            name: data.name,
            description: data.description
        })
        .eq('id', roleId);

    if (updateError) throw new Error(updateError.message);

    // 2. Sync Permissions (Fail-Safe Diff)
    // Fetch existing
    const { data: existingPerms, error: fetchError } = await supabase
        .from('role_permissions')
        .select('permission_id')
        .eq('role_id', roleId);

    if (fetchError) throw new Error(fetchError.message);

    const existingIds = new Set((existingPerms as DbRolePermission[]).map(p => p.permission_id));
    const newIds = new Set(data.permissionIds);

    // Calculate Diff
    const toAdd = [...newIds].filter(id => !existingIds.has(id));
    const toRemove = [...existingIds].filter(id => !newIds.has(id));

    // Execute DELETE (only what needs removing)
    if (toRemove.length > 0) {
        const { error: deleteError } = await supabase
            .from('role_permissions')
            .delete()
            .eq('role_id', roleId)
            .in('permission_id', toRemove);

        if (deleteError) throw new Error(`Failed to remove permissions: ${deleteError.message}`);
    }

    // Execute INSERT (only what needs adding)
    if (toAdd.length > 0) {
        const payload = toAdd.map(pid => ({
            role_id: roleId,
            permission_id: pid
        }));

        const { error: insertError } = await supabase
            .from('role_permissions')
            .insert(payload);

        if (insertError) throw new Error(`Failed to add permissions: ${insertError.message}`);
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
