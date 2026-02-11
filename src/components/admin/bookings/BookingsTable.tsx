"use client";

import { useState, useMemo } from "react";
import { PaginationControls } from "@/components/ui/admin/PaginationControls";
import { Booking, Room, ContactRequest, BookingStatus } from "@/types";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/priceCalculator";
import { Badge } from "@/components/ui/Badge";
import { Eye, XCircle, RotateCcw, X, Trash2 } from "lucide-react";
import { deleteBookingAction, cancelBookingAction } from "@/app/actions/bookings";
import { useToast } from "@/contexts/ToastContext";
import { BookingDetailsModal } from "./BookingDetailsModal";
import { FilterableHeader } from "./FilterableHeader";
import { RequestBadge } from "./RequestBadge";
import { RequestDetailsModal } from "../requests/RequestDetailsModal";
import { DateRange } from "react-day-picker";
import { getStatusColor } from "@/lib/constants/statusStyles";
import {
    BookingIdFilter,
    DetailsFilter,
    RoomFilter,
    GuestsFilter,
    CostFilter,
    StatusFilter,
    RequestsFilter,
    DatesFilter,
    NumericFilterValue,
    RequestFilterOption
} from "./filters";

import { useBookingFilters, BookingFilters, FilterKey } from "@/hooks/useBookingFilters";

interface BookingsTableProps {
    bookings: Booking[];
    rooms: Room[];
    requests?: ContactRequest[];
    userRole: string;
    onApproveRequest?: (request: ContactRequest) => Promise<void>;
    onDiscardRequest?: (request: ContactRequest) => Promise<void>;
}





export function BookingsTable({ bookings, rooms, requests = [], userRole, onApproveRequest, onDiscardRequest }: BookingsTableProps) {
    const { showToast } = useToast();

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
        clearFilters
    } = useBookingFilters(bookings, requests);

    // Pagination State
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const getRoomName = (id: string) => {
        return rooms.find(r => r.id === id)?.name || "Unknown Room";
    };

    const resetFilters = () => {
        clearFilters();
    };

    // Helper to remove a specific filter
    const removeFilter = (type: string, value?: any) => {
        const newFilters = { ...filters };
        switch (type) {
            case "bookingId":
                newFilters.bookingId = "";
                break;
            case "details":
                if (value && typeof value === 'string') newFilters.details = { ...newFilters.details, [value]: undefined };
                else newFilters.details = {};
                break;
            case "room":
                newFilters.roomIds = newFilters.roomIds.filter(id => id !== value);
                break;
            case "guests":
                newFilters.guests = null;
                break;
            case "cost":
                newFilters.cost = null;
                break;
            case "status":
                newFilters.statuses = newFilters.statuses.filter(s => s !== value);
                break;
            case "requests":
                newFilters.requestOptions = newFilters.requestOptions.filter(o => o !== value);
                break;
            case "bookedDate":
                newFilters.bookedDate = null;
                break;
        }
        setFilters(newFilters);
    };

    // Generate tags for active filters
    const activeTags = useMemo(() => {
        const tags: { id: string; label: React.ReactNode; onRemove: () => void }[] = [];

        if (filters.bookingId) {
            tags.push({ id: 'bid', label: `ID: ${filters.bookingId}`, onRemove: () => removeFilter("bookingId") });
        }
        if (filters.details.name) tags.push({ id: 'd-name', label: `Name: ${filters.details.name}`, onRemove: () => removeFilter("details", "name") });
        if (filters.details.email) tags.push({ id: 'd-email', label: `Email: ${filters.details.email}`, onRemove: () => removeFilter("details", "email") });
        if (filters.details.phone) tags.push({ id: 'd-phone', label: `Phone: ${filters.details.phone}`, onRemove: () => removeFilter("details", "phone") });

        filters.roomIds.forEach(id => {
            const roomName = rooms.find(r => r.id === id)?.name || id;
            tags.push({ id: `room-${id}`, label: roomName, onRemove: () => removeFilter("room", id) });
        });

        if (filters.guests) {
            const { operator, value, value2 } = filters.guests;
            let label = `Guests ${operator} ${value}`;
            if (operator === "between") label = `Guests: ${value}-${value2}`;
            tags.push({ id: 'guests', label, onRemove: () => removeFilter("guests") });
        }

        if (filters.cost) {
            const { operator, value, value2 } = filters.cost;
            let label = `Total ${operator} ${formatCurrency(value)}`;
            if (operator === "between") label = `Total: ${formatCurrency(value)} - ${formatCurrency(value2 || 0)}`;
            tags.push({ id: 'cost', label, onRemove: () => removeFilter("cost") });
        }

        filters.statuses.forEach(status => {
            tags.push({ id: `status-${status}`, label: status, onRemove: () => removeFilter("status", status) });
        });

        filters.requestOptions.forEach(opt => {
            tags.push({ id: `req-${opt}`, label: `Request: ${opt}`, onRemove: () => removeFilter("requests", opt) });
        });

        if (filters.bookedDate && filters.bookedDate.from) {
            let label = `Booked: ${format(filters.bookedDate.from, "MMM d")}`;
            if (filters.bookedDate.to) label += ` - ${format(filters.bookedDate.to, "MMM d")}`;
            tags.push({ id: 'date', label, onRemove: () => removeFilter("bookedDate") });
        }

        return tags;
    }, [filters, rooms]);

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

    const handleClearFilters = () => {
        clearFilters();
        setOpenFilter(null);
    };

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
            {hasActiveFilters && (
                <div className="mb-4 space-y-3 bg-[var(--color-aegean-blue)]/5 border border-[var(--color-aegean-blue)]/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--color-aegean-blue)] font-medium">
                            Showing <strong>{filteredBookings.length}</strong> of <strong>{bookings.length}</strong> bookings
                        </span>
                        <button
                            onClick={resetFilters}
                            className="flex items-center gap-1 text-xs font-bold text-[var(--color-aegean-blue)] hover:underline uppercase tracking-wider"
                        >
                            <RotateCcw className="h-3 w-3" />
                            Clear all
                        </button>
                    </div>

                    {/* Active Filter Chips */}
                    <div className="flex flex-wrap gap-2">
                        {activeTags.map(tag => (
                            <span
                                key={tag.id}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[var(--color-aegean-blue)]/30 text-[var(--color-aegean-blue)] text-xs font-medium shadow-sm transition-all hover:border-[var(--color-aegean-blue)]"
                            >
                                {tag.label}
                                <button
                                    onClick={tag.onRemove}
                                    className="p-0.5 hover:bg-[var(--color-aegean-blue)]/10 rounded-full transition-colors"
                                    aria-label="Remove filter"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            )}

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
                                <FilterableHeader
                                    label="Booking ID"
                                    isActive={isFilterActive("bookingId")}
                                    onClick={() => setOpenFilter("bookingId")}
                                />
                                <FilterableHeader
                                    label="Details"
                                    isActive={isFilterActive("details")}
                                    onClick={() => setOpenFilter("details")}
                                />
                                <FilterableHeader
                                    label="Room"
                                    isActive={isFilterActive("room")}
                                    onClick={() => setOpenFilter("room")}
                                />
                                <th className="p-4 font-bold text-[var(--color-charcoal)]">Dates</th>
                                <FilterableHeader
                                    label="Guests"
                                    isActive={isFilterActive("guests")}
                                    onClick={() => setOpenFilter("guests")}
                                />
                                <FilterableHeader
                                    label="Total"
                                    isActive={isFilterActive("cost")}
                                    onClick={() => setOpenFilter("cost")}
                                />
                                <FilterableHeader
                                    label="Status"
                                    isActive={isFilterActive("status")}
                                    onClick={() => setOpenFilter("status")}
                                />
                                <FilterableHeader
                                    label="Requests"
                                    isActive={isFilterActive("requests")}
                                    onClick={() => setOpenFilter("requests")}
                                />
                                <FilterableHeader
                                    label="Booked"
                                    isActive={isFilterActive("bookedDate")}
                                    onClick={() => setOpenFilter("bookedDate")}
                                />
                                <th className="p-4 font-bold text-[var(--color-charcoal)] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-sand)]">
                            {paginatedBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="p-8 text-center text-[var(--color-charcoal)]/60 italic">
                                        No bookings match the current filters.
                                    </td>
                                </tr>
                            ) : (
                                paginatedBookings.map((booking) => {
                                    const bookingRequests = requestsByBookingId.get(booking.id) || [];
                                    return (
                                        <tr key={booking.id} className="hover:bg-[var(--color-warm-white)]/20 transition-colors">
                                            <td className="p-4 whitespace-nowrap">
                                                <code className="text-xs font-mono text-[var(--color-charcoal)]/70 bg-[var(--color-warm-white)] px-1.5 py-0.5 rounded">
                                                    {booking.id}
                                                </code>
                                            </td>
                                            <td className="p-4 whitespace-nowrap">
                                                <div className="font-bold text-[var(--color-aegean-blue)]">{booking.guestName}</div>
                                                <div className="text-xs text-[var(--color-charcoal)]/60">{booking.guestEmail}</div>
                                            </td>
                                            <td className="p-4 font-medium whitespace-nowrap">
                                                {getRoomName(booking.roomId)}
                                            </td>
                                            <td className="p-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span>{format(new Date(booking.checkIn), "MMM d, yyyy")}</span>
                                                    <span className="text-[10px] text-[var(--color-charcoal)]/50">to</span>
                                                    <span>{format(new Date(booking.checkOut), "MMM d, yyyy")}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 whitespace-nowrap">
                                                {booking.guestsCount}
                                            </td>
                                            <td className="p-4 font-mono font-bold whitespace-nowrap">
                                                {formatCurrency(booking.totalPrice)}
                                            </td>
                                            <td className="p-4 whitespace-nowrap">
                                                <Badge
                                                    variant="outline"
                                                    className={getStatusColor(booking.status, 'booking')}
                                                >
                                                    {booking.status}
                                                </Badge>
                                            </td>
                                            <td className="p-4 whitespace-nowrap">
                                                <RequestBadge
                                                    requests={bookingRequests}
                                                    onClick={() => {
                                                        const pending = bookingRequests.find(r => r.status === "pending");
                                                        if (pending) setSelectedRequest(pending);
                                                    }}
                                                />
                                            </td>
                                            <td className="p-4 text-sm text-[var(--color-charcoal)]/70 whitespace-nowrap">
                                                {format(new Date(booking.createdAt), "MMM d, yyyy")}
                                            </td>
                                            <td className="p-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => setSelectedBooking(booking)}
                                                        className="p-1.5 text-[var(--color-aegean-blue)] hover:bg-[var(--color-aegean-blue)]/5 rounded-md transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>

                                                    {userRole === 'admin' && (
                                                        <button
                                                            onClick={async () => {
                                                                if (confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
                                                                    try {
                                                                        await deleteBookingAction(booking.id);
                                                                        showToast('Booking deleted successfully', 'success');
                                                                    } catch (error: any) {
                                                                        showToast(error.message, 'error');
                                                                    }
                                                                }
                                                            }}
                                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                            title="Delete Booking (Admin Only)"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    )}

                                                    {booking.status === 'confirmed' && (
                                                        <button
                                                            onClick={async () => {
                                                                if (confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
                                                                    await cancelBookingAction(booking.id);
                                                                }
                                                            }}
                                                            className="p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
                                                            title="Cancel Booking"
                                                        >
                                                            <XCircle className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
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

            {/* Filter Modals */}
            <BookingIdFilter
                isOpen={openFilter === "bookingId"}
                onClose={() => setOpenFilter(null)}
                value={filters.bookingId}
                onChange={(value) => setFilters({ ...filters, bookingId: value })}
            />
            <DetailsFilter
                isOpen={openFilter === "details"}
                onClose={() => setOpenFilter(null)}
                value={filters.details}
                onChange={(value) => setFilters({ ...filters, details: value })}
            />
            <RoomFilter
                isOpen={openFilter === "room"}
                onClose={() => setOpenFilter(null)}
                rooms={rooms}
                selectedRoomIds={filters.roomIds}
                onChange={(roomIds) => setFilters({ ...filters, roomIds })}
            />
            <GuestsFilter
                isOpen={openFilter === "guests"}
                onClose={() => setOpenFilter(null)}
                value={filters.guests}
                onChange={(value) => setFilters({ ...filters, guests: value })}
            />
            <CostFilter
                isOpen={openFilter === "cost"}
                onClose={() => setOpenFilter(null)}
                value={filters.cost}
                onChange={(value) => setFilters({ ...filters, cost: value })}
            />
            <StatusFilter
                isOpen={openFilter === "status"}
                onClose={() => setOpenFilter(null)}
                selectedStatuses={filters.statuses}
                onChange={(statuses) => setFilters({ ...filters, statuses })}
            />
            <RequestsFilter
                isOpen={openFilter === "requests"}
                onClose={() => setOpenFilter(null)}
                selectedOptions={filters.requestOptions}
                onChange={(requestOptions) => setFilters({ ...filters, requestOptions })}
            />
            <DatesFilter
                isOpen={openFilter === "bookedDate"}
                onClose={() => setOpenFilter(null)}
                label="Booking Date"
                value={filters.bookedDate}
                onChange={(bookedDate) => setFilters({ ...filters, bookedDate })}
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
