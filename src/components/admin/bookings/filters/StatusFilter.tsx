"use client";

import { useState, useEffect } from "react";
import { BookingStatus } from "@/types";
import { Check } from "lucide-react";
import { FilterModal } from "../FilterModal";

interface StatusFilterProps {
    isOpen: boolean;
    onClose: () => void;
    selectedStatuses: BookingStatus[];
    onChange: (statuses: BookingStatus[]) => void;
}

const ALL_STATUSES: { value: BookingStatus; label: string; color: string }[] = [
    { value: "confirmed", label: "Confirmed", color: "bg-green-100 text-green-700" },
    { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-700" },
    { value: "completed", label: "Completed", color: "bg-gray-100 text-gray-600" }
];

export function StatusFilter({ isOpen, onClose, selectedStatuses, onChange }: StatusFilterProps) {
    const [localSelection, setLocalSelection] = useState<BookingStatus[]>(selectedStatuses);

    useEffect(() => {
        setLocalSelection(selectedStatuses);
    }, [selectedStatuses]);

    const allSelected = localSelection.length === 0 || localSelection.length === ALL_STATUSES.length;

    const toggleStatus = (status: BookingStatus) => {
        if (localSelection.includes(status)) {
            setLocalSelection(localSelection.filter(s => s !== status));
        } else {
            setLocalSelection([...localSelection, status]);
        }
    };

    const selectAll = () => {
        setLocalSelection([]);
    };

    const handleApply = () => {
        onChange(localSelection);
        onClose();
    };

    const handleClear = () => {
        setLocalSelection([]);
        onChange([]);
    };

    return (
        <FilterModal title="Status" isOpen={isOpen} onClose={onClose} onClear={handleClear}>
            <div className="space-y-4">
                <div className="space-y-1">
                    {/* All Option */}
                    <button
                        onClick={selectAll}
                        className={`w-full flex items-center justify-between p-2 rounded-md transition-colors ${allSelected
                                ? "bg-[var(--color-aegean-blue)]/10 text-[var(--color-aegean-blue)]"
                                : "hover:bg-[var(--color-warm-white)]"
                            }`}
                    >
                        <span className="font-medium">All Statuses</span>
                        {allSelected && <Check className="h-4 w-4" />}
                    </button>

                    <div className="h-px bg-[var(--color-sand)] my-2" />

                    {/* Status Options */}
                    {ALL_STATUSES.map(status => {
                        const isSelected = localSelection.includes(status.value);
                        return (
                            <button
                                key={status.value}
                                onClick={() => toggleStatus(status.value)}
                                className={`w-full flex items-center justify-between p-2 rounded-md transition-colors ${isSelected
                                        ? "bg-[var(--color-aegean-blue)]/10 text-[var(--color-aegean-blue)]"
                                        : "hover:bg-[var(--color-warm-white)]"
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${status.color}`}>
                                        {status.label}
                                    </span>
                                </div>
                                {isSelected && <Check className="h-4 w-4" />}
                            </button>
                        );
                    })}
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
