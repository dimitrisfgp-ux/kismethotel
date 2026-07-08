"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { DesktopNav } from "./DesktopNav";
import { MobileMenu } from "./MobileMenu";
import { BurgerIcon } from "./BurgerIcon";
import { Container } from "../ui/Container";
import { useScroll } from "@/hooks/useScroll";
import { LogoBrand } from "../ui/LogoBrand";
import { HotelSettings } from "@/types";

interface RoomSummary {
    id: string;
    slug: string;
    name: string;
    sizeSqm: number;
    maxOccupancy: number;
}

export interface HeaderProps {
    settings?: Pick<HotelSettings, 'name' | 'logoMode' | 'logoIconUrl' | 'logoTextUrl'>;
    rooms: RoomSummary[];
}

const DEFAULT_LOGO_SETTINGS: Pick<HotelSettings, 'name' | 'logoMode' | 'logoIconUrl' | 'logoTextUrl' | 'description'> = {
    name: 'Kismet',
    description: '',
    logoMode: 'image',
    logoIconUrl: '/images/Brand%20Media/kismet-logo-icon.svg',
    logoTextUrl: '/images/Brand%20Media/kismet-logo-text.svg'
};

export function Header({ settings, rooms }: HeaderProps) {
    const { isScrolled } = useScroll({ threshold: 50 });
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const pathname = usePathname();
    // Homepage: no navigation — just the logo, centered.
    const isHome = pathname === "/";

    // Logic: 
    // Top of page (Hero): Transparent bg, White logo/text. (dark prop = true)
    // Scrolled: White bg, Charcoal logo/text. (dark prop = false)
    // Mobile Menu Open: White bg equivalent logic (managed by menu overlay).

    const isDark = !isScrolled && !isMobileOpen; // "Dark" means dark mode styles (white text)
    const logoVariant = isMobileOpen ? 'light' : (isDark ? 'light' : 'dark');

    return (
        <header
            className={cn(
                "fixed top-0 w-full z-50 transition-all duration-300 ease-premium h-16 md:h-[var(--header-height)]",
                (isScrolled && !isMobileOpen)
                    ? "bg-white/95 backdrop-blur-sm shadow-[var(--shadow-sm)]"
                    // Soft darken behind the header so white nav text stays readable
                    // over bright video frames. Fades to transparent at bottom edge.
                    : "bg-gradient-to-b from-black/40 to-transparent"
            )}
        >
            <Container className={cn("h-full flex items-center relative", isHome ? "justify-center" : "justify-between")}>
                {/* Logo */}
                <Link href="/" className="z-50 relative">
                    <LogoBrand
                        settings={{ ...DEFAULT_LOGO_SETTINGS, ...settings }}
                        variant={logoVariant}
                        size="sm"
                    />
                </Link>

                {/* Navigation — hidden entirely on the homepage */}
                {!isHome && (
                    <>
                        {/* Desktop Nav */}
                        <DesktopNav dark={isDark} rooms={rooms} />

                        {/* Mobile Trigger */}
                        <div className="lg:hidden z-50 h-full flex items-center">
                            <BurgerIcon
                                isOpen={isMobileOpen}
                                onClick={() => setIsMobileOpen(!isMobileOpen)}
                                dark={isDark || isMobileOpen} // White if top/dark mode OR if menu is open (dark bg)
                            />
                        </div>

                        {/* Mobile Menu Panel */}
                        <MobileMenu isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} rooms={rooms} />
                    </>
                )}
            </Container>
        </header>
    );
}
