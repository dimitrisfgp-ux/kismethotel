"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DesktopNav } from "./DesktopNav";
import { MobileMenu } from "./MobileMenu";
import { BurgerIcon } from "./BurgerIcon";
import { Container } from "../ui/Container";
import { useScroll } from "@/hooks/useScroll";

export interface HeaderProps {
    settings?: { name: string }; // Optional because layout might not pass it initially
}

export function Header({ settings }: HeaderProps) {
    const { isScrolled } = useScroll({ threshold: 50 });
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const hotelName = settings?.name || "Kismet";

    // Logic: 
    // Top of page (Hero): Transparent bg, White logo/text. (dark prop = true)
    // Scrolled: White bg, Charcoal logo/text. (dark prop = false)
    // Mobile Menu Open: White bg equivalent logic (managed by menu overlay).

    const isDark = !isScrolled && !isMobileOpen; // "Dark" means dark mode styles (white text)

    return (
        <header
            className={cn(
                "fixed top-0 w-full z-50 transition-all duration-300 ease-premium h-16 md:h-[var(--header-height)]",
                (isScrolled && !isMobileOpen) ? "bg-white/95 backdrop-blur-sm shadow-[var(--shadow-sm)]" : "bg-transparent"
            )}
        >
            <Container className="h-full flex items-center justify-between relative">
                {/* Logo */}
                <Link href="/" className="z-50 relative">
                    <span className={cn(
                        "font-montserrat font-bold text-2xl tracking-[0.2em] uppercase transition-colors duration-300",
                        isMobileOpen ? "text-white" : (isDark ? "text-white" : "text-[var(--color-charcoal)]")
                    )}>
                        {hotelName}
                    </span>
                </Link>

                {/* Desktop Nav */}
                <DesktopNav dark={isDark} />

                {/* Mobile Trigger */}
                <div className="lg:hidden z-50 h-full flex items-center">
                    <BurgerIcon
                        isOpen={isMobileOpen}
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                        dark={isDark || isMobileOpen} // White if top/dark mode OR if menu is open (dark bg)
                    />
                </div>

                {/* Mobile Menu Panel */}
                <MobileMenu isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
            </Container>
        </header>
    );
}
