"use client";

import { BedDouble, BedSingle, Minus, Plus } from "lucide-react";

interface BedSelectorProps {
    doubleBeds: number;
    setDoubleBeds: (val: number) => void;
    singleBeds: number;
    setSingleBeds: (val: number) => void;
    maxDoubleBeds?: number;
    maxSingleBeds?: number;
}

function Counter({
    count,
    onChange,
    max,
    icon: Icon,
    label
}: {
    count: number,
    onChange: (val: number) => void,
    max?: number,
    icon: any,
    label: string
}) {
    return (
        <div className="flex items-center gap-3 bg-[var(--color-sand)]/20 p-2 rounded-lg">
            <div className="flex flex-col items-center gap-0.5">
                <Icon className="h-4 w-4 text-[var(--color-charcoal)]" />
                <span className="text-[10px] font-bold text-[var(--color-charcoal)]/60 uppercase">{label}</span>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onChange(Math.max(0, count - 1))}
                    disabled={count === 0}
                    aria-label={`Decrease ${label} beds`}
                    className="h-6 w-6 flex items-center justify-center rounded-full bg-white border border-[var(--color-sand)] hover:border-[var(--color-aegean-blue)] disabled:opacity-30 disabled:hover:border-[var(--color-sand)] transition-all"
                >
                    <Minus className="h-3 w-3" />
                </button>

                <span className="w-4 text-center font-montserrat font-bold text-sm">{count}</span>

                <button
                    onClick={() => onChange(Math.min(max || 99, count + 1))}
                    disabled={max !== undefined && count >= max}
                    aria-label={`Increase ${label} beds`}
                    className="h-6 w-6 flex items-center justify-center rounded-full bg-white border border-[var(--color-sand)] hover:border-[var(--color-aegean-blue)] disabled:opacity-30 disabled:hover:border-[var(--color-sand)] transition-all"
                >
                    <Plus className="h-3 w-3" />
                </button>
            </div>
        </div>
    );
}

export function BedSelector({
    doubleBeds,
    setDoubleBeds,
    singleBeds,
    setSingleBeds,
    maxDoubleBeds,
    maxSingleBeds
}: BedSelectorProps) {
    return (
        <div className="flex items-center gap-2">
            <Counter
                count={doubleBeds}
                onChange={setDoubleBeds}
                max={maxDoubleBeds}
                icon={BedDouble}
                label="Double"
            />
            <div className="w-[1px] h-8 bg-[var(--color-sand)]/50" />
            <Counter
                count={singleBeds}
                onChange={setSingleBeds}
                max={maxSingleBeds}
                icon={BedSingle}
                label="Single"
            />
        </div>
    );
}
