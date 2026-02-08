"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BedDouble, Settings, LogOut, ExternalLink, CalendarCheck, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    {
        label: "Bookings",
        href: "/admin/bookings",
        icon: CalendarCheck // Importing CalendarCheck
    },
    {
        label: "Requests",
        href: "/admin/requests",
        icon: MessageSquare
    },
    {
        label: "Rooms",
        href: "/admin/rooms",
        icon: BedDouble
    },
    {
        label: "Page Content",
        href: "/admin/page-content",
        icon: LayoutDashboard // Reusing generic icon or could import FileText
    },
    {
        label: "Settings",
        href: "/admin/settings",
        icon: Settings
    }
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-[var(--color-aegean-blue)] text-white flex flex-col z-50">
            {/* Branding */}
            <div className="h-16 flex items-center px-6 border-b border-white/10">
                <span className="font-montserrat font-bold text-xl tracking-[0.1em] uppercase">
                    Kismét CMS
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-white/10 text-white"
                                    : "text-white/60 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Actions */}
            <div className="p-4 border-t border-white/10 space-y-2">
                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-md transition-colors"
                >
                    <ExternalLink className="h-5 w-5" />
                    Open Website
                </Link>

                <a
                    href="/admin/login"
                    onClick={() => {
                        // Simple logout by clearing cookie client-side or just redirecting
                        document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
                    }}
                    className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-white/60 hover:text-red-400 hover:bg-white/5 rounded-md transition-colors cursor-pointer"
                >
                    <LogOut className="h-5 w-5" />
                    Logout
                </a>
            </div>
        </aside>
    );
}
