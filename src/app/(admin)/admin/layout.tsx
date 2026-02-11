import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch Profile Role via join
    const { data: profile } = await supabase
        .from('profiles')
        .select('role_id, full_name, roles ( name )')
        .eq('id', user.id)
        .single();

    const rolesData = profile?.roles;
    const role = Array.isArray(rolesData)
        ? (rolesData[0] as { name: string })?.name || 'viewer'
        : ((rolesData as unknown) as { name: string } | null)?.name || 'viewer';
    const fullName = profile?.full_name || user.email?.split('@')[0] || 'User';

    return (
        <div className="flex min-h-screen bg-[var(--color-warm-white)]">
            <AdminSidebar user={user} role={role} fullName={fullName} />
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
