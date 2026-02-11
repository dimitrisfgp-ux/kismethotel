"use client";

import { useState } from "react";
import { PaginationControls } from "@/components/ui/admin/PaginationControls";
import { ContactRequest, Booking } from "@/types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/Badge";
import { Eye, Check, X } from "lucide-react";
import { approveRequestAction, discardRequestAction } from "@/app/actions/request";
import { useToast } from "@/contexts/ToastContext";
import { RequestDetailsModal } from "./RequestDetailsModal";
import { SUBJECT_LABELS_SHORT, SUBJECT_COLORS } from "@/lib/constants/requestStyles";
import { REQUEST_STATUS_COLORS } from "@/lib/constants/statusStyles";

interface RequestsTableProps {
    requests: ContactRequest[];
    bookings: Booking[];
}

export function RequestsTable({ requests, bookings }: RequestsTableProps) {
    const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);
    const [localRequests, setLocalRequests] = useState<ContactRequest[]>(requests);
    const { showToast } = useToast();

    // Pagination State
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const getLinkedBooking = (bookingId?: string) => {
        if (!bookingId) return undefined;
        return bookings.find(b => b.id === bookingId);
    };

    const handleApprove = async (requestId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to approve this request? This will update the associated booking.")) return;

        const success = await approveRequestAction(requestId);
        if (success) {
            setLocalRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'approved' as const } : r));
            showToast("Request approved successfully", "success");
        } else {
            showToast("Failed to approve request", "error");
        }
    };

    const handleDiscard = async (requestId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to discard this request?")) return;

        const success = await discardRequestAction(requestId);
        if (success) {
            setLocalRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'discarded' as const } : r));
            showToast("Request discarded", "success");
        } else {
            showToast("Failed to discard request", "error");
        }
    };

    // Pagination Logic
    const totalItems = localRequests.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedRequests = localRequests.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (localRequests.length === 0) {
        return (
            <div className="text-center py-12 border border-dashed border-[var(--color-sand)] rounded-lg">
                <p className="text-[var(--color-charcoal)]/60 italic">No contact requests yet.</p>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-lg border border-[var(--color-sand)] overflow-hidden">
                {/* Top Pagination */}
                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
                />

                <div className="overflow-x-auto">
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
                            {paginatedRequests.map((request) => (
                                <tr
                                    key={request.id}
                                    className="hover:bg-[var(--color-warm-white)]/20 transition-colors cursor-pointer"
                                    onClick={() => setSelectedRequest(request)}
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
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            {request.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={(e) => handleApprove(request.id, e)}
                                                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                                        title="Approve Request"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDiscard(request.id, e)}
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

                {/* Bottom Pagination */}
                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
                />
            </div>

            {selectedRequest && (
                <RequestDetailsModal
                    request={selectedRequest}
                    booking={getLinkedBooking(selectedRequest.bookingId)}
                    onClose={() => setSelectedRequest(null)}
                    onApprove={async () => {
                        await approveRequestAction(selectedRequest.id);
                        setLocalRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, status: 'approved' as const } : r));
                        setSelectedRequest(null);
                        showToast("Request approved successfully", "success");
                    }}
                    onDiscard={async () => {
                        await discardRequestAction(selectedRequest.id);
                        setLocalRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, status: 'discarded' as const } : r));
                        setSelectedRequest(null);
                        showToast("Request discarded", "success");
                    }}
                />
            )}
        </>
    );
}
