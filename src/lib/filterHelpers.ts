import { Room, RoomFilters } from "@/types";

export function matchesPrice(room: Room, range: [number, number]): boolean {
    return room.pricePerNight >= range[0] && room.pricePerNight <= range[1];
}

export function matchesOccupancy(room: Room, guests: number): boolean {
    if (!guests || guests === 0) return true;
    return room.maxOccupancy === guests;
}

export function matchesSize(room: Room, minSize: number): boolean {
    if (!minSize || minSize === 0) return true;
    return room.sizeSqm === minSize;
}

export function matchesFloor(room: Room, floors: number[]): boolean {
    if (floors.length === 0) return true;
    return floors.includes(room.floor);
}

export function matchesAmenities(room: Room, amenityIds: number[]): boolean {
    if (amenityIds.length === 0) return true;
    // Flatten all amenities from all layout categories
    const roomAmenityIds = room.layout.flatMap(cat => cat.amenities.map(a => a.id));
    return amenityIds.every(id => roomAmenityIds.includes(id));
}

export function matchesDoubleBeds(room: Room, count: number): boolean {
    if (!count || count === 0) return true;
    const doubleBeds = room.beds?.find(b => b.type === 'double')?.count || 0;
    return doubleBeds === count;
}

export function matchesSingleBeds(room: Room, count: number): boolean {
    if (!count || count === 0) return true;
    const singleBeds = room.beds?.find(b => b.type === 'single')?.count || 0;
    return singleBeds === count;
}

export function filterRooms(rooms: Room[], filters: RoomFilters): Room[] {
    return rooms.filter(room => {
        return matchesPrice(room, filters.priceRange) &&
            matchesOccupancy(room, filters.occupancy) &&
            matchesSize(room, filters.size) &&
            matchesFloor(room, filters.floors) &&
            matchesAmenities(room, filters.amenityIds) &&
            matchesDoubleBeds(room, filters.doubleBeds) &&
            matchesSingleBeds(room, filters.singleBeds);
    });
}
