"use client";

import { Layers } from "lucide-react";
import { RoomFilters } from "@/types";

interface FloorSelectorProps {
    localFilters: RoomFilters;
    setLocalFilters: (filters: RoomFilters) => void;
    floors: number[];
}

export function FloorSelector({ localFilters, setLocalFilters, floors }: FloorSelectorProps) {
    return (
        <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 text-white">
                <Layers className="w-4 h-4 text-[var(--color-accent-gold)]" /> Floor Preference
            </label>
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
    );
}
