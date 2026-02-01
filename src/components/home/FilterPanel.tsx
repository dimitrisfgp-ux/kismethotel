"use client";

import { createPortal } from "react-dom";
import { useState, useEffect, useMemo } from "react";
import { RoomFilters, Room } from "@/types";
import { AMENITIES } from "@/data/amenities";
import { Button } from "../ui/Button";
import { X } from "lucide-react";
import { useDateContext } from "@/contexts/DateContext";
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
    const derivedOptions = useMemo(() => {
        if (!rooms.length) return null;

        // Helper to get rooms filtered by everything EXCEPT the specified keys
        const getRoomsFilteredBy = (ignoredKeys: (keyof RoomFilters)[]) => {
            return rooms.filter(room => {
                const checkPrice = ignoredKeys.includes('priceRange') || (room.pricePerNight >= localFilters.priceRange[0] && room.pricePerNight <= localFilters.priceRange[1]);
                const checkOccupancy = ignoredKeys.includes('occupancy') || (!localFilters.occupancy || room.maxOccupancy === localFilters.occupancy);
                const checkSize = ignoredKeys.includes('size') || (!localFilters.size || room.sizeSqm === localFilters.size);
                const checkFloors = ignoredKeys.includes('floors') || (localFilters.floors.length === 0 || localFilters.floors.includes(room.floor));
                const checkAmenities = ignoredKeys.includes('amenityIds') || (localFilters.amenityIds.length === 0 || localFilters.amenityIds.every(id => room.layout.flatMap(c => c.amenities).some(a => a.id === id)));
                const checkDoubleBeds = ignoredKeys.includes('doubleBeds') || (!localFilters.doubleBeds || (room.beds?.find(b => b.type === 'double')?.count || 0) === localFilters.doubleBeds);
                const checkSingleBeds = ignoredKeys.includes('singleBeds') || (!localFilters.singleBeds || (room.beds?.find(b => b.type === 'single')?.count || 0) === localFilters.singleBeds);

                return checkPrice && checkOccupancy && checkSize && checkFloors && checkAmenities && checkDoubleBeds && checkSingleBeds;
            });
        };

        // Derive available options
        const roomsForFloors = getRoomsFilteredBy(['floors']);
        const availableFloors = Array.from(new Set(roomsForFloors.map(r => r.floor))).sort((a, b) => a - b);

        const roomsForSizes = getRoomsFilteredBy(['size']);
        const availableSizes = Array.from(new Set(roomsForSizes.map(r => r.sizeSqm))).sort((a, b) => a - b);

        const roomsForAmenities = getRoomsFilteredBy(['amenityIds']);
        const usedAmenityIds = new Set<number>();
        roomsForAmenities.forEach(r => {
            r.layout.forEach(cat => cat.amenities.forEach(a => usedAmenityIds.add(a.id)));
        });
        const availableAmenities = AMENITIES.filter(a => usedAmenityIds.has(a.id));

        const roomsForDoubleBeds = getRoomsFilteredBy(['doubleBeds']);
        const maxDoubleBeds = Math.max(0, ...roomsForDoubleBeds.map(r => r.beds?.find(b => b.type === 'double')?.count || 0));

        const roomsForSingleBeds = getRoomsFilteredBy(['singleBeds']);
        const maxSingleBeds = Math.max(0, ...roomsForSingleBeds.map(r => r.beds?.find(b => b.type === 'single')?.count || 0));

        const allPrices = rooms.map(r => r.pricePerNight);
        const minPrice = Math.min(...allPrices);
        const maxPrice = Math.max(...allPrices);

        return {
            minPrice, maxPrice,
            floors: availableFloors,
            sizes: availableSizes,
            availableAmenities,
            maxDoubleBeds,
            maxSingleBeds
        };
    }, [rooms, localFilters]);

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
                            style={{
                                '--cal-nav-color': 'white',
                                '--cal-label-color': 'white'
                            } as React.CSSProperties}
                            className="w-full flex justify-center pb-2 text-white"
                            classNames={{
                                selected: "bg-[var(--color-accent-gold)] text-white hover:bg-[var(--color-accent-gold)]/90 rounded-md",
                                range_start: "bg-[var(--color-accent-gold)] text-white rounded-l-md rounded-r-none",
                                range_end: "bg-[var(--color-accent-gold)] text-white rounded-l-none rounded-r-md",
                                range_middle: "bg-white/10 text-white rounded-none",
                                today: "text-[var(--color-accent-gold)] font-bold",
                                head_cell: "text-white/60 font-medium text-[0.7rem] uppercase tracking-wider",
                                caption_label: "text-white font-bold font-montserrat tracking-widest uppercase"
                            }}
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
