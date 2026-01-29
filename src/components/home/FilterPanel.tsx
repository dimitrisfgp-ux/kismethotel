"use client";

import { RoomFilters, RoomSizeCategory } from "@/types";
import { Button } from "../ui/Button";
import { X, Users } from "lucide-react";
import { useState } from "react";
import { useDateContext } from "@/contexts/DateContext";
import { DatePickerWithRange } from "../booking/DateRangePicker";

interface FilterPanelProps {
    isOpen: boolean;
    onClose: () => void;
    currentFilters: RoomFilters;
    onApply: (filters: RoomFilters) => void;
}

export function FilterPanel({ isOpen, onClose, currentFilters, onApply }: FilterPanelProps) {
    const [localFilters, setLocalFilters] = useState<RoomFilters>(currentFilters);
    const { dateRange, setDateRange, guestCount, setGuestCount } = useDateContext();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end animate-fade-in">
            <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 md:p-8 overflow-y-auto animate-slide-up">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-montserrat text-xl font-bold uppercase tracking-widest text-[var(--color-aegean-blue)]">Filter Rooms</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X className="h-6 w-6 text-[var(--color-charcoal)]" /></button>
                </div>

                <div className="space-y-8">
                    {/* Primary Filters (Date & Guests) - Added for unified mobile view */}
                    <div className="bg-[var(--color-sand)]/20 p-4 rounded-[var(--radius-subtle)] space-y-4 border border-[var(--color-sand)]">
                        <h3 className="font-montserrat text-sm font-bold uppercase tracking-wider text-[var(--color-charcoal)] mb-2">My Stay</h3>

                        {/* Date Picker */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--color-charcoal)]/60 mb-2">Dates</label>
                            <DatePickerWithRange
                                date={dateRange}
                                setDate={setDateRange}
                                className="w-full"
                            />
                        </div>

                        {/* Guest Count */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--color-charcoal)]/60 mb-2">Guests</label>
                            <div className="flex items-center gap-4 bg-white p-2 rounded-[var(--radius-subtle)] border border-[var(--color-sand)]">
                                <Users className="h-5 w-5 text-[var(--color-aegean-blue)] ml-2" />
                                <select
                                    value={guestCount}
                                    onChange={(e) => setGuestCount(Number(e.target.value))}
                                    className="w-full bg-transparent border-none text-sm font-inter focus:ring-0 cursor-pointer"
                                >
                                    {[1, 2, 3, 4, 5, 6].map(num => (
                                        <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-[var(--color-sand)] w-full" />

                    {/* Price */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest mb-4">Price Range (€{localFilters.priceRange[0]} - €{localFilters.priceRange[1]})</label>
                        <input
                            type="range" min="50" max="1000" step="50"
                            value={localFilters.priceRange[1]}
                            onChange={(e) => setLocalFilters({ ...localFilters, priceRange: [localFilters.priceRange[0], Number(e.target.value)] })}
                            className="w-full accent-[var(--color-aegean-blue)]"
                        />
                    </div>

                    {/* Occupancy */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest mb-4">Min Guests</label>
                        <div className="flex gap-4">
                            {[1, 2, 3, 4, 5, 6].map(num => (
                                <button
                                    key={num}
                                    onClick={() => setLocalFilters({ ...localFilters, minOccupancy: num })}
                                    className={`w-10 h-10 rounded-full border ${localFilters.minOccupancy === num ? 'bg-[var(--color-aegean-blue)] text-white border-[var(--color-aegean-blue)]' : 'border-[var(--color-sand)] hover:border-[var(--color-aegean-blue)]'}`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Size */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest mb-4">Room Size</label>
                        <div className="flex gap-2 flex-wrap">
                            {(['small', 'medium', 'large'] as RoomSizeCategory[]).map(size => (
                                <button
                                    key={size}
                                    onClick={() => {
                                        const newSizes = localFilters.sizeCategories.includes(size)
                                            ? localFilters.sizeCategories.filter(s => s !== size)
                                            : [...localFilters.sizeCategories, size];
                                        setLocalFilters({ ...localFilters, sizeCategories: newSizes });
                                    }}
                                    className={`px-4 py-2 rounded-[var(--radius-subtle)] border text-sm uppercase ${localFilters.sizeCategories.includes(size) ? 'bg-[var(--color-aegean-blue)] text-white' : 'border-[var(--color-sand)]'}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => setLocalFilters({
                            priceRange: [0, 1000],
                            minOccupancy: 1,
                            sizeCategories: [],
                            floors: [],
                            minBedrooms: 0,
                            bedTypes: [],
                            amenityIds: []
                        })}
                        className="flex-1"
                    >
                        Reset
                    </Button>
                    <Button
                        onClick={() => { onApply(localFilters); onClose(); }}
                        className="flex-1 bg-[var(--color-aegean-blue)] text-white"
                    >
                        Apply Filters
                    </Button>
                </div>
            </div>
        </div>
    );
}
