"use client";

import { useState } from "react";
import { Convenience } from "@/types";
import dynamic from "next/dynamic";
import { Bus, ShoppingCart, Pill, Car, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";

// Dynamic import for Map to avoid SSR issues
const InteractiveMap = dynamic(() => import("../ui/InteractiveMap"), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-[var(--color-sand)] animate-pulse" />
});

interface LocationSectionProps {
    conveniences: Convenience[];
}

const CATEGORIES = [
    { label: "KTEL", types: ["Bus"], icon: <Bus className="h-6 w-6" /> },
    { label: "Rentals", types: ["Car Rental"], icon: <Car className="h-6 w-6" /> },
    { label: "SuperMarkets", types: ["Supermarket"], icon: <ShoppingCart className="h-6 w-6" /> },
    { label: "Pharmacies", types: ["Pharmacy"], icon: <Pill className="h-6 w-6" /> },
    { label: "Restaurants & Cafe", types: ["Restaurant", "Cafe", "Bar"], icon: <Utensils className="h-6 w-6" /> },
];

// ... imports ...
import { useRef, useEffect } from "react";
import { MapMobileWidget } from "./MapMobileWidget";
import { useUIContext } from "@/contexts/UIContext";

// ... existing code ...

export function LocationSection({ conveniences }: LocationSectionProps) {
    const [activeCategoryIndex, setActiveCategoryIndex] = useState<number | null>(null);
    const [isMobileWidgetVisible, setIsMobileWidgetVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const { setFloatingWidgetVisible } = useUIContext();

    const handleCategoryClick = (index: number) => {
        // Toggle if same clicked
        setActiveCategoryIndex(prev => prev === index ? null : index);
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsMobileWidgetVisible(entry.isIntersecting);
                // When map is visible (intersecting), hide global widget (false)
                // When map is NOT visible, show global widget (true)
                setFloatingWidgetVisible(!entry.isIntersecting);
            },
            {
                threshold: 0,
                // Strict "Center Focus": Match RoomsGrid to prevent overlap.
                rootMargin: "-45% 0px -45% 0px"
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            observer.disconnect();
            setFloatingWidgetVisible(true); // Ensure restored on leave/unmount
        };
    }, [setFloatingWidgetVisible]);

    const activeTypes = activeCategoryIndex !== null ? CATEGORIES[activeCategoryIndex].types : null;

    return (
        <section ref={sectionRef} className="flex flex-col md:flex-row w-full h-[95vh] min-h-[600px] border-y border-[var(--color-sand)] relative">

            {/* Mobile-Only Heading */}
            <div className="md:hidden w-full bg-[var(--color-warm-white)] py-8 px-4 text-center border-b border-[var(--color-sand)]">
                <h2 className="font-montserrat text-xl font-bold uppercase tracking-widest text-[var(--color-charcoal)] mb-2">Easy Access to Conveniences</h2>
                <div className="w-12 h-1 bg-[var(--color-aegean-blue)] mx-auto" />
                <p className="font-inter text-sm text-[var(--color-charcoal)] opacity-70 mt-2">
                    Discover local essentials just steps away.
                </p>
            </div>

            {/* Main: Interactive Map */}
            <div className="flex-1 relative h-[95vh] md:h-full bg-[var(--color-sand)] overflow-hidden order-2 md:order-1">
                <InteractiveMap
                    conveniences={conveniences}
                    center={[35.33965, 25.13285]}
                    highlightedTypes={activeTypes}
                />
            </div>

            {/* Sidebar: Conveniences */}
            <div className="w-full md:w-80 lg:w-96 bg-[var(--color-warm-white)]/95 backdrop-blur h-auto md:h-full border-l border-[var(--color-sand)] overflow-y-auto order-1 md:order-2 z-10 shadow-lg md:shadow-none hidden md:block">
                <div className="p-8 h-full flex flex-col">
                    <div className="mb-8">
                        <h2 className="font-montserrat text-xl font-bold uppercase tracking-widest text-[var(--color-charcoal)] mb-2">EASY ACCESS TO CONVENIENCES</h2>
                        <div className="w-12 h-1 bg-[var(--color-aegean-blue)] mb-4" />
                        <p className="font-inter text-sm text-[var(--color-charcoal)] opacity-70">
                            Discover local essentials just steps away.
                        </p>
                    </div>

                    <div className="space-y-3 flex-1">
                        {CATEGORIES.map((cat, index) => {
                            const isActive = activeCategoryIndex === index;

                            return (
                                <button
                                    key={cat.label}
                                    onClick={() => handleCategoryClick(index)}
                                    className={cn(
                                        "w-full flex items-center p-4 rounded-[var(--radius-subtle)] border transition-all duration-300 text-left group",
                                        isActive
                                            ? "bg-white border-[var(--color-aegean-blue)] shadow-md translate-x-1"
                                            : "bg-white/50 border-transparent hover:bg-white hover:border-[var(--color-sand)] hover:shadow-sm"
                                    )}
                                >
                                    <div className={cn(
                                        "p-2 rounded-full mr-4 transition-colors",
                                        isActive
                                            ? "bg-[var(--color-aegean-blue)] text-white"
                                            : "bg-[var(--color-sand)]/30 text-[var(--color-aegean-blue)] group-hover:bg-[var(--color-aegean-blue)] group-hover:text-white"
                                    )}>
                                        {cat.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={cn(
                                            "font-montserrat text-sm font-bold uppercase tracking-wider",
                                            isActive ? "text-[var(--color-aegean-blue)]" : "text-[var(--color-charcoal)]"
                                        )}>
                                            {cat.label}
                                        </h4>
                                        <span className="text-[10px] uppercase tracking-widest opacity-50 font-semibold group-hover:opacity-80">View Map</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <MapMobileWidget
                isVisible={isMobileWidgetVisible}
                categories={CATEGORIES}
                activeCategoryIndex={activeCategoryIndex}
                onCategorySelect={handleCategoryClick}
            />
        </section>
    );
}
