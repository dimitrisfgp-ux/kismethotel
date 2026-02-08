import { useMemo } from "react";
import { Room, RoomFilters, Booking, BlockedDate } from "@/types";
import { DateRange } from "react-day-picker";
import { filterRooms } from "@/lib/filterHelpers";
import { areIntervalsOverlapping } from "date-fns";

interface UseRoomFiltersProps {
    rooms: Room[];
    filters: RoomFilters;
    dateRange?: DateRange;
    bookings?: Booking[];
    blockedDates?: BlockedDate[];
}

export function useRoomFilters({ rooms, filters, dateRange, bookings = [], blockedDates = [] }: UseRoomFiltersProps) {
    const filteredRooms = useMemo(() => {
        const activeFilters = { ...filters };

        let results = filterRooms(rooms, activeFilters);

        // Availability Logic
        if (dateRange?.from && dateRange?.to) {
            const start = dateRange.from;
            const end = dateRange.to;

            results = results.filter(room => {
                // Check for overlapping blocked dates
                const hasBlock = blockedDates
                    .filter(b => b.roomId === room.id)
                    .some(b => {
                        return areIntervalsOverlapping(
                            { start, end },
                            { start: new Date(b.from), end: new Date(b.to) },
                            { inclusive: true } // Be strict about overlap
                        );
                    });

                // Check for overlapping bookings (confirmed only)
                const hasBooking = bookings
                    .filter(b => b.roomId === room.id && b.status === 'confirmed')
                    .some(b => {
                        return areIntervalsOverlapping(
                            { start, end },
                            { start: new Date(b.checkIn), end: new Date(b.checkOut) },
                            { inclusive: true }
                        );
                    });

                return !hasBlock && !hasBooking;
            });
        }

        return results;
    }, [rooms, filters, dateRange, bookings, blockedDates]);

    return filteredRooms;
}
