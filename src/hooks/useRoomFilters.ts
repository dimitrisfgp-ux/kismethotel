import { useMemo } from "react";
import { Room, RoomFilters } from "@/types";
import { DateRange } from "react-day-picker";
import { filterRooms } from "@/lib/filterHelpers";

interface UseRoomFiltersProps {
    rooms: Room[];
    filters: RoomFilters;
    guestCount: number;
    dateRange?: DateRange;
}

export function useRoomFilters({ rooms, filters, guestCount, dateRange }: UseRoomFiltersProps) {
    const filteredRooms = useMemo(() => {
        // Override local minOccupancy with context guestCount to ensure consistency
        const activeFilters = { ...filters, minOccupancy: guestCount };

        let results = filterRooms(rooms, activeFilters);

        // Mock Availability Logic
        // In a real app, this would check availability against a backend or derived availability map
        if (dateRange?.from && dateRange?.to) {
            const duration = dateRange.to.getTime() - dateRange.from.getTime();
            const days = duration / (1000 * 3600 * 24);

            // Example Rule: 'Knossos' (id:2) is unavailable for stays > 3 days
            if (days > 3) {
                results = results.filter(r => r.id !== "2");
            }
        }

        return results;
    }, [rooms, filters, guestCount, dateRange]);

    return filteredRooms;
}
