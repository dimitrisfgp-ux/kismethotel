"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { User, Mail, Phone } from "lucide-react";
import { FilterModal } from "../FilterModal";

interface DetailsFilterValue {
    name?: string;
    email?: string;
    phone?: string;
}

interface DetailsFilterProps {
    isOpen: boolean;
    onClose: () => void;
    value: DetailsFilterValue;
    onChange: (value: DetailsFilterValue) => void;
}

export function DetailsFilter({ isOpen, onClose, value, onChange }: DetailsFilterProps) {
    const [localValue, setLocalValue] = useState<DetailsFilterValue>(value);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleApply = () => {
        onChange(localValue);
        onClose();
    };

    const handleClear = () => {
        const empty = { name: "", email: "", phone: "" };
        setLocalValue(empty);
        onChange(empty);
    };

    return (
        <FilterModal title="Guest Details" isOpen={isOpen} onClose={onClose} onClear={handleClear}>
            <div className="space-y-4">
                <div className="space-y-3">
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-charcoal)]/40" />
                        <Input
                            placeholder="Guest Name..."
                            value={localValue.name || ""}
                            onChange={(e) => setLocalValue({ ...localValue, name: e.target.value })}
                            className="pl-10"
                            autoFocus
                        />
                    </div>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-charcoal)]/40" />
                        <Input
                            placeholder="Email..."
                            value={localValue.email || ""}
                            onChange={(e) => setLocalValue({ ...localValue, email: e.target.value })}
                            className="pl-10"
                        />
                    </div>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-charcoal)]/40" />
                        <Input
                            placeholder="Phone..."
                            value={localValue.phone || ""}
                            onChange={(e) => setLocalValue({ ...localValue, phone: e.target.value })}
                            className="pl-10"
                        />
                    </div>
                </div>
                <p className="text-xs text-[var(--color-charcoal)]/50 text-center">
                    Searches across name, email, and phone fields
                </p>
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
