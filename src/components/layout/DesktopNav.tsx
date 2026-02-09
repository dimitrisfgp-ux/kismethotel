"use client";

import Link from "next/link";
import { useState } from "react";
import { RoomsDropdown } from "./RoomsDropdown";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/config/navigation";

interface RoomSummary {
    id: string;
    slug: string;
    name: string;
    sizeSqm: number;
    maxOccupancy: number;
}

interface DesktopNavProps {
    dark?: boolean;
    rooms: RoomSummary[];
}

export function DesktopNav({ dark = false, rooms }: DesktopNavProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const linkClass = cn(
        "font-inter text-sm font-medium uppercase tracking-widest hover:text-[var(--color-accent-gold)] transition-colors py-8",
        dark ? "text-white" : "text-[var(--color-charcoal)]"
    );

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.includes("#")) {
            const id = href.split("#")[1];
            const element = document.getElementById(id);
            if (element) {
                e.preventDefault();
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

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
                        <Link
                            href={link.href}
                            className={linkClass}
                            onClick={(e) => handleNavClick(e, link.href)}
                        >
                            {link.label}
                        </Link>
                        {isDropdownOpen && <RoomsDropdown rooms={rooms} />}
                    </div>
                ) : (
                    <Link
                        key={link.label}
                        href={link.href}
                        className={linkClass}
                        onClick={(e) => handleNavClick(e, link.href)}
                    >
                        {link.label}
                    </Link>
                )
            ))}
        </nav>
    );
}
