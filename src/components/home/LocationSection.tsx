"use client";

import { useState, useRef, useEffect } from "react";
import { Convenience, LocationCategory } from "@/types";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useUIContext } from "@/contexts/UIContext";
import { MapMobileWidget } from "./MapMobileWidget";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { iconMap } from "@/components/ui/icons/iconMap";
import { MapPin } from "lucide-react";

// Dynamic import for Map to avoid SSR issues
const InteractiveMap = dynamic(() => import("../ui/InteractiveMap"), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-[var(--color-sand)] animate-pulse" />
});

interface LocationSectionProps {
    conveniences: Convenience[];
    categories: LocationCategory[];
    content?: {
        title: string;
        subtitle: string;
    };
}

export function LocationSection({ conveniences, categories, content }: LocationSectionProps) {
    const [activeCategoryIndex, setActiveCategoryIndex] = useState<number | null>(null);
    const [isMobileWidgetVisible, setIsMobileWidgetVisible] = useState(false);
    const [hasMapLoaded, setHasMapLoaded] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const { setFloatingWidgetVisible } = useUIContext();

    // Lazy Load Map Trigger (200px before viewport)
    const isNearViewport = useIntersectionObserver(sectionRef, {
        rootMargin: "200px",
        threshold: 0
    });

    useEffect(() => {
        if (isNearViewport && !hasMapLoaded) {
            setHasMapLoaded(true);
        }
    }, [isNearViewport, hasMapLoaded]);

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

    const activeCategoryId = activeCategoryIndex !== null ? categories[activeCategoryIndex].id : null;

    return (
        <section ref={sectionRef} className="flex flex-col md:flex-row w-full h-auto md:h-[95vh] min-h-[600px] border-y border-[var(--color-sand)] relative">

            {/* Mobile-Only Heading */}
            <div className="md:hidden w-full bg-[var(--color-warm-white)] py-8 px-4 text-center border-b border-[var(--color-sand)]">
                <h2 className="font-montserrat text-xl font-bold uppercase tracking-widest text-[var(--color-charcoal)] mb-2">
                    {content?.title || "Easy Access to Conveniences"}
                </h2>
                <div className="w-12 h-1 bg-[var(--color-aegean-blue)] mx-auto" />
                <p className="font-inter text-sm text-[var(--color-charcoal)] opacity-70 mt-2">
                    {content?.subtitle || "Discover local essentials just steps away."}
                </p>
            </div>

            {/* Main: Interactive Map */}
            <div className="w-full md:flex-1 relative h-[80vh] md:h-full bg-[var(--color-sand)] overflow-hidden order-2 md:order-1">
                {hasMapLoaded && (
                    <InteractiveMap
                        conveniences={conveniences}
                        categories={categories}
                        activeCategoryId={activeCategoryId}
                    />
                )}

                {/* Mobile Floating Category Widget (Bottom of Map) */}
                <MapMobileWidget
                    categories={categories}
                    activeCategoryIndex={activeCategoryIndex}
                    onCategoryClick={handleCategoryClick}
                    isVisible={isMobileWidgetVisible}
                />
            </div>

            {/* Sidebar: Categories (Desktop) */}
            <div className="hidden md:flex flex-col w-[380px] bg-[var(--color-warm-white)] border-l border-[var(--color-sand)] relative z-20 order-1 md:order-2">
                <div className="p-12 pb-6 border-b border-[var(--color-sand)]">
                    <h2 className="font-montserrat text-2xl font-bold uppercase tracking-widest text-[var(--color-charcoal)] mb-4">
                        {content?.title || "Easy Access to Conveniences"}
                    </h2>
                    <div className="w-16 h-1 bg-[var(--color-aegean-blue)] mb-6" />
                    <p className="font-inter text-[var(--color-charcoal)] opacity-70 leading-relaxed">
                        {content?.subtitle || "Discover local essentials just steps away from your sanctuary."}
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {categories.map((cat, index) => {
                        const Icon = iconMap[cat.icon] || MapPin;
                        const isActive = activeCategoryIndex === index;

                        return (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryClick(index)}
                                className={cn(
                                    "w-full flex items-center justify-between p-6 border-b border-[var(--color-sand)] transition-all duration-300 group hover:bg-[var(--color-sand)]/20",
                                    isActive ? "bg-[var(--color-sand)]/30 border-l-4 border-l-[var(--color-aegean-blue)] pl-[20px]" : "pl-6"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300",
                                            isActive ? "bg-[var(--color-aegean-blue)]" : "bg-white border border-[var(--color-sand)] group-hover:border-[var(--color-aegean-blue)]"
                                        )}
                                        style={{
                                            backgroundColor: isActive ? cat.color : undefined,
                                            borderColor: isActive ? undefined : 'var(--color-sand)'
                                        }}
                                    >
                                        <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-[var(--color-charcoal)]")} />
                                    </div>
                                    <span className={cn(
                                        "font-montserrat font-bold text-sm uppercase tracking-wider transition-colors",
                                        isActive ? "text-[var(--color-aegean-blue)]" : "text-[var(--color-charcoal)]"
                                    )}
                                        style={{ color: isActive ? cat.color : undefined }}
                                    >
                                        {cat.label}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
