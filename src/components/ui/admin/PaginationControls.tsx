import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (limit: number) => void;
}

export function PaginationControls({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange
}: PaginationControlsProps) {
    const startItem = ((currentPage - 1) * itemsPerPage) + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 border-t border-[var(--color-sand)]">
            <div className="flex items-center gap-4 text-sm text-[var(--color-charcoal)]/70">
                <span>
                    Showing <span className="font-medium text-[var(--color-aegean-blue)]">{startItem}-{endItem}</span> of <span className="font-medium text-[var(--color-aegean-blue)]">{totalItems}</span>
                </span>

                <div className="flex items-center gap-2">
                    <span>Rows per page:</span>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                        className="bg-white border border-[var(--color-sand)] rounded px-2 py-1 text-sm focus:outline-none focus:border-[var(--color-aegean-blue)]"
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="h-8 w-8 p-0"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <span className="text-sm font-medium px-2">
                    Page {currentPage} of {totalPages}
                </span>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="h-8 w-8 p-0"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
