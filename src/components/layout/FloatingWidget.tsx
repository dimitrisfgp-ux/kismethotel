"use client";

import Image from "next/image";
import { Phone, Mail, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { HotelSettings } from "@/types";
import { useUIContext } from "@/contexts/UIContext";

interface FloatingWidgetProps {
    settings: HotelSettings;
}

// Layout constants used to compute the expanded-bar width to match the visible
// button count exactly. Keeps the open/close transition smooth without Tailwind
// having to know dynamic class names.
const BUTTON_SIZE = 40;
const BUTTON_GAP = 12;
const HORIZONTAL_PADDING = 24; // px-3 left + right

export function FloatingWidget({ settings }: FloatingWidgetProps) {
    const { isFloatingWidgetVisible, isFloatingWidgetOpen, setFloatingWidgetOpen } = useUIContext();

    const hasWhatsApp = !!settings.socials.whatsapp;
    const hasViber = !!settings.socials.viber;
    const hasEmail = !!settings.contact.email;
    const hasPhone = !!settings.contact.phone;

    const buttonCount =
        Number(hasWhatsApp) + Number(hasViber) + Number(hasEmail) + Number(hasPhone);

    // Nothing to show — don't render the FAB at all.
    if (buttonCount === 0) return null;

    const expandedWidthPx = buttonCount * BUTTON_SIZE + (buttonCount - 1) * BUTTON_GAP + HORIZONTAL_PADDING;

    return (
        <div className={cn(
            "fixed bottom-6 right-6 z-50 flex flex-row-reverse items-center gap-3 transition-all duration-500 ease-premium",
            isFloatingWidgetVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20 pointer-events-none"
        )}>
            {/* Main FAB */}
            <button
                onClick={() => setFloatingWidgetOpen(!isFloatingWidgetOpen)}
                aria-label="Toggle Contact Options"
                className={cn(
                    "relative z-10 flex items-center justify-center w-14 h-14 rounded-full shadow-[var(--shadow-hover)] transition-all duration-300 border border-[var(--color-accent-gold)]",
                    isFloatingWidgetOpen ? "bg-[var(--color-deep-med)] rotate-90" : "bg-[var(--color-deep-med)] hover:bg-[var(--color-deep-med)]/90"
                )}
            >
                {isFloatingWidgetOpen ? <X className="h-6 w-6 text-white" /> : <Phone className="h-6 w-6 text-white" />}
            </button>

            {/* Expanded Options Bar */}
            <div
                style={{
                    width: isFloatingWidgetOpen ? `${expandedWidthPx}px` : '0px',
                    paddingLeft: isFloatingWidgetOpen ? '12px' : '0px',
                    paddingRight: isFloatingWidgetOpen ? '12px' : '0px',
                }}
                className={cn(
                    "flex items-center gap-3 bg-[var(--color-deep-med)] border border-[var(--color-accent-gold)] rounded-full transition-all duration-500 ease-premium overflow-hidden shadow-lg h-14",
                    isFloatingWidgetOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8 pointer-events-none"
                )}>
                {hasWhatsApp && (
                    <a href={settings.socials.whatsapp} target="_blank" rel="noopener noreferrer"
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
                )}

                {hasViber && (
                    <a href={settings.socials.viber}
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
                )}

                {hasEmail && (
                    <a href={`mailto:${settings.contact.email}`}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white hover:bg-gray-100 text-[var(--color-aegean-blue)] transition-colors flex-shrink-0 shadow-sm"
                        title="Email Us"
                    >
                        <Mail className="h-5 w-5" />
                    </a>
                )}

                {hasPhone && (
                    <a href={`tel:${settings.contact.phone.replace(/\s/g, '')}`}
                        onClick={(e) => {
                            // On desktop, scroll to footer contact section
                            if (window.innerWidth >= 1024) {
                                e.preventDefault();
                                const contactSection = document.getElementById('contact');
                                if (contactSection) {
                                    contactSection.scrollIntoView({ behavior: 'smooth' });
                                    setFloatingWidgetOpen(false);
                                }
                            }
                        }}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white hover:bg-gray-100 text-[var(--color-aegean-blue)] transition-colors flex-shrink-0 shadow-sm"
                        title="Call Us"
                    >
                        <Phone className="h-5 w-5" />
                    </a>
                )}
            </div>
        </div>
    );
}
