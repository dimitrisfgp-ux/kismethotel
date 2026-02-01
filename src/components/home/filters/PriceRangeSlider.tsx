"use client";

import { Euro } from "lucide-react";
import { RoomFilters } from "@/types";

interface PriceRangeSliderProps {
    localFilters: RoomFilters;
    setLocalFilters: (filters: RoomFilters) => void;
    minPrice: number;
    maxPrice: number;
}

export function PriceRangeSlider({ localFilters, setLocalFilters, minPrice, maxPrice }: PriceRangeSliderProps) {
    return (
        <div>
            <div className="flex justify-between mb-4">
                <label className="block text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-white">
                    <Euro className="w-4 h-4 text-[var(--color-accent-gold)]" /> Price Range
                </label>
                <span className="text-xs font-inter text-white">
                    €{localFilters.priceRange[0]} - €{localFilters.priceRange[1]}
                </span>
            </div>
            <input
                type="range"
                min={minPrice}
                max={maxPrice}
                step="10"
                value={localFilters.priceRange[1]}
                onChange={(e) => setLocalFilters({ ...localFilters, priceRange: [localFilters.priceRange[0], Number(e.target.value)] })}
                className="w-full accent-[var(--color-accent-gold)]"
            />
        </div>
    );
}
