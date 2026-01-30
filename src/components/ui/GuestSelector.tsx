"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface GuestSelectorProps {
    value: number;
    onChange: (val: number) => void;
    customTrigger?: React.ReactNode;
}

export function GuestSelector({ value, onChange, customTrigger }: GuestSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const options = [
        { value: 1, label: "1 Guest, 1 Bed" },
        { value: 2, label: "2 Guests, 1 Bed" },
        { value: 3, label: "3 Guests, 2 Beds" },
        { value: 4, label: "4 Guests, 2 Beds" },
        { value: 5, label: "5 Guests, 3 Beds" },
        { value: 6, label: "6 Guests, 3 Beds" },
    ];

    const currentLabel = options.find(o => o.value === value)?.label || `${value} Guests`;

    return (
        <div className="relative" ref={containerRef}>
            {/* Trigger */}
            <div onClick={() => setIsOpen(!isOpen)}>
                {customTrigger ? customTrigger : (
                    <button className="w-full text-left h-[42px] px-3 border border-[var(--color-sand)] rounded-[var(--radius-subtle)] bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-aegean-blue)] font-inter flex items-center justify-between min-w-[160px]">
                        <span className="truncate">{currentLabel}</span>
                    </button>
                )}
            </div>

            {/* Dropdown / Modal */}
            {isOpen && (
                <>
                    {/* Backdrop (Mobile Only?) - Optional context dependent */}
                    <div
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Menu Container */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none md:absolute md:inset-auto md:top-12 md:left-0 md:translate-x-0">
                        <div className="pointer-events-auto w-[280px] md:w-[240px] bg-white border border-[var(--color-sand)] shadow-2xl md:shadow-lg rounded-card md:rounded-[var(--radius-subtle)] overflow-hidden animate-slide-up p-2 md:p-0">
                            <div className="max-h-[300px] overflow-y-auto">
                                {options.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            onChange(option.value);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "w-full text-left px-4 py-3 text-sm rounded-md md:rounded-none hover:bg-[var(--color-sand)]/20 transition-colors font-inter flex items-center justify-between",
                                            value === option.value ? "bg-[var(--color-aegean-blue)]/5 text-[var(--color-aegean-blue)] font-semibold" : "text-[var(--color-charcoal)]"
                                        )}
                                    >
                                        {option.label}
                                        {value === option.value && <div className="h-2 w-2 rounded-full bg-[var(--color-aegean-blue)]" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
