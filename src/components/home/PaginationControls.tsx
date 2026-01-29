import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function PaginationControls({ currentPage, totalPages, onPageChange }: PaginationControlsProps) {
    return (
        <div className="flex items-center justify-center space-x-6 mt-16 animate-fade-in">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="disabled:opacity-20 hover:text-[var(--color-aegean-blue)] transition-colors"
            >
                <ChevronLeft className="h-6 w-6" />
            </button>

            <div className="flex items-center space-x-3">
                {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => onPageChange(i + 1)}
                        className={cn(
                            "h-2 w-2 rounded-full transition-all duration-300",
                            currentPage === i + 1 ? "bg-[var(--color-aegean-blue)] scale-125" : "bg-[var(--color-sand)] hover:bg-[var(--color-charcoal)]"
                        )}
                    />
                ))}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="disabled:opacity-20 hover:text-[var(--color-aegean-blue)] transition-colors"
            >
                <ChevronRight className="h-6 w-6" />
            </button>
        </div>
    );
}
