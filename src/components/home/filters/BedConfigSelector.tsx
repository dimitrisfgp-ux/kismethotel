"use client";

import { BedDouble, Bed } from "lucide-react";
import { RoomFilters } from "@/types";

interface BedConfigSelectorProps {
    localFilters: RoomFilters;
    setLocalFilters: (filters: RoomFilters) => void;
    maxDoubleBeds: number;
    maxSingleBeds: number;
}

export function BedConfigSelector({ localFilters, setLocalFilters, maxDoubleBeds, maxSingleBeds }: BedConfigSelectorProps) {
    return (
        <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-white">
                <BedDouble className="w-4 h-4 text-[var(--color-accent-gold)]" /> Bed Configuration
            </label>

            <div className="grid grid-cols-2 gap-4">
                {/* Double Beds */}
                <div>
                    <span className="text-[10px] uppercase tracking-wider text-white/60 font-semibold mb-2 block flex items-center gap-1">
                        <BedDouble className="w-3 h-3" /> Double Beds
                    </span>
                    <div className="flex gap-2">
                        {Array.from({ length: maxDoubleBeds + 1 }, (_, i) => i).map(num => (
                            <button
                                key={num}
                                onClick={() => setLocalFilters({ ...localFilters, doubleBeds: num })}
                                className={`w-10 h-10 rounded-full border text-sm transition-all ${localFilters.doubleBeds === num ? 'bg-[var(--color-accent-gold)] text-white border-[var(--color-accent-gold)]' : 'border-white/20 text-white hover:border-[var(--color-accent-gold)]'}`}
                            >
                                {num === 0 ? "Any" : num}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Single Beds */}
                <div>
                    <span className="text-[10px] uppercase tracking-wider text-white/60 font-semibold mb-2 block flex items-center gap-1">
                        <Bed className="w-3 h-3" /> Single Beds
                    </span>
                    <div className="flex gap-2">
                        {Array.from({ length: maxSingleBeds + 1 }, (_, i) => i).map(num => (
                            <button
                                key={num}
                                onClick={() => setLocalFilters({ ...localFilters, singleBeds: num })}
                                className={`w-10 h-10 rounded-full border text-sm transition-all ${localFilters.singleBeds === num ? 'bg-[var(--color-accent-gold)] text-white border-[var(--color-accent-gold)]' : 'border-white/20 text-white hover:border-[var(--color-accent-gold)]'}`}
                            >
                                {num === 0 ? "Any" : num}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
