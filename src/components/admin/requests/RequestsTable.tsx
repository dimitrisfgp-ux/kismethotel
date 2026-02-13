"use client";

import { useState } from "react";
import { PaginationControls } from "@/components/ui/admin/PaginationControls";
import { ContactRequest, Booking } from "@/types";
// import { format } from "date-fns";  <-- Removed unused
// import { Badge } from "@/components/ui/Badge"; <-- Removed unused
// import { Eye, Check, X } from "lucide-react"; <-- Removed unused
import { approveRequestAction, discardRequestAction } from "@/app/actions/request";
import { useToast } from "@/contexts/ToastContext";
import { RequestDetailsModal } from "./RequestDetailsModal";
// import { SUBJECT_LABELS_SHORT, SUBJECT_COLORS } from "@/lib/constants/requestStyles"; <-- Removed unused
// import { REQUEST_STATUS_COLORS } from "@/lib/constants/statusStyles"; <-- Removed unused
import { RequestsMobileCard } from "./RequestsMobileCard";
import { RequestsDesktopTable } from "./RequestsDesktopTable";
import { RequestsMobileList } from "./RequestsMobileList";

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
                {/* Top Pagination - Hidden on Mobile */}
                <div className="hidden md:block">
                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                    />
                </div>

                <RequestsDesktopTable
                    requests={paginatedRequests}
                    bookings={bookings}
                    onViewDetails={setSelectedRequest}
                    onApprove={handleApprove}
                    onDiscard={handleDiscard}
                />

                <RequestsMobileList
                    requests={paginatedRequests}
                    onViewDetails={setSelectedRequest}
                    onApprove={handleApprove}
                    onDiscard={handleDiscard}
                />

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
