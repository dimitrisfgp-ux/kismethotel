"use client";

import { Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { FAB_BOTTOM_OFFSET } from "@/data/constants";

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
                "fixed right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-accent-gold)] text-white border-2 border-white shadow-[var(--shadow-hover)] hover:bg-white hover:text-[var(--color-accent-gold)] hover:border-[var(--color-accent-gold)] hover:scale-105 transition-all duration-500 ease-premium",
                FAB_BOTTOM_OFFSET,
                visible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
            )}
        >
            <Filter className="h-6 w-6" />
        </button>
    );
}
