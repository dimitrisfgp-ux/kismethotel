import { useMemo } from "react";
import { Room, RoomFilters } from "@/types";
import { DateRange } from "react-day-picker";
import { filterRooms } from "@/lib/filterHelpers";

interface UseRoomFiltersProps {
    rooms: Room[];
    filters: RoomFilters;
    dateRange?: DateRange;
}

export function useRoomFilters({ rooms, filters, dateRange }: UseRoomFiltersProps) {
    const filteredRooms = useMemo(() => {
        const activeFilters = { ...filters };

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
    }, [rooms, filters, dateRange]);

    return filteredRooms;
}
