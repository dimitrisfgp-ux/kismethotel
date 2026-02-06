"use client";

import { BedDouble, Bed } from "lucide-react";
import { RoomFilters } from "@/types";
import { FilterSectionHeader } from "./FilterSectionHeader";

interface BedConfigSelectorProps {
    localFilters: RoomFilters;
    setLocalFilters: (filters: RoomFilters) => void;
    maxDoubleBeds: number;
    maxSingleBeds: number;
}

export function BedConfigSelector({ localFilters, setLocalFilters, maxDoubleBeds, maxSingleBeds }: BedConfigSelectorProps) {
    return (
        <div className="space-y-4">
            <FilterSectionHeader
                icon={BedDouble}
                title="Bed Configuration"
            />

            <div className="grid grid-cols-2 gap-4">
                <BedCountRow
                    icon={BedDouble}
                    label="Double Beds"
                    count={localFilters.doubleBeds}
                    max={maxDoubleBeds}
                    onChange={(val) => setLocalFilters({ ...localFilters, doubleBeds: val })}
                />
                <BedCountRow
                    icon={Bed}
                    label="Single Beds"
                    count={localFilters.singleBeds}
                    max={maxSingleBeds}
                    onChange={(val) => setLocalFilters({ ...localFilters, singleBeds: val })}
                />
            </div>
        </div>
    );
}

function BedCountRow({ icon: Icon, label, count, max, onChange }: { icon: any, label: string, count: number, max: number, onChange: (val: number) => void }) {
    return (
        <div>
            <span className="text-[10px] uppercase tracking-wider text-white/60 font-semibold mb-2 block flex items-center gap-1">
                <Icon className="w-3 h-3" /> {label}
            </span>
            <div className="flex gap-2">
                {Array.from({ length: max + 1 }, (_, i) => i).map(num => (
                    <button
                        key={num}
                        onClick={() => onChange(num)}
                        className={`w-10 h-10 rounded-full border text-sm transition-all ${count === num ? 'bg-[var(--color-accent-gold)] text-white border-[var(--color-accent-gold)]' : 'border-white/20 text-white hover:border-[var(--color-accent-gold)]'}`}
                    >
                        {num === 0 ? "Any" : num}
                    </button>
                ))}
            </div>
        </div>
    );
}
