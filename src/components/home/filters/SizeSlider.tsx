"use client";

import { Maximize } from "lucide-react";
import { RoomFilters } from "@/types";
import { FilterSectionHeader } from "./FilterSectionHeader";

interface SizeSliderProps {
    localFilters: RoomFilters;
    setLocalFilters: (filters: RoomFilters) => void;
    sizes: number[];
}

export function SizeSlider({ localFilters, setLocalFilters, sizes }: SizeSliderProps) {
    if (sizes.length === 0) return null;

    const min = sizes[0];
    const max = sizes[sizes.length - 1];
    const currentValue = localFilters.size || min;
    const range = max - min || 1; // Prevent division by zero

    return (
        <div>
            <FilterSectionHeader
                icon={Maximize}
                title="Room Size"
            >
                {localFilters.size > 0 ? `${localFilters.size} m²` : `${min} m²`}
            </FilterSectionHeader>

            <div className="relative h-8 flex items-center">
                {/* Visual Track Line */}
                <div className="absolute w-full h-[3px] bg-white/20 rounded-full z-0 top-1/2 -translate-y-1/2" />

                {/* Active Track (Fill) */}
                <div
                    className="absolute h-[3px] bg-[var(--color-accent-gold)] rounded-full z-0 top-1/2 -translate-y-1/2 left-0 transition-all duration-75 ease-out origin-left pointer-events-none"
                    style={{
                        width: `${((currentValue - min) / range) * 100}%`
                    }}
                />

                {/* Track Points */}
                <div className="absolute w-full top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                    {sizes.map(size => {
                        const percent = ((size - min) / range) * 100;
                        const isActive = size <= currentValue;

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
                    min={min}
                    max={max}
                    step="any"
                    value={currentValue}
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
                        left: `${sizes.length > 1 ? ((currentValue - min) / range) * 100 : 0}%`
                    }}
                />
            </div>

            <div className="flex justify-between text-[10px] text-white/40 mt-2 font-mono uppercase tracking-wider">
                <span>{min} m²</span>
                <span>{max} m²</span>
            </div>
        </div>
    );
}
