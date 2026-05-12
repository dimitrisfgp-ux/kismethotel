import { RoomFilters } from "@/types";



// Map Constants
export const HOTEL_LOCATION_ID = "999";
// Single source of truth for the hotel's lat/lng — used by InteractiveMap,
// LocationPickerMap, and the Guesty-mode convenience cluster.
// Source: 35°20'13.0"N 25°07'48.9"E (DMS), converted to decimal degrees.
export const HOTEL_COORDINATES: [number, number] = [35.336944, 25.130250];
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

// Room Defaults
export const DEFAULT_CHECK_IN_TIME = "15:00";
export const DEFAULT_CHECK_OUT_TIME = "11:00";
