import { useMemo } from "react";
import { Room, RoomFilters } from "@/types";
import { AMENITIES } from "@/data/amenities";
import { matchesPrice, matchesOccupancy, matchesSize, matchesFloor, matchesAmenities, matchesDoubleBeds, matchesSingleBeds } from "@/lib/filterHelpers";

export function useFacetedOptions(rooms: Room[], filters: RoomFilters) {
    return useMemo(() => {
        if (!rooms.length) return null;

        // Helper to get rooms filtered by everything EXCEPT the specified keys
        const getRoomsFilteredBy = (ignoredKeys: (keyof RoomFilters)[]) => {
            return rooms.filter(room => {
                const checkPrice = ignoredKeys.includes('priceRange') || matchesPrice(room, filters.priceRange);
                const checkOccupancy = ignoredKeys.includes('occupancy') || matchesOccupancy(room, filters.occupancy);
                const checkSize = ignoredKeys.includes('size') || matchesSize(room, filters.size);
                const checkFloors = ignoredKeys.includes('floors') || matchesFloor(room, filters.floors);
                const checkAmenities = ignoredKeys.includes('amenityIds') || matchesAmenities(room, filters.amenityIds);
                const checkDoubleBeds = ignoredKeys.includes('doubleBeds') || matchesDoubleBeds(room, filters.doubleBeds);
                const checkSingleBeds = ignoredKeys.includes('singleBeds') || matchesSingleBeds(room, filters.singleBeds);

                return checkPrice && checkOccupancy && checkSize && checkFloors && checkAmenities && checkDoubleBeds && checkSingleBeds;
            });
        };

        // Derive available options
        const roomsForFloors = getRoomsFilteredBy(['floors']);
        const availableFloors = Array.from(new Set(roomsForFloors.map(r => r.floor))).sort((a, b) => a - b);

        const roomsForSizes = getRoomsFilteredBy(['size']);
        const availableSizes = Array.from(new Set(roomsForSizes.map(r => r.sizeSqm))).sort((a, b) => a - b);

        const roomsForAmenities = getRoomsFilteredBy(['amenityIds']);
        const usedAmenityIds = new Set<number>();
        roomsForAmenities.forEach(r => {
            r.layout.forEach(cat => cat.amenities.forEach(a => usedAmenityIds.add(a.id)));
        });
        const availableAmenities = AMENITIES.filter(a => usedAmenityIds.has(a.id));

        const roomsForDoubleBeds = getRoomsFilteredBy(['doubleBeds']);
        const maxDoubleBeds = Math.max(0, ...roomsForDoubleBeds.map(r => r.beds?.find(b => b.type === 'double')?.count || 0));

        const roomsForSingleBeds = getRoomsFilteredBy(['singleBeds']);
        const maxSingleBeds = Math.max(0, ...roomsForSingleBeds.map(r => r.beds?.find(b => b.type === 'single')?.count || 0));

        const allPrices = rooms.map(r => r.pricePerNight);
        const minPrice = Math.min(...allPrices);
        const maxPrice = Math.max(...allPrices);

        return {
            minPrice, maxPrice,
            floors: availableFloors,
            sizes: availableSizes,
            availableAmenities,
            maxDoubleBeds,
            maxSingleBeds
        };
    }, [rooms, filters]);
}
