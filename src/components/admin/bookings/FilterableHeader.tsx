"use client";

import { ChevronDown, ChevronUp, Filter, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SortDirection } from "@/hooks/useBookingFilters";

interface FilterableHeaderProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
    className?: string;
    /** Sort direction — undefined means this column has no active sort */
    sortDirection?: SortDirection | null;
    /** Callback when the sort button is clicked */
    onSort?: () => void;
    /** If true, this column is sortable (shows sort controls) */
    sortable?: boolean;
}

export function FilterableHeader({
    label,
    isActive,
    onClick,
    className,
    sortDirection,
    onSort,
    sortable = false
}: FilterableHeaderProps) {
    return (
        <th className={cn("p-4 font-bold text-[var(--color-charcoal)]", className)}>
            <div className="flex items-center gap-1">
                {/* Sort button (if sortable) */}
                {sortable && onSort && (
                    <button
                        onClick={onSort}
                        className={cn(
                            "p-0.5 rounded transition-colors",
                            sortDirection
                                ? "text-[var(--color-aegean-blue)]"
                                : "text-[var(--color-charcoal)]/30 hover:text-[var(--color-charcoal)]/60"
                        )}
                        title={`Sort by ${label}`}
                    >
                        {sortDirection === "asc" ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                        ) : sortDirection === "desc" ? (
                            <ChevronDown className="h-3.5 w-3.5" />
                        ) : (
                            <ArrowUpDown className="h-3 w-3" />
                        )}
                    </button>
                )}

                {/* Filter button */}
                <button
                    onClick={onClick}
                    className={cn(
                        "flex items-center gap-1 hover:text-[var(--color-aegean-blue)] transition-colors group",
                        isActive && "text-[var(--color-aegean-blue)]"
                    )}
                >
                    <span>{label}</span>
                    {isActive ? (
                        <Filter className="h-3 w-3 fill-current" />
                    ) : (
                        <ChevronDown className="h-3 w-3 opacity-40 group-hover:opacity-100 transition-opacity" />
                    )}
                </button>
            </div>
        </th>
    );
}
