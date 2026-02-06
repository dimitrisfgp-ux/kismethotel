import { AMENITIES, ATTRACTIONS, CONVENIENCES, FAQS } from "@/data";
import { HOTEL_SETTINGS, HOME_PAGE_CONTENT } from "@/data/settings";
import { Amenity, Attraction, Convenience, FAQ, HotelSettings, PageContent } from "@/types";

export const contentService = {
    getAmenities: async (): Promise<Amenity[]> => {
        return AMENITIES;
    },

    getConveniences: async (): Promise<Convenience[]> => {
        return CONVENIENCES;
    },

    getAttractions: async (): Promise<Attraction[]> => {
        return ATTRACTIONS;
    },

    getFAQs: async (): Promise<FAQ[]> => {
        return FAQS;
    },

    getSettings: async (): Promise<HotelSettings> => {
        return HOTEL_SETTINGS;
    },

    getPageContent: async (): Promise<PageContent> => {
        return HOME_PAGE_CONTENT;
    }
};
