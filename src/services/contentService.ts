import { AMENITIES, ATTRACTIONS, CONVENIENCES, FAQS } from "@/data";
import { HOTEL_SETTINGS, HOME_PAGE_CONTENT } from "@/data/settings";
import { Amenity, Attraction, Convenience, FAQ, HotelSettings, PageContent } from "@/types";

// Global persistence hack for development
const globalForMock = global as unknown as {
    mockSettings: HotelSettings,
    mockPageContent: PageContent,
    mockFAQs: FAQ[]
};

if (!globalForMock.mockSettings) globalForMock.mockSettings = { ...HOTEL_SETTINGS };
if (!globalForMock.mockPageContent) globalForMock.mockPageContent = { ...HOME_PAGE_CONTENT };
if (!globalForMock.mockFAQs) globalForMock.mockFAQs = [...FAQS];

export const contentService = {
    getAmenities: async (): Promise<Amenity[]> => {
        return AMENITIES;
    },

    getConveniences: async (): Promise<Convenience[]> => {
        // Return a copy to prevent mutation bugs
        return [...CONVENIENCES];
    },

    getAttractions: async (): Promise<Attraction[]> => {
        return [...ATTRACTIONS];
    },

    getFAQs: async (): Promise<FAQ[]> => {
        return globalForMock.mockFAQs;
    },

    getSettings: async (): Promise<HotelSettings> => {
        return globalForMock.mockSettings;
    },

    updateSettings: async (settings: HotelSettings): Promise<boolean> => {
        globalForMock.mockSettings = settings;
        return true;
    },

    getPageContent: async (): Promise<PageContent> => {
        return globalForMock.mockPageContent;
    },

    updatePageContent: async (content: PageContent): Promise<boolean> => {
        globalForMock.mockPageContent = content;
        return true;
    },

    updateFAQs: async (faqs: FAQ[]): Promise<boolean> => {
        // In a real app, this would write to DB. For now, we update the in-memory array or log it.
        // Since FAQS is imported from data/faqs.ts which is const, we can't mutate it easily without a global override.
        // We'll add a global mock for FAQs similar to settings.
        globalForMock.mockFAQs = faqs;
        return true;
    }
};
