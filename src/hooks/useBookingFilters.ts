import { useState, useMemo } from "react";
import { Booking, ContactRequest, BookingStatus } from "@/types";
import { DateRange } from "react-day-picker";
import { NumericFilterValue, RequestFilterOption } from "@/components/admin/bookings/filters";

// --- Types ---

export interface BookingFilters {
    bookingId: string;
    details: { name?: string; email?: string; phone?: string };
    roomIds: string[];
    guests: NumericFilterValue | null;
    cost: NumericFilterValue | null;
    statuses: BookingStatus[];
    requestOptions: RequestFilterOption[];
    bookedDate: DateRange | null;
}

export type FilterKey = "bookingId" | "details" | "room" | "guests" | "cost" | "status" | "requests" | "bookedDate";

export const INITIAL_FILTERS: BookingFilters = {
    bookingId: "",
    details: {},
    roomIds: [],
    guests: null,
    cost: null,
    statuses: [],
    requestOptions: [],
    bookedDate: null
};

// --- Hook ---

export function useBookingFilters(bookings: Booking[], requests: ContactRequest[] = []) {
    const [filters, setFilters] = useState<BookingFilters>(INITIAL_FILTERS);

    // 1. Group Requests by Booking ID
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

    // 2. Filter Active Helper
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

    const clearFilters = () => setFilters(INITIAL_FILTERS);

    // 3. Apply Filters
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

                // If any detail filter is set, strict matching logic:
                // If I search Name="John", it must match.
                // If I search Name="John" AND Email="gmail", do I match BOTH?
                // The original logic was:
                // if (name && !matchesName) return false;
                // if (email && !matchesEmail) return false;
                // if (phone && !matchesPhone) return false;
                // This implies AND.

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
                const hasPending = bookingRequests.some(r => r.status === 'pending');
                const hasHistory = bookingRequests.length > 0;

                // "any" means has pending requests
                if (filters.requestOptions.includes('any') && !hasPending) return false;

                // "none" means NO pending requests
                if (filters.requestOptions.includes('none') && hasPending) return false;

                // Specific types
                if (filters.requestOptions.includes('reschedule')) {
                    const hasReschedule = bookingRequests.some(r => r.subject === 'reschedule' && r.status === 'pending');
                    if (!hasReschedule) return false;
                }

                if (filters.requestOptions.includes('cancellation')) {
                    const hasCancellation = bookingRequests.some(r => r.subject === 'cancellation' && r.status === 'pending');
                    if (!hasCancellation) return false;
                }
            }

            // Booked Date filter
            if (filters.bookedDate) {
                const { from, to } = filters.bookedDate;
                const checkIn = new Date(booking.checkIn);
                // Simple logic: If booking check-in is within range
                if (from && checkIn < from) return false;
                if (to && checkIn > to) return false;
            }

            return true;
        });
    }, [bookings, filters, requestsByBookingId]);

    return {
        filters,
        setFilters,
        filteredBookings,
        requestsByBookingId,
        isFilterActive,
        hasActiveFilters,
        clearFilters
    };
}
