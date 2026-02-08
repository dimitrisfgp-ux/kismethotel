"use client";

import { useState, useMemo } from "react";
import { Booking, Room, ContactRequest, BookingStatus } from "@/types";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/priceCalculator";
import { Badge } from "@/components/ui/Badge";
import { Eye, XCircle, RotateCcw } from "lucide-react";
import { cancelBookingAction } from "@/app/actions";
import { BookingDetailsModal } from "./BookingDetailsModal";
import { FilterableHeader } from "./FilterableHeader";
import { RequestBadge } from "./RequestBadge";
import { RequestDetailsModal } from "../requests/RequestDetailsModal";
import { DateRange } from "react-day-picker";
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

interface BookingsTableProps {
    bookings: Booking[];
    rooms: Room[];
    requests?: ContactRequest[];
    onApproveRequest?: (request: ContactRequest) => Promise<void>;
    onDiscardRequest?: (request: ContactRequest) => Promise<void>;
}

interface BookingFilters {
    bookingId: string;
    details: { name?: string; email?: string; phone?: string };
    roomIds: string[];
    guests: NumericFilterValue | null;
    cost: NumericFilterValue | null;
    statuses: BookingStatus[];
    requestOptions: RequestFilterOption[];
    bookedDate: DateRange | null;
}

type FilterKey = "bookingId" | "details" | "room" | "guests" | "cost" | "status" | "requests" | "bookedDate";

const INITIAL_FILTERS: BookingFilters = {
    bookingId: "",
    details: {},
    roomIds: [],
    guests: null,
    cost: null,
    statuses: [],
    requestOptions: [],
    bookedDate: null
};

export function BookingsTable({ bookings, rooms, requests = [], onApproveRequest, onDiscardRequest }: BookingsTableProps) {
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);
    const [filters, setFilters] = useState<BookingFilters>(INITIAL_FILTERS);
    const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);

    // Get requests by booking ID for quick lookup
    const requestsByBookingId = useMemo(() => {
        const map = new Map<string, ContactRequest[]>();
        requests.forEach(req => {
            if (req.bookingId) {
                const existing = map.get(req.bookingId) || [];
                map.set(req.bookingId, [...existing, req]);
            }
        });
        return map;
    }, [requests]);

    // Filter active state checks
    const isFilterActive = (key: FilterKey): boolean => {
        switch (key) {
            case "bookingId": return !!filters.bookingId;
            case "details": return !!(filters.details.name || filters.details.email || filters.details.phone);
            case "room": return filters.roomIds.length > 0;
            case "guests": return filters.guests !== null;
            case "cost": return filters.cost !== null;
            case "status": return filters.statuses.length > 0;
            case "requests": return filters.requestOptions.length > 0;
            case "bookedDate": return filters.bookedDate !== null;
            default: return false;
        }
    };

    const hasActiveFilters = Object.keys(INITIAL_FILTERS).some(key => isFilterActive(key as FilterKey));

    // Apply filters to bookings
    const filteredBookings = useMemo(() => {
        return bookings.filter(booking => {
            // Booking ID filter
            if (filters.bookingId && !booking.id.toLowerCase().includes(filters.bookingId.toLowerCase())) {
                return false;
            }

            // Details filter (OR across fields)
            const { name, email, phone } = filters.details;
            if (name || email || phone) {
                const matchesName = name ? booking.guestName.toLowerCase().includes(name.toLowerCase()) : true;
                const matchesEmail = email ? booking.guestEmail.toLowerCase().includes(email.toLowerCase()) : true;
                const matchesPhone = phone ? (booking.guestPhone?.includes(phone) || false) : true;
                // If any filter is set, at least one must match
                if (name && !matchesName) return false;
                if (email && !matchesEmail) return false;
                if (phone && !matchesPhone) return false;
            }

            // Room filter
            if (filters.roomIds.length > 0 && !filters.roomIds.includes(booking.roomId)) {
                return false;
            }

            // Guests filter
            if (filters.guests) {
                const { operator, value, value2 } = filters.guests;
                const guests = booking.guestsCount;
                switch (operator) {
                    case "=": if (guests !== value) return false; break;
                    case ">=": if (guests < value) return false; break;
                    case "<=": if (guests > value) return false; break;
                    case "between": if (value2 && (guests < value || guests > value2)) return false; break;
                }
            }

            // Cost filter
            if (filters.cost) {
                const { operator, value, value2 } = filters.cost;
                const cost = booking.totalPrice;
                switch (operator) {
                    case "=": if (cost !== value) return false; break;
                    case ">=": if (cost < value) return false; break;
                    case "<=": if (cost > value) return false; break;
                    case "between": if (value2 && (cost < value || cost > value2)) return false; break;
                }
            }

            // Status filter
            if (filters.statuses.length > 0 && !filters.statuses.includes(booking.status)) {
                return false;
            }

            // Requests filter
            if (filters.requestOptions.length > 0) {
                const bookingRequests = requestsByBookingId.get(booking.id) || [];
                const pendingRequests = bookingRequests.filter(r => r.status === "pending");
                const hasPending = pendingRequests.length > 0;

                const wantsNone = filters.requestOptions.includes("none");
                const wantsAny = filters.requestOptions.includes("any");
                const wantsReschedule = filters.requestOptions.includes("reschedule");
                const wantsCancellation = filters.requestOptions.includes("cancellation");

                if (wantsNone && hasPending) return false;
                if (wantsAny && !hasPending) return false;
                if (wantsReschedule && !pendingRequests.some(r => r.subject === "reschedule")) return false;
                if (wantsCancellation && !pendingRequests.some(r => r.subject === "cancellation")) return false;
            }

            // Booked Date filter
            if (filters.bookedDate) {
                const bookingDate = new Date(booking.createdAt);
                const { from, to } = filters.bookedDate;
                if (from && bookingDate < from) return false;
                if (to) {
                    const endOfDay = new Date(to);
                    endOfDay.setHours(23, 59, 59, 999);
                    if (bookingDate > endOfDay) return false;
                }
            }

            return true;
        });
    }, [bookings, filters, requestsByBookingId]);

    const getRoomName = (id: string) => {
        return rooms.find(r => r.id === id)?.name || "Unknown Room";
    };

    const resetFilters = () => {
        setFilters(INITIAL_FILTERS);
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
                <div className="mb-4 flex items-center justify-between bg-[var(--color-aegean-blue)]/5 border border-[var(--color-aegean-blue)]/20 rounded-lg px-4 py-2">
                    <span className="text-sm text-[var(--color-aegean-blue)]">
                        Showing <strong>{filteredBookings.length}</strong> of <strong>{bookings.length}</strong> bookings
                    </span>
                    <button
                        onClick={resetFilters}
                        className="flex items-center gap-1 text-sm text-[var(--color-aegean-blue)] hover:underline"
                    >
                        <RotateCcw className="h-3 w-3" />
                        Clear all filters
                    </button>
                </div>
            )}

            <div className="bg-white rounded-lg border border-[var(--color-sand)] overflow-hidden">
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
                            {filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="p-8 text-center text-[var(--color-charcoal)]/60 italic">
                                        No bookings match the current filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking) => {
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
                                                    className={booking.status === 'confirmed'
                                                        ? 'bg-green-100 text-green-700 border-green-200'
                                                        : booking.status === 'cancelled'
                                                            ? 'bg-red-100 text-red-700 border-red-200'
                                                            : 'bg-gray-100 text-gray-600 border-gray-200'}
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
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end items-center gap-2">
                                                    <button
                                                        onClick={() => setSelectedBooking(booking)}
                                                        className="p-1.5 text-[var(--color-aegean-blue)] hover:bg-[var(--color-aegean-blue)]/5 rounded-md transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>

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
