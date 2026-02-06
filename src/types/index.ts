export type BedType = 'single' | 'double';
export type SectionType = 'kitchen' | 'living_room' | 'bedroom' | 'bathroom';
export type BookingStatus = 'held' | 'confirmed' | 'completed' | 'cancelled' | 'expired';
export type BlockReason = 'maintenance' | 'owner_use' | 'seasonal' | 'other';
export type RoomSizeCategory = 'small' | 'medium' | 'large';

// === Entities ===

export interface Amenity {
    id: number;
    name: string;
    iconName: string; // Lucide icon name
    category?: SectionType | 'general';
}

export interface RoomBed {
    type: BedType;
    count: number;
}

export interface RoomLayoutCategory {
    type: SectionType;
    title: string; // e.g. "Master Bedroom", "Kitchenette"
    details: string[]; // e.g. "King Size Bed", "En-suite"
    amenities: Amenity[]; // Direct assignment for now
}

export interface Room {
    id: string;
    slug: string; // For URL routing
    name: string;
    description: string;
    sizeSqm: number;
    floor: number;
    maxOccupancy: number;
    pricePerNight: number;
    images: string[];
    beds: RoomBed[];
    // Deprecated: sections: RoomSection[];
    // Deprecated: amenityIds: number[];
    layout: RoomLayoutCategory[];
    highlights: string[];
    // Derived/Resolved fields can be added here if needed, but keeping it raw for now
}

export interface Booking {
    id: string;
    roomId: string;
    checkIn: string; // ISO Date
    checkOut: string; // ISO Date
    guestName: string;
    guestEmail: string;
    guestsCount: number;
    totalPrice: number;
    status: BookingStatus;
    createdAt: string;
}

export interface Convenience {
    id: number;
    name: string;
    type: 'Supermarket' | 'Bus' | 'Pharmacy' | 'Beach' | 'Attraction' | 'Car Rental' | 'Restaurant' | 'Cafe' | 'Bar' | 'Other';
    lat: number;
    lng: number;
    distanceLabel?: string;
}

export interface Attraction {
    id: number;
    name: string;
    description: string;
    image: string;
    distance: string; // "1.2 km"
}

export interface FAQ {
    id: number;
    question: string;
    answer: string;
    category: string;
}

// === Filters ===

export interface RoomFilters {
    priceRange: [number, number]; // [min, max]
    occupancy: number;
    size: number; // Sqm
    floors: number[]; // [0, 1, 2]
    bedrooms: number;
    doubleBeds: number;
    singleBeds: number;
    amenityIds: number[];
}

// === Availability ===
// DateRange is imported from react-day-picker in consumers
// export interface DateRange {
//    from: Date | undefined;
//    to: Date | undefined;
// }

export interface HotelSettings {
    name: string;
    description: string;
    contact: {
        address: string;
        phone: string;
        email: string;
    };
    socials: {
        whatsapp: string;
        viber: string;
        instagram: string;
        facebook: string;
    };
}

export interface PageContent {
    hero: {
        title: string;
        subtitle: string;
        ctaText: string;
    };
    sections: {
        rooms: { title: string; subtitle: string; };
        location: { title: string; subtitle: string; };
        attractions: { title: string; subtitle: string; };
        faq: { title: string; subtitle: string; };
    };
}
