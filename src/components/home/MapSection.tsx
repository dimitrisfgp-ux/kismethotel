"use client";

import dynamic from "next/dynamic";
import { Convenience } from "@/types";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

// Dynamically import map to avoid SSR issues with Leaflet
const InteractiveMap = dynamic(() => import("@/components/ui/InteractiveMap"), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center w-full h-full bg-[var(--color-sand)]">
            <span className="font-montserrat text-sm text-[var(--color-charcoal)] opacity-50 uppercase tracking-widest animate-pulse">Loading Map...</span>
        </div>
    ),
});

interface MapSectionProps {
    conveniences: Convenience[];
}

export function MapSection({ conveniences }: MapSectionProps) {
    return (
        <section className="relative w-full h-[75vh] min-h-[550px] bg-[var(--color-sand)] overflow-hidden">
            {/* Interactive Map */}
            <div className="absolute inset-0 z-0">
                <InteractiveMap
                    conveniences={conveniences}
                    center={[35.33965, 25.13285]}
                    highlightedTypes={null}
                />
            </div>

            {/* Overlay Gradient */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[var(--color-warm-white)] to-transparent pointer-events-none" />

            {/* Address Card */}
            <div className="absolute bottom-8 left-8 z-20 bg-white/90 backdrop-blur-sm p-6 rounded-card shadow-lg border border-[var(--color-sand)] max-w-xs animate-fade-in">
                <h3 className="font-montserrat text-sm font-bold uppercase tracking-widest text-[var(--color-aegean-blue)] mb-2">Location</h3>
                <p className="font-inter text-sm text-[var(--color-charcoal)] leading-relaxed">
                    Pl. Rhga Feraioi,<br />
                    Iraklio 712 01,<br />
                    Crete, Greece
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-60">
                    <MapPin className="w-4 h-4" />
                    <span>City Center</span>
                </div>
            </div>
        </section>
    );
}
