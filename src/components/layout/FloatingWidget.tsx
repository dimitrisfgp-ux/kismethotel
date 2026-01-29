"use client";

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
            "fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-4 transition-all duration-500 ease-premium",
            isFloatingWidgetVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20 pointer-events-none"
        )}>
            {/* Expanded Options */}
            {isOpen && (
                <div className="flex flex-col space-y-3 animate-slide-up">
                    <a href="https://wa.me/30123456789" target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-end space-x-2 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:scale-105 transition-transform">
                        <span className="font-bold text-sm">WhatsApp</span>
                        <MessageCircle className="h-5 w-5" />
                    </a>
                    <a href="tel:+302810123456"
                        className="flex items-center justify-end space-x-2 bg-[var(--color-aegean-blue)] text-white px-4 py-3 rounded-full shadow-lg hover:scale-105 transition-transform">
                        <span className="font-bold text-sm">Call Us</span>
                        <Phone className="h-5 w-5" />
                    </a>
                </div>
            )}

            {/* Main FAB */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center justify-center w-14 h-14 rounded-full shadow-[var(--shadow-hover)] transition-all duration-300",
                    isOpen ? "bg-[var(--color-charcoal)] rotate-90" : "bg-[var(--color-aegean-blue)] hover:bg-[var(--color-deep-med)]"
                )}
            >
                {isOpen ? <X className="h-6 w-6 text-white" /> : <MessageCircle className="h-6 w-6 text-white" />}
            </button>
        </div>
    );
}
