"use client";

import { NumericFilter, NumericFilterValue } from "./NumericFilter";

// Re-export types for backward compatibility
export type { NumericFilterValue, NumericOperator } from "./NumericFilter";

interface GuestsFilterProps {
    isOpen: boolean;
    onClose: () => void;
    value: NumericFilterValue | null;
    onChange: (value: NumericFilterValue | null) => void;
}

export function GuestsFilter({ isOpen, onClose, value, onChange }: GuestsFilterProps) {
    return (
        <NumericFilter
            title="Guests"
            isOpen={isOpen}
            onClose={onClose}
            value={value}
            onChange={onChange}
            parseAs="int"
            placeholder="Guests"
        />
    );
}
