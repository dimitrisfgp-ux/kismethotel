"use client";

import { Euro } from "lucide-react";
import { RoomFilters } from "@/types";
import { FilterSectionHeader } from "./FilterSectionHeader";

interface PriceRangeSliderProps {
    localFilters: RoomFilters;
    setLocalFilters: (filters: RoomFilters) => void;
    minPrice: number;
    maxPrice: number;
}

export function PriceRangeSlider({ localFilters, setLocalFilters, minPrice, maxPrice }: PriceRangeSliderProps) {
    return (
        <div>
            <FilterSectionHeader
                icon={Euro}
                title="Price Range"
            >
                €{localFilters.priceRange[0]} - €{localFilters.priceRange[1]}
            </FilterSectionHeader>
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
