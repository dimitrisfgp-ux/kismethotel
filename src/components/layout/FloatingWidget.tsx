"use client";

import Image from "next/image";

import { useState } from "react";
import { MessageCircle, Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ... imports
import { useUIContext } from "@/contexts/UIContext";

export function FloatingWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const { isFloatingWidgetVisible } = useUIContext();

    // Close only if visibly hidden? 
    // If hidden, isOpen state doesn't matter much but let's keep logic simple.

    return (
        <div className={cn(
            "fixed bottom-6 right-6 z-50 flex flex-row-reverse items-center gap-3 transition-all duration-500 ease-premium",
            isFloatingWidgetVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20 pointer-events-none"
        )}>
            {/* Main FAB */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Contact Options"
                className={cn(
                    "relative z-10 flex items-center justify-center w-14 h-14 rounded-full shadow-[var(--shadow-hover)] transition-all duration-300",
                    isOpen ? "bg-[var(--color-charcoal)] rotate-90" : "bg-[var(--color-aegean-blue)] hover:bg-[var(--color-deep-med)]"
                )}
            >
                {isOpen ? <X className="h-6 w-6 text-white" /> : <Phone className="h-6 w-6 text-white" />}
            </button>

            {/* Expanded Options Bar */}
            <div className={cn(
                "flex items-center gap-3 bg-[var(--color-aegean-blue)] rounded-full transition-all duration-500 ease-premium overflow-hidden shadow-lg",
                isOpen ? "w-[170px] px-3 py-2 opacity-100 translate-x-0" : "w-0 px-0 opacity-0 translate-x-8 pointer-events-none"
            )}>
                {/* WhatsApp */}
                <a href="https://wa.me/30123456789" target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white hover:bg-gray-100 transition-colors flex-shrink-0 shadow-sm"
                    title="WhatsApp"
                >
                    <Image
                        src="/images/whatsapp-logo-4454.svg"
                        alt="WhatsApp"
                        width={24}
                        height={24}
                        className="object-contain"
                    />
                </a>

                {/* Viber */}
                <a href="viber://chat?number=%2B30123456789"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white hover:bg-gray-100 transition-colors flex-shrink-0 shadow-sm"
                    title="Viber"
                >
                    <Image
                        src="/images/viber-logo-14126.svg"
                        alt="Viber"
                        width={24}
                        height={24}
                        className="object-contain"
                    />
                </a>

                {/* Phone */}
                <a href="tel:+302810123456"
                    onClick={(e) => {
                        // On desktop, scroll to footer contact section
                        if (window.innerWidth >= 1024) {
                            e.preventDefault();
                            const contactSection = document.getElementById('contact');
                            if (contactSection) {
                                contactSection.scrollIntoView({ behavior: 'smooth' });
                                setIsOpen(false);
                            }
                        }
                    }}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white hover:bg-gray-100 text-[var(--color-aegean-blue)] transition-colors flex-shrink-0 shadow-sm"
                    title="Call Us"
                >
                    <Phone className="h-5 w-5" />
                </a>
            </div>
        </div>
    );
}
