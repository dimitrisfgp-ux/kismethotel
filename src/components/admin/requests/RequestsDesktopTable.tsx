"use client";

import { ContactRequest, Booking } from "@/types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/Badge";
import { Eye, Check, X } from "lucide-react";
import { SUBJECT_LABELS_SHORT, SUBJECT_COLORS } from "@/lib/constants/requestStyles";
import { REQUEST_STATUS_COLORS } from "@/lib/constants/statusStyles";

interface RequestsDesktopTableProps {
    requests: ContactRequest[];
    bookings: Booking[];
    onViewDetails: (request: ContactRequest) => void;
    onApprove: (requestId: string, e: React.MouseEvent) => void;
    onDiscard: (requestId: string, e: React.MouseEvent) => void;
}

export function RequestsDesktopTable({
    requests,
    onViewDetails,
    onApprove,
    onDiscard
}: RequestsDesktopTableProps) {
    return (
        <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-[var(--color-warm-white)] border-b border-[var(--color-sand)]">
                    <tr>
                        <th className="p-4 font-bold text-[var(--color-charcoal)]">Subject</th>
                        <th className="p-4 font-bold text-[var(--color-charcoal)]">Contact</th>
                        <th className="p-4 font-bold text-[var(--color-charcoal)]">Booking ID</th>
                        <th className="p-4 font-bold text-[var(--color-charcoal)]">Date</th>
                        <th className="p-4 font-bold text-[var(--color-charcoal)]">Status</th>
                        <th className="p-4 font-bold text-[var(--color-charcoal)] text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-sand)]">
                    {requests.map((request) => (
                        <tr
                            key={request.id}
                            className="hover:bg-[var(--color-warm-white)]/20 transition-colors cursor-pointer"
                            onClick={() => onViewDetails(request)}
                        >
                            <td className="p-4">
                                <Badge variant="outline" className={SUBJECT_COLORS[request.subject]}>
                                    {SUBJECT_LABELS_SHORT[request.subject]}
                                </Badge>
                            </td>
                            <td className="p-4">
                                <div className="font-bold text-[var(--color-aegean-blue)]">{request.name}</div>
                                <div className="text-xs text-[var(--color-charcoal)]/60">{request.email}</div>
                            </td>
                            <td className="p-4">
                                {request.bookingId ? (
                                    <code className="text-xs font-mono text-[var(--color-charcoal)]/70 bg-[var(--color-warm-white)] px-1.5 py-0.5 rounded">
                                        {request.bookingId.slice(0, 8)}...
                                    </code>
                                ) : (
                                    <span className="text-[var(--color-charcoal)]/40 italic">—</span>
                                )}
                            </td>
                            <td className="p-4 text-[var(--color-charcoal)]/70">
                                {format(new Date(request.createdAt), "MMM d, yyyy")}
                            </td>
                            <td className="p-4">
                                <Badge variant="outline" className={REQUEST_STATUS_COLORS[request.status]}>
                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                </Badge>
                            </td>
                            <td className="p-4 text-right">
                                <div className="flex justify-end items-center gap-2">
                                    <button
                                        className="p-1.5 text-[var(--color-aegean-blue)] hover:bg-[var(--color-aegean-blue)]/5 rounded-md transition-colors"
                                        title="View Details"
                                        onClick={(e) => { e.stopPropagation(); onViewDetails(request); }}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </button>
                                    {request.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={(e) => onApprove(request.id, e)}
                                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                                title="Approve Request"
                                            >
                                                <Check className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={(e) => onDiscard(request.id, e)}
                                                className="p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
                                                title="Discard Request"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
