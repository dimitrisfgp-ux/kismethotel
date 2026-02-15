// === UI & View Models ===

/** Lightweight room info for admin lists, filters, and dropdowns */
export interface RoomSummary {
    id: string;
    name: string;
    slug: string;
    pricePerNight: number;
    checkInTime?: string;
    checkOutTime?: string;
    maxOccupancy?: number;
    imageUrl?: string;
}

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

export interface RoomPageContent {
    hero: {
        title?: string;
        subtitle?: string;
        ctaText?: string;
    };
}

export interface PageContent {
    hero: {
        title: string;
        subtitle: string;
        ctaText: string;
        poster?: string;
        videos?: {
            ios?: string;
            android?: string;
            desktop?: string;
        };
    };
    locationsSection: {
        title: string;
        subtitle: string;
    };
    sections: {
        rooms: { title: string; subtitle: string; };
        location: { title: string; subtitle: string; };
        attractions: { title: string; subtitle: string; };
        faq: { title: string; subtitle: string; };
    };
}
