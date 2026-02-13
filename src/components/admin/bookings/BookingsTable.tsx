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
}

export function BookingsTable({ bookings, rooms, requests = [], userRole, onApproveRequest, onDiscardRequest }: BookingsTableProps) {
    // UI State
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);
    const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);

    // Custom Hook for Filtering
    const {
        filters,
        setFilters,
        filteredBookings,
        requestsByBookingId,
        isFilterActive,
        hasActiveFilters,
        clearFilters,
        sortConfig,
        cycleSort
    } = useBookingFilters(bookings, requests, rooms);

    // Pagination State
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // Reset page when filtered count changes
    useMemo(() => {
        setCurrentPage(1);
    }, [filteredBookings.length]);

    // Pagination Logic
    const totalItems = filteredBookings.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedBookings = filteredBookings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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
                filteredCount={filteredBookings.length}
                totalCount={bookings.length}
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
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                    />
                </div>

                {/* Desktop Table */}
                <BookingsDesktopTable
                    bookings={paginatedBookings}
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
                    bookings={paginatedBookings}
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
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
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
