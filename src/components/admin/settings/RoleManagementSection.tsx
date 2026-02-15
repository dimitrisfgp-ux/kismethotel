'use client';

import { useState, useEffect } from 'react';
import { Role, Permission } from '@/types';
import {
    getRolesAction,
    getPermissionsAction,
    createRoleAction,
    updateRoleAction,
    deleteRoleAction,
    getRoleDetailsAction
} from '@/app/actions/roles';
import { useToast } from '@/contexts/ToastContext';
import { Loader2, Plus, Shield, Edit2, Trash2, Check, X } from 'lucide-react';
import { usePermission } from '@/contexts/PermissionContext';

interface RoleManagementSectionProps {
    initialRoles?: Role[];
    initialPermissions?: Permission[];
}

export function RoleManagementSection({ initialRoles = [], initialPermissions = [] }: RoleManagementSectionProps) {
    const { showToast } = useToast();
    const { can } = usePermission();
    const [roles, setRoles] = useState<Role[]>(initialRoles);
    const [permissions, setPermissions] = useState<Permission[]>(initialPermissions);
    const [isLoading, setIsLoading] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '', permissionIds: [] as string[] });
    const [isSaving, setIsSaving] = useState(false);

    // Removed automatic useEffect loadData since we pass initial data
    // effectively making this instant.
    // We only load data if explicitly refreshing or after an action.

    async function loadData() {
        setIsLoading(true);
        try {
            const [rolesData, permsData] = await Promise.all([
                getRolesAction(),
                getPermissionsAction()
            ]);
            setRoles(rolesData);
            setPermissions(permsData);
        } catch (error) {
            console.error(error);
            showToast('Failed to load roles configuration', 'error');
        } finally {
            setIsLoading(false);
        }
    }

    // Modal Handlers
    function openCreateModal() {
        setEditingRole(null);
        setFormData({ name: '', description: '', permissionIds: [] });
        setIsModalOpen(true);
    }

    async function openEditModal(role: Role) {
        try {
            // Fetch full details (permissions) for this role
            const fullRole = await getRoleDetailsAction(role.id);
            setEditingRole(fullRole);
            setFormData({
                name: fullRole.name,
                description: fullRole.description || '',
                permissionIds: fullRole.permissions?.map(p => p.id) || []
            });
            setIsModalOpen(true);
        } catch (error) {
            showToast('Failed to load role details', 'error');
        }
    }

    function togglePermission(permId: string) {
        setFormData(prev => {
            if (prev.permissionIds.includes(permId)) {
                return { ...prev, permissionIds: prev.permissionIds.filter(id => id !== permId) };
            } else {
                return { ...prev, permissionIds: [...prev.permissionIds, permId] };
            }
        });
    }

    async function handleSave() {
        if (!formData.name) return showToast('Role Name is required', 'error');
        setIsSaving(true);
        try {
            if (editingRole) {
                await updateRoleAction(editingRole.id, formData);
                showToast('Role updated successfully', 'success');
            } else {
                await createRoleAction(formData);
                showToast('Role created successfully', 'success');
            }
            setIsModalOpen(false);
            loadData(); // Refresh list
        } catch (error: any) {
            showToast(error.message, 'error');
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDelete(role: Role) {
        if (!confirm(`Are you sure you want to delete the role "${role.name}"?`)) return;
        try {
            await deleteRoleAction(role.id);
            showToast('Role deleted', 'success');
            loadData();
        } catch (error: any) {
            showToast(error.message, 'error');
        }
    }

    // Group permissions by Module
    const permissionsByModule = permissions.reduce((acc, perm) => {
        if (!acc[perm.module]) acc[perm.module] = [];
        acc[perm.module].push(perm);
        return acc;
    }, {} as Record<string, Permission[]>);

    if (isLoading) return <div className="p-8 text-center text-[var(--color-charcoal)]/60"><Loader2 className="w-6 h-6 animate-spin mx-auto" /> Loading Roles...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h3 className="text-lg font-bold font-montserrat text-[var(--color-aegean-blue)] flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Roles & Permissions
                    </h3>
                    <p className="text-sm text-[var(--color-charcoal)]/60">Manage staff access levels and granular permissions.</p>
                </div>
                {can('roles.manage') && (
                    <button
                        onClick={openCreateModal}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-aegean-blue)] text-white rounded-lg hover:bg-[var(--color-aegean-blue)]/90 transition-colors w-full md:w-auto"
                    >
                        <Plus className="w-4 h-4" />
                        New Role
                    </button>
                )}
            </div>

            {/* Role List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map(role => (
                    <div key={role.id} className="bg-white p-6 rounded-xl border border-[var(--color-sand)] hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-bold text-lg text-[var(--color-charcoal)] capitalize">{role.name}</h4>
                                {role.isSystem && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full mt-1 inline-block">System Role</span>}
                            </div>
                            <div className="flex gap-2">
                                {can('roles.manage') && (
                                    <button onClick={() => openEditModal(role)} className="p-2 text-gray-400 hover:text-[var(--color-aegean-blue)] bg-gray-50 hover:bg-blue-50 rounded-full transition-colors">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                )}
                                {(!role.isSystem && can('roles.manage')) && (
                                    <button onClick={() => handleDelete(role)} className="p-2 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-full transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-4 h-10 line-clamp-2">{role.description || 'No description provided.'}</p>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-[var(--color-sand)] flex justify-between items-center bg-[var(--color-cream)]">
                            <h3 className="text-xl font-bold font-montserrat text-[var(--color-aegean-blue)]">
                                {editingRole ? `Edit Role: ${editingRole.name}` : 'Create New Role'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-black/5 rounded-full text-gray-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body (Scrollable) */}
                        <div className="p-6 overflow-y-auto flex-1 space-y-8">

                            {/* Metadata */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[var(--color-charcoal)]">Role Name</label>
                                    <input
                                        value={formData.name}
                                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full p-3 border border-[var(--color-sand)] rounded-lg focus:ring-2 focus:ring-[var(--color-aegean-blue)] outline-none"
                                        placeholder="e.g. Senior Manager"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[var(--color-charcoal)]">Description</label>
                                    <input
                                        value={formData.description}
                                        onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full p-3 border border-[var(--color-sand)] rounded-lg focus:ring-2 focus:ring-[var(--color-aegean-blue)] outline-none"
                                        placeholder="What does this role do?"
                                    />
                                </div>
                            </div>

                            {/* Permission Matrix */}
                            <div>
                                <h4 className="text-md font-bold text-[var(--color-charcoal)] mb-4 pb-2 border-b border-[var(--color-sand)]">
                                    Permissions
                                </h4>
                                <div className="space-y-6">
                                    {Object.entries(permissionsByModule).map(([module, perms]) => (
                                        <div key={module} className="bg-gray-50 p-3 md:p-4 rounded-lg">
                                            <h5 className="font-bold text-[var(--color-aegean-blue)] uppercase text-xs trackng-wider mb-3 flex items-center gap-2">
                                                {module} Module
                                                <span className="text-[var(--color-charcoal)]/40 font-normal normal-case ml-auto text-[10px]">{perms.length} Permissions</span>
                                            </h5>
                                            <div className="grid grid-cols-1 gap-3">
                                                {perms.map(perm => {
                                                    const isChecked = formData.permissionIds.includes(perm.id);
                                                    return (
                                                        <label
                                                            key={perm.id}
                                                            className={`
                                                                flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all
                                                                ${isChecked ? 'bg-white border-[var(--color-aegean-blue)] shadow-sm' : 'border-transparent hover:bg-white'}
                                                            `}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={isChecked}
                                                                onChange={() => togglePermission(perm.id)}
                                                                className="mt-1 w-4 h-4 text-[var(--color-aegean-blue)] rounded focus:ring-[var(--color-aegean-blue)] shrink-0"
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-sm font-medium text-[var(--color-charcoal)] font-mono text-xs mb-1 truncate">
                                                                    {perm.slug}
                                                                </div>
                                                                <div className="text-xs text-gray-500 leading-tight">
                                                                    {perm.description}
                                                                </div>
                                                            </div>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-[var(--color-sand)] flex justify-end gap-3 bg-gray-50">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-6 py-2 bg-[var(--color-aegean-blue)] text-white rounded-lg hover:bg-[var(--color-aegean-blue)]/90 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                {editingRole ? 'Update Role' : 'Create Role'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
