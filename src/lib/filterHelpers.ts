import { Room, RoomFilters } from "@/types";

export function matchesPrice(room: Room, range: [number, number]): boolean {
    return room.pricePerNight >= range[0] && room.pricePerNight <= range[1];
}

export function matchesOccupancy(room: Room, guests: number): boolean {
    return room.maxOccupancy >= guests;
}

export function matchesSize(room: Room, categories: string[]): boolean {
    if (categories.length === 0) return true;
    // Map size to category
    let category = 'medium';
    if (room.sizeSqm < 40) category = 'small';
    else if (room.sizeSqm > 70) category = 'large';

    return categories.includes(category);
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

export function matchesBedType(room: Room, bedTypes: string[]): boolean {
    if (bedTypes.length === 0) return true;
    // Check if any layout category details contain the bed type string (simple check for now)
    // e.g. "King Bed" contains "King"
    return room.layout.some(cat =>
        cat.details.some(detail =>
            bedTypes.some(type => detail.toLowerCase().includes(type.toLowerCase()))
        )
    );
}

export function filterRooms(rooms: Room[], filters: RoomFilters): Room[] {
    return rooms.filter(room => {
        return matchesPrice(room, filters.priceRange) &&
            matchesOccupancy(room, filters.minOccupancy) &&
            matchesSize(room, filters.sizeCategories) &&
            matchesFloor(room, filters.floors) &&
            matchesAmenities(room, filters.amenityIds) &&
            matchesBedType(room, filters.bedTypes);
    });
}
