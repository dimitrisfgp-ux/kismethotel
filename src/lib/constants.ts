import { RoomFilters } from "@/types";

export const CONTACT_EMAIL = "info@kismethotel.com";

// Map Constants
export const HOTEL_LOCATION_ID = 999;
export const HOTEL_COORDINATES: [number, number] = [35.3400, 25.1360];
export const DEFAULT_HOTEL_COLOR = "var(--color-deep-med)";
export const DEFAULT_CATEGORY_COLOR = "var(--color-charcoal)";
export const FALLBACK_ICON_COLOR = "#000000"; // For color picker default

// Filter Constants
export const DEFAULT_FILTERS: RoomFilters = {
    priceRange: [0, 1000],
    occupancy: 0,
    size: 0,
    floors: [],
    bedrooms: 0,
    doubleBeds: 0,
    singleBeds: 0,
    amenityIds: []
};

// Mobile Style Constants
export const MOBILE_FILTER_BTN_CLASS = "p-3 bg-white border-2 border-[var(--color-accent-gold)] rounded-full text-[var(--color-accent-gold)] hover:bg-[var(--color-accent-gold)] hover:text-white transition-all duration-300 active:scale-95 shadow-sm";

// Layout Constants
export const FAB_BOTTOM_OFFSET = "bottom-24"; // Height (56px) + Offset (24px) + Buffer

// Timezone Constants
export const HOTEL_TIMEZONE = "Europe/Athens";
export const TIMEZONE_DISCLAIMER = "All dates shown in Greek time (Europe/Athens)";
