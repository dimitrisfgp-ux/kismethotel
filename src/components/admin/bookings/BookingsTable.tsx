"use client";

import { useState, useMemo } from "react";
import { PaginationControls } from "@/components/ui/admin/PaginationControls";
import { Booking, RoomSummary, ContactRequest } from "@/types";
import { useToast } from "@/contexts/ToastContext";
import { BookingDetailsModal } from "./BookingDetailsModal";
import { RequestDetailsModal } from "../requests/RequestDetailsModal";
import { useBookingFilters, FilterKey } from "@/hooks/useBookingFilters";

// Extracted Components
import { BookingsFilterBar } from "./BookingsFilterBar";
import { BookingsFilterModals } from "./BookingsFilterModals";
import { BookingsDesktopTable } from "./BookingsDesktopTable";
import { BookingsMobileList } from "./BookingsMobileList";

interface BookingsTableProps {
    bookings: Booking[];
    rooms: RoomSummary[];
    requests?: ContactRequest[];
    userRole: string;
    onApproveRequest?: (request: ContactRequest) => Promise<void>;
    onDiscardRequest?: (request: ContactRequest) => Promise<void>;
    // Server Pagination Props
    totalBookings: number;
    currentPage: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

export function BookingsTable({
    bookings,
    rooms,
    requests = [],
    userRole,
    onApproveRequest,
    onDiscardRequest,
    totalBookings,
    currentPage,
    itemsPerPage,
    onPageChange
}: BookingsTableProps) {
    // UI State
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);
    const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);

    // Custom Hook for Filtering (Still useful for sort/filter WITHIN the page, or if we move filters to server later)
    // IMPORTANT: If we are paginating on server, client-side filtering only filters the CURRENT PAGE.
    // Ideally, filters should also be server-side.
    // For now, let's assume filters are applied CLIENT SIDE on the CURRENT PAGE for simplicity, 
    // OR we disable filters for this iteration until we lift them to URL params.
    // Given the task is "Server Side Pagination", we should respect that.
    // However, `useBookingFilters` does a lot.
    // Let's pass the raw bookings to the table for now, and let the user see the page they requested.
    // Note: This creates a UX issue where sorting only sorts the current page.
    // Future improvement: Move sort/filter to Server Actions/URL params.

    const {
        filters,
        setFilters,
        filteredBookings, // This will slice the ALREADY sliced page if we aren't careful. 
        requestsByBookingId,
        isFilterActive,
        hasActiveFilters,
        clearFilters,
        sortConfig,
        cycleSort
    } = useBookingFilters(bookings, requests, rooms);

    // We use the filtered bookings from the hook, which acts on the 'bookings' prop (which is the current page)
    // So 'filteredBookings' is effectively 'filtered page'.

    // Pagination Logic (Server Driven)
    const totalPages = Math.ceil(totalBookings / itemsPerPage);

    // Removed client-side slicing (paginatedBookings)

    if (bookings.length === 0) {
        return (
            <div className="text-center py-12 border border-dashed border-[var(--color-sand)] rounded-lg">
                <p className="text-[var(--color-charcoal)]/60 italic">No bookings found.</p>
            </div>
        );
    }

    return (
        <>
            {/* Filter Status Bar */}
            <BookingsFilterBar
                filters={filters}
                setFilters={setFilters}
                filteredCount={filteredBookings.length} // Count on current page
                totalCount={totalBookings} // Total in DB
                hasActiveFilters={hasActiveFilters}
                clearFilters={() => {
                    clearFilters();
                    setOpenFilter(null);
                }}
                rooms={rooms}
            />

            <div className="bg-white rounded-lg border border-[var(--color-sand)] overflow-hidden">
                {/* Top Pagination - Hidden on Mobile */}
                <div className="hidden md:block">
                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalBookings}
                        itemsPerPage={itemsPerPage}
                        onPageChange={onPageChange}
                        onItemsPerPageChange={() => { }} // Not implemented yet
                    />
                </div>

                {/* Desktop Table */}
                <BookingsDesktopTable
                    bookings={filteredBookings} // Filtered version of current page
                    requestsByBookingId={requestsByBookingId}
                    rooms={rooms}
                    userRole={userRole}
                    onSelectBooking={setSelectedBooking}
                    onSelectRequest={setSelectedRequest}
                    isFilterActive={isFilterActive}
                    setOpenFilter={setOpenFilter}
                    sortConfig={sortConfig}
                    cycleSort={cycleSort}
                />

                {/* Mobile List View */}
                <BookingsMobileList
                    bookings={filteredBookings}
                    requestsByBookingId={requestsByBookingId}
                    rooms={rooms}
                    userRole={userRole}
                    onSelectBooking={setSelectedBooking}
                    onSelectRequest={setSelectedRequest}
                    isFilterActive={isFilterActive}
                    setOpenFilter={setOpenFilter}
                />

                {/* Bottom Pagination */}
                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalBookings}
                    itemsPerPage={itemsPerPage}
                    onPageChange={onPageChange}
                    onItemsPerPageChange={() => { }}
                />
            </div>

            {/* Filter Modals */}
            <BookingsFilterModals
                openFilter={openFilter}
                setOpenFilter={setOpenFilter}
                filters={filters}
                setFilters={setFilters}
                rooms={rooms}
            />

            {/* Booking Details Modal */}
            {selectedBooking && (
                <BookingDetailsModal
                    booking={selectedBooking}
                    room={rooms.find(r => r.id === selectedBooking.roomId)}
                    onClose={() => setSelectedBooking(null)}
                />
            )}

            {/* Request Details Modal */}
            {selectedRequest && (
                <RequestDetailsModal
                    request={selectedRequest}
                    booking={bookings.find(b => b.id === selectedRequest.bookingId)}
                    onClose={() => setSelectedRequest(null)}
                    onApprove={async () => {
                        if (onApproveRequest) await onApproveRequest(selectedRequest);
                        setSelectedRequest(null);
                    }}
                    onDiscard={async () => {
                        if (onDiscardRequest) await onDiscardRequest(selectedRequest);
                        setSelectedRequest(null);
                    }}
                />
            )}
        </>
    );
}
