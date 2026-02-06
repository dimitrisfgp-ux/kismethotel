import { RoomFilters } from "@/types";

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
