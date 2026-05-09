import { montserrat, inter } from "@/lib/fonts";
import "@/app/globals.css";
import { ToastProvider } from "@/contexts/ToastContext";

import { getCachedUserWithRole } from "@/lib/auth/guards";
import { PermissionProvider } from "@/contexts/PermissionContext";
import { redirect } from "next/navigation";
import { getMode } from "@/lib/mode";

export default async function AdminRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // In Guesty mode the CMS is dormant — Supabase may be paused.
    // Bail out before getCachedUserWithRole would hit it.
    if ((await getMode()) === "guesty") {
        redirect("/");
    }

    const user = await getCachedUserWithRole();

    if (!user) {
        redirect("/login");
    }

    return (
        <html lang="en" className={`${montserrat.variable} ${inter.variable}`}>
            <body className="antialiased bg-[var(--color-warm-white)] text-[var(--color-charcoal)]">
                <ToastProvider>
                    <PermissionProvider
                        permissions={user.permissions}
                        role={user.roleName}
                    >
                        {children}
                    </PermissionProvider>
                </ToastProvider>
            </body>
        </html>
    );
}
