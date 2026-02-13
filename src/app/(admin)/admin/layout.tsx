import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { AdminMobileHeader } from "@/components/admin/layout/AdminMobileHeader";
import { getCachedUserWithRole } from "@/lib/auth/guards";
import { redirect } from "next/navigation";

export default async function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const result = await getCachedUserWithRole();

    if (!result) {
        redirect('/login');
    }

    const { user, roleName, fullName } = result;

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-[var(--color-warm-white)]">
            {/* Mobile Header */}
            <AdminMobileHeader user={user} role={roleName} fullName={fullName} />

            {/* Desktop Sidebar */}
            <AdminSidebar
                user={user}
                role={roleName}
                fullName={fullName}
                className="hidden md:flex"
            />

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}

