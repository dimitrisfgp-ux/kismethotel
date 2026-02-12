import { useState, useMemo } from "react";
import { Booking, ContactRequest, BookingStatus, RoomSummary } from "@/types";
import { DateRange } from "react-day-picker";
import { NumericFilterValue, RequestFilterOption } from "@/components/admin/bookings/filters";

// --- Types ---

export interface BookingFilters {
    bookingId: string;
    details: { name?: string; email?: string; phone?: string };
    roomIds: string[];
    stayDates: DateRange | null;
    guests: NumericFilterValue | null;
    cost: NumericFilterValue | null;
    statuses: BookingStatus[];
    requestOptions: RequestFilterOption[];
    bookedDate: DateRange | null;
}

export type FilterKey = "bookingId" | "details" | "room" | "dates" | "guests" | "cost" | "status" | "requests" | "bookedDate";

export type SortDirection = "asc" | "desc";
export interface SortConfig {
    key: string;
    direction: SortDirection;
}

export const INITIAL_FILTERS: BookingFilters = {
    bookingId: "",
    details: {},
    roomIds: [],
    stayDates: null,
    guests: null,
    cost: null,
    statuses: [],
    requestOptions: [],
    bookedDate: null
};

// --- Hook ---

export function useBookingFilters(bookings: Booking[], requests: ContactRequest[] = [], rooms: RoomSummary[] = []) {
    const [filters, setFilters] = useState<BookingFilters>(INITIAL_FILTERS);
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

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

    // Room name lookup (for sorting)
    const roomNameMap = useMemo(() => {
        const map = new Map<string, string>();
        rooms.forEach(r => map.set(r.id, r.name));
        return map;
    }, [rooms]);

    // 2. Filter Active Helper
    const isFilterActive = (key: FilterKey): boolean => {
        switch (key) {
            case "bookingId": return !!filters.bookingId;
            case "details": return !!(filters.details.name || filters.details.email || filters.details.phone);
            case "room": return filters.roomIds.length > 0;
            case "dates": return filters.stayDates !== null;
            case "guests": return filters.guests !== null;
            case "cost": return filters.cost !== null;
            case "status": return filters.statuses.length > 0;
            case "requests": return filters.requestOptions.length > 0;
            case "bookedDate": return filters.bookedDate !== null;
            default: return false;
        }
    };

    const hasActiveFilters = Object.keys(INITIAL_FILTERS).some(key => {
        // Map filter keys to FilterKey enum values
        const filterKeyMap: Record<string, FilterKey> = {
            bookingId: "bookingId",
            details: "details",
            roomIds: "room",
            stayDates: "dates",
            guests: "guests",
            cost: "cost",
            statuses: "status",
            requestOptions: "requests",
            bookedDate: "bookedDate"
        };
        return isFilterActive(filterKeyMap[key] || key as FilterKey);
    });

    const clearFilters = () => {
        setFilters(INITIAL_FILTERS);
        setSortConfig(null);
    };

    // 3. Cycle sort: none → asc → desc → none
    const cycleSort = (key: string) => {
        setSortConfig(prev => {
            if (!prev || prev.key !== key) return { key, direction: "asc" };
            if (prev.direction === "asc") return { key, direction: "desc" };
            return null; // desc → none
        });
    };

    // 4. Apply Filters + Sort
    const filteredBookings = useMemo(() => {
        let result = bookings.filter(booking => {
            // Booking ID filter
            if (filters.bookingId && !booking.id.toLowerCase().includes(filters.bookingId.toLowerCase())) {
                return false;
            }

            // Details filter (AND across fields)
            const { name, email, phone } = filters.details;
            if (name || email || phone) {
                if (name && !booking.guestName.toLowerCase().includes(name.toLowerCase())) return false;
                if (email && !booking.guestEmail.toLowerCase().includes(email.toLowerCase())) return false;
                if (phone && !(booking.guestPhone?.includes(phone) || false)) return false;
            }

            // Room filter
            if (filters.roomIds.length > 0 && !filters.roomIds.includes(booking.roomId)) {
                return false;
            }

            // Stay Dates filter (overlap: checkIn <= range.to AND checkOut >= range.from)
            if (filters.stayDates) {
                const { from, to } = filters.stayDates;
                const checkIn = new Date(booking.checkIn);
                const checkOut = new Date(booking.checkOut);
                if (from && checkOut < from) return false;
                if (to && checkIn > to) return false;
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

                if (filters.requestOptions.includes('any') && !hasPending) return false;
                if (filters.requestOptions.includes('none') && hasPending) return false;

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
                if (from && checkIn < from) return false;
                if (to && checkIn > to) return false;
            }

            return true;
        });

        // Apply sorting
        if (sortConfig) {
            const { key, direction } = sortConfig;
            const multiplier = direction === "asc" ? 1 : -1;

            result = [...result].sort((a, b) => {
                let cmp = 0;
                switch (key) {
                    case "guestName":
                        cmp = a.guestName.localeCompare(b.guestName);
                        break;
                    case "roomName": {
                        const nameA = roomNameMap.get(a.roomId) || "";
                        const nameB = roomNameMap.get(b.roomId) || "";
                        cmp = nameA.localeCompare(nameB);
                        break;
                    }
                    case "checkIn":
                        cmp = new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime();
                        break;
                    case "guestsCount":
                        cmp = a.guestsCount - b.guestsCount;
                        break;
                    case "totalPrice":
                        cmp = a.totalPrice - b.totalPrice;
                        break;
                    case "createdAt":
                        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                        break;
                }
                return cmp * multiplier;
            });
        }

        return result;
    }, [bookings, filters, requestsByBookingId, sortConfig, roomNameMap]);

    return {
        filters,
        setFilters,
        filteredBookings,
        requestsByBookingId,
        isFilterActive,
        hasActiveFilters,
        clearFilters,
        sortConfig,
        cycleSort
    };
}
