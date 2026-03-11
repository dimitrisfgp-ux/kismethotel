import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { AdminMobileHeader } from "@/components/admin/layout/AdminMobileHeader";
import { getCachedUserWithRole } from "@/lib/auth/guards";
import { redirect } from "next/navigation";
import { PermissionProvider } from "@/contexts/PermissionContext";
import { contentService } from "@/services/contentService";

export default async function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [result, settings] = await Promise.all([
        getCachedUserWithRole(),
        contentService.getSettings()
    ]);

    if (!result) {
        redirect('/login');
    }

    const { user, roleName, fullName, permissions } = result;

    return (
        <PermissionProvider permissions={permissions} role={roleName}>
            <div className="flex flex-col md:flex-row min-h-screen bg-[var(--color-warm-white)]">
                {/* Mobile Header */}
                <AdminMobileHeader user={user} role={roleName} fullName={fullName} settings={settings} />

                {/* Desktop Sidebar */}
                <AdminSidebar
                    user={user}
                    role={roleName}
                    fullName={fullName}
                    settings={settings}
                    className="hidden md:flex"
                />

                {/* Main Content */}
                <main className="flex-1 md:ml-64 p-4 md:p-8">
                    {children}
                </main>
            </div>
        </PermissionProvider>
    );
}

