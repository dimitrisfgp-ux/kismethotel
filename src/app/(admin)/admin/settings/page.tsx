import { contentService } from "@/services/contentService";
import { SettingsForm } from "@/components/admin/forms/SettingsForm";
import { UserManagementSection } from "@/components/admin/settings/UserManagementSection";
import { RoleManagementSection } from "@/components/admin/settings/RoleManagementSection";
import { createClient } from "@/lib/supabase/server";
import { getUsersAction } from "@/app/actions/auth";
import { getRolesAction, getPermissionsAction } from "@/app/actions/roles";
import { getUserRole } from '@/lib/auth/guards';

export default async function SettingsPage() {
    const supabase = await createClient();

    // Parallel Data Fetching (Server-Side)
    const [settings, userResult, usersResult, rolesResult, permissionsResult, roleResult] = await Promise.all([
        contentService.getSettings(),
        supabase.auth.getUser(),
        getUsersAction().catch((err: Error) => { console.error('Failed to fetch users:', err); return []; }),
        getRolesAction().catch((err: Error) => { console.error('Failed to fetch roles:', err); return []; }),
        getPermissionsAction().catch((err: Error) => { console.error('Failed to fetch permissions:', err); return []; }),
        getUserRole()
    ]);

    const user = userResult.data.user;
    const userRole = roleResult?.roleName ?? 'viewer';

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-12">
            {/* Header */}
            <div className="border-b border-[var(--color-sand)] pb-6">
                <h1 className="text-3xl font-bold font-montserrat text-[var(--color-charcoal)]">Global Settings</h1>
                <p className="text-[var(--color-charcoal)]/60 mt-2">Manage hotel configuration, team members, and contact details.</p>
            </div>

            {/* User Management (Admin Only - Component handles internal guard, but we pass props) */}
            {user && (
                <div className="pb-8 border-b border-[var(--color-sand)]">
                    <UserManagementSection
                        currentUserRole={userRole}
                        currentUserId={user.id}
                        initialUsers={usersResult}
                        initialRoles={rolesResult}
                    />
                </div>
            )}

            {/* Role Management (Protected Section) */}
            <div className="pb-8 border-b border-[var(--color-sand)]">
                <RoleManagementSection
                    initialRoles={rolesResult}
                    initialPermissions={permissionsResult}
                />
            </div>

            {/* General Settings */}
            <div>
                <h2 className="text-xl font-bold font-montserrat text-[var(--color-aegean-blue)] mb-6">Hotel Configuration</h2>
                <SettingsForm initialSettings={settings} />
            </div>
        </div>
    );
}
