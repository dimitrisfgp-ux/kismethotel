"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Search } from "lucide-react";
import { FilterModal } from "../FilterModal";

interface BookingIdFilterProps {
    isOpen: boolean;
    onClose: () => void;
    value: string;
    onChange: (value: string) => void;
}

export function BookingIdFilter({ isOpen, onClose, value, onChange }: BookingIdFilterProps) {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleApply = () => {
        onChange(localValue);
        onClose();
    };

    const handleClear = () => {
        setLocalValue("");
        onChange("");
    };

    return (
        <FilterModal title="Booking ID" isOpen={isOpen} onClose={onClose} onClear={handleClear}>
            <div className="space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-charcoal)]/40" />
                    <Input
                        placeholder="Search by Booking ID..."
                        value={localValue}
                        onChange={(e) => setLocalValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleApply()}
                        className="pl-10"
                        autoFocus
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
