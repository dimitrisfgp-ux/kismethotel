"use client";

import { ChevronDown, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterableHeaderProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
    className?: string;
}

export function FilterableHeader({ label, isActive, onClick, className }: FilterableHeaderProps) {
    return (
        <th className={cn("p-4 font-bold text-[var(--color-charcoal)]", className)}>
            <button
                onClick={onClick}
                className={cn(
                    "flex items-center gap-1.5 hover:text-[var(--color-aegean-blue)] transition-colors group",
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
        </th>
    );
}
