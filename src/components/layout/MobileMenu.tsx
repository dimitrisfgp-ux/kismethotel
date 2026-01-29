"use client";

import Link from "next/link";
import { ROOMS } from "@/data/rooms";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

import { createPortal } from "react-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
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

    return createPortal(
        <div
            className={cn(
                "fixed inset-0 z-[49] bg-[#2F3437] backdrop-blur-md transition-transform duration-500 ease-premium transform",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}
        >
            <div className="flex flex-col h-full pt-28 pb-10 px-8 space-y-8 overflow-y-auto text-center md:text-left">
                <nav className="flex flex-col space-y-6">
                    {/* Home Link */}
                    <Link
                        href="/"
                        onClick={onClose}
                        className="font-montserrat text-3xl font-bold uppercase tracking-widest text-white animate-slide-up hover:text-[var(--color-sand)] transition-colors"
                        style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}
                    >
                        Home
                    </Link>

                    {/* Rooms Dropdown */}
                    <div className="flex flex-col space-y-4 animate-slide-up" style={{ animationDelay: '50ms', animationFillMode: 'forwards' }}>
                        <button
                            onClick={() => setIsRoomsOpen(!isRoomsOpen)}
                            className="flex items-center justify-center md:justify-start gap-2 font-montserrat text-3xl font-bold uppercase tracking-widest text-white hover:text-[var(--color-sand)] transition-colors focus:outline-none"
                        >
                            Rooms
                            {isRoomsOpen ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
                        </button>

                        {/* Dropdown Content */}
                        <div
                            className={cn(
                                "flex flex-col space-y-4 overflow-hidden transition-all duration-300 ease-in-out pl-0 md:pl-4",
                                isRoomsOpen ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0"
                            )}
                        >
                            {ROOMS.map(room => (
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
                                href="/#rooms"
                                onClick={onClose}
                                className="font-montserrat text-xs uppercase tracking-widest text-[var(--color-sand)] pt-2 hover:text-white transition-colors"
                            >
                                View All Rooms →
                            </Link>
                        </div>
                    </div>

                    {/* Contact Link */}
                    <Link
                        href="/#contact"
                        onClick={onClose}
                        className="font-montserrat text-3xl font-bold uppercase tracking-widest text-white animate-slide-up hover:text-[var(--color-sand)] transition-colors"
                        style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
                    >
                        Contact
                    </Link>
                </nav>

                <div className="w-12 h-[1px] bg-white/20 opacity-0 animate-fade-in mx-auto md:mx-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }} />

                {/* Cleaned up redundant section since we now have the dropdown */}
            </div>
        </div>,
        document.body
    );
}
