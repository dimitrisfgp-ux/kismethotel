"use client";

import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import { RoomFilters, Room } from "@/types";
import { Button } from "../ui/Button";
import { X } from "lucide-react";
import { useDateContext } from "@/contexts/DateContext";
import { useFacetedOptions } from "@/hooks/useFacetedOptions";
import { Calendar } from "../ui/Calendar";
import {
    PriceRangeSlider,
    BedConfigSelector,
    FloorSelector,
    AmenityGrid,
    SizeSlider
} from "./filters";

interface FilterPanelProps {
    isOpen: boolean;
    onClose: () => void;
    currentFilters: RoomFilters;
    onApply: (filters: RoomFilters) => void;
    rooms: Room[];
}

export function FilterPanel({ isOpen, onClose, currentFilters, onApply, rooms }: FilterPanelProps) {
    const [localFilters, setLocalFilters] = useState<RoomFilters>(currentFilters);
    const { dateRange, setDateRange } = useDateContext();
    const [mounted, setMounted] = useState(false);

    // Dynamic Data Derivation for Faceted Search
    const derivedOptions = useFacetedOptions(rooms, localFilters);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        setLocalFilters(currentFilters);
    }, [currentFilters]);

    if (!isOpen || !mounted || !derivedOptions) return null;

    const { minPrice, maxPrice, floors, sizes, availableAmenities, maxDoubleBeds, maxSingleBeds } = derivedOptions;

    const handleReset = () => {
        setLocalFilters({
            priceRange: [0, 1000],
            occupancy: 0,
            size: 0,
            floors: [],
            bedrooms: 0,
            doubleBeds: 0,
            singleBeds: 0,
            amenityIds: []
        });
    };

    return createPortal(
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex justify-end animate-fade-in">
            <div className="w-full max-w-md bg-[var(--color-aegean-blue)] h-full shadow-2xl p-6 md:p-8 overflow-y-auto animate-slide-up border-l border-[var(--color-accent-gold)]/30">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-montserrat text-xl font-bold uppercase tracking-widest text-white">Filter Rooms</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="h-6 w-6 text-white" />
                    </button>
                </div>

                <div className="space-y-8">
                    {/* Date Section */}
                    <div className="bg-white/5 p-4 rounded-[var(--radius-subtle)] space-y-4 border border-white/10">
                        <h3 className="font-montserrat text-sm font-bold uppercase tracking-wider text-white mb-2">My Stay</h3>
                        <label className="block text-xs font-semibold uppercase tracking-widest text-white/80 mb-2">Dates</label>
                        <Calendar
                            mode="range"
                            selected={dateRange}
                            onSelect={setDateRange}
                            numberOfMonths={1}
                            className="w-full flex justify-center pb-2 text-white calendar-dark"
                        />
                    </div>

                    <div className="h-px bg-white/10 w-full" />

                    {/* Sub-components */}
                    <PriceRangeSlider
                        localFilters={localFilters}
                        setLocalFilters={setLocalFilters}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                    />

                    <BedConfigSelector
                        localFilters={localFilters}
                        setLocalFilters={setLocalFilters}
                        maxDoubleBeds={maxDoubleBeds}
                        maxSingleBeds={maxSingleBeds}
                    />

                    <FloorSelector
                        localFilters={localFilters}
                        setLocalFilters={setLocalFilters}
                        floors={floors}
                    />

                    <AmenityGrid
                        localFilters={localFilters}
                        setLocalFilters={setLocalFilters}
                        availableAmenities={availableAmenities}
                    />

                    <SizeSlider
                        localFilters={localFilters}
                        setLocalFilters={setLocalFilters}
                        sizes={sizes}
                    />
                </div>

                {/* Actions */}
                <div className="mt-12 flex gap-4">
                    <Button
                        variant="ghost"
                        onClick={handleReset}
                        className="flex-1 text-white hover:bg-white/10 hover:text-white"
                    >
                        Reset
                    </Button>
                    <Button
                        onClick={() => { onApply(localFilters); onClose(); }}
                        className="flex-1 bg-[var(--color-accent-gold)] text-white hover:bg-[var(--color-accent-gold)]/90"
                    >
                        Apply Filters
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
}
