"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import { NAV_LINKS } from "@/config/navigation";

interface RoomSummary {
    id: string;
    slug: string;
    name: string;
}

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    rooms: RoomSummary[];
}

export function MobileMenu({ isOpen, onClose, rooms }: MobileMenuProps) {
    const [mounted, setMounted] = useState(false);
    const [isRoomsOpen, setIsRoomsOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }, [isOpen]);

    if (!mounted) return null;

    // Use portal to ensure it overlays everything
    return createPortal(
        <div
            className={cn(
                "fixed inset-0 z-[49] bg-[var(--color-aegean-blue)] backdrop-blur-md transition-transform duration-500 ease-premium transform",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}
        >
            <div className="flex flex-col h-full pt-28 pb-10 px-8 space-y-8 overflow-y-auto text-center md:text-left">
                <nav className="flex flex-col space-y-6">
                    {NAV_LINKS.map((link, index) => (
                        link.hasDropdown ? (
                            /* Rooms Dropdown Logic */
                            <div key={link.label} className="flex flex-col space-y-4 animate-slide-up" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}>
                                <button
                                    onClick={() => setIsRoomsOpen(!isRoomsOpen)}
                                    className="flex items-center justify-center md:justify-start gap-2 font-montserrat text-3xl font-bold uppercase tracking-widest text-white hover:text-[var(--color-sand)] transition-colors focus:outline-none"
                                >
                                    {link.label}
                                    {isRoomsOpen ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
                                </button>

                                {/* Dropdown Content */}
                                <div
                                    className={cn(
                                        "flex flex-col space-y-4 overflow-hidden transition-all duration-300 ease-in-out pl-0 md:pl-4",
                                        isRoomsOpen ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0"
                                    )}
                                >
                                    {rooms.map(room => (
                                        <Link
                                            key={room.id}
                                            href={`/rooms/${room.slug}`}
                                            onClick={onClose}
                                            className="font-inter text-lg text-white/80 hover:text-white transition-colors block py-1"
                                        >
                                            {room.name}
                                        </Link>
                                    ))}
                                    <Link
                                        href={link.href}
                                        onClick={onClose}
                                        className="font-montserrat text-xs uppercase tracking-widest text-[var(--color-sand)] pt-2 hover:text-white transition-colors"
                                    >
                                        View All Rooms →
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            /* Standard Link */
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={onClose}
                                className="font-montserrat text-3xl font-bold uppercase tracking-widest text-white animate-slide-up hover:text-[var(--color-sand)] transition-colors"
                                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
                            >
                                {link.label}
                            </Link>
                        )
                    ))}
                </nav>

                <div className="w-12 h-[1px] bg-white/20 opacity-0 animate-fade-in mx-auto md:mx-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }} />
            </div>
        </div>,
        document.body
    );
}
