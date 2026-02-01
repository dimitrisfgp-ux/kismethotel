"use client";

import { Sparkles, Wind, Wifi, Tv, ChefHat, Waves, Sun, CloudRain, Coffee, BedDouble, Car } from "lucide-react";
import { RoomFilters, Amenity } from "@/types";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Wind, Wifi, Tv, ChefHat, Waves, Sun, CloudRain, Coffee, BedDouble, Car
};

interface AmenityGridProps {
    localFilters: RoomFilters;
    setLocalFilters: (filters: RoomFilters) => void;
    availableAmenities: Amenity[];
}

export function AmenityGrid({ localFilters, setLocalFilters, availableAmenities }: AmenityGridProps) {
    return (
        <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 text-white">
                <Sparkles className="w-4 h-4 text-[var(--color-accent-gold)]" /> Amenities
            </label>
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
    );
}
