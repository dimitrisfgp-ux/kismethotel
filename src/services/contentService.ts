import { AMENITIES, ATTRACTIONS, CONVENIENCES, FAQS } from "@/data";
import { Amenity, Attraction, Convenience, FAQ } from "@/types";

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
    }
};
