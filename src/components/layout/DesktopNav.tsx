"use client";

import Link from "next/link";
import { useState } from "react";
import { RoomsDropdown } from "./RoomsDropdown";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/config/navigation";

interface DesktopNavProps {
    dark?: boolean;
}

export function DesktopNav({ dark = false }: DesktopNavProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const linkClass = cn(
        "font-inter text-sm font-medium uppercase tracking-widest hover:text-[var(--color-accent-gold)] transition-colors py-8",
        dark ? "text-white" : "text-[var(--color-charcoal)]"
    );

    return (
        <nav className="hidden lg:flex items-center space-x-16 h-full">
            {NAV_LINKS.map(link => (
                link.hasDropdown ? (
                    <div
                        key={link.label}
                        className="relative h-full flex items-center"
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                    >
                        <Link href={link.href} className={linkClass}>
                            {link.label}
                        </Link>
                        {isDropdownOpen && <RoomsDropdown />}
                    </div>
                ) : (
                    <Link key={link.label} href={link.href} className={linkClass}>
                        {link.label}
                    </Link>
                )
            ))}
        </nav>
    );
}
