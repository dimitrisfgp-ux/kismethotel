"use client";

import { createPortal } from "react-dom";
import { useState, useEffect, useMemo } from "react";
import { RoomFilters, Room } from "@/types";
import { AMENITIES } from "@/data/amenities";
import { Button } from "../ui/Button";
import { X, Users, BedDouble, Bed, Layers, Sparkles, Maximize, Euro, Wind, Wifi, Tv, ChefHat, Waves, Sun, CloudRain, Coffee, Car } from "lucide-react";
import { useDateContext } from "@/contexts/DateContext";
import { Calendar } from "../ui/Calendar";

const iconMap: Record<string, React.ComponentType<any>> = {
    Wind, Wifi, Tv, ChefHat, Waves, Sun, CloudRain, Coffee, BedDouble, Car
};

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
                // Check all filters except the ignored ones
                const checkPrice = ignoredKeys.includes('priceRange') || (room.pricePerNight >= localFilters.priceRange[0] && room.pricePerNight <= localFilters.priceRange[1]);
                const checkOccupancy = ignoredKeys.includes('occupancy') || (!localFilters.occupancy || room.maxOccupancy === localFilters.occupancy); // Exact match logic from helper
                const checkSize = ignoredKeys.includes('size') || (!localFilters.size || room.sizeSqm === localFilters.size);

                const checkFloors = ignoredKeys.includes('floors') || (localFilters.floors.length === 0 || localFilters.floors.includes(room.floor));

                // Amenities - complicated because it's an array. Usually we want to see amenities compatible with OTHER current filters + OTHER current amenities?
                // For simplicity: Show amenities available in rooms matching ALL other filters (Price, Beds, Floor, Size).
                // We do NOT ignore 'amenityIds' here usually, unless we want to see amenities compatible with the *current set* of amenities?
                // Let's ignore 'amenityIds' to see ALL valid amenities for the current room set defined by other parameters.
                const checkAmenities = ignoredKeys.includes('amenityIds') || (localFilters.amenityIds.length === 0 || localFilters.amenityIds.every(id => room.layout.flatMap(c => c.amenities).some(a => a.id === id)));

                const checkDoubleBeds = ignoredKeys.includes('doubleBeds') || (!localFilters.doubleBeds || (room.beds?.find(b => b.type === 'double')?.count || 0) === localFilters.doubleBeds);
                const checkSingleBeds = ignoredKeys.includes('singleBeds') || (!localFilters.singleBeds || (room.beds?.find(b => b.type === 'single')?.count || 0) === localFilters.singleBeds);

                // For faceted search, we usually allow the 'ignored' key to vary.
                return checkPrice && checkOccupancy && checkSize && checkFloors && checkAmenities && checkDoubleBeds && checkSingleBeds;
            });
        };

        // 1. Available Floors: Filter by everything EXCEPT 'floors'
        const roomsForFloors = getRoomsFilteredBy(['floors']);
        const availableFloors = Array.from(new Set(roomsForFloors.map(r => r.floor))).sort((a, b) => a - b);

        // 2. Available Sizes: Filter by everything EXCEPT 'size'
        const roomsForSizes = getRoomsFilteredBy(['size']);
        const availableSizes = Array.from(new Set(roomsForSizes.map(r => r.sizeSqm))).sort((a, b) => a - b);

        // 3. Available Amenities: Filter by everything EXCEPT 'amenityIds' 
        // (So we see amenities that *could* be selected given the other constraints)
        const roomsForAmenities = getRoomsFilteredBy(['amenityIds']);
        const usedAmenityIds = new Set<number>();
        roomsForAmenities.forEach(r => {
            r.layout.forEach(cat => cat.amenities.forEach(a => usedAmenityIds.add(a.id)));
        });
        const availableAmenities = AMENITIES.filter(a => usedAmenityIds.has(a.id));

        // 4. Available Bed Counts: Filter by everything EXCEPT the specific bed type
        const roomsForDoubleBeds = getRoomsFilteredBy(['doubleBeds']);
        const maxDoubleBeds = Math.max(0, ...roomsForDoubleBeds.map(r => r.beds?.find(b => b.type === 'double')?.count || 0));

        const roomsForSingleBeds = getRoomsFilteredBy(['singleBeds']);
        const maxSingleBeds = Math.max(0, ...roomsForSingleBeds.map(r => r.beds?.find(b => b.type === 'single')?.count || 0));

        // 5. Global Ranges (for sliders/limits that shouldn't disappear entirely, but maybe gray out?
        // Actually, let's keep min/max price static based on *all* rooms so the slider doesn't jump around confusingly
        const allPrices = rooms.map(r => r.pricePerNight);
        const minPrice = Math.min(...allPrices);
        const maxPrice = Math.max(...allPrices);

        // Occupancy should also be dynamic to prevent selecting 4 guests if only 2-person rooms match other filters
        const roomsForOccupancy = getRoomsFilteredBy(['occupancy']);
        const maxTotalOccupancy = Math.max(0, ...roomsForOccupancy.map(r => r.maxOccupancy));

        return {
            minPrice, maxPrice,
            floors: availableFloors,
            sizes: availableSizes,
            availableAmenities,
            maxTotalOccupancy,
            maxDoubleBeds,
            maxSingleBeds
        };
    }, [rooms, localFilters]); // Re-run when filters change

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Also sync local filters if props change
    // BE CAREFUL: If we sync strictly, we might reset user work. 
    // But typically 'currentFilters' prop updating implies external change.
    useEffect(() => {
        setLocalFilters(currentFilters);
    }, [currentFilters]);

    if (!isOpen || !mounted || !derivedOptions) return null;

    const { minPrice, maxPrice, floors, sizes, availableAmenities, maxTotalOccupancy, maxDoubleBeds, maxSingleBeds } = derivedOptions;

    // Use localFilters for guests, preserve date context for global availability check
    // Actually, user might want to filter dates just locally until applied? 
    // Current design uses global context for dates everywhere. Let's stick to that for dates.
    // For Guests, we bind to localFilters.occupancy.

    return createPortal(
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex justify-end animate-fade-in">
            <div className="w-full max-w-md bg-[var(--color-aegean-blue)] h-full shadow-2xl p-6 md:p-8 overflow-y-auto animate-slide-up border-l border-[var(--color-accent-gold)]/30">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-montserrat text-xl font-bold uppercase tracking-widest text-white">Filter Rooms</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="h-6 w-6 text-white" /></button>
                </div>

                <div className="space-y-8">
                    {/* Primary Filters (Date & Guests) - Added for unified mobile view */}
                    <div className="bg-white/5 p-4 rounded-[var(--radius-subtle)] space-y-4 border border-white/10">
                        <h3 className="font-montserrat text-sm font-bold uppercase tracking-wider text-white mb-2">My Stay</h3>

                        {/* Date Picker - INLINE CALENDAR */}
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

                    {/* Price */}
                    <div>
                        <div className="flex justify-between mb-4">
                            <label className="block text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-white"><Euro className="w-4 h-4 text-[var(--color-accent-gold)]" /> Price Range</label>
                            <span className="text-xs font-inter text-white">€{localFilters.priceRange[0]} - €{localFilters.priceRange[1]}</span>
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

                    {/* Bed Configuration */}
                    <div className="space-y-4">
                        <label className="block text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-white"><BedDouble className="w-4 h-4 text-[var(--color-accent-gold)]" /> Bed Configuration</label>

                        {/* Bed Configuration - Separated */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Double Beds */}
                            <div>
                                <span className="text-[10px] uppercase tracking-wider text-white/60 font-semibold mb-2 block flex items-center gap-1"><BedDouble className="w-3 h-3" /> Double Beds</span>
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
                                <span className="text-[10px] uppercase tracking-wider text-white/60 font-semibold mb-2 block flex items-center gap-1"><Bed className="w-3 h-3" /> Single Beds</span>
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

                    {/* Floors - Dynamic */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 text-white"><Layers className="w-4 h-4 text-[var(--color-accent-gold)]" /> Floor Preference</label>
                        <div className="flex gap-3 flex-wrap">
                            {floors.map(floor => (
                                <button
                                    key={floor}
                                    onClick={() => {
                                        const newFloors = localFilters.floors.includes(floor)
                                            ? []
                                            : [floor];
                                        setLocalFilters({ ...localFilters, floors: newFloors });
                                    }}
                                    className={`px-4 py-2 rounded-[var(--radius-subtle)] border text-sm uppercase transition-all ${localFilters.floors.includes(floor) ? 'bg-[var(--color-accent-gold)] text-white border-[var(--color-accent-gold)]' : 'border-white/20 text-white hover:border-[var(--color-accent-gold)]'}`}
                                >
                                    {floor === 0 ? "Ground" : `${floor}th Floor`}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Amenities - Dynamic */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 text-white"><Sparkles className="w-4 h-4 text-[var(--color-accent-gold)]" /> Amenities</label>
                        <div className="grid grid-cols-2 gap-3">
                            {availableAmenities.map(amenity => {
                                const Icon = iconMap[amenity.iconName as keyof typeof iconMap] || Sparkles;
                                return (
                                    <button
                                        key={amenity.id}
                                        onClick={() => {
                                            const newIds = localFilters.amenityIds.includes(amenity.id)
                                                ? localFilters.amenityIds.filter(id => id !== amenity.id)
                                                : [...localFilters.amenityIds, amenity.id];
                                            setLocalFilters({ ...localFilters, amenityIds: newIds });
                                        }}
                                        className={`text-left px-3 py-2 rounded-[var(--radius-subtle)] border text-xs font-inter transition-all flex items-center gap-2 ${localFilters.amenityIds.includes(amenity.id) ? 'bg-[var(--color-accent-gold)] text-white border-[var(--color-accent-gold)]' : 'border-white/20 text-white hover:bg-white/5'}`}
                                    >
                                        <Icon className="w-3 h-3 opacity-70" />
                                        {amenity.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Size - Dynamic Slider */}
                    <div>
                        <div className="flex justify-between mb-6">
                            <label className="block text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2"><Maximize className="w-4 h-4 text-[var(--color-accent-gold)]" /> Room Size</label>
                            <span className="text-sm font-inter font-bold text-white">
                                {localFilters.size > 0 ? `${localFilters.size} m²` : `${sizes[0]} m²`}
                            </span>
                        </div>

                        <div className="relative h-8 flex items-center">
                            {/* Visual Track Line */}
                            <div className="absolute w-full h-[3px] bg-white/20 rounded-full z-0 top-1/2 -translate-y-1/2" />

                            {/* Active Track (Fill) */}
                            <div
                                className="absolute h-[3px] bg-[var(--color-accent-gold)] rounded-full z-0 top-1/2 -translate-y-1/2 left-0 transition-all duration-75 ease-out origin-left pointer-events-none"
                                style={{
                                    width: `${(((localFilters.size || sizes[0]) - sizes[0]) / (sizes[sizes.length - 1] - sizes[0])) * 100}%`
                                }}
                            />

                            {/* Track Points */}
                            <div className="absolute w-full top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                                {sizes.map(size => {
                                    const min = sizes[0];
                                    const max = sizes[sizes.length - 1];
                                    const percent = ((size - min) / (max - min)) * 100;
                                    const isActive = size <= (localFilters.size || min);

                                    return (
                                        <div
                                            key={size}
                                            className={`absolute w-2.5 h-2.5 rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 transition-colors duration-300 ${isActive ? 'bg-[var(--color-accent-gold)]' : 'bg-white/20'}`}
                                            style={{ left: `${percent}%` }}
                                        />
                                    );
                                })}
                            </div>

                            {/* The Input - Overlay for interaction */}
                            <input
                                type="range"
                                min={sizes.length > 0 ? sizes[0] : 0}
                                max={sizes.length > 0 ? sizes[sizes.length - 1] : 100}
                                step="any"
                                value={localFilters.size ?? (sizes.length > 0 ? sizes[0] : 0)}
                                onChange={(e) => {
                                    const val = Number(e.target.value);
                                    const closest = sizes.reduce((prev, curr) =>
                                        Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev
                                    );
                                    setLocalFilters({ ...localFilters, size: closest });
                                }}
                                className="appearance-none w-full absolute z-30 opacity-0 cursor-pointer h-full inset-0 m-0 p-0"
                                aria-label="Room Size"
                            />

                            {/* Custom Thumb (Visual Only) */}
                            <div
                                className="absolute h-5 w-5 bg-[var(--color-accent-gold)] rounded-full shadow-lg border-2 border-white pointer-events-none z-20 transition-all duration-75 ease-out top-1/2 -translate-y-1/2 -translate-x-1/2 transform hover:scale-110"
                                style={{
                                    left: `${sizes.length > 1
                                        ? (((localFilters.size ?? sizes[0]) - sizes[0]) / (sizes[sizes.length - 1] - sizes[0])) * 100
                                        : 0}%`
                                }}
                            />
                        </div>

                        <div className="flex justify-between text-[10px] text-white/40 mt-2 font-mono uppercase tracking-wider">
                            <span>{sizes[0]} m²</span>
                            <span>{sizes[sizes.length - 1]} m²</span>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => setLocalFilters({
                            priceRange: [0, 1000],
                            occupancy: 0,
                            size: 0,
                            floors: [],
                            bedrooms: 0,
                            doubleBeds: 0,
                            singleBeds: 0,
                            amenityIds: []
                        })}
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
