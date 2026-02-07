import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-[var(--color-warm-white)]">
            <AdminSidebar />
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
