"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BedDouble, Settings, ExternalLink, CalendarCheck, MessageSquare, User, Image } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/components/admin/auth/LogoutButton";
import type { User as AuthUser } from "@supabase/supabase-js";

// Define Nav Items with required roles (if any)
const NAV_ITEMS = [
    {
        label: "Bookings",
        href: "/admin/bookings",
        icon: CalendarCheck,
        roles: ['admin', 'manager', 'receptionist']
    },
    {
        label: "Requests",
        href: "/admin/requests",
        icon: MessageSquare,
        roles: ['admin', 'manager', 'receptionist'] // Receptionist view only
    },
    {
        label: "Rooms",
        href: "/admin/rooms",
        icon: BedDouble,
        roles: ['admin', 'manager', 'receptionist'] // Receptionist availability only
    },
    {
        label: "Page Content",
        href: "/admin/page-content",
        icon: LayoutDashboard,
        roles: ['admin', 'manager']
    },
    {
        label: "Media Library",
        href: "/admin/media",
        icon: Image,
        roles: ['admin', 'manager']
    },
    {
        label: "Settings",
        href: "/admin/settings",
        icon: Settings,
        roles: ['admin', 'manager']
    }
];

interface AdminSidebarProps {
    user: AuthUser | null;
    role: string;
    fullName: string | null;
}

export function AdminSidebar({ user, role, fullName }: AdminSidebarProps) {
    const pathname = usePathname();

    // Mapping roles to display names and colors
    const roleBadge = {
        admin: { label: "Admin", color: "bg-red-500" },
        manager: { label: "Manager", color: "bg-blue-500" },
        receptionist: { label: "Reception", color: "bg-emerald-500" },
        viewer: { label: "Viewer", color: "bg-gray-500" }
    }[role] || { label: "Staff", color: "bg-gray-500" };

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-[var(--color-aegean-blue)] text-white flex flex-col z-50 shadow-xl">
            {/* Branding */}
            <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
                <span className="font-montserrat font-bold text-xl tracking-[0.1em] uppercase">
                    Kismét CMS
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {NAV_ITEMS.filter(item => item.roles.includes(role)).map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-white/10 text-white shadow-sm"
                                    : "text-white/60 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile Footer */}
            <div className="p-4 border-t border-white/10 space-y-4 shrink-0 bg-black/20">
                {user && (
                    <Link href="/admin/profile" className="flex items-center gap-3 px-2 group hover:bg-white/5 rounded-lg transition-colors p-2">
                        <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                            <User className="h-5 w-5 text-white/80" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-white truncate group-hover:text-white transition-colors">
                                {fullName || user.email}
                            </p>
                            <div className="flex mt-1">
                                <span className={cn("text-[10px] uppercase font-bold px-1.5 py-0.5 rounded text-white tracking-wide", roleBadge.color)}>
                                    {roleBadge.label}
                                </span>
                            </div>
                        </div>
                    </Link>
                )}

                <div className="space-y-1 pt-2 border-t border-white/5">
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-md transition-colors"
                    >
                        <ExternalLink className="h-5 w-5" />
                        Open Website
                    </Link>

                    <LogoutButton />
                </div>
            </div>
        </aside>
    );
}
