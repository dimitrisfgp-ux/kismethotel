"use client";

import { NumericFilter, NumericFilterValue } from "./NumericFilter";

interface CostFilterProps {
    isOpen: boolean;
    onClose: () => void;
    value: NumericFilterValue | null;
    onChange: (value: NumericFilterValue | null) => void;
}

export function CostFilter({ isOpen, onClose, value, onChange }: CostFilterProps) {
    return (
        <NumericFilter
            title="Total Cost"
            isOpen={isOpen}
            onClose={onClose}
            value={value}
            onChange={onChange}
            parseAs="float"
            prefix="€"
            placeholder="Amount"
            step={0.01}
        />
    );
}
