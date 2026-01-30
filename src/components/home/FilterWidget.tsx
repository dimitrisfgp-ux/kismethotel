"use client";

import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

// Global filter state manager could go here or in URL. 
// For prototype, we'll keep local or pass props. 
// Actually, filters should affect RoomsGrid. 
// I'll make this component accept an `onFilterChange` or export a context. 
// Given the complexity upgrade, I'll assume we need a `FilterContext` or just pass props down if integrated in RoomsGrid.
// BUT RoomsGrid imports FilterWidget in the plan? No, plan says "Create FilterWidget...".
// Best approach: FilterWidget triggers a panel which updates a global or shared state.
// Simplest: RoomsGrid contains FilterWidget and manages state.

interface FilterWidgetProps {
    onOpen: () => void;
    visible?: boolean;
}

export function FilterWidget({ onOpen, visible = true }: FilterWidgetProps) {
    return (
        <button
            onClick={onOpen}
            aria-label="Filter Rooms"
            className={cn(
                "fixed bottom-24 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-white text-[var(--color-accent-gold)] border-2 border-[var(--color-accent-gold)] shadow-[var(--shadow-hover)] hover:bg-[var(--color-accent-gold)] hover:text-white hover:scale-105 transition-all duration-500 ease-premium",
                visible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
            )}
        >
            <SlidersHorizontal className="h-6 w-6" />
        </button>
    );
}
