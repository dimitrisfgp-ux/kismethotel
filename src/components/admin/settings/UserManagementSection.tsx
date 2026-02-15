'use client';

import { useState, useEffect } from 'react';
import { getUsersAction, inviteUserAction, deleteUserAction, updateUserAction } from '@/app/actions/auth';
import { getRolesAction } from '@/app/actions/roles';
import { Plus, Trash2, User, Loader2, Edit2, X, Key, Mail, Shield } from 'lucide-react';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { useToast } from '@/contexts/ToastContext';
import { Role } from '@/types';
import { usePermission } from '@/contexts/PermissionContext';

interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    role: string;
    role_id: string;
    roles?: { name: string }; // Joined data
    created_at: string;
}

interface UserManagementSectionProps {
    currentUserRole: string;
    currentUserId: string;
    initialUsers?: UserProfile[];
    initialRoles?: Role[];
}

export function UserManagementSection({ currentUserRole, currentUserId, initialUsers = [], initialRoles = [] }: UserManagementSectionProps) {
    const { showToast } = useToast();
    const { can } = usePermission();

    // Filter out current user immediately from initial data if present
    const [users, setUsers] = useState<UserProfile[]>(initialUsers.filter(u => u.id !== currentUserId));
    const [roles, setRoles] = useState<Role[]>(initialRoles);
    const [isLoading, setIsLoading] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        password: '',
        roleId: ''
    });

    const [isSaving, setIsSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Removed automatic useEffect loadData.

    async function loadData() {
        setIsLoading(true);
        try {
            const [usersData, rolesData] = await Promise.all([
                getUsersAction(),
                getRolesAction()
            ]);
            // Filter out the current user from the list
            const filteredUsers = usersData.filter((u: UserProfile) => u.id !== currentUserId);
            setUsers(filteredUsers);
            setRoles(rolesData);
        } catch (error) {
            console.error(error);
            showToast('Failed to load user data', 'error');
        } finally {
            setIsLoading(false);
        }
    }

    // Modal Handlers
    function openInviteModal() {
        setEditingUser(null);
        setFormData({ email: '', fullName: '', password: '', roleId: roles[0]?.id || '' });
        setIsModalOpen(true);
    }

    function openEditModal(user: UserProfile) {
        setEditingUser(user);
        setFormData({
            email: user.email,
            fullName: user.full_name,
            password: '', // Leave blank to keep unchanged
            roleId: user.role_id || ''
        });
        setIsModalOpen(true);
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setIsSaving(true);
        try {
            const payload = new FormData();
            payload.append('email', formData.email);
            payload.append('fullName', formData.fullName);
            payload.append('password', formData.password);
            payload.append('roleId', formData.roleId);

            if (editingUser) {
                // Update
                if (!formData.roleId) throw new Error("Role is required");
                await updateUserAction(editingUser.id, {
                    email: formData.email,
                    fullName: formData.fullName,
                    roleId: formData.roleId,
                    password: formData.password
                });
                showToast('User updated successfully', 'success');
            } else {
                // Invite
                await inviteUserAction(payload);
                showToast('User invited successfully', 'success');
            }
            setIsModalOpen(false);
            loadData();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'An error occurred';
            showToast(message, 'error');
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDelete(userId: string) {
        if (!confirm('Are you sure you want to remove this user? This action cannot be undone.')) return;
        try {
            await deleteUserAction(userId);
            showToast('User removed successfully', 'success');
            loadData();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'An error occurred';
            showToast(message, 'error');
        }
    }

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-[var(--color-aegean-blue)]" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold font-montserrat text-[var(--color-aegean-blue)]">Team Members</h2>
                    <p className="text-sm text-[var(--color-charcoal)]/60">Manage staff access and roles.</p>
                </div>
                {can('users.manage') && (
                    <button
                        onClick={openInviteModal}
                        className="flex items-center justify-center gap-2 bg-[var(--color-aegean-blue)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0fd0d6] hover:text-[var(--color-aegean-blue)] transition-colors w-full md:w-auto"
                    >
                        <Plus className="w-4 h-4" />
                        Invite Member
                    </button>
                )}
            </div>

            {/* List */}
            <div className="bg-white rounded-lg shadow-sm border border-black/5 overflow-hidden">
                <div className="divide-y divide-gray-100">
                    {users.map((user) => (
                        <div key={user.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-gray-50 transition-colors gap-3 md:gap-0">
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="w-10 h-10 rounded-full bg-[var(--color-aegean-blue)]/10 flex items-center justify-center text-[var(--color-aegean-blue)] shrink-0">
                                    <User className="w-5 h-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-medium text-[var(--color-charcoal)] truncate">{user.full_name || 'Unnamed'}</p>
                                    <p className="text-xs text-[var(--color-charcoal)]/60 truncate">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto pl-14 md:pl-0">
                                {/* Role Badge */}
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600`}>
                                    {user.roles?.name || user.role}
                                </span>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    {can('users.manage') && (
                                        <>
                                            <button
                                                onClick={() => openEditModal(user)}
                                                className="p-2 text-gray-400 hover:text-[var(--color-aegean-blue)] bg-gray-50 hover:bg-blue-50 rounded-full transition-colors"
                                                title="Edit User"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>

                                            {user.id !== currentUserId && (
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-full transition-colors"
                                                    title="Remove User"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-[var(--color-charcoal)]">
                                {editingUser ? 'Edit User' : 'Invite New User'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            {/* Name */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase text-gray-500">Full Name</label>
                                <div className="relative">
                                    <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                    <input
                                        required
                                        value={formData.fullName}
                                        onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-aegean-blue)] outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase text-gray-500">Email Address</label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                    <input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-aegean-blue)] outline-none"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            {/* Role Selection */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase text-gray-500">Role</label>
                                <div className="relative">
                                    <Shield className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                    <select
                                        required
                                        value={formData.roleId}
                                        onChange={e => setFormData(prev => ({ ...prev, roleId: e.target.value }))}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-aegean-blue)] outline-none bg-white appearance-none"
                                    >
                                        <option value="" disabled>Select a role...</option>
                                        {roles.map(role => (
                                            <option key={role.id} value={role.id}>
                                                {role.name} {role.isSystem ? '(System)' : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase text-gray-500">
                                    {editingUser ? 'New Password (Optional)' : 'Password'}
                                </label>
                                <div className="relative">
                                    <Key className="w-4 h-4 absolute left-3 top-3 text-gray-400 z-10" />
                                    <PasswordInput
                                        required={!editingUser}
                                        value={formData.password}
                                        onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                        className="pl-10"
                                        placeholder={editingUser ? "Leave blank to keep current password" : "••••••••"}
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 px-4 py-2 bg-[var(--color-aegean-blue)] text-white rounded-lg hover:bg-[var(--color-aegean-blue)]/90 transition-colors font-medium flex justify-center items-center gap-2 disabled:opacity-50"
                                >
                                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {editingUser ? 'Save Changes' : 'Invite User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
