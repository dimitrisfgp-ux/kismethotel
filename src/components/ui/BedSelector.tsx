"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { BedDouble, Bed } from "lucide-react";

interface BedSelectorProps {
    doubleBeds: number;
    setDoubleBeds: (val: number) => void;
    singleBeds: number;
    setSingleBeds: (val: number) => void;
    customTrigger?: React.ReactNode;
    maxDoubleBeds?: number;
    maxSingleBeds?: number;
}

export function BedSelector({
    doubleBeds,
    setDoubleBeds,
    singleBeds,
    setSingleBeds,
    customTrigger,
    maxDoubleBeds = 4,
    maxSingleBeds = 4
}: BedSelectorProps) {
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

    // Helper to generate label
    const getLabel = () => {
        if (doubleBeds === 0 && singleBeds === 0) return "Any Beds";
        const parts = [];
        if (doubleBeds > 0) parts.push(`${doubleBeds} Dbl`);
        if (singleBeds > 0) parts.push(`${singleBeds} Sgl`);
        return parts.join(", ");
    };

    return (
        <div className="relative" ref={containerRef}>
            {/* Trigger */}
            <div onClick={() => setIsOpen(!isOpen)}>
                {customTrigger ? customTrigger : (
                    <button className="w-full text-left h-[42px] px-3 border border-[var(--color-sand)] rounded-[var(--radius-subtle)] bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-aegean-blue)] font-inter flex items-center justify-between min-w-[140px]">
                        <span className="truncate">{getLabel()}</span>
                    </button>
                )}
            </div>

            {/* Dropdown */}
            {isOpen && (
                <>
                    {/* Backdrop (Mobile Only?) */}
                    <div
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Menu Container */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none md:absolute md:inset-auto md:top-12 md:left-0 md:translate-x-0">
                        <div className="pointer-events-auto w-[320px] md:w-[300px] bg-white border border-[var(--color-sand)] shadow-2xl md:shadow-lg rounded-card md:rounded-[var(--radius-subtle)] overflow-hidden animate-slide-up p-4">

                            <div className="grid grid-cols-2 gap-4">
                                {/* Double Beds Column */}
                                <div>
                                    <span className="text-[10px] uppercase tracking-wider opacity-60 font-semibold mb-2 block flex items-center gap-1">
                                        <BedDouble className="w-3 h-3" /> Double
                                    </span>
                                    <div className="flex flex-col gap-1">
                                        {Array.from({ length: maxDoubleBeds + 1 }, (_, i) => i).map(num => (
                                            <button
                                                key={`double-${num}`}
                                                onClick={() => setDoubleBeds(num)}
                                                className={cn(
                                                    "w-full text-left px-3 py-2 text-sm rounded-[var(--radius-subtle)] hover:bg-[var(--color-sand)]/20 transition-colors font-inter flex items-center justify-between",
                                                    doubleBeds === num ? "bg-[var(--color-aegean-blue)]/5 text-[var(--color-aegean-blue)] font-semibold" : "text-[var(--color-charcoal)]"
                                                )}
                                            >
                                                <span>{num === 0 ? "Any" : num}</span>
                                                {doubleBeds === num && <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-aegean-blue)]" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Single Beds Column */}
                                <div>
                                    <span className="text-[10px] uppercase tracking-wider opacity-60 font-semibold mb-2 block flex items-center gap-1">
                                        <Bed className="w-3 h-3" /> Single
                                    </span>
                                    <div className="flex flex-col gap-1">
                                        {Array.from({ length: maxSingleBeds + 1 }, (_, i) => i).map(num => (
                                            <button
                                                key={`single-${num}`}
                                                onClick={() => setSingleBeds(num)}
                                                className={cn(
                                                    "w-full text-left px-3 py-2 text-sm rounded-[var(--radius-subtle)] hover:bg-[var(--color-sand)]/20 transition-colors font-inter flex items-center justify-between",
                                                    singleBeds === num ? "bg-[var(--color-aegean-blue)]/5 text-[var(--color-aegean-blue)] font-semibold" : "text-[var(--color-charcoal)]"
                                                )}
                                            >
                                                <span>{num === 0 ? "Any" : num}</span>
                                                {singleBeds === num && <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-aegean-blue)]" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Done Button for Mobile/Comfort */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-full mt-4 bg-[var(--color-aegean-blue)] text-white py-2 rounded-[var(--radius-subtle)] text-sm font-semibold hover:bg-[var(--color-aegean-blue)]/90 transition-colors"
                            >
                                Done
                            </button>

                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
