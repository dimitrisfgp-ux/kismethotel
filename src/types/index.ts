export type BedType = 'single' | 'double';
// SectionType is now just a string alias for clarity, but allows any value for CMS flexibility
export type SectionType = string;
export type BookingStatus = 'held' | 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'expired';
export type BlockReason = 'Maintenance' | 'Renovations' | 'Out of Season' | 'Other';
export type RoomSizeCategory = 'small' | 'medium' | 'large';
export type RequestSubject = 'general' | 'reschedule' | 'cancellation';
export type RequestStatus = 'pending' | 'approved' | 'discarded';

export interface BlockedDate {
    id: string;
    roomId: string;
    from: string; // ISO Date
    to: string; // ISO Date
    reason: BlockReason;
    note?: string; // Optional custom note
}

// === Entities ===

export interface Amenity {
    id: number;
    name: string;
    iconName: string; // Lucide icon name
    category?: string; // Relaxed from SectionType for custom grouping
}

export interface RoomBed {
    type: BedType;
    count: number;
}

export interface RoomLayoutCategory {
    type: string; // CUSTOM string from CMS (e.g. "Gaming Den", "Library")
    title: string; // e.g. "Master Bedroom", "Kitchenette"
    details: string[]; // e.g. "King Size Bed", "En-suite"
    amenities: Amenity[];
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
    checkInTime?: string; // e.g. "15:00"
    checkOutTime?: string; // e.g. "11:00"
    // images: string[]; // <-- REMOVED (Legacy)
    beds: RoomBed[];
    layout: RoomLayoutCategory[];
    highlights: string[];
    media: RoomMedia[]; // <-- NOW REQUIRED
}

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

export interface Booking {
    id: string;
    roomId: string;
    checkIn: string; // ISO Date
    checkOut: string; // ISO Date
    guestName: string;
    guestEmail: string;
    guestPhone?: string;
    guestsCount: number;
    totalPrice: number;
    status: BookingStatus;
    createdAt: string;
    preCheckoutEmailSent?: boolean;
}

export interface BookingHold {
    id: string;
    roomId: string;
    checkIn: string;      // ISO Date
    checkOut: string;     // ISO Date
    sessionId: string;
    expiresAt: string;    // ISO DateTime
    hasContention: boolean;
    contentionDeadline: string | null; // ISO DateTime — set when UserB triggers contention
    createdAt: string;
}

export interface ContactRequest {
    id: string;
    subject: RequestSubject;
    name: string;
    email: string;
    phone?: string;
    message: string;
    bookingId?: string;           // For reschedule/cancellation
    newCheckIn?: string;          // For reschedule (ISO Date)
    newCheckOut?: string;         // For reschedule (ISO Date)
    originalCheckIn?: string;     // Stored when reschedule is approved (original dates before change)
    originalCheckOut?: string;    // Stored when reschedule is approved (original dates before change)
    status: RequestStatus;
    createdAt: string;
}

export interface LocationCategory {
    id: string;
    label: string;
    icon: string; // Lucide icon name
    color: string;
    description?: string;
}

export interface Convenience {
    id: string;
    name: string;
    description?: string;
    lat: number;
    lng: number;
    categoryId: string;
    type: string; // "Hotel", "Attraction", "Transport", etc.
    rating?: number;
    placeId?: string; // Google Place ID
    distanceLabel?: string; // e.g. "5 min walk"
}

export type MediaType = 'image' | 'video';

export interface MediaAsset {
    id: string;
    filename: string;
    originalFilename: string;
    storagePath: string;
    url: string;
    bucket: string;
    folder: string;
    mediaType: MediaType;
    mimeType: string;
    sizeBytes: number;
    width?: number;
    height?: number;
    altText?: string;
    caption?: string;
    createdBy?: string;
    createdAt: string;
    updatedAt: string;
}

export type RoomMediaCategory = 'primary' | 'secondary' | 'gallery' | 'hero_poster' | 'hero_video' | 'portrait';

export interface RoomMedia extends MediaAsset {
    displayOrder: number;
    isPrimary: boolean; // Kept for backward compatibility, but 'category' should take precedence
    category: RoomMediaCategory;
}

// Duplicate Convenience interface removed.

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
    websiteUrl: string; // For QR Code generation
    holdDurationMinutes: number; // For booking hold system
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
        googleReviews: string; // For QR Code generation
    };
}

export interface RoomPageContent {
    hero: {
        title?: string;
        subtitle?: string;
        ctaText?: string;
    };
    // Additional content fields can be added here
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

// === Auth & RBAC ===

export interface Role {
    id: string;
    name: string;
    description?: string;
    isSystem: boolean; // Cannot be deleted if true
    createdAt: string;
    permissions?: Permission[]; // Optional joined permissions
}

export interface Permission {
    id: string;
    slug: string; // e.g. "bookings.create"
    description: string;
    module: string; // e.g. "bookings"
}

export interface RolePermission {
    roleId: string;
    permissionId: string;
}
