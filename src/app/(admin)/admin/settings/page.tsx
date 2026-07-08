import { contentService } from "@/services/contentService";
import { SettingsForm } from "@/components/admin/forms/SettingsForm";
import { UserManagementSection } from "@/components/admin/settings/UserManagementSection";
import { RoleManagementSection } from "@/components/admin/settings/RoleManagementSection";
import { createClient } from "@/lib/supabase/server";
import { getUsersAction } from "@/app/actions/auth";
import { getRolesAction, getPermissionsAction } from "@/app/actions/roles";
import { getUserRole } from '@/lib/auth/guards';
import { isEmailConfigured } from "@/services/emailService";
import { getMode } from "@/lib/mode";

export default async function SettingsPage() {
    const supabase = await createClient();

    // 1. Fetch User & Role First
    const [userResult, roleResult] = await Promise.all([
        supabase.auth.getUser(),
        getUserRole()
    ]);

    const user = userResult.data.user;
    const userRole = roleResult?.roleName ?? 'viewer';
    const permissions = roleResult?.permissions ?? [];

    // In Guesty mode the granular ROLE/PERMISSION configuration is hidden (redundant
    // and risky for a single content admin). User management — creating/inviting
    // admins — stays available in both modes.
    const showRoleManagement = (await getMode()) !== 'guesty';

    // 2. Conditional Data Fetching based on permissions/role.
    // Users + roles are needed by User Management (both modes); roles also feed its
    // role dropdown. The permissions matrix is only needed by the role manager.
    const canViewUsers = permissions.includes('users.view') || userRole === 'admin';
    const canViewRoles = permissions.includes('roles.view') || userRole === 'admin';
    const canManageRoles = showRoleManagement && (permissions.includes('roles.manage') || userRole === 'admin');

    const [settings, usersResult, rolesResult, permissionsResult] = await Promise.all([
        contentService.getSettings(),
        canViewUsers ? getUsersAction().catch((err: Error) => { console.error('Failed to fetch users:', err); return []; }) : Promise.resolve([]),
        canViewRoles ? getRolesAction().catch((err: Error) => { console.error('Failed to fetch roles:', err); return []; }) : Promise.resolve([]),
        canManageRoles ? getPermissionsAction().catch((err: Error) => { console.error('Failed to fetch permissions:', err); return []; }) : Promise.resolve([])
    ]);

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-12">
            {/* Header */}
            <div className="border-b border-[var(--color-sand)] pb-4 md:pb-6 px-4 md:px-0">
                <h1 className="text-2xl md:text-3xl font-bold font-montserrat text-[var(--color-charcoal)]">Global Settings</h1>
                <p className="text-[var(--color-charcoal)]/60 mt-1 md:mt-2 text-sm md:text-base">Manage hotel configuration, team members, and contact details.</p>
            </div>

            {/* User Management — available in both modes (create/invite admins) */}
            {user && (
                <div className="pb-8 border-b border-[var(--color-sand)]">
                    <UserManagementSection
                        currentUserRole={userRole}
                        currentUserId={user.id}
                        initialUsers={usersResult}
                        initialRoles={rolesResult}
                        smtpConfigured={isEmailConfigured()}
                    />
                </div>
            )}

            {/* Role Management (hidden in Guesty mode) */}
            {showRoleManagement && (
                <div className="pb-8 border-b border-[var(--color-sand)]">
                    <RoleManagementSection
                        initialRoles={rolesResult}
                        initialPermissions={permissionsResult}
                    />
                </div>
            )}

            {/* General Settings */}
            <div>
                <h2 className="text-xl font-bold font-montserrat text-[var(--color-aegean-blue)] mb-6">Hotel Configuration</h2>
                <SettingsForm initialSettings={settings} />
            </div>
        </div>
    );
}
