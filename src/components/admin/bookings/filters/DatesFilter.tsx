"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/Calendar";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { FilterModal } from "../FilterModal";

interface DatesFilterProps {
    isOpen: boolean;
    onClose: () => void;
    value: DateRange | null;
    onChange: (value: DateRange | null) => void;
    label: string;
}

export function DatesFilter({ isOpen, onClose, value, label, onChange }: DatesFilterProps) {
    const [localValue, setLocalValue] = useState<DateRange | undefined>(value || undefined);

    useEffect(() => {
        setLocalValue(value || undefined);
    }, [value]);

    const handleApply = () => {
        onChange(localValue || null);
        onClose();
    };

    const handleClear = () => {
        setLocalValue(undefined);
        onChange(null);
    };

    return (
        <FilterModal title={label} isOpen={isOpen} onClose={onClose} onClear={handleClear}>
            <div className="space-y-4">
                {/* Selected Range Display */}
                <div className="text-center text-sm text-[var(--color-charcoal)]/70 bg-[var(--color-warm-white)] rounded-lg p-2">
                    {localValue?.from ? (
                        localValue.to ? (
                            <>
                                <span className="font-medium">{format(localValue.from, "MMM d, yyyy")}</span>
                                <span className="mx-2">→</span>
                                <span className="font-medium">{format(localValue.to, "MMM d, yyyy")}</span>
                            </>
                        ) : (
                            <span className="font-medium">{format(localValue.from, "MMM d, yyyy")}</span>
                        )
                    ) : (
                        <span className="opacity-50">Select a date range</span>
                    )}
                </div>

                {/* Calendar */}
                <div className="flex justify-center">
                    <Calendar
                        mode="range"
                        selected={localValue}
                        onSelect={setLocalValue}
                        numberOfMonths={1}
                        className="calendar-light p-2"
                    />
                </div>

                <button
                    onClick={handleApply}
                    className="w-full py-2 bg-[var(--color-aegean-blue)] text-white rounded-[var(--radius-subtle)] font-semibold hover:bg-[var(--color-aegean-blue)]/90 transition-colors"
                >
                    Apply Filter
                </button>
            </div>
        </FilterModal>
    );
}
