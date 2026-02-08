"use client";

import { useState, useEffect } from "react";
import { RequestSubject } from "@/types";
import { Check } from "lucide-react";
import { FilterModal } from "../FilterModal";

export type RequestFilterOption = RequestSubject | "none" | "any";

interface RequestsFilterProps {
    isOpen: boolean;
    onClose: () => void;
    selectedOptions: RequestFilterOption[];
    onChange: (options: RequestFilterOption[]) => void;
}

const ALL_OPTIONS: { value: RequestFilterOption; label: string; description: string }[] = [
    { value: "any", label: "Has Any Request", description: "Show bookings with pending requests" },
    { value: "reschedule", label: "Reschedule Request", description: "Pending reschedule requests" },
    { value: "cancellation", label: "Cancellation Request", description: "Pending cancellation requests" },
    { value: "none", label: "No Requests", description: "Show bookings without pending requests" }
];

export function RequestsFilter({ isOpen, onClose, selectedOptions, onChange }: RequestsFilterProps) {
    const [localSelection, setLocalSelection] = useState<RequestFilterOption[]>(selectedOptions);

    useEffect(() => {
        setLocalSelection(selectedOptions);
    }, [selectedOptions]);

    const allSelected = localSelection.length === 0;

    const toggleOption = (option: RequestFilterOption) => {
        if (localSelection.includes(option)) {
            setLocalSelection(localSelection.filter(o => o !== option));
        } else {
            // Special handling for mutually exclusive options
            if (option === "any" || option === "none") {
                setLocalSelection([option]);
            } else {
                // Remove "any" and "none" when selecting specific types
                setLocalSelection([
                    ...localSelection.filter(o => o !== "any" && o !== "none"),
                    option
                ]);
            }
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
        <FilterModal title="Requests" isOpen={isOpen} onClose={onClose} onClear={handleClear}>
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
                        <div>
                            <span className="font-medium">All Bookings</span>
                            <p className="text-xs text-[var(--color-charcoal)]/50">No request filter</p>
                        </div>
                        {allSelected && <Check className="h-4 w-4" />}
                    </button>

                    <div className="h-px bg-[var(--color-sand)] my-2" />

                    {/* Options */}
                    {ALL_OPTIONS.map(option => {
                        const isSelected = localSelection.includes(option.value);
                        return (
                            <button
                                key={option.value}
                                onClick={() => toggleOption(option.value)}
                                className={`w-full flex items-center justify-between p-2 rounded-md transition-colors text-left ${isSelected
                                        ? "bg-[var(--color-aegean-blue)]/10 text-[var(--color-aegean-blue)]"
                                        : "hover:bg-[var(--color-warm-white)]"
                                    }`}
                            >
                                <div>
                                    <span className="font-medium">{option.label}</span>
                                    <p className="text-xs text-[var(--color-charcoal)]/50">{option.description}</p>
                                </div>
                                {isSelected && <Check className="h-4 w-4 flex-shrink-0" />}
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
