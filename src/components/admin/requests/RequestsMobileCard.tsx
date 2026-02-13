"use client";

import { ContactRequest } from "@/types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/Badge";
import { Eye, Check, X } from "lucide-react";
import { SUBJECT_LABELS_SHORT, SUBJECT_COLORS } from "@/lib/constants/requestStyles";
import { REQUEST_STATUS_COLORS } from "@/lib/constants/statusStyles";

interface RequestsMobileCardProps {
    request: ContactRequest;
    onViewDetails: () => void;
    onApprove: (e: React.MouseEvent) => void;
    onDiscard: (e: React.MouseEvent) => void;
}

export function RequestsMobileCard({ request, onViewDetails, onApprove, onDiscard }: RequestsMobileCardProps) {
    return (
        <div className="bg-white p-3 rounded-lg border border-[var(--color-sand)] shadow-sm space-y-2">
            {/* Header */}
            <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={`${SUBJECT_COLORS[request.subject]} text-[10px] px-1.5 py-0.5 h-auto`}>
                            {SUBJECT_LABELS_SHORT[request.subject]}
                        </Badge>
                        <span className="text-[10px] text-[var(--color-charcoal)]/60 whitespace-nowrap">
                            {format(new Date(request.createdAt), "MMM d")}
                        </span>
                    </div>
                    <div className="font-bold text-[var(--color-aegean-blue)] truncate text-sm leading-tight">
                        {request.name}
                    </div>
                    <div className="text-[10px] text-[var(--color-charcoal)]/60 truncate mt-0.5">
                        {request.email}
                    </div>
                </div>
                <Badge variant="outline" className={`${REQUEST_STATUS_COLORS[request.status]} shrink-0 text-[10px] px-1.5 py-0.5 h-auto uppercase tracking-wide`}>
                    {request.status}
                </Badge>
            </div>

            {/* Meta: Linked Booking */}
            {request.bookingId && (
                <div className="flex items-center gap-1.5 text-[10px] pt-1 border-t border-[var(--color-sand)]/30 mt-1">
                    <span className="text-[var(--color-charcoal)]/40 uppercase font-bold tracking-wider">Booking:</span>
                    <span className="font-mono bg-[var(--color-warm-white)] px-1 rounded text-[var(--color-charcoal)]">
                        {request.bookingId.slice(0, 8)}...
                    </span>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-[var(--color-sand)]/30 mt-1">
                {request.status === 'pending' && (
                    <>
                        <button
                            onClick={onDiscard}
                            className="h-8 w-8 flex items-center justify-center text-red-400 bg-red-50 hover:bg-red-100 hover:text-red-600 rounded border border-transparent hover:border-red-200 transition-colors"
                            title="Discard"
                        >
                            <X className="h-4 w-4" />
                        </button>
                        <button
                            onClick={onApprove}
                            className="h-8 w-8 flex items-center justify-center text-green-600 bg-green-50 hover:bg-green-100 rounded border border-transparent hover:border-green-200 transition-colors"
                            title="Approve"
                        >
                            <Check className="h-4 w-4" />
                        </button>
                    </>
                )}

                <button
                    onClick={onViewDetails}
                    className="flex-1 h-8 bg-[var(--color-aegean-blue)]/10 text-[var(--color-aegean-blue)] rounded text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 hover:bg-[var(--color-aegean-blue)]/20 transition-colors"
                >
                    <Eye className="h-3 w-3" />
                    Details
                </button>
            </div>
        </div>
    );
}
