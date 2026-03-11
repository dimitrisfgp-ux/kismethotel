"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BedDouble, Settings, ExternalLink, CalendarCheck, MessageSquare, User, Image } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/components/admin/auth/LogoutButton";
import type { User as AuthUser } from "@supabase/supabase-js";
import { LogoBrand } from "@/components/ui/LogoBrand";
import { HotelSettings } from "@/types";

import { usePermission } from "@/contexts/PermissionContext";

// Define Nav Items with required permissions
const NAV_ITEMS = [
    {
        label: "Bookings",
        href: "/admin/bookings",
        icon: CalendarCheck,
        permission: 'bookings.view'
    },
    {
        label: "Requests",
        href: "/admin/requests",
        icon: MessageSquare,
        permission: 'requests.view'
    },
    {
        label: "Rooms",
        href: "/admin/rooms",
        icon: BedDouble,
        permission: 'rooms.view'
    },
    {
        label: "Page Content",
        href: "/admin/page-content",
        icon: LayoutDashboard,
        permission: 'content.view'
    },
    {
        label: "Media Library",
        href: "/admin/media",
        icon: Image,
        permission: 'media.view'
    },
    {
        label: "Settings",
        href: "/admin/settings",
        icon: Settings,
        permission: null // Public to all admin/staff (or check 'settings.view' if exists)
    }
];

interface AdminSidebarProps {
    user: AuthUser | null;
    role: string;
    fullName: string | null;
    settings?: Pick<HotelSettings, 'name' | 'logoMode' | 'logoIconUrl' | 'logoTextUrl' | 'description'>;
    className?: string;
    onNavigate?: () => void;
}

export function AdminSidebar({ user, role, fullName, settings, className, onNavigate }: AdminSidebarProps) {
    const pathname = usePathname();
    const { can } = usePermission();

    // Mapping roles to display names and colors
    const roleBadge = {
        admin: { label: "Admin", color: "bg-red-500" },
        manager: { label: "Manager", color: "bg-blue-500" },
        receptionist: { label: "Reception", color: "bg-emerald-500" },
        viewer: { label: "Viewer", color: "bg-gray-500" }
    }[role] || { label: "Staff", color: "bg-gray-500" };

    return (
        <aside className={cn(
            "fixed left-0 top-0 h-screen w-64 bg-[var(--color-aegean-blue)] text-white flex flex-col z-50 shadow-xl transition-transform duration-300",
            className
        )}>
            {/* Branding */}
            <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0 gap-2">
                {settings ? (
                    <LogoBrand settings={settings} variant="light" size="sm" />
                ) : (
                    <span className="font-montserrat font-bold text-lg tracking-[0.1em] uppercase">Kismet</span>
                )}
                <span className="font-montserrat font-bold text-xs tracking-wider text-white/50 uppercase">CMS</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {NAV_ITEMS.filter(item => !item.permission || can(item.permission)).map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onNavigate}
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
                    <Link
                        href="/admin/profile"
                        onClick={onNavigate}
                        className="flex items-center gap-3 px-2 group hover:bg-white/5 rounded-lg transition-colors p-2"
                    >
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
