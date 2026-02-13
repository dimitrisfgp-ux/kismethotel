"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { AdminSidebar } from "./AdminSidebar";
import type { User as AuthUser } from "@supabase/supabase-js";

interface AdminMobileHeaderProps {
    user: AuthUser | null;
    role: string;
    fullName: string | null;
}

export function AdminMobileHeader({ user, role, fullName }: AdminMobileHeaderProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="md:hidden sticky top-0 z-40 bg-[var(--color-aegean-blue)] text-white px-4 h-16 flex items-center justify-between shadow-md">
            {/* Branding */}
            <span className="font-montserrat font-bold text-lg tracking-[0.1em] uppercase">
                Kismét CMS
            </span>

            {/* Menu Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 hover:bg-white/10 rounded-md transition-colors"
                aria-label="Open Menu"
            >
                <Menu className="h-6 w-6" />
            </button>

            {/* Drawer */}
            <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <AdminSidebar
                    user={user}
                    role={role}
                    fullName={fullName}
                    className="relative w-full h-full shadow-none"
                    onNavigate={() => setIsOpen(false)}
                />
            </Sheet>
        </div>
    );
}
