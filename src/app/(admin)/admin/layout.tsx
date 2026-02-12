import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
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
        <div className="flex min-h-screen bg-[var(--color-warm-white)]">
            <AdminSidebar user={user} role={roleName} fullName={fullName} />
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}

